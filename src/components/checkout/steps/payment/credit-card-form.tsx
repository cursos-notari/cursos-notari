"use client";

import React, { useState, useMemo } from 'react'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { paymentCardSchema, TPaymentCardSchema } from '@/validation/zod-schemas/payment-card-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock } from 'lucide-react';
import { detectCardBrand } from '@/utils/detect-card-brand';
import { formatCardNumber } from '@/utils/format-card-number';
import { Spinner } from '@/components/ui/spinner';
import { clearSensitiveData, encryptCardData, getPublicKey, prepareCardData, validatePagSeguroSDK } from '@/utils/encryptionHelper';
import { creditCardCharge } from '@/actions/server/payment/credit-card-charge';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

// import 'react-credit-cards-2/dist/es/styles-compiled.css'
import dynamic from 'next/dynamic';
// const Cards = dynamic(() => import('react-credit-cards-2'), {
//   ssr: false, // renderiza direto no cliente
//   loading: () => <div className="flex items-center justify-center h-[180px]"><Spinner /></div>
// });

interface CreditCardFormProps {
  unitAmount: number;
  token: string;
}

const CreditCardForm = React.memo(function CreditCardForm({ unitAmount, token }: CreditCardFormProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [focused, setFocused] = useState<'number' | 'expiry' | 'cvc' | 'name' | undefined>();

  const form = useForm<TPaymentCardSchema>({
    resolver: zodResolver(paymentCardSchema),
    defaultValues: {
      holderName: '',
      cardNumber: '',
      cvv: '',
      expiryDate: '',
      installments: 1,
      acceptPolicy: false,
      acceptContract: false
    }
  });

  // Memoização de cálculos caros
  const installmentOptions = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => i + 1), []
  );

  // Valores computados
  // const orderValue = useMemo(() => unitAmount / 100, [unitAmount]);

  const cardBrand = useMemo(() =>
    detectCardBrand(form.watch('cardNumber') || ''),
    [form.watch('cardNumber')]
  );

  const handleCreditCardFormSubmit = async (creditCardData: TPaymentCardSchema,) => {
    try {
      setIsSubmitting(true);
      validatePagSeguroSDK();
      const publicKey = getPublicKey();
      const cardData = prepareCardData(creditCardData);
      const encryptedCardToken = encryptCardData(publicKey, cardData);

      // limpa dados sensíveis da cardData
      cardData.number = '';
      cardData.securityCode = '';

      // limpa dados sensíveis vindos do formulário
      clearSensitiveData(creditCardData);

      const res = await creditCardCharge(token, {
        installments: creditCardData.installments,
        cardToken: encryptedCardToken
      });

      if (!res.success) throw new Error(res.message);



    } catch (e) {
      console.error('Erro no processamento do pagamento:', e);
      toast.error('Não foi possível processar o pagamento. Tente novamente.', {
        position: 'top-center'
      });
    } finally {
      setIsSubmitting(false);
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
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                              onFocus={() => setFocused('number')}
                              onBlur={() => setFocused(undefined)}
                              className="pr-16"
                            />
                            {cardBrand && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                                {cardBrand}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className='text-xs mb-2' />
                      </FormItem>
                    )}
                  />

                  {/* data de expiração e CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
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
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString() || '1'}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {installmentOptions.map((installment) => (
                                <SelectItem key={installment} value={installment.toString()}>
                                  {installment}x de R$ {(unitAmount / installment).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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

                <div className='flex flex-col justify-between pb-8 max-w-[290px] w-1/2 space-y-5'>
                  <div className="relative min-h-[180px]">
                    {/* <Cards
                      number={form.watch('cardNumber')}
                      expiry={form.watch('expiryDate')}
                      cvc={form.watch('cvv')}
                      name={form.watch('holderName')}
                      focused={focused}
                      locale={{ valid: 'VALIDADE' }}
                    /> */}
                  </div>

                  {/* informações de segurança */}
                  {/* <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-accent p-3 rounded-md">
                <Lock className="w-3 h-3" />
                <span>Suas informações estão seguras</span>
              </div> */}

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
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className='text-xs! text-gray-700'>
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
                          <FormLabel className='text-xs! text-gray-700'>
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
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? <><Spinner />Processando</> : 'Finalizar pedido'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

export default CreditCardForm