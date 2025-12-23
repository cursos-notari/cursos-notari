import { create } from "zustand";
import { PersonalDataFormSchema } from "@/validation/zod-schemas/personal-data-form-schema";
import { defaultValuesMock } from "@/mocks/personal-data-mock";
import { immer } from 'zustand/middleware/immer';

interface PersonalDataStore {
  personalData: PersonalDataFormSchema | null;
  setPersonalData: (data: PersonalDataFormSchema) => void;
  updatePersonalDataField: <K extends keyof PersonalDataFormSchema>(
    field: K,
    value: PersonalDataFormSchema[K]
  ) => void;
  resetPersonalData: () => void;
}

const usePersonalData = create<PersonalDataStore>()(
  immer((set) => ({
    personalData: defaultValuesMock,

    setPersonalData: (data) =>
      set((state) => {
        state.personalData = data;
      }),

    updatePersonalDataField: (field, value) =>
      set((state) => {
        if (state.personalData) {
          state.personalData[field] = value;
        }
      }),

    resetPersonalData: () =>
      set((state) => {
        state.personalData = defaultValuesMock;
      }),
  }))
);

export default usePersonalData;