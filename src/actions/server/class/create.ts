'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server-client';
import { TransformedCreateClassFormData } from '@/validation/zod-schemas/create-class-schema';

export async function createClassAction(classData: TransformedCreateClassFormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Usuário não autenticado');

  const params = {
    p_name: classData.className,
    p_description: classData.description,
    p_opening_date: classData.openingDate.toISOString().split('T')[0],
    p_closing_date: classData.closingDate.toISOString().split('T')[0],
    p_total_seats: classData.vacancies,
    p_registration_fee: classData.registrationFee,
    p_address: classData.address,
    p_status: classData.status,
    p_schedules: classData.classDays.map(d => d.toISOString())
  }

  const { data: newId, error } = await supabase.rpc('create_class_with_schedules', params);

  if (error) {
    console.error(error);
    if (error.code === '42501') {
      throw new Error('Você não tem permissão para criar uma nova turma.');
    }
    throw new Error('Erro ao criar turma')
  }

  if (!newId) {
    throw new Error('Erro ao criar turma, verifique suas permissões.');
  }

  // invalida cache do dashboard
  revalidatePath('/admin/dashboard');

  return newId;
}