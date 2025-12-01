import { LoginForm } from '@/components/manager/login/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Painel Administrativo',
  description: 'Acesse sua conta para gerenciar o sistema.',
}

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}