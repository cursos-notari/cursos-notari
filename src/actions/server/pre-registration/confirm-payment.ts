'use server'

import { createServiceClient } from "@/supabase/service-client";

export interface ConfirmPaymentResult {
  success: boolean;
  message: string;
  data?: any;
  confirmed_at?: string;
}

export async function confirmPayment({
  preRegistrationId,
  orderId,
  chargeData,
}: {
  preRegistrationId: string;
  orderId: string;
  chargeData: any;
}): Promise<ConfirmPaymentResult> {
  try {
    const supabase = createServiceClient();

    if (!supabase) {
      return {
        success: false,
        message: 'Erro interno: cliente Supabase não disponível'
      };
    }

    const { data, error } = await supabase.rpc('confirm_payment', {
      p_id: preRegistrationId,
      p_order_id: orderId,
      p_charge_data: chargeData
    });

    if (error) {
      console.error("Erro ao chamar RPC confirm_payment:", error);
      return {
        success: false,
        message: "Não foi possível confirmar o pagamento. Tente novamente.",
      };
    }

    return data as ConfirmPaymentResult;

  } catch (error: any) {
    console.error("Erro inesperado ao confirmar pagamento:", error);
    return {
      success: false,
      message: error.message || "Erro inesperado ao processar confirmação.",
    };
  }
}