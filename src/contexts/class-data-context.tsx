'use client'

import { createContext, useContext } from 'react'
import { PublicClass } from '@/types/interfaces/database/class'

interface CheckoutContextValue {
  classData: PublicClass
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export function CheckoutProvider({ 
  children, 
  classData 
}: { 
  children: React.ReactNode
  classData: PublicClass 
}) {
  return (
    <CheckoutContext.Provider value={{ classData }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckoutData() {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckoutData must be used within CheckoutProvider')
  }
  return context
}