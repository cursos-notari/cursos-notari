"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function VerificationError({ error }: { error: string | null }) {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para as turmas após 3 segundos
    const timer = setTimeout(() => {
      router.push('/#classes');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-700">Erro de verificação</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-base text-muted-foreground font-semibold">
            {error || 'Dados não encontrados'}
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            Redirecionando para as turmas disponíveis...
          </p>

          {/* Indicator de loading */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}