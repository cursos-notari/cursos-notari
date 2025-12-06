"use client"

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalDataFormSchema, PersonalDataFormSchema } from '@/validation/zod-schemas/personal-data-form-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCPF } from '@/utils/format-CPF'
import { formatPhone } from '@/utils/format-phone'
import { formatCEP } from '@/utils/format-CEP'
import { Loader2Icon } from 'lucide-react'
import { createPreRegistration } from '@/actions/server/pre-registration/create-pre-registration'
import { toast } from 'sonner'
import { defaultValuesMock } from '@/mocks/personal-data-mock'
import { useQuery } from '@tanstack/react-query'
import { getAddressByCEP } from '@/services/get-address-by-cep'
import { useEffect } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getCitiesByUF } from '@/services/get-cities-by-uf'
import usePersonalData from '@/hooks/zustand/use-personal-data'

interface PersonalDataFormProps {
  onNext: () => void;
}

export default function PersonalDataForm({ onNext }: PersonalDataFormProps) {

  const personalData = usePersonalData((state) => state.personalData);
  const setPersonalData = usePersonalData((state) => state.setPersonalData);

  const form = useForm<PersonalDataFormSchema>({
    resolver: zodResolver(personalDataFormSchema),
    // defaultValues: {
    //   ...personalData,
    //   state: 'São Paulo',
    //   regionCode: 'SP'
    // } || {
    //   name: '',
    //   surname: '',
    //   cpf: '',
    //   email: '',
    //   birthdate: undefined,
    //   phone: '',
    //   street: '',
    //   number: '',
    //   noNumber: false,
    //   complement: '',
    //   locality: '',
    //   city: '',
    //   regionCode: 'SP',
    //   state: 'São Paulo',
    //   postalCode: '',
    // },
    defaultValues: defaultValuesMock,
    mode: 'onChange'
  })

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

  const { data: address, isFetching: isFetchingAddress } = useQuery({
    queryKey: ['cep', cep],
    queryFn: () => getAddressByCEP(cep),
    enabled: cep.length === 8,
    staleTime: Infinity,
    select: (data) => ({
      street: data.logradouro || '',
      locality: data.bairro || '',
      city: data.localidade || '',
      regionCode: 'SP',
      state: 'São Paulo',
    }),
  })

  useEffect(() => {

    if (!address) return;

    form.reset({ ...form.getValues(), ...address });
  }, [address]);

  const handleSubmit = async (data: PersonalDataFormSchema) => {
    setPersonalData(data);
    onNext();
  }

  return (
    <Card className="w-full rounded-none border-t-0 max-w-2xl mx-auto">
      <CardHeader>
        {/* <CardTitle className='emphasis text-2xl'>Inscrição - {classData.name}</CardTitle> */}
        <CardDescription className='text-sm text-center font-normal'>
          Confirme seus dados. Eles aparecerão em sua nota fiscal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Fieldset para Informações Pessoais */}
            <fieldset className="border border-gray-200 rounded-lg p-6 space-y-4">
              <legend className="text-lg font-semibold emphasis px-3">Informações Pessoais</legend>
              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>Nome*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="Digite seu nome"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>Sobrenome*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="Digite seu sobrenome"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">

                {/* Data de Nascimento */}
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field, fieldState }) => {
                    const isAgeError = fieldState.error?.message === "Você deve ter no mínimo 17 anos para se cadastrar";

                    return (
                      <FormItem className="w-fit min-w-0">
                        <FormLabel className='emphasis font-medium!'>Data de Nascimento*</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Selecione sua data de nascimento"
                            captionLayout="dropdown"
                            startMonth={new Date(1940, 0)}
                            endMonth={new Date(2008, 11)}
                            defaultMonth={field.value || new Date(2008, 11)}
                          />
                        </FormControl>
                        <FormDescription className={`text-xs ${isAgeError ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          *Você deve ter pelo menos 17 anos para se cadastrar
                        </FormDescription>
                        {!isAgeError && <FormMessage />}
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
                      <FormLabel className='emphasis font-medium!'>CPF*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="000.000.000-00"
                          {...field}
                          onChange={(e) => {

                            const formatted = formatCPF(e.target.value)
                            field.onChange(formatted)
                          }}
                          maxLength={14}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start row-reverse">

                {/* Telefone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>WhatsApp*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="(11) 99999-9999"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value)
                            field.onChange(formatted)
                          }}
                          maxLength={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>E-mail*</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            {/* Fieldset para Endereço */}
            <fieldset className="border border-gray-200 rounded-lg p-6 space-y-4">
              <legend className="text-lg font-semibold emphasis px-3">Endereço</legend>

              {/* CEP e Rua */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>CEP*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCEP(e.target.value);
                            field.onChange(formatted.replace(/\D/g, ''));
                          }}
                          value={formatCEP(field.value)}
                          maxLength={9}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className='emphasis font-medium!'>Rua*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="Nome da rua"
                          disabled={isFetchingAddress}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Número e Complemento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='emphasis font-medium!'>Número*</FormLabel>
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
                                    if (checked) form.setValue('number', '')
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>Complemento</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="Apto, bloco, etc. (opcional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bairro, Cidade e Estado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="locality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>Bairro*</FormLabel>
                      <FormControl>
                        <Input className='selection:bg-sky-500'
                          placeholder="Centro"
                          {...field}
                          disabled={isFetchingAddress}
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/[0-9]/g, ''))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regionCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>UF*</FormLabel>
                      <FormControl>
                        <Input
                          className='selection:bg-sky-500'
                          disabled
                          readOnly
                          {...field}
                          value="SP" // Sempre SP
                          onChange={() => {}} // Previne qualquer mudança
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='emphasis font-medium!'>Cidade*</FormLabel>
                      <FormControl>
                        {isLoadingCities ? (
                          <div className="flex items-center justify-center h-10 border rounded-md">
                            <Loader2Icon className='animate-spin h-4 w-4 text-gray-400' />
                          </div>
                        ) : citiesItems ? (
                          <Combobox
                            disabled={isFetchingAddress}
                            className='w-full cursor-pointer font-normal hover:text-gray-600'
                            comboboxPlaceholder='Selecione a cidade'
                            searchOptionPlaceholder='Busque a cidade'
                            items={citiesItems}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        ) : null}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            {/* Campo oculto para state */}
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
                      onChange={() => {}} // Previne qualquer mudança
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Botão de Submit */}
            <Button
              type="submit"
              variant='personalized'
              className='w-full'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loader2Icon className='animate-spin' /> : 'Avançar'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}