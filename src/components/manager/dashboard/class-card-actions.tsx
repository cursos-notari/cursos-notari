'use client'

import React from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/utils/cn"
import { ConditionalTooltip } from "./conditional-tooltip"

interface ClassCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isPending: boolean;
  deleteDisabled: boolean;
  editDisabled: boolean;
}

export function ClassCardActions({ onEdit, onDelete, isPending, deleteDisabled, editDisabled }: ClassCardActionsProps) {
  const { state } = useSidebar();

  const getEditTooltipMessage = () => 
    editDisabled ? "Não é possível editar turmas finalizadas ou canceladas.": "Editar";

  const getDeleteTooltipMessage = () => 
    deleteDisabled ? "Não é possível deletar turmas com alunos inscritos.": "Deletar";

  return (
    <div className={cn( "flex", state === 'expanded' ? "flex-col" : "flex-row" )}>
      <ConditionalTooltip
        showTooltip={editDisabled || isPending} 
        message={getEditTooltipMessage()}
      >
        <Button
          className={cn(
            "hover:bg-accent",
            (editDisabled || isPending) ? "cursor-not-allowed" : "hover:cursor-pointer"
          )}
          style={{
            cursor: (editDisabled || isPending) ? 'not-allowed' : 'pointer'
          }}
          variant="ghost"
          size="sm"
          onClick={onEdit}
          disabled={editDisabled || isPending}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </ConditionalTooltip>

      <ConditionalTooltip 
        showTooltip={deleteDisabled || isPending} 
        message={getDeleteTooltipMessage()}
        side="bottom"
      >
        <Button
          className={cn(
            "hover:bg-accent",
            (deleteDisabled || isPending) ? "cursor-not-allowed" : "hover:cursor-pointer"
          )}
          style={{
            cursor: (deleteDisabled || isPending) ? 'not-allowed' : 'pointer'
          }}
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={deleteDisabled || isPending}
        >
          <Trash2 color="red" className="h-4 w-4" />
        </Button>
      </ConditionalTooltip>
    </div>
  )
}