'use server';
import 'server-only';
import axios, { AxiosError } from 'axios';

import { confirmPayment } from "../pre-registration/confirm-payment";
import { Order } from '@/types/interfaces/payment/pagbank/order';

export interface CreditCardChargeResult {
  success: boolean;
  retryable?: boolean;
  message?: string;
  orderId?: string;
}

export interface CreditCardChargeParams {
  pagBankOrder: Order;
  creditCardToken: string;
  installments: number;
  preRegistrationId: string;
}

export async function creditCardCharge({
  preRegistrationId,
  pagBankOrder,
  creditCardToken,
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
            encrypted: creditCardToken,
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
      timeout: 30000 // 30 segundos
    });

    const data = response.data;

    // TODO: VERIFICAR TODOS OS CASOS DE ERRO POSSÍVEIS E SE PODE RETENTAR OU NÃO O PAGAMENTO.

    if (response.status < 200 || response.status >= 300) {
      console.error('Resposta com status inesperado:', response.status);
      return {
        success: false,
        message: 'Erro ao processar pagamento',
        retryable: response.status >= 500
      }
    }

    const charge = data.charges?.[0];

    if (!charge) {
      console.error('Nenhuma cobrança retornada na resposta');
      return {
        success: false,
        message: 'Erro ao processar cobrança',
        retryable: false
      };
    }

    // verifica status do pagamento
    if (charge.status !== 'PAID') {
      const errorMessage = charge.payment_response?.message || "O pagamento não foi aprovado.";
      console.error('Pagamento não aprovado:', errorMessage);

      return {
        success: false,
        message: errorMessage,
        retryable: false // TODO: VERIFICAR POSSIBILIDADE DE RETENTAR (DOC API PAGBANK)
      };
    }

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

        console.error('Erro na resposta:', {
          status,
          data,
          headers: axiosError.response.headers
        });

        // Mapeamento de erros comuns do PagBank
        switch (status) {
          case 400:
            return {
              success: false,
              message: data?.error_messages?.[0]?.description || 'Dados inválidos',
              retryable: false
            };

          case 401:
            return {
              success: false,
              message: 'Erro de autenticação com PagBank',
              retryable: true // pode ser problema temporário de token
            };

          case 402:
            return {
              success: false,
              message: 'Pagamento recusado',
              retryable: false
            };

          case 429:
            return {
              success: false,
              message: 'Muitas requisições. Tente novamente em alguns instantes.',
              retryable: true
            };

          case 500:
          case 502:
          case 503:
          case 504:
            return {
              success: false,
              message: 'Erro temporário no serviço de pagamento. Tente novamente.',
              retryable: true
            };

          default:
            return {
              success: false,
              message: 'Erro ao processar pagamento',
              retryable: status >= 500
            };
        }
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
            message: 'Tempo esgotado. Tente novamente.',
            retryable: true
          };
        }

        if (axiosError.code === 'ERR_NETWORK') {
          return {
            success: false,
            message: 'Erro de conexão. Verifique sua internet.',
            retryable: true
          };
        }

        return {
          success: false,
          message: 'Erro de comunicação com serviço de pagamento',
          retryable: true
        };
      }

      // Erro na configuração da requisição
      console.error('Erro na configuração:', axiosError.message);
      return {
        success: false,
        message: 'Erro interno ao processar pagamento',
        retryable: false
      };
    }

    // Outros erros não relacionados ao Axios
    console.error('Erro inesperado:', error);
    return {
      success: false,
      message: 'Erro inesperado ao processar pagamento',
      retryable: false
    };
  }
}