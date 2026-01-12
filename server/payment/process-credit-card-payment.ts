'use server'

import { PublicClass } from "@/types/interfaces/database/class";
import { getPreRegistrationById } from "../pre-registration/get-pre-registration-by-id";
import { Order } from "@/types/interfaces/payment/pagbank/order";
import { isOrderExpired } from "@/utils/is-order-expired";
import { createPagBankOrder } from "./create-pagbank-order";
import { creditCardCharge } from "./credit-card-charge";
import { getClassById } from "@/server/class/get-class-by-id";

interface ProcessCreditCardPaymentParams {
  preRegistrationId: string;
  classId: string;
  cardToken: any;
  installments: number;
}

export async function processCreditCardPayment({
  preRegistrationId,
  classId,
  cardToken,
  installments
}: ProcessCreditCardPaymentParams) {
  try {
    const preRegistration = await getPreRegistrationById(preRegistrationId);

    if (!preRegistration.success) return { success: false };

    const { pagbank_order_data, pagbank_order_created_at } = preRegistration.data!;

    let pagBankOrder: Order;

    const existingOrderData: Order | null | undefined = pagbank_order_data;
    const existingOrderCreatedAt = pagbank_order_created_at;

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
      
      const classData = await getClassById(classId);

      if(!classData.success || !classData.data) return {
        success: false
      } 

      const res = await createPagBankOrder({
        classData: classData.data,
        preRegistrationData: preRegistration.data!
      });

      if (!res.success || !res.data) return { 
        success: false,
        message: 'Ocorreu um erro ao criar seu pedido.'
      };

      pagBankOrder = res.data;
    }

    const res = await creditCardCharge({
      pagBankOrder,
      cardToken,
      installments,
      preRegistrationId
    });

    if (!res.success) {
      return {
        success: false,
        message: res.message
      }
    }

    return { success: true };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Ocorreu um erro ao processar o pagamento.'
    }
  }
}