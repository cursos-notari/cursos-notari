import { create } from "zustand";
import { immer } from 'zustand/middleware/immer';
import { PixFormSchema } from "@/validation/zod-schemas/pix-form-validation";

interface PixDataStore {
  pixData: PixFormSchema;
  setPixData: (data: PixFormSchema) => void;
  updatePixDataField: <K extends keyof PixFormSchema>(
    field: K,
    value: PixFormSchema[K]
  ) => void;
  resetPixData: () => void;
}

const INITIAL_PIX_DATA: PixFormSchema = {
  acceptContract: false,
  acceptPolicy: false
};

const usePixData = create<PixDataStore>()(
  immer((set) => ({
    pixData: INITIAL_PIX_DATA,

    setPixData: (data) =>
      set((state) => {
        state.pixData = data;
      }),

    updatePixDataField: (field, value) =>
      set((state) => {
        state.pixData[field] = value;
      }),

    resetPixData: () =>
      set((state) => {
        state.pixData = INITIAL_PIX_DATA;
      }),
  }))
);

export default usePixData;