"use client"

import { use, useMemo, Suspense, useCallback } from "react";
import { Class } from "@/types/interfaces/database/class";
import CreateClassCard from "@/components/manager/dashboard/create-class-card";
import { MemoizedClassCard } from "@/components/manager/dashboard/memoized-class-card";
import { DialogManager } from "@/components/manager/dashboard/dialog-manager";
import { useDashboard } from "@/hooks/use-dashboard";
import { useClassOperations } from "@/hooks/use-class-operations";
import { TransformedCreateClassFormData } from "@/validation/zod-schemas/create-class-schema";
import { TransformedUpdateClassFormData } from "@/validation/zod-schemas/update-class-schema";

export default function Classes({ classes: classesPromise }: { 
  classes: Promise<{ 
    data?: Class[] | [], 
    success: boolean 
  }> 
}) {
  
  const allClasses = use(classesPromise);

  const {
    dialog,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,
  } = useDashboard();

  const {
    isPending,
    createClass,
    updateClass,
    deleteClass
  } = useClassOperations();

  const handleCreate = useCallback(async (classData: TransformedCreateClassFormData) => {
    const success = await createClass(classData)
    if (success) closeDialog()

    return success
  }, [createClass, closeDialog])

  const handleUpdate = useCallback(async (classId: string, classData: TransformedUpdateClassFormData) => {
    const success = await updateClass(classId, classData)
    if (success) closeDialog()

    return success
  }, [updateClass, closeDialog])

  const handleDelete = useCallback(async (classData: Class) => {
    const success = await deleteClass(classData)
    if (success) closeDialog()

  }, [deleteClass, closeDialog])

  // memoiza array de cards para prevenir re-renders desnecessários
  const classCards = useMemo(() => {
    return allClasses?.data?.map((classItem) => {
      const handleEdit = () => openEditDialog(classItem);
      const handleDeleteClick = () => openDeleteDialog(classItem);

      return (
        <MemoizedClassCard
          key={classItem.id}
          classData={classItem}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isPending={isPending}
        />
      );
    });
  }, [allClasses, isPending, openEditDialog, openDeleteDialog]);

  return (
    <div className="grid auto-rows-[minmax(17rem,auto)] gap-4 md:grid-cols-3 lg:grid-cols-4">
      {/* card para criar turma */}
      <CreateClassCard onClick={openCreateDialog} />

      {/* cards de turmas memoizados */}
      {classCards}

      {/* dialog manager - gerencia todos os dialogs de forma eficiente */}
      <Suspense fallback={null}>
        <DialogManager
          dialogType={dialog.type}
          isOpen={dialog.isOpen}
          selectedClass={dialog.selectedClass}
          onOpenChange={closeDialog}
          onConfirmCreate={handleCreate}
          onConfirmUpdate={handleUpdate}
          onConfirmDelete={handleDelete}
          isPending={isPending}
        />
      </Suspense>
    </div>
  );
}