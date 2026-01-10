"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Status, StatusEnum } from "@/constants/statuses"
import { cn } from "@/utils/cn"

interface ComboboxPopoverProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  statuses: Partial<Record<StatusEnum, Status>>;
  disabled?: boolean;
  id?: string;
}

export function ComboboxPopover({ id, value, onChange, statuses, disabled = false }: ComboboxPopoverProps) {
  const [open, setOpen] = React.useState(false)

  const selectedStatus = statuses[value as StatusEnum]

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-[150px] justify-start",
              !disabled && "hover:cursor-pointer",
              !selectedStatus && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {selectedStatus ? (
              <div className="flex items-center">
                <span
                  className={cn("mr-2 h-2 w-2 rounded-full", selectedStatus.color)}
                />
                {selectedStatus.label}
              </div>
            ) : (
              <>Altere o status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput id={id} placeholder="Altere o status..." />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup>
                {Object.entries(statuses).map(([key, status]) => (
                  <CommandItem
                    className="hover: cursor-pointer"
                    key={key}
                    value={status.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? null : currentValue)
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-center">
                      <span
                        className={cn("mr-2 h-2 w-2 rounded-full", status.color)}
                      />
                      {status.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}