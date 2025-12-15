'use server'
import 'server-only'

import { createPagBankOrder } from "./create-pagbank-order";
import { getPreRegistrationById } from "../pre-registration/get-pre-registration-by-id";
import { PublicClass } from "@/types/interfaces/database/class";
import { Order } from '@/types/interfaces/payment/pagbank/order';
import { isOrderExpired } from '@/utils/is-order-expired';
import { cookies } from 'next/headers';

interface ProcessPixPaymentProps {
  preRegistrationId: string,
  classData: PublicClass;
}

interface ProcessPixPaymentReturn {
  success: boolean;
}

export async function processPixPayment({ preRegistrationId, classData }: ProcessPixPaymentProps): Promise<ProcessPixPaymentReturn> {
  try {
    const preRegistration = await getPreRegistrationById(preRegistrationId);

    if (!preRegistration.data) {
      return {
        success: false,
      }
    }

    const existingOrderData: Order | null | undefined = preRegistration.data?.pagbank_order_data;
    const existingOrderCreatedAt = existingOrderData?.created_at;

    let pagBankOrder: Order;

    const shouldReuseOrder = existingOrderData && !isOrderExpired(existingOrderCreatedAt);

    if (shouldReuseOrder) {
      // se o pedido for válido (menos de 1 hora), reutiliza
      pagBankOrder = existingOrderData;
    } else {
      // se o pedido não existir ou estiver expirado, cria uma novo
      await createPagBankOrder({
        classData,
        preRegistrationData: preRegistration.data
      });
    }

  } catch (error: any) {
    console.error(error.message);
    return {
      success: false,
    }
  }

  return {
    success: true,
  }
}