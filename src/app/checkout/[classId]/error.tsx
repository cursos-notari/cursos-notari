"use client"

import React from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  // TODO: ESTILIZAR ESSA PÁGINA DE ERRO
  return (
    <div>
      <p>Erro: {error.message}</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}