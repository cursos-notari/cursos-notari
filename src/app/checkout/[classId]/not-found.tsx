import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="bg-muted min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-red-600">404</CardTitle>
          <CardDescription className="text-lg font-semibold">
            Turma não encontrada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            A turma buscada não existe ou está fechada.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-sky-500 hover:bg-sky-400" asChild>
              <Link className="text-white!" href="/">
                Voltar ao início
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/#classes">
                Ver turmas disponíveis
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}