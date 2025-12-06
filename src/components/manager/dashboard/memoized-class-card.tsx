'use client'

import React, { memo, useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClassCardActions } from "./class-card-actions"
import { Class } from "@/types/interfaces/database/class"
import { statuses } from "@/constants/statuses"
import { formatCurrency } from "@/utils/format-currency"

interface MemoizedClassCardProps {
  classData: Class;
  onEdit: () => void;
  onDelete: () => void;
  isPending: boolean;
}

export const MemoizedClassCard = memo<MemoizedClassCardProps>(function MemoizedClassCard({
  classData,
  onEdit,
  onDelete,
  isPending
}) {
  const statusInfo = statuses[classData.status || 'planned'];

  const isDeleteDisabled = useMemo(() =>
    classData.occupied_seats > 0,
    [classData.status, classData.occupied_seats]);

  const isEditDisabled = useMemo(() =>
    classData.status === 'canceled' || classData.status === 'finished',
    [classData.status]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle>{classData.name}</CardTitle>
        </div>
        <CardAction>
          <ClassCardActions
            onEdit={onEdit}
            onDelete={onDelete}
            isPending={isPending}
            deleteDisabled={isDeleteDisabled}
            editDisabled={isEditDisabled}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
          <span>{statusInfo.label}</span>
        </div>
        <div className="text-sm">
          <strong>Vagas:</strong> {classData.total_seats - classData.occupied_seats || 0} / {classData.total_seats}
        </div>
        <div className="text-sm">
          <strong>Inscrição:</strong> {formatCurrency(classData.registration_fee)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" className="w-full hover:cursor-pointer">
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  )
}, (prevProps, nextProps) => {
  //compara props para decidir se precisar re-renderizar o componente
  return (
    prevProps.classData.id === nextProps.classData.id &&
    prevProps.classData.name === nextProps.classData.name &&
    prevProps.classData.status === nextProps.classData.status &&
    prevProps.classData.total_seats === nextProps.classData.total_seats &&
    prevProps.classData.occupied_seats === nextProps.classData.occupied_seats &&
    prevProps.classData.registration_fee === nextProps.classData.registration_fee &&
    prevProps.classData.updated_at === nextProps.classData.updated_at &&
    prevProps.isPending === nextProps.isPending
  )
})