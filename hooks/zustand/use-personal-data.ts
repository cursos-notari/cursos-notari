import { create } from "zustand";
import { PersonalDataFormSchema } from "@/validation/zod-schemas/personal-data-form-schema";
import { EMPTY_PERSONAL_DATA_MOCK, PERSONAL_DATA_MOCK } from "@/mocks/personal-data-mock";
import { immer } from 'zustand/middleware/immer';

interface PersonalDataStore {
  personalData: Partial<PersonalDataFormSchema>;
  setPersonalData: (data: Partial<PersonalDataFormSchema>) => void;
  updatePersonalDataField: <K extends keyof PersonalDataFormSchema>(
    field: K,
    value: PersonalDataFormSchema[K]
  ) => void;
  resetPersonalData: () => void;
}

const usePersonalData = create<PersonalDataStore>()(
  immer((set) => ({
    personalData: PERSONAL_DATA_MOCK,

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
        state.personalData = EMPTY_PERSONAL_DATA_MOCK;
      }),
  }))
);

export default usePersonalData;