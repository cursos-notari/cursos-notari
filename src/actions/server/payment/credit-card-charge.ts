'use server';

import { createServiceClient } from "@/supabase/service-client";
import { getPreRegistrationById } from "../pre-registration/get-pre-registration-by-id";
import { confirmPayment } from "../pre-registration/confirm-payment";

export interface CreditCardChargeResult {
  success: boolean;
  message?: string;
  orderId?: string;
}

export interface TokenizedPaymentData {
  installments: number;
  cardToken: string;
}

export async function creditCardCharge(
  preRegistrationId: string,
  creditCardToken: TokenizedPaymentData
): Promise<CreditCardChargeResult> {

  try {
    const supabase = createServiceClient();

    if (!supabase) return { success: false }

    const preRegistration = await getPreRegistrationById(preRegistrationId);

    if (!preRegistration.success || !preRegistration.data) {
      return { success: false };
    }

    const { pagbank_order_id, pagbank_order_data } = preRegistration.data;
    
    if (!pagbank_order_id || !pagbank_order_data) {
      return { success: false };
    }

    const orderId = pagbank_order_id;
    const paymentUrl = pagbank_order_data.links![1].href;
    const orderAmountInCents = pagbank_order_data.items[0].unit_amount;

    const requestBody = {
      charges: [{
        amount: {
          value: orderAmountInCents,
          currency: "BRL"
        },
        payment_method: {
          type: "CREDIT_CARD",
          installments: creditCardToken.installments,
          capture: true,
          card: {
            encrypted: creditCardToken.cardToken
          }
        }
      }]
    };

    const response = await fetch(paymentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAGBANK_API_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Erro ao processar pagamento:", responseData);
      return {
        success: false,
        message: responseData.error_messages?.[0]?.description ?? null,
      };
    }

    const charge = responseData.charges?.[0];
    
    // verificar status do pagamento
    if (charge?.status !== 'PAID') {
      return {
        success: false,
        message: charge?.payment_response?.message || "O pagamento não foi aprovado.",
      };
    }
    
    // const confirmResult = await confirmPayment({
    //   preRegistrationId,
    //   orderId,
    //   chargeData: responseData, // salva os dados completos da resposta
    // });

    // if (!confirmResult.success) {
    //   console.error("CRÍTICO: Pagamento aprovado mas não confirmado no DB", {
    //     preRegistrationId,
    //     orderId,
    //     error: confirmResult.message
    //   });
      
    //   return {
    //     success: false,
    //     message: "Pagamento aprovado, mas houve um erro ao processar. Entre em contato com o suporte informando o código: " + orderId,
    //   };
    // }

    return {
      success: true,
      orderId: orderId,
    };

  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return { success: false };
  }
}