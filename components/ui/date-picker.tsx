"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { pt } from "react-day-picker/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  disabled?: boolean
  captionLayout?: "label" | "dropdown" | "dropdown-years"
  startMonth?: Date
  endMonth?: Date
  defaultMonth?: Date
}

export function DatePicker({ 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  captionLayout = "label",
  startMonth,
  endMonth,
  defaultMonth,
  ...props 
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="cursor-pointer data-[empty=true]:text-muted-foreground w-[300px] justify-start text-left font-normal selection:bg-primary selection:text-primary-foreground"
          disabled={disabled}
          {...props}
        >
          <CalendarIcon />
          {value ? format(value, "PPPP", { locale: pt }) : <span>{placeholder ?? 'Selecione uma data'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          locale={pt}
          mode="single"
          className="rounded-lg border"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          captionLayout={captionLayout}
          startMonth={startMonth}
          endMonth={endMonth}
          defaultMonth={defaultMonth}
        />
      </PopoverContent>
    </Popover>
  )
}