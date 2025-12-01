"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  items: {
    value: string;
    label: string
  }[];
  value?: string;
  onChange?: (value: string) => void;
  comboboxPlaceholder?: string;
  searchOptionPlaceholder?: string;
  className?: string;
  emptySearch?: string;
  disabled?: boolean;
}

export function Combobox({
  items,
  value: externalValue,
  onChange,
  comboboxPlaceholder = "Selecione uma opção",
  searchOptionPlaceholder = "Pesquise uma opção",
  emptySearch = "Nenhuma opção encontrada",
  className,
  disabled,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState("")
  const [search, setSearch] = React.useState("")

  const value = externalValue !== undefined ? externalValue : internalValue

  // Filter items based on search
  const filteredItems = React.useMemo(() => {
    if (!search) return items.slice(0, 50); // itens iniciais
    return items.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 100); // limite de 100 resultados
  }, [items, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", (!value && "text-gray-500"), className)}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : comboboxPlaceholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            disabled={disabled}
            placeholder={searchOptionPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptySearch}</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  className="cursor-pointer"
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue

                    if (onChange)
                      onChange(newValue)
                    else
                      setInternalValue(newValue)

                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}