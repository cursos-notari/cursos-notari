'use client'

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { loginFormSchema, LoginFormSchema } from "@/validation/zod-schemas/login-schema"
import LoginForm from "./login-form"
import Image from "next/image"

export default function LoginPage() {

  const router = useRouter();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const handleLoginFormSubmit = async (data: LoginFormSchema) => {

    const supabase = createClient();

    if (!supabase) {
      toast.error("Ocorreu um erro interno ao tentar realizar seu login.", {
        position: 'top-center'
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      let errorMessage: React.ReactNode = "Ocorreu um erro inesperado. Tente novamente mais tarde.";

      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = (
            <div>
              <p>E-mail ou senha inválidos.</p>
              <p>Por favor, verifique seus dados e tente novamente.</p>
            </div>
          );
          break;
      }

      toast.error(errorMessage, { position: "top-center" });

      return;
    }

    form.reset();

    router.push('/admin/dashboard');
  }

  return (
    <div className="bg-muted flex items-center justify-center h-screen">
      <Card className="overflow-hidden p-0 shadow md:w-1/2">
        <CardContent className="grid p-0 md:grid-cols-2">
          <LoginForm
            form={form}
            onSubmit={handleLoginFormSubmit}
          />
          <div className="border-l relative hidden md:block">
            <Image
              width={1536}
              height={1024}
              src="/img/logo-secundary.png"
              alt="Logo Cursos Notari"
              className="absolute top-[50%] -translate-y-1/2 inset-0 w-full object-fill dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}