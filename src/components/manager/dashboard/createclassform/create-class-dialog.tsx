'use client'

import React, { useEffect, useState } from 'react'
import { useForm, FormProvider, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createClassSchema as createClassFormSchema,
  TransformedCreateClassFormData,
  CreateClassFormData
} from '@/validation/zod-schemas/create-class-schema'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import styles from './create-class-dialog.module.css'
import clsx from 'clsx';
import ConfirmUnsavedExit from '../shared/confirm-unsaved-exit'
import { CreateClassForm } from './create-class-form'
import { getDefaultDates } from '@/utils/get-default-dates'

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransformedCreateClassFormData) => Promise<boolean>;
  isPending: boolean;
}

export default function CreateClassDialog({ open, onOpenChange, onSubmit, isPending }: CreateClassDialogProps) {
  // estado que controla a confirmação de saída sem salvar
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  const methods = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassFormSchema) as unknown as Resolver<CreateClassFormData>,
    defaultValues: {
      className: "Fundamentos da Refrigeração",
      description: "Turma teste",
      ...getDefaultDates({ status: "open" }),
      status: "open",
      vacancies: 15,
      registrationFee: 500,
      address: "Rua das Pérolas, 172",
      // classDays: [{ date: null!, time: "" }]
    },
  });

  const { formState: { isDirty }, reset } = methods;

  // impede recarregamento da página com alterações não salvas
  useEffect(() => {
    // impede fechar dialog durante loading
    if (isPending) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) =>
      isDirty && e.preventDefault();

    window.addEventListener('beforeunload', handleBeforeUnload);

    // cleanup
    return () =>
      window.removeEventListener('beforeunload', handleBeforeUnload);

  }, [isDirty]);

  const handleCloseAndReset = () => {
    onOpenChange(false);
    reset();
  }

  function handleOpenChangeInternal(isOpen: boolean) {
    // se o formulário está sendo fechado e está 'sujo', abre a confirmação.
    if (!isOpen && isDirty) {
      setIsConfirmingClose(true);
      return;
    }
    // se não está sujo, apenas usa a função do manager dashboard
    onOpenChange(isOpen);
    if (!isOpen) reset();
  }

  async function handleCreateClass(classData: CreateClassFormData) {
    const transformedData = classData as unknown as TransformedCreateClassFormData

    // usa a função externa (vinda do hook)
    const success = await onSubmit(transformedData);
    if (success) handleCloseAndReset();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChangeInternal}>
        <DialogContent className={clsx("sm:max-w-[50vw] sm:max-h-[80vh] overflow-y-auto", styles.dialogContent)}>

          <DialogHeader>
            <DialogTitle>Criar nova turma</DialogTitle>
            <DialogDescription>
              Os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...methods}>
            <CreateClassForm
              onSubmit={handleCreateClass}
              isPending={isPending}
            />
          </FormProvider>

        </DialogContent>
      </Dialog>
      <ConfirmUnsavedExit
        open={isConfirmingClose}
        onOpenChange={setIsConfirmingClose}
        setOpen={setIsConfirmingClose}
        onConfirm={handleCloseAndReset}
      />
    </>
  )
}