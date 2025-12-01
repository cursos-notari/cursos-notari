"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"

const checkboxVariants = cva(
  "peer border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        secondary: "data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground dark:data-[state=checked]:bg-secondary data-[state=checked]:border-secondary",
        destructive: "data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground dark:data-[state=checked]:bg-destructive data-[state=checked]:border-destructive",
        success: "data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
        warning: "data-[state=checked]:bg-orange-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600",
        custom: "data-[state=checked]:bg-[#17A6FF] data-[state=checked]:text-white dark:data-[state=checked]:bg-[#17A6FF] data-[state=checked]:border-[#17A6FF]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Checkbox({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ variant }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
