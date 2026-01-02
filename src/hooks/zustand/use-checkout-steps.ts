import { PersonalDataFormSchema } from "@/validation/zod-schemas/personal-data-form-schema";
import { UseFormReturn } from "react-hook-form";
import { create } from "zustand";

interface FormError {
  field: keyof PersonalDataFormSchema;
  message: string;
}

interface CheckoutStepsStore {
  currentStep: number;
  maxStepReached: number;
  pendingErrors: FormError[] | null;
  nextStep: () => void;
  goToStep: (stepId: number) => void;
  resetSteps: () => void;
  setPendingErrors: (errors: FormError[] | null) => void;
}

export const useCheckoutSteps = create<CheckoutStepsStore>((set, get) => ({
  currentStep: 0,
  maxStepReached: 0,
  pendingErrors: null,

  nextStep: () => {
    const { currentStep, maxStepReached } = get();
    if (currentStep < 2) {
      const newStep = currentStep + 1;
      set({
        currentStep: newStep,
        maxStepReached: Math.max(maxStepReached, newStep)
      });
    }
  },

  goToStep: (stepId: number) => {
    const { currentStep, maxStepReached } = get();
    if (stepId < currentStep && stepId <= maxStepReached) {
      set({ currentStep: stepId });
    }
  },

  resetSteps: () => {
    set({ currentStep: 0, maxStepReached: 0, pendingErrors: null });
  },

  setPendingErrors: (errors) => {
    set({ pendingErrors: errors });
  }
}))