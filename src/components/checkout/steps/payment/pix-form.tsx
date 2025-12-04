import { getClassById } from '@/actions/server/class/get-class-by-id'
import { createPagBankOrder } from '@/actions/server/payment/create-pagbank-order'
import { createPreRegistration } from '@/actions/server/pre-registration/create-pre-registration'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import usePersonalData from '@/hooks/zustand/use-personal-data'
import { pixFormSchema, PixFormSchema } from '@/validation/zod-schemas/pix-form-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function PixForm() {

  const form = useForm<PixFormSchema>({
    resolver: zodResolver(pixFormSchema),
    defaultValues: {
      acceptContract: false,
      acceptPolicy: false
    }
  });

  const personalData = usePersonalData((state) => state.personalData);

  const handlePixFormSubmit = async (data: PixFormSchema) => {
    if(!data.acceptContract || !data.acceptPolicy) {
      form.setError("root", {
        message: 'Você precisa aceitar os termos para prosseguir'
      })

      return
    };

    // const classData = await getClassById();
    
    // const preRegistration = await createPreRegistration(personalData, );

    // const newOrder = await createPagBankOrder(supabase, preRegistration);
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
                        <a className='emphasis underline' target='_blank' href=""> termos de política de privacidade </a>
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
                        <a className='emphasis' target='_blank' href=""> termos do contrato </a>
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
              // disabled={isSubmitting}
            >
              {/* {isSubmitting ? <><Spinner />Processando</> : 'Finalizar pedido'} */}
              Finalizar pedido
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
