'use client'

import { createContext, useContext } from 'react'
import { PublicClass } from '@/types/interfaces/database/class'

interface ClassContext {
  classData: PublicClass
}

export const ClassContext = createContext<ClassContext | null>(null)

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