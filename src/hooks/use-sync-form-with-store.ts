import { useEffect } from 'react';
import { UseFormWatch, FieldValues, Path } from 'react-hook-form';

type UpdateFieldFunction<T extends FieldValues> = (
  field: Path<T>,
  value: any
) => void;

export function useSyncFormWithStore<T extends FieldValues>(
  watch: UseFormWatch<T>,
  updateField: UpdateFieldFunction<T>
) {
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && value[name as Path<T>] !== undefined) {
        updateField(name as Path<T>, value[name as Path<T>]);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, updateField]);
}