import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Spinner } from '../ui/spinner'

export function VerificationLoading() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-sky-100 rounded-full">
            <Spinner className="w-8 h-8 text-sky-500" />
          </div>
          <CardTitle className="text-sky-700">Verificando dados</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Carregando informações do seu registro...
          </p>

          {/* Indicator de loading */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
