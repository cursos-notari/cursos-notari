'use client'

import { useRef } from 'react'
import CurrencyInputField, { CurrencyInputProps } from 'react-currency-input-field'
import { Controller, Control } from 'react-hook-form'

interface ControlledCurrencyInputProps extends CurrencyInputProps {
  name: string
  control: Control<any>
}

export function CurrencyInput({ name, control, ...props }: ControlledCurrencyInputProps) {

  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CurrencyInputField
          id={name}
          name={field.name}
          ref={(el) => {
            field.ref(el)
            inputRef.current = el
          }}
          // garante que o value sempre seja number
          value={field.value ?? undefined}
          defaultValue={0}
          // onValueChange envia o valor em string e sem máscara para o react-hook-form
          onValueChange={
            (value) => {
              field.onChange(value && value.trim() !== '' ? Number(value) : 0)
              // posiciona o cursor no final
              requestAnimationFrame(() => {
                if (inputRef.current) {
                  const len = inputRef.current.value.length
                  inputRef.current.setSelectionRange(len, len)
                }
              })
            }
          }
          onBlur={field.onBlur}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 selection:bg-primary selection:text-primary-foreground"

          // configurações para o Real Brasileiro (BRL)
          placeholder="R$ 0,00"
          prefix="R$ "
          groupSeparator="."
          decimalSeparator=","
          decimalsLimit={2}
          allowNegativeValue={false}
          min={0}
          {...props} // permite passar outras props como 'disabled', etc.
        />
      )}
    />
  )
}