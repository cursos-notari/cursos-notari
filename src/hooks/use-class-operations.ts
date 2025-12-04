'use client'

import { useCallback, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteClassAction } from '@/actions/server/class/delete-class'
import { createClassAction } from '@/actions/server/class/create-class'
import { updateClassAction } from '@/actions/server/class/update-class'
import { Class } from '@/types/database/class'
import { TransformedCreateClassFormData } from '@/validation/zod-schemas/create-class-schema'
import { TransformedUpdateClassFormData } from '@/validation/zod-schemas/update-class-schema'

export function useClassOperations() {
  const [isPending, startTransition] = useTransition();

  const createClass = useCallback(async (classData: TransformedCreateClassFormData): Promise<boolean> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          await createClassAction(classData)
          toast.success('Turma criada com sucesso!', {
            description: classData.className,
            position: 'top-right'
          })
          resolve(true)
        } catch (error: any) {
          toast.error(error.message || 'Erro inesperado ao criar turma', {
            position: 'top-right'
          })
          console.error('Erro ao criar turma:', error)
          resolve(false)
        }
      })
    })
  }, [])

  const updateClass = useCallback(async (classId: string, classData: TransformedUpdateClassFormData): Promise<boolean> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          // TODO: ARRUMAR ADAPTAÇÃO DO TIPO
          // TODO: VERIFICAR POR QUE O BOTÃO NÃO FUNCIONA QUANDO O USUÁRIO É ADMIN
          await updateClassAction(classId, classData);
          toast.success('Turma atualizada com sucesso!', {
            description: classData.className,
            position: 'top-right'
          })
          resolve(true)
        } catch (error: any) {
          toast.error(error.message || 'Erro inesperado ao atualizar turma', {
            position: 'top-right'
          })
          console.error('Erro ao atualizar turma:', error)
          resolve(false)
        }
      })
    })
  }, [])

  const deleteClass = useCallback(async (classData: Class): Promise<boolean> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const result = await deleteClassAction(classData.id)

          if (result.success) {
            toast.success(`Turma "${classData.name}" deletada com sucesso!`, {
              position: 'top-right'
            })
            resolve(true)
          } else {
            toast.error(result.message, {
              position: 'top-right'
            })
            resolve(false)
          }
        } catch (error) {
          toast.error('Erro inesperado ao deletar turma', {
            position: 'top-right'
          })
          resolve(false)
        }
      })
    })
  }, [])

  return {
    isPending,
    createClass,
    updateClass,
    deleteClass,
  }
}