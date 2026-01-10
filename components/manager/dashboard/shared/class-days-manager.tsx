import { Control, FieldErrors, useFieldArray, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';
import { IconTrash } from '@tabler/icons-react';
import { Label } from '@/components/ui/label';
import { ClassFormWithDays } from '@/types/interfaces/database/class';

interface ClassDaysManagerProps<T extends ClassFormWithDays> {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
}

export function ClassDaysManager<T extends ClassFormWithDays>({
  control,
  register,
  errors,
  disabled = false
}: ClassDaysManagerProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "classDays" as any
  });

  const classDaysErrors = errors.classDays as FieldErrors<T['classDays']> | undefined;

  return (
    <div className="grid gap-4">
      <Label>Dias de aula*</Label>

      {fields.map((field, index) => {
        const dayErrors = classDaysErrors?.[index] as {
          date?: { message?: string };
          time?: { message?: string };
        } | undefined;

        return (
          <div key={field.id} className="flex gap-5 items-start">
            <span className={
              dayErrors?.date || dayErrors?.time
                ? 'self-start pt-2'
                : 'self-center'
            }>
              {index + 1}º dia:
            </span>

            {/* date picker */}
            <div className='flex flex-col gap-2'>
              <Controller
                control={control}
                name={`classDays.${index}.date` as any}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
              {dayErrors?.date && (
                <p className="text-sm text-red-500">
                  {dayErrors.date.message}
                </p>
              )}
            </div>

            {/* class time input */}
            <div className='flex flex-col gap-2'>
              <Input
                type="time"
                disabled={disabled}
                {...register(`classDays.${index}.time` as any)}
                className="hover:cursor-text min-w-40 self-end bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              {dayErrors?.time && (
                <p className="text-sm text-red-500">
                  {dayErrors.time.message}
                </p>
              )}
            </div>

            {/* remove classday button */}
            {index > 0 && (
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className='hover:cursor-pointer hover:bg-transparent self-start disabled:cursor-not-allowed'
                onClick={() => remove(index)}
              >
                <IconTrash
                  color={disabled ? '#ccc' : 'red'}
                  size={25}
                />
              </Button>
            )}
          </div>
        );
      })}

      {/* root error */}
      {classDaysErrors && 'root' in classDaysErrors && (
        <p className="text-sm text-red-500">
          {(classDaysErrors as any).root?.message}
        </p>
      )}

      {/* add classday button */}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        className='mt-2 disabled:cursor-not-allowed hover:cursor-pointer'
        onClick={() => append({ date: undefined, time: "" } as any)}
      >
        Adicionar dia de aula
      </Button>
    </div>
  );
}