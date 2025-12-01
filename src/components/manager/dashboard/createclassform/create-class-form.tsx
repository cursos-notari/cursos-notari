import { useFormContext, Controller } from 'react-hook-form';
import { CreateClassFormData } from '@/validation/zod-schemas/create-class-schema';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from '../../../ui/date-picker';
import { CurrencyInput } from '@/components/manager/dashboard/shared/currency-input';
import { ClassDaysManager } from '../shared/class-days-manager';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ComboboxPopover } from '../shared/status-combobox';
import { StatusEnum, statuses } from '@/constants/statuses';
import { useEffect, useMemo } from 'react';
import { Loader2Icon } from 'lucide-react';

export function CreateClassForm({ onSubmit, isPending }: {
  onSubmit: (classData: CreateClassFormData) => void;
  isPending: boolean;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useFormContext<CreateClassFormData>();

  const { planned, open } = statuses;

  const openingDate = watch('openingDate');

  // muda status da turma de acordo com a data de abertura
  useEffect(() => {
    if (openingDate) {
      const today = new Date().setHours(0, 0, 0, 0);

      const openingDay = new Date(openingDate).setHours(0, 0, 0, 0);

      if (openingDay <= today)
        setValue('status', 'open', { shouldValidate: true });
      else
        setValue('status', 'planned', { shouldValidate: true });
    }
  }, [openingDate, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-7 py-5'>
      {/* nome da turma */}
      <div className="grid gap-2">
        <Label htmlFor="className">Nome*</Label>
        <Input className='bg-transparent' id="className" placeholder="Nome da turma" {...register("className")} />
        {errors.className && <p className="text-sm text-red-500">{errors.className.message}</p>}
      </div>

      {/* descrição */}
      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" placeholder="Descrição da turma" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      {/* datas de inscrição */}
      <div className='flex justify-between items-center'>
        <Controller
          control={control}
          name='openingDate'
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor='start-date'>Data de abertura*</Label>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder='Selecione a data de abertura'
              />
              {errors.openingDate && <p className="text-sm text-red-500">{errors.openingDate.message}</p>}
            </div>
          )}
        />
        <Controller
          control={control}
          name='closingDate'
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor='end-date'>Data de fechamento*</Label>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder='Selecione a data de fechamento'
              />
              {errors.closingDate && <p className="text-sm text-red-500 max-w-50">{errors.closingDate.message}</p>}
            </div>
          )}
        />
      </div>

      {/* componente para dias de aula */}
      <ClassDaysManager<CreateClassFormData>
        control={control}
        register={register}
        errors={errors}
      />

      {/* vagas, taxa de inscrição e status */}
      <div className="flex gap-10 w-full items-start">
        <div className="grid gap-2 max-w-40">
          <Label htmlFor='vacancies'>Vagas*</Label>
          <Input placeholder='Ex.: 15' id='vacancies' type='number' {...register("vacancies")} />
          {errors.vacancies && <p className="text-sm text-red-500">{errors.vacancies.message}</p>}
        </div>

        <div className="grid gap-2 max-w-40 self-start">
          <Label htmlFor='registrationFee'>Valor da inscrição*</Label>
          <CurrencyInput control={control} name="registrationFee" />
          {errors.registrationFee && <p className="text-sm no-wrap text-red-500">{errors.registrationFee.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor='status'>Status*</Label>
          <Controller
            control={control}
            name='status'
            render={({ field }) => (
              <ComboboxPopover
                value={field.value}
                onChange={field.onChange}
                statuses={{ [StatusEnum.OPEN]: open, [StatusEnum.PLANNED]: planned }}
              />
            )}
          />
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>
      </div>

      {/* endereço */}
      <div className="grid gap-2">
        <Label htmlFor='address'>Endereço*</Label>
        <Input placeholder='Rua das Pérolas, 172' id='address' {...register("address")} />
        {errors.address && <p className="text-sm no-wrap text-red-500">{errors.address.message}</p>}
      </div>

      <DialogFooter>
        <Button
          disabled={isPending}
          className='cursor-pointer'
          type='submit'>
          {isPending ? (
            <>
              <Loader2Icon className='animate-spin' />
              Criando turma...
            </>
          ) : ('Criar turma')}
        </Button>
      </DialogFooter>
    </form>
  );
}