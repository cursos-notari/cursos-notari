'use server';

import { PublicClass } from "@/types/interfaces/database/class";
import { Order } from "@/types/interfaces/payment/pagbank/order";
import { createServiceClient } from "@/supabase/service-client";
import { PreRegistration } from "@/types/interfaces/database/pre-registration";

// o qrcode é válido por 1 hora
const EXPIRATION_TIME = 1;

interface CreatePagBankOrderParams {
  classData: PublicClass,
  preRegistrationData: PreRegistration
}

export async function createPagBankOrder({
  classData,
  preRegistrationData
}: CreatePagBankOrderParams) {

  // dia e hora de expiração do QRCode
  const expirationDate = new Date();

  // adiciona o tempo de duração
  expirationDate.setHours(expirationDate.getHours() + EXPIRATION_TIME);

  // playload
  const orderPayload = {
    reference_id: `class_${classData.id}_student_${preRegistrationData.id.substring(0, 8)}`,
    customer: {
      name: `${preRegistrationData.name} ${preRegistrationData.surname}`,
      email: preRegistrationData.email,
      tax_id: preRegistrationData.cpf,
    },
    items: [
      {
        reference_id: classData.id,
        name: classData.name,
        quantity: 1,
        unit_amount: classData.registration_fee * 100, // O valor deve ser em centavos
      },
    ],
    qr_codes: [
      {
        amount: {
          value: classData.registration_fee * 100,
        },
        expiration_date: expirationDate.toISOString(),
      }
    ],
    // Adicionar aqui URL para notificação via Webhook
    // notification_urls: ["https://seusite.com/api/webhooks/pagbank"],
  };

  try {
    const response = await fetch("https://sandbox.api.pagseguro.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAGBANK_API_TOKEN}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const error = await response.json();

      console.error("Erro ao criar pedido PagBank:", error);
      return { success: false };
    }

    const order: Order = await response.json();

    const supabase = createServiceClient();

    if (!supabase) return { success: false };

    // salva os dados do pedido no banco de dados
    const { error: updateError } = await supabase
      .from('pre_registrations')
      .update({
        pagbank_order_id: order.id,
        pagbank_order_data: order,
        pagbank_order_created_at: order.created_at
      })
      .eq('id', preRegistrationData.id);

    if (updateError) {
      console.error("Erro ao salvar o pedido no banco:", updateError);
    }

    return {
      success: true,
      data: order
    }

  } catch (error) {
    console.error("Erro ao tentar criar pedido PagBank:", error);
    return { success: false };
  }
}