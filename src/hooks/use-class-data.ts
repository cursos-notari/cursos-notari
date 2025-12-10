import { ClassContext } from "@/contexts/class-data-context"
import { useContext } from "react"

export function useClassData() {
  const context = useContext(ClassContext)
  if (!context) {
    throw new Error('useClassData must be used within CheckoutProvider')
  }
  return context
}