'use server'

import { PublicClass } from "@/types/interfaces/database/class";
import { getPreRegistrationById } from "../pre-registration/get-pre-registration-by-id";
import { Order } from "@/types/interfaces/payment/pagbank/order";
import { isOrderExpired } from "@/utils/is-order-expired";
import { createPagBankOrder } from "./create-pagbank-order";
import { creditCardCharge } from "./credit-card-charge";

interface ProcessCreditCardPaymentParams {
  preRegistrationId: string;
  classData: PublicClass;
  creditCardToken: any;
  installments: number;
}

export async function processCreditCardPayment({
  preRegistrationId,
  classData,
  creditCardToken,
  installments
}: ProcessCreditCardPaymentParams) {
  try {
    const preRegistration = await getPreRegistrationById(preRegistrationId);

    if (!preRegistration.success || !preRegistration.data) {
      console.error('Erro ao buscar pré-registro');
      return {
        success: false
      }
    }

    const { pagbank_order_data, pagbank_order_created_at } = preRegistration.data;

    const existingOrderData: Order | null | undefined = pagbank_order_data;
    const existingOrderCreatedAt = pagbank_order_created_at;

    let pagBankOrder: Order;

    const shouldReuseOrder = existingOrderData && !isOrderExpired(existingOrderCreatedAt);

    if (shouldReuseOrder) {
      const hasApprovedCharge = existingOrderData?.charges?.some(
        charge => charge.status === 'PAID' || charge.status === 'AUTHORIZED'
      );

      if (hasApprovedCharge) {
        return {
          success: false,
          message: "Este pedido já foi pago anteriormente."
        }
      }
      pagBankOrder = existingOrderData;
    } else {
      // se o pedido não existir ou estiver expirado, cria uma novo
      const res = await createPagBankOrder({
        classData,
        preRegistrationData: preRegistration.data
      });

      if (!res.success || !res.data) {
        console.error('Erro ao criar pedido do PagBank');
        return {
          success: false
        }
      }

      pagBankOrder = res.data;
    }

    const res = await creditCardCharge({
      pagBankOrder,
      creditCardToken,
      installments,
      preRegistrationId
    });

    if (!res.success) {
      return {
        success: false
      }
    }

    return {
      success: true
    }

  } catch (error) {
    console.error(error);
    return {
      success: false
    }
  }
}