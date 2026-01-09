"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalDataFormSchema, PersonalDataFormSchema } from '@/validation/zod-schemas/personal-data-form-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { formatCPF } from '@/utils/format-CPF'
import { formatPhone } from '@/utils/format-phone'
import { formatCEP } from '@/utils/format-CEP'
import { Loader2Icon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAddressByCEP } from '@/services/get-address-by-cep'
import { useEffect } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getCitiesByUF } from '@/services/get-cities-by-uf'
import usePersonalData from '@/hooks/zustand/use-personal-data'
import { useSyncFormWithStore } from '@/hooks/use-sync-form-with-store'
import { useCheckoutSteps } from '@/hooks/zustand/use-checkout-steps'

export default function PersonalDataForm({ onNext }: { onNext: () => void }) {

  const personalData = usePersonalData((state) => state.personalData);

  const updateField = usePersonalData((state) => state.updatePersonalDataField);
  const pendingErrors = useCheckoutSteps((state) => state.pendingErrors);
  const setPendingErrors = useCheckoutSteps((state) => state.setPendingErrors);

  const form = useForm<PersonalDataFormSchema>({
    resolver: zodResolver(personalDataFormSchema),
    defaultValues: personalData ? {
      ...personalData,
      state: 'São Paulo',
      regionCode: 'SP'
    } : {
      name: '',
      surname: '',
      cpf: '',
      email: '',
      birthdate: undefined,
      phone: '',
      street: '',
      number: '',
      noNumber: false,
      complement: '',
      locality: '',
      city: '',
      regionCode: 'SP',
      state: 'São Paulo',
      postalCode: '',
    },
    mode: 'onChange'
  });

  const cep = form.watch('postalCode');

  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities', 'SP'],
    queryFn: () => getCitiesByUF('SP'),
    staleTime: Infinity,
  })

  const citiesItems = cities?.map((city) => {
    return {
      value: city.nome,
      label: city.nome
    }
  })

  const { data: address, isFetching: isFetchingAddress, error: addressError } = useQuery({
    queryKey: ['cep', cep],
    queryFn: () => getAddressByCEP(cep),
    enabled: cep.length === 8,
    staleTime: Infinity,
    retry: false,
    retryDelay: 0,
    select: (data) => ({
      street: data?.logradouro || '',
      locality: data?.bairro || '',
      city: data?.localidade || '',
      regionCode: 'SP',
      state: 'São Paulo',
    }),
  })

  useEffect(() => {

    if (!address) return;

    form.reset({ ...form.getValues(), ...address });

  }, [address]);

  useEffect(() => {
    if (addressError && cep.length === 8) {
      form.setError('postalCode', {
        type: 'manual',
        message: addressError instanceof Error ? addressError.message : 'Erro ao buscar CEP'
      });
    } else if (!addressError && cep.length === 8) {
      form.clearErrors('postalCode');
    }
  }, [addressError, cep, form]);

  useEffect(() => {
    if (pendingErrors && pendingErrors.length > 0) {
      pendingErrors.forEach((error) => {
        form.setError(error.field, {
          type: 'manual',
          message: error.message
        });
      });

      const firstErrorField = pendingErrors[0]?.field;
      if (firstErrorField) {
        // aguarda a renderização completa e o scroll
        setTimeout(() => {
          form.setFocus(firstErrorField);

        }, 100); // 100ms para garantir que o DOM está pronto
      }

      setPendingErrors(null);
    }
  }, [pendingErrors, form, setPendingErrors]);

  useSyncFormWithStore(form.watch, updateField);

  return (
    <Card className="w-full rounded-none border-t-0 max-w-2xl mx-auto">
      <CardHeader>
        <CardDescription className='text-sm text-center font-normal'>
          Confirme seus dados. Eles aparecerão em sua nota fiscal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => onNext())} className="space-y-6">
            {/* fieldset para informações pessoais */}
            <fieldset className="border border-gray-200 p-6 rounded-md space-y-4">
              <legend className="text-lg font-semibold text-linear bg-linear-to-tr linear-colors px-3">Informações Pessoais</legend>
              {/* nome e sobrenome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>Nome*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          {...field}
                          placeholder="Digite seu nome"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                            field.onChange(value);
                          }}
                          maxLength={50}
                          minLength={2}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>Sobrenome*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          {...field}
                          placeholder="Digite seu sobrenome"
                           onChange={(e) => {
                            const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                            field.onChange(value);
                          }}
                          minLength={2}
                          maxLength={50}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">

                {/* data de nascimento */}
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field, fieldState }) => {
                    const isAgeError = fieldState.error?.message === "Você deve ter no mínimo 17 anos para se cadastrar";

                    return (
                      <FormItem className="w-fit min-w-0">
                        <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>Data de Nascimento*</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Selecione sua data de nascimento"
                            captionLayout="dropdown"
                            startMonth={new Date(1940, 0)}
                            endMonth={new Date(2009, 11)}
                            defaultMonth={field.value || new Date(2009, 11)}
                          />
                        </FormControl>
                        <FormDescription className={`text-xs ${isAgeError ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          *Você deve ter pelo menos 17 anos para se cadastrar
                        </FormDescription>
                        {!isAgeError && <FormMessage className='text-xs' />}
                      </FormItem>
                    );
                  }}
                />

                {/* CPF */}
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>CPF*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="000.000.000-00"
                          value={formatCPF(field.value)}
                          onChange={(e) => {
                            const unformatted = e.target.value.replace(/\D/g, '')
                            field.onChange(unformatted)
                          }}
                          minLength={14}
                          maxLength={14}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start row-reverse">

                {/* telefone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>WhatsApp*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="(11) 99999-9999"
                          value={formatPhone(field.value)}
                          onChange={(e) => {
                            const unformatted = e.target.value.replace(/\D/g, '');
                            field.onChange(unformatted);
                          }}
                          minLength={15}
                          maxLength={15}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>E-mail*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.toLowerCase())
                          }}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            {/* fieldset para endereço */}
            <fieldset className="border border-gray-200 p-6 rounded-md space-y-4">
              <legend className="text-lg font-semibold text-linear bg-linear-to-tr linear-colors px-3">Endereço</legend>

              {/* CEP e rua */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>CEP*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCEP(e.target.value);
                            field.onChange(formatted.replace(/\D/g, ''));
                          }}
                          value={formatCEP(field.value)}
                          minLength={9}
                          maxLength={9}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>Rua*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^a-zA-Z0-9À-ÿ\s.'-]/g, '');
                            field.onChange(value);
                          }}
                          placeholder="Nome da rua"
                          disabled={isFetchingAddress}
                          minLength={5}
                          maxLength={100}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              </div>

              {/* número e complemento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>Número*</FormLabel>
                        <FormControl>
                          <Input className='selection:bg-sky-500'
                            placeholder="123"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/\D/g, ''))
                            }}
                            maxLength={4}
                            disabled={form.watch('noNumber')}
                          />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name="noNumber"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked)
                                    if (checked) {
                                      form.setValue('number', '')
                                      form.clearErrors('number')
                                    }
                                  }}
                                  variant="custom"
                                  className="cursor-pointer"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className='font-normal text-gray-500 text-sm cursor-pointer'>
                                  Sem número
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormMessage className='text-xs' />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>Complemento</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="Apto, bloco, etc. (opcional)"
                          {...field}
                          maxLength={50}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              </div>

              {/* bairro, cidade e estado */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <FormField
                  control={form.control}
                  name="locality"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>Bairro*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="Centro"
                          {...field}
                          disabled={isFetchingAddress}
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/[0-9]/g, ''))
                          }}
                          minLength={2}
                          maxLength={50}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regionCode"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>UF*</FormLabel>
                      <FormControl>
                        <Input
                          className='selection:bg-sky-500'
                          disabled
                          readOnly
                          {...field}
                          value="SP" // Sempre SP
                          onChange={() => { }} // previne qualquer mudança
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field, fieldState }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel className='text-linear bg-linear-to-tr linear-colors font-medium!'>Cidade*</FormLabel>
                      <FormControl>
                        {isLoadingCities ? (
                          <div className="flex items-center justify-center h-10 border rounded-md">
                            <Loader2Icon className='animate-spin h-4 w-4 text-gray-400' />
                          </div>
                        ) : citiesItems ? (
                          <Combobox
                            disabled={isFetchingAddress}
                            className={`w-full cursor-pointer font-normal hover:text-gray-600 ${fieldState.error ? 'border-red-500' : ''}`}
                            comboboxPlaceholder='Selecione a cidade'
                            searchOptionPlaceholder='Busque a cidade'
                            items={citiesItems}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        ) : null}
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            {/* campo oculto para state */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      type="hidden"
                      {...field}
                      value="São Paulo"
                      onChange={() => { }} // previne qualquer mudança
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant='personalized'
              className='w-full'
              disabled={form.formState.isSubmitting || isFetchingAddress}
            >
              {form.formState.isSubmitting ? <Loader2Icon className='animate-spin' /> : 'Avançar'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}