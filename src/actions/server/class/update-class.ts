'use server'

import { createClient } from '@/supabase/server-client'
import { TransformedUpdateClassFormData } from '@/validation/zod-schemas/update-class-schema'
import { revalidatePath } from 'next/cache'

export async function updateClassAction(classId: string, classData: TransformedUpdateClassFormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Usuário não autenticado')

  // prepara os parâmetros para a função RPC do Supabase
  const params = {
    p_class_id: classId,
    p_name: classData.className,
    p_description: classData.description,
    p_opening_date: classData.openingDate.toISOString().split("T")[0], // só pega dia,
    p_closing_date: classData.closingDate.toISOString().split("T")[0], // só pega dia,
    p_total_seats: classData.vacancies,
    p_registration_fee: classData.registrationFee,
    p_address: classData.address,
    p_status: classData.status,
    // converte as datas do formulário para o formato que o banco espera (timestamptz)
    // TODO: PASSAR ISSO PRO ZOD USANDO .transform()
    p_schedules: classData.classDays.map(d => d.toISOString())
  };

  // função rpc para atualizar a turma e seus horários
  const { error } = await supabase.rpc('update_class_with_schedules', params);

  if (error) {
    console.error('Error calling update_class_with_schedules RPC:', error)
    throw new Error('Falha ao atualizar a turma e seus horários.')
  }

  // invalida cache do dashboard
  revalidatePath('/admin/dashboard');

  return { success: true }
}