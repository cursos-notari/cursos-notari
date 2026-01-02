"use client";

import { encryptCard } from '@/utils/encryption-helper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { paymentCardSchema, TPaymentCardSchema } from '@/validation/zod-schemas/payment-card-schema';
import { createPreRegistration } from '@/actions/server/pre-registration/create-pre-registration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import usePersonalData from '@/hooks/zustand/use-personal-data';
import { formatCardNumber } from '@/utils/format-card-number';
import { detectCardBrand } from '@/utils/detect-card-brand';
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { usePathname, useRouter } from 'next/navigation';
import { usePaymentMethods } from '@/hooks/zustand/use-payment-methods';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClassData } from '@/hooks/use-class-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import SuccessAnimation from '@/components/animations/success-animation';
import { processCreditCardPayment } from '@/actions/server/payment/process-credit-card-payment';
import { fieldError } from '@/constants/code-field-map';
import { useCheckoutSteps } from '@/hooks/zustand/use-checkout-steps';
import useCreditCardData from '@/hooks/zustand/use-credit-card';
import { useSyncFormWithStore } from '@/hooks/use-sync-form-with-store';
import { PersonalDataFormSchema, personalDataFormSchema } from '@/validation/zod-schemas/personal-data-form-schema';

const Cards = dynamic(() => import('react-credit-cards-2'), {
  ssr: false, // renderiza direto no cliente
  loading: () => (
    <div className="flex items-center justify-center min-w-72.5 min-h-[182.26px]">
      <Spinner />
    </div>
  )
});

const CreditCardForm = React.memo(function CreditCardForm() {

  const [focused, setFocused] = useState<'number' | 'expiry' | 'cvc' | 'name' | undefined>();
  const [paymentAccepted, setPaymentAccepted] = useState(false);

  const { classData } = useClassData();

  const personalData = usePersonalData(state => state.personalData);

  const creditCardData = useCreditCardData(state => state.creditCardData);
  const updateField = useCreditCardData(state => state.updateCreditCardDataField);
  const resetCreditCardData = useCreditCardData(state => state.resetCreditCardData);
  
  const goToStep = useCheckoutSteps((state) => state.goToStep);
  const setPendingErrors = useCheckoutSteps(state => state.setPendingErrors);

  const currentInstallments = usePaymentMethods(state => state.installments);
  const setInstallments = usePaymentMethods(state => state.setInstallments);

  const form = useForm<TPaymentCardSchema>({
    resolver: zodResolver(paymentCardSchema),
    defaultValues: creditCardData
      ? creditCardData
      : {
        holderName: '',
        cardNumber: '',
        cvv: '',
        expirationDate: '',
        installments: 12,
        acceptPolicy: false,
        acceptContract: false
      }
  });

  useSyncFormWithStore(form.watch, updateField);

  // memoização de cálculos caros
  const installmentOptions = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => i + 1), []
  );

  // observa o número do cartão
  const watchedCardNumber = form.watch('cardNumber');

  const cardBrand = useMemo(() => {
    return detectCardBrand(watchedCardNumber || '')
  }, [watchedCardNumber]);

  const router = useRouter();
  const pathname = usePathname();

  const handleCreditCardFormSubmit = async (creditCardData: TPaymentCardSchema,) => {
    try {
      const preRegistration = await createPreRegistration({
        personalData: personalData as PersonalDataFormSchema,
        classId: classData.id
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

      const result = encryptCard(creditCardData);

      if (result.hasErrors) {
        result.errors.forEach((error) => {
          const field = fieldError[error.code];
          form.setError(field.name, {
            type: 'manual',
            message: field.message
          })
        })
        return;
      }

      const res = await processCreditCardPayment({
        preRegistrationId: preRegistration.id,
        classData: classData,
        installments: creditCardData.installments,
        cardToken: result.encryptedCard
      });

      if (!res.success) throw new Error(res.message);

      setPaymentAccepted(true);
      resetCreditCardData();
      form.reset({
        holderName: '',
        cardNumber: '',
        cvv: '',
        expirationDate: '',
        installments: currentInstallments
      });

      setTimeout(() => router.replace(`${pathname}/success`), 1500);

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message || 'Ocorreu um erro ao processar o pagamento.'
          : 'Erro ao processar pagamento. Tente novamente mais tarde',
        { position: 'top-center' }
      );
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto gap-10 rounded-none shadow-none border-x-0">
      <CardHeader className="text-center ">
        <CardTitle className="flex items-center text-gray-700 justify-center gap-2">
          Pague com Cartão
        </CardTitle>
        <CardDescription>
          Preencha os dados do seu cartão de crédito ou débito
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreditCardFormSubmit)} className="flex justify-between">
            <div className="flex flex-col w-full">
              <div className="flex w-full">
                <div className='flex flex-col w-1/2'>
                  {/* número do cartão */}
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className='gap-1!'>
                        <FormLabel className='text-gray-700'>Número do cartão</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                              onFocus={() => setFocused('number')}
                              onBlur={() => setFocused(undefined)}
                              className="pr-16 selection:bg-sky-500 selection:text-white"
                              disabled={paymentAccepted}
                            />
                          </FormControl>
                          {cardBrand && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                              {cardBrand}
                            </div>
                          )}
                        </div>
                        <FormMessage className='text-xs mb-2' />
                      </FormItem>
                    )}
                  />

                  {/* data de expiração e CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expirationDate"
                      render={({ field }) => (
                        <FormItem className='gap-1!'>
                          <FormLabel className='text-gray-700'>Validade</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="MM/AA"
                              maxLength={5}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');

                                if (value.length > 2)
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);

                                field.onChange(value);
                              }}
                              onFocus={() => setFocused('expiry')}
                              onBlur={() => setFocused(undefined)}
                              className="selection:bg-sky-500 selection:text-white"
                              disabled={paymentAccepted}
                            />
                          </FormControl>
                          <FormMessage className='text-xs mb-2' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem className="col-span-1 gap-1!">
                          <FormLabel className='text-gray-700'>CVV</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="123"
                              maxLength={4}
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                              onFocus={() => setFocused('cvc')}
                              onBlur={() => setFocused(undefined)}
                              className="selection:bg-sky-500 selection:text-white"
                              disabled={paymentAccepted}
                            />
                          </FormControl>
                          <FormMessage className='text-xs mb-2' />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* nome do portador */}
                  <FormField
                    control={form.control}
                    name="holderName"
                    render={({ field }) => (
                      <FormItem className='gap-1!'>
                        <FormLabel className='text-gray-700'>Nome do titular</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nome como está no cartão"
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(undefined)}
                            className="selection:bg-sky-500 selection:text-white"
                            disabled={paymentAccepted}
                          />
                        </FormControl>
                        <FormMessage className='text-xs mb-2' />
                      </FormItem>
                    )}
                  />

                  {/* parcelas */}
                  <FormField
                    control={form.control}
                    name="installments"
                    render={({ field }) => (
                      <FormItem className='gap-1!'>
                        <FormLabel className='text-gray-700'>Parcelas</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const installments = parseInt(value);
                              field.onChange(installments);
                              setInstallments(installments, classData.registration_fee);
                            }}
                            value={field.value?.toString() || '1'}
                            disabled={paymentAccepted}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {installmentOptions.map((installment) => (
                                <SelectItem key={installment} value={installment.toString()}>
                                  {installment}x de R$ {(classData.registration_fee / installment).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  {installment === 1 ? ' à vista' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className='text-xs mb-2' />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='border-l border-gray-300 mx-6 h-75'></div>

                <div className='flex flex-col justify-between pb-8 max-w-72.5 w-1/2 space-y-5'>
                  <div className="relative min-h-45 max-h-45">
                    {paymentAccepted
                      ?
                      <SuccessAnimation />
                      :
                      <Cards
                        number={watchedCardNumber}
                        expiry={form.watch('expirationDate')}
                        cvc={form.watch('cvv')}
                        name={form.watch('holderName')}
                        focused={focused}
                        locale={{ valid: 'VALIDADE' }}
                        placeholders={{ name: 'SEU NOME AQUI' }}
                      />
                    }
                  </div>

                  <FormField
                    control={form.control}
                    name="acceptPolicy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            variant="custom"
                            className="m-0 cursor-pointer"
                            disabled={paymentAccepted}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className='text-xs! text-gray-700'>
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
                            disabled={paymentAccepted}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className='text-xs! text-gray-700'>
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
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
                disabled={form.formState.isSubmitting || paymentAccepted}
              >
                {form.formState.isSubmitting ? <><Spinner />Processando</> : 'Finalizar pedido'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

export default CreditCardForm;