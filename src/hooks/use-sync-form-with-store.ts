import { useEffect } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { PersonalDataFormSchema } from '@/validation/zod-schemas/personal-data-form-schema';
import usePersonalData from './zustand/use-personal-data';

export function useSyncFormWithStore(watch: UseFormWatch<PersonalDataFormSchema>) {
  const updatePersonalDataField = usePersonalData((state) => state.updatePersonalDataField);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && value[name] !== undefined) {
        updatePersonalDataField(name as keyof PersonalDataFormSchema, value[name]);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, updatePersonalDataField]);
}