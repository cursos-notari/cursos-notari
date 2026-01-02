'use client'

import { createPreRegistration } from '@/actions/server/pre-registration/create-pre-registration'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { pixFormSchema, PixFormSchema } from '@/validation/zod-schemas/pix-form-validation'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { processPixPayment } from '@/actions/server/payment/process-pix-payment'
import usePersonalData from '@/hooks/zustand/use-personal-data'
import { useClassData } from '@/hooks/use-class-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCheckoutSteps } from '@/hooks/zustand/use-checkout-steps'
import usePixData from '@/hooks/zustand/use-pix-data'
import { useSyncFormWithStore } from '@/hooks/use-sync-form-with-store'

export default function PixForm() {

  const pixData = usePixData(state => state.pixData);
  const updateField = usePixData(state => state.updatePixDataField);
  const resetPixData = usePixData(state => state.resetPixData);

  const form = useForm<PixFormSchema>({
    resolver: zodResolver(pixFormSchema),
    defaultValues: pixData
  });

  // Sincroniza o formulário com o Zustand
  useSyncFormWithStore(form.watch, updateField);

  const router = useRouter();
  const pathname = usePathname();
  const { classData } = useClassData();

  const personalData = usePersonalData(state => state.personalData);
  const setPendingErrors = useCheckoutSteps(state => state.setPendingErrors);
  const goToStep = useCheckoutSteps(state => state.goToStep);

  if (!personalData) throw new Error("Ocorreu um erro interno. Tente novamente mais tarde");

  const handlePixFormSubmit = async (data: PixFormSchema) => {

    if (!data.acceptContract || !data.acceptPolicy) {
      form.setError("root", {
        message: 'Você precisa aceitar os termos para prosseguir'
      });
      return;
    }
    
    try {
      const preRegistration = await createPreRegistration({
        classId: classData.id,
        personalData
      });

      if (!preRegistration.success) {
        if (preRegistration.code === 'invalid_data') {
          setPendingErrors(preRegistration.errors);
          goToStep(1);
        }
        throw new Error(
          preRegistration.message || 'Ocorreu um erro interno ao criar seu registro'
        );
      }

      if (!preRegistration.success || !preRegistration.id) {
        throw new Error('Ocorreu um erro ao processar o pagamento pix.');
      }

      const res = await processPixPayment({
        classData,
        preRegistrationId: preRegistration.id,
      });

      if (!res.success) {
        throw new Error('Ocorreu um erro ao processar o pagamento pix.');
      }

      // Reseta os dados do PIX após sucesso
      resetPixData();
      router.push(`${pathname}/congrats`);

    } catch (error: any) {
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Erro ao processar pagamento. Tente novamente mais tarde', 
        { position: 'top-center' }
      );
    }
  }

  return (
    <Card className='shadow-none rounded-none border-x-0'>
      <CardHeader>
        <CardTitle className='text-gray-700'>
          Pague com Pix
        </CardTitle>
        <CardDescription>
          Finalize o pedido para gerar o QRCode ou código de pagamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePixFormSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="acceptPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      variant="custom"
                      className="m-0 cursor-pointer"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className='text-sm! text-gray-700'>
                      <p>
                        Eu li e aceito os
                        <a className='text-sky-500 font-semibold underline' target='_blank' href=""> termos de política de privacidade </a>
                        da Cursos Notari
                      </p>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptContract"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      variant="custom"
                      className="m-0 cursor-pointer"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className='text-sm! text-gray-700'>
                      <p>
                        Li e aceito os
                        <a className='text-sky-500 font-semibold underline' target='_blank' href=""> termos do contrato </a>
                        do curso oferecido pela empresa
                      </p>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <><Spinner />Processando</> : 'Finalizar pedido'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}