'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO: AO SUBIR PRA PRODUÇÃO, INTEGRAR SENTRY OU OUTRA PLATAFORMA DE REGISTRO DE ERROS
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Algo deu errado!</h2>
      <button
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}