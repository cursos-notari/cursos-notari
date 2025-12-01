import { create } from "zustand";
import { PublicClass } from "@/types/database/class";

interface ClassDataState {
  classData: PublicClass | null;
  setClassData: (data: PublicClass) => void;
}

const useClassData = create<ClassDataState>((set) => ({
  classData: null,
  setClassData: (data: PublicClass) => set({ classData: data }),
}));

export default useClassData;