'use client'

import { Suspense, lazy, memo } from 'react'
import { Class } from '@/types/interfaces/database/class'
import { TransformedCreateClassFormData } from '@/validation/zod-schemas/create-class-schema'
import { ClassDialogSkeleton } from './shared/class-dialog-skeleton'
import { DeleteClassDialog } from './delete-class-dialog'
import { TransformedUpdateClassFormData, UpdateClassFormData } from '@/validation/zod-schemas/update-class-schema'

// lazy load heavy dialog components
const CreateClassDialog = lazy(() => import('./createclassform/create-class-dialog'))
const EditClassDialog = lazy(() => import('./editclassform/edit-class-dialog'))

interface DialogManagerProps {
  dialogType: 'create' | 'edit' | 'delete' | null
  isOpen: boolean
  selectedClass: Class | null
  onOpenChange: (open: boolean) => void
  onConfirmDelete: (classData: Class) => void
  onConfirmCreate: (data: TransformedCreateClassFormData) => Promise<boolean>
  onConfirmUpdate: (classId: string, classData: TransformedUpdateClassFormData) => Promise<boolean>
  isPending: boolean
}

export const DialogManager = memo<DialogManagerProps>(function DialogManager({
  dialogType,
  isOpen,
  selectedClass,
  onOpenChange,
  onConfirmDelete,
  onConfirmCreate,
  onConfirmUpdate,
  isPending
}) {

  if (!isOpen || !dialogType) return null

  switch (dialogType) {
    case 'create':
      return (
        <Suspense fallback={<ClassDialogSkeleton />}>
          <CreateClassDialog
            open={isOpen}
            onOpenChange={onOpenChange}
            onSubmit={onConfirmCreate!}
            isPending={isPending}
          />
        </Suspense>
      )

    case 'edit':
      if (!selectedClass) return null
      return (
        <Suspense fallback={<ClassDialogSkeleton />}>
          <EditClassDialog
            open={isOpen}
            onSubmit={onConfirmUpdate}
            isPending={isPending}
            onOpenChange={onOpenChange}
            classData={selectedClass}
          />
        </Suspense>
      )

    case 'delete':
      if (!selectedClass) return null
      return (
        <DeleteClassDialog
          open={isOpen}
          onOpenChange={onOpenChange}
          onConfirm={() => onConfirmDelete(selectedClass)}
          className={selectedClass.name}
          isPending={isPending}
        />
      )

    default:
      return null
  }
}, (prevProps, nextProps) => {
  return (
    prevProps.dialogType === nextProps.dialogType &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.selectedClass?.id === nextProps.selectedClass?.id &&
    prevProps.selectedClass?.updated_at === nextProps.selectedClass?.updated_at &&
    prevProps.isPending === nextProps.isPending
  )
})