'use server'
import 'server-only';

import { createClient } from "@/lib/supabase/service";
import { Order } from '@/types/interfaces/payment/pagbank/order';

export interface ConfirmPaymentResult {
  success: boolean;
  message?: string;
}

export async function confirmPayment({
  preRegistrationId,
  orderId,
  order,
}: {
  preRegistrationId: string;
  orderId: string;
  order: Order;
}): Promise<ConfirmPaymentResult> {

  const supabase = createClient();

  if (!supabase) { return { success: false } };

  const { data, error } = await supabase.rpc('confirm_payment', {
    p_id: preRegistrationId,
    p_order_id: orderId,
    p_order_data: order
  });

  if (error) {
    console.error("Erro ao chamar RPC confirm_payment:", error);
    return { success: false };
  }

  if (!data.success) { return { success: false } };

  return { success: true };
}