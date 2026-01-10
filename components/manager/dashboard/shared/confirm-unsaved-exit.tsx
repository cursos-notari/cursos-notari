'use client'

import React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Props {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onOpenChange: (open: boolean) => void,
  onConfirm: () => void
}

export default function ConfirmUnsavedExit({
  open,
  setOpen,
  onOpenChange,
  onConfirm
}: Props) {

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  }

  const handleCancel = () => setOpen(false);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Você modificou o formulário. Se sair agora, todas as suas alterações serão perdidas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='hover:cursor-pointer' onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:cursor-pointer focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive dark:hover:bg-destructive/90'
            onClick={handleConfirm}
          >
            Sair e descartar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}