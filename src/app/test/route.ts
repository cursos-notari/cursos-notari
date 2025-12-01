import { NextRequest } from 'next/server';
import { createClient } from '@/supabase/server-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('public_classes')
      .select('*')
      .eq('id', '58f801cc-efd6-44a4-b96b-b65828b0b7a5')
      .single();

    if (error) {
      return Response.json({
        error: 'Erro ao buscar turmas',
        message: error.message
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      classes: data,
      total: data?.length || 0
    });

  } catch (error) {
    return Response.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}