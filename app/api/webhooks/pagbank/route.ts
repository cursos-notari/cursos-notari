import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    const rawBody = await request.text();

    // verifica se é o formato novo (JSON)
    if (contentType?.includes('application/json')) {

      const body = JSON.parse(rawBody);

      const isValidationRequired = process.env.X_AUTHENTICITY_TOKEN === 'true';

      if (isValidationRequired) {
        // header de autenticidade
        const authHeader = request.headers.get('x-authenticity-token');

        if (!authHeader) {
          // se não houver o header, decide se ignora ou processa sem validar
          console.warn('⚠️ aviso: notificação json sem header de autenticidade');
        }
      }



      console.log('📦 pedido v2 recebido:', body.id);

      // processar lógica de pagamento

    } else if (contentType?.includes('application/x-www-form-urlencoded')) {

      // formato antigo
      console.log('ℹ️ notificação v1 recebida (form-urlencoded). ignorando ou buscando via get...');

      // se precisar processar v1
      // const params = new URLSearchParams(rawBody);
      // const code = params.get('notificationCode');
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ erro no webhook:', error);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}