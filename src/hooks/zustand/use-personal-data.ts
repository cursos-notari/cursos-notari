import { create } from "zustand";
import { PersonalDataFormSchema } from "@/validation/zod-schemas/personal-data-form-schema";
import { defaultValuesMock } from "@/mocks/personal-data-mock";

interface PersonalDataStore {
  personalData: PersonalDataFormSchema | null;
  setPersonalData: (data: PersonalDataFormSchema) => void;
}

const usePersonalData = create<PersonalDataStore>((set) => ({
  personalData: defaultValuesMock,
  setPersonalData: (data: PersonalDataFormSchema) => set({ personalData: data }),
}));

export default usePersonalData;