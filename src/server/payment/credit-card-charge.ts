'use server';
import 'server-only';
import axios, { AxiosError } from 'axios';

import { confirmPayment } from "../pre-registration/confirm-payment";
import { Order } from '@/types/interfaces/payment/pagbank/order';
import { getFriendlyMessage } from '@/utils/get-friendly-message';
import { isRetryablePaymentCode } from '@/utils/is-retryable-payment-code';

export interface CreditCardChargeResult {
  success: boolean;
  retryable?: boolean;
  message?: string;
  orderId?: string;
  errorCode?: string;
}

export interface CreditCardChargeParams {
  pagBankOrder: Order;
  cardToken: string;
  installments: number;
  preRegistrationId: string;
}

export async function creditCardCharge({
  preRegistrationId,
  pagBankOrder,
  cardToken,
  installments
}: CreditCardChargeParams
): Promise<CreditCardChargeResult> {

  try {
    const { links, items } = pagBankOrder;

    if (!links?.[1].href) throw new Error('URL de pagamento não encontrada');

    const paymentUrl = links![1].href;
    const orderAmountInCents = items[0].unit_amount;

    const requestBody = {
      charges: [{
        amount: {
          value: orderAmountInCents,
          currency: "BRL"
        },
        payment_method: {
          type: "CREDIT_CARD",
          installments: installments,
          capture: true,
          card: {
            encrypted: cardToken,
            store: false
          }
        }
      }]
    };

    const response = await axios.post<Order>(paymentUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAGBANK_API_TOKEN}`,
      },
      timeout: 30000
    });

    const data = response.data;

    if (response.status < 200 || response.status >= 300) {
      console.error('Resposta com status inesperado:', response.status);
      return {
        success: false,
        message: 'Erro ao processar pagamento',
        retryable: response.status >= 500
      }
    }

    const charge = data.charges?.at(-1);

    if (!charge) {
      console.error('Nenhuma cobrança retornada na resposta');
      return {
        success: false,
        message: 'Erro ao processar cobrança',
        retryable: false
      };
    }

    // Verifica status do pagamento
    if (charge.status !== 'PAID') {
      const paymentResponse = charge.payment_response;
      const errorCode = paymentResponse?.code || '10002';
      const originalMessage = paymentResponse?.message || '';

      const isRetryable = isRetryablePaymentCode(errorCode);
      const friendlyMessage = getFriendlyMessage(errorCode, originalMessage);

      console.error('Pagamento não aprovado:', {
        code: paymentResponse?.code,
        message: originalMessage,
        retryable: isRetryable,
        rawData: paymentResponse?.raw_data
      });

      return {
        success: false,
        message: friendlyMessage,
        errorCode: errorCode,
        retryable: isRetryable
      };
    }

    // Pagamento aprovado - confirma no banco de dados
    const resPaymentConfirmation = await confirmPayment({
      preRegistrationId,
      orderId: data.id,
      order: data
    });

    if (!resPaymentConfirmation.success) {
      console.error("Pagamento aprovado mas não confirmado no DB");

      return {
        success: false,
        message: "Pagamento aprovado, mas houve um erro ao processar. Entre em contato com o suporte informando o código: " + data.id,
        retryable: false
      };
    }

    return {
      success: true,
      orderId: data.id
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data as any;

        console.error('Erro na resposta:', { status, data });

        // Status 402: Pagamento recusado - pode ter payment_response com código específico
        if (status === 402) {
          const charge = data?.charges?.[0];
          if (charge?.payment_response?.code) {
            const errorCode = charge.payment_response.code;
            return {
              success: false,
              message: getFriendlyMessage(errorCode, charge.payment_response.message),
              errorCode: errorCode,
              retryable: isRetryablePaymentCode(errorCode)
            };
          }
        }

        // Erros genéricos HTTP
        const isServerError = status >= 500;
        const errorMessages: Record<number, string> = {
          400: data?.error_messages?.[0]?.description || 'Dados inválidos. Verifique as informações.',
          401: 'Erro de autenticação. Entre em contato com o suporte.',
          429: 'Muitas requisições. Aguarde alguns instantes.'
        };

        return {
          success: false,
          message: errorMessages[status] || (isServerError
            ? 'Erro temporário no serviço de pagamento. Tente novamente.'
            : 'Erro ao processar pagamento.'),
          retryable: isServerError || status === 401 || status === 429
        };
      }

      // Erros de requisição (timeout, network, etc)
      if (axiosError.request) {
        console.error('Erro na requisição (sem resposta):', {
          code: axiosError.code,
          message: axiosError.message
        });

        if (axiosError.code === 'ECONNABORTED') {
          return {
            success: false,
            message: 'Tempo de resposta esgotado. Tente novamente.',
            retryable: true
          };
        }

        if (axiosError.code === 'ERR_NETWORK') {
          return {
            success: false,
            message: 'Erro de conexão. Verifique sua internet e tente novamente.',
            retryable: true
          };
        }

        return {
          success: false,
          message: 'Erro de comunicação com o serviço de pagamento. Tente novamente.',
          retryable: true
        };
      }

      // Erro na configuração da requisição
      console.error('Erro na configuração:', axiosError.message);
      return {
        success: false,
        message: 'Erro interno ao processar pagamento. Entre em contato com o suporte.',
        retryable: false
      };
    }

    // Outros erros não relacionados ao Axios
    console.error('Erro inesperado:', error);
    return {
      success: false,
      message: 'Erro inesperado ao processar pagamento. Entre em contato com o suporte.',
      retryable: false
    };
  }
}