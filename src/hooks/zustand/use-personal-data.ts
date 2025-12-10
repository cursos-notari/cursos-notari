import { create } from "zustand";
import { PersonalDataFormSchema } from "@/validation/zod-schemas/personal-data-form-schema";

interface PersonalDataStore {
  personalData: PersonalDataFormSchema | null;
  setPersonalData: (data: PersonalDataFormSchema) => void;
}

const usePersonalData = create<PersonalDataStore>((set) => ({
  personalData: null,
  setPersonalData: (data: PersonalDataFormSchema) => set({ personalData: data }),
}));

export default usePersonalData;