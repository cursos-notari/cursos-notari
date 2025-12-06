'use server'
import 'server-only'

import { createPreRegistration } from "../pre-registration/create-pre-registration";
import { createPagBankOrder } from "./create-pagbank-order";
import { getPreRegistrationById } from "../pre-registration/get-pre-registration-by-id";
import { PublicClass } from "@/types/interfaces/database/class";

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

    const pagBankOrder = await createPagBankOrder({
      classData,
      preRegistrationData: preRegistration.data
    });

  } catch (error) {
    return {
      success: false
    }
  }

  return {
    success: true
  }
}