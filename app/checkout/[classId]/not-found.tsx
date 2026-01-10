'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { useImmer } from 'use-immer';

export default function NotFound() {

  const [isNavigating, setIsNavigating] = useImmer({
    classes: false,
    home: false
  });

  return (
    <div className="bg-muted min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto text-center gap-0 space-y-5 py-8 px-3">
        <CardHeader className="gap-1">
          <CardTitle className="text-3xl font-bold text-red-600">404</CardTitle>
          <CardDescription className="text-lg text-stone-800 font-semibold">
            Turma não encontrada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-7">
          <p className="text-stone-700 font-medium">
            A turma que você está procurando não existe ou está fechada.
          </p>
          <div className="flex w-full flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="w-1/2"
              variant='personalized'
              disabled={isNavigating.classes}
              asChild
            >
              <Link
                href="/#classes"
                replace
                onClick={() => setIsNavigating(draft => { draft.classes = true })}
              >
                { isNavigating.classes ? <Spinner/> : 'Ver turmas disponíveis' }
              </Link>
            </Button>
            <Button
              className="w-1/2"
              variant="outline"
              disabled={isNavigating.home}
              asChild
            >
              <Link
                href="/"
                replace
                onClick={() => setIsNavigating(draft => { draft.home = true })}
              >
                { isNavigating.home ? <Spinner/> : 'Voltar ao início' }
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}