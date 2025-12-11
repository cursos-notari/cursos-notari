'use client'

import { createContext, useContext } from 'react'
import { PublicClass } from '@/types/interfaces/database/class'

export const ClassContext = createContext<{ classData: PublicClass } | null>(null);

export function CheckoutProvider({ 
  children, 
  classData 
}: { 
  children: React.ReactNode
  classData: PublicClass 
}) {
  return (
    <ClassContext.Provider value={{ classData }}>
      {children}
    </ClassContext.Provider>
  )
}