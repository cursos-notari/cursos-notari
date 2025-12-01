import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { UseFormReturn } from 'react-hook-form';
import { Button } from '../../ui/button';
import { TLoginFormSchema } from '@/validation/zod-schemas/login-schema';
import { Loader2Icon } from 'lucide-react';

interface FormProps {
  form: UseFormReturn<TLoginFormSchema>;
  onSubmit: (data: TLoginFormSchema) => void;
  isLoading: boolean;
}

export default function FormContent({ form, onSubmit, isLoading }: FormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-balance">
            Faça login na sua conta
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage /> {/* Exibe erros de validação aqui */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Senha</FormLabel>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full hover:cursor-pointer" disabled={isLoading}>
          {isLoading ? <Loader2Icon className='animate-spin'/> : 'Login'}
        </Button>
      </form>
    </Form>
  )
}