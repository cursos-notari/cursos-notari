import { useMemo, useEffect } from 'react';

// react-hook-form
import { useFormContext, Controller } from 'react-hook-form';

// ui
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/manager/dashboard/shared/currency-input';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ComboboxPopover } from '@/components/manager/dashboard/shared/status-combobox';

// componente separado para dias de aula
import { ClassDaysManager } from '../shared/class-days-manager';

// status da turma
import { StatusEnum, statuses } from '@/constants/statuses';

// type zod
import { UpdateClassFormData } from '@/validation/zod-schemas/update-class-schema';
import { Loader2Icon } from 'lucide-react';
import { Class } from '@/types/interfaces/database/class';
import { filterStatus } from '@/utils/filter-status';

interface Props {
  onSubmit: (data: UpdateClassFormData) => void;
  isPending: boolean;
  classData: Class;
}

export function EditClassForm({ onSubmit, isPending, classData }: Props) {
  const {
    register, control, handleSubmit, formState: { errors, isDirty }, watch, setValue
  } = useFormContext<UpdateClassFormData>();

  const openingDate = watch('openingDate');

  const wasOpened = useMemo(() => {
    return classData.status !== StatusEnum.PLANNED;
  }, [classData.status]);

  // Atualiza status automaticamente quando a data de abertura muda (apenas para turmas planejadas)
  useEffect(() => {
    if (openingDate && classData.status === StatusEnum.PLANNED) {
      const today = new Date().setHours(0, 0, 0, 0);
      const openingDay = new Date(openingDate).setHours(0, 0, 0, 0);

      if (openingDay <= today) setValue('status', 'open', { shouldValidate: true });
      else setValue('status', 'planned', { shouldValidate: true });
    }
  }, [openingDate, setValue, classData.status]);

  const filteredStatus = useMemo(() => filterStatus(classData), [classData]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      // elemento que disparou o evento
      const target = event.target as HTMLElement;

      // Permite o Enter em TextAreas (caso você adicione alguma)
      // e permite o Enter se o foco estiver explicitamente em um botão de submit
      if (target.tagName !== 'TEXTAREA' && target.getAttribute('type') !== 'submit') {
        // Impede a ação padrão (submissão do formulário)
        event.preventDefault();
        // Opcional: Você pode adicionar lógica aqui, como mover o foco
        // para o próximo campo, se desejar.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className='grid gap-7 py-5'>
      {/* nome da turma */}
      <div className="grid gap-2">
        <Label htmlFor="className">Nome*</Label>
        <Input id="className" placeholder="Nome da turma" {...register("className")} />
        {errors.className && <p className="text-sm text-red-500">{errors.className.message}</p>}
      </div>

      {/* descrição */}
      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" placeholder="Descrição da turma" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      {/* datas de inscrição */}
      <div className='flex justify-between items-start'>
        <Controller
          control={control}
          name='openingDate'
          render={({ field }) => (
            <div className="grid gap-2">
              <Label>Data de abertura*</Label>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder='Selecione a data de abertura'
                disabled={wasOpened}
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
              <Label>Data de fechamento*</Label>
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
      <ClassDaysManager<UpdateClassFormData>
        control={control}
        register={register}
        errors={errors}
        disabled={isPending || wasOpened}
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
          <CurrencyInput disabled={wasOpened} control={control} name="registrationFee" />
          {errors.registrationFee && <p className="text-sm no-wrap text-red-500">{errors.registrationFee.message}</p>}
        </div>

        <Controller
          control={control}
          name='status'
          render={({ field }) => (
            <div className="grid gap-2">
              <Label>Status*</Label>
              <ComboboxPopover
                value={field.value}
                onChange={field.onChange}
                statuses={filteredStatus}
                disabled={classData.status === StatusEnum.CANCELED || classData.status === StatusEnum.FINISHED}
              />
            </div>
          )}
        />
        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
      </div>

      {/* endereço */}
      <div className="grid gap-2">
        <Label htmlFor='address'>Endereço*</Label>
        <Input autoCapitalize='off' disabled={wasOpened} placeholder='Rua das Pérolas, 172' id='address' {...register("address")} />
        {errors.address && <p className="text-sm no-wrap text-red-500">{errors.address.message}</p>}
      </div>

      <DialogFooter>
        <Button
          disabled={isPending || !isDirty}
          className='cursor-pointer'
          type='submit'
        >
          {isPending ? (
            <>
              <Loader2Icon className='animate-spin' />
              Salvando alterações...
            </>
          ) : ('Salvar alterações')}
        </Button>
      </DialogFooter>
    </form>
  );
}