"use server"

import { Resend } from 'resend';

interface SendVerificationEmailProps {
  to: string;
  name: string;
  className: string;
  verificationCode: string;
}

export async function sendVerificationCode({
  to,
  name,
  className,
  verificationCode
}: SendVerificationEmailProps) {

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) throw new Error('RESEND_API_KEY não configurada');

  const resend = new Resend(resendApiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [to],
      subject: `Código de verificação - Inscrição em ${className}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 10px;">Confirme sua inscrição</h2>
            <p style="color: #666;">Olá <strong>${name}</strong>,</p>
            <p style="color: #666;">Você se inscreveu no curso <strong>${className}</strong>.</p>
          </div>
          
          <div style="background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="color: #495057; margin-bottom: 10px; font-size: 14px;">Seu código de verificação é:</p>
            <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${verificationCode}
            </div>
            <p style="color: #6c757d; margin-top: 10px; font-size: 12px;">Digite este código na página de verificação</p>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Importante:</strong>
            </p>
            <ul style="color: #856404; margin: 10px 0 0 20px; font-size: 14px;">
              <li>Este código expira em 15 minutos</li>
              <li>Você tem até 3 tentativas para inserir o código</li>
              <li>Não compartilhe este código com ninguém</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 12px;">
              Se você não solicitou esta inscrição, pode ignorar este email.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Erro ao enviar email: ${error.message}`);
    }

    return { success: true, message: data?.id };

  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    throw new Error('Erro ao enviar email de verificação');
  }
}