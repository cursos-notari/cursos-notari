import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { UseFormReturn, useFormState } from 'react-hook-form';
import { Button } from '../../ui/button';
import { LoginFormSchema } from '@/validation/zod-schemas/login-schema';
import { Loader2Icon } from 'lucide-react';

interface FormProps {
  form: UseFormReturn<LoginFormSchema>;
  onSubmit: (data: LoginFormSchema) => Promise<void>;
}

export default function LoginForm({ form, onSubmit }: FormProps) {

  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full p-6 md:p-8">

        <div className="flex flex-col items-center text-center mb-7">
          <h1 className="text-2xl font-bold text-linear bg-linear-to-tl linear-colors">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Faça login na sua conta
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className='mb-3'>
              <FormLabel className='text-stone-800'>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className='selection:bg-sky-500 autofill:bg-sky-50 autofill:text-stone-800 autofill:shadow-[inset_0_0_0px_1000px_rgb(240_249_255)]'
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className='mb-3'>
              <div className="flex items-center">
                <FormLabel className='text-stone-800'>Senha</FormLabel>
                {/* // TODO: IMPLEMENTAR BOTÃO DE ESQUECI SENHA */}
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className='selection:bg-sky-500 autofill:bg-white! autofill:text-stone-800! autofill:shadow-[inset_0_0_0px_1000px_rgb(240_249_255)]!'
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full hover:cursor-pointer"
          variant='personalized'
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Login'}
        </Button>
      </form>
    </Form>
  )
}