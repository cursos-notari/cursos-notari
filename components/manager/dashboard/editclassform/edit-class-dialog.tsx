'use client'

import React, { useEffect, useState } from 'react';

// form
import { EditClassForm } from './edit-class-form';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// função que formata os dados do banco para inserção no form
import { formatDataForClassForm } from '@/utils/format-data-for-class-form';

// zod - schema e types
import {
  TransformedUpdateClassFormData, transformedUpdateClassFormSchema, // classdays como Date[]
  UpdateClassFormData, // classdays no formato { data, time }
} from '@/validation/zod-schemas/update-class-schema';

// dialog - modal
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// confirmação de saída sem salvar
import ConfirmUnsavedExit from '../shared/confirm-unsaved-exit';

// types
import { Class } from '@/types/interfaces/database/class'; // formato vindo do banco

// estilos
import styles from '../createclassform/create-class-dialog.module.css';
import clsx from 'clsx';

interface EditClassDialogProps {
  open: boolean;
  classData: Class;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (classId: string, classData: TransformedUpdateClassFormData) => Promise<boolean>;
}

export default function EditClassDialog({
  open,
  onOpenChange,
  classData,
  onSubmit,
  isPending
}: EditClassDialogProps) {
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  const methods = useForm<UpdateClassFormData>({
    resolver: zodResolver(
      transformedUpdateClassFormSchema(classData.status, classData.occupied_seats)
    ) as unknown as Resolver<UpdateClassFormData>,
    defaultValues: { ...formatDataForClassForm(classData) },
  });

  const { formState: { isDirty }, reset } = methods;

  useEffect(() => {
    // impede fechar dialog durante loading
    if (isPending) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) =>
      isDirty && event.preventDefault();

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () =>
      window.removeEventListener('beforeunload', handleBeforeUnload);

  }, [isDirty]);

  const handleCloseAndReset = () => {
    onOpenChange(false);
    reset();
  };

  function handleOpenChangeInternal(isOpen: boolean) {
    if (!isOpen && isDirty) {
      setIsConfirmingClose(true);
      return;
    }
    onOpenChange(isOpen);
    if (!isOpen) reset();
  }

  async function handleUpdateClass(formData: UpdateClassFormData) {
    // verifica se há alterações antes de enviar
    if (!isDirty) return;

    const transformedData = formData as unknown as TransformedUpdateClassFormData;

    // usa a função externa (vinda do hook)
    const success = await onSubmit(classData.id, transformedData);
    if (success) handleCloseAndReset();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChangeInternal}>
        <DialogContent className={clsx("sm:max-w-[50vw] sm:max-h-[80vh] overflow-y-auto", styles.dialogContent)}>

          <DialogHeader>
            <DialogTitle>Editar Turma</DialogTitle>
            <DialogDescription>
              Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...methods}>
            <EditClassForm
              isPending={isPending}
              classData={classData}
              onSubmit={handleUpdateClass}
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