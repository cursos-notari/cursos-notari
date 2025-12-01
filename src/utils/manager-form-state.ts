import { StorageState } from "@/types/interfaces/verify-email-interfaces";

export const loadState = (storageKey: string): StorageState | null => {
  try {
    const savedState = localStorage.getItem(storageKey);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Erro ao carregar estado:', error);
    return null;
  }
};

export const saveState = (stateToSave: Partial<StorageState>, storageKey: string) => {
  try {
    const currentState = loadState(storageKey) || {};
    const newState = { ...currentState, ...stateToSave };
    localStorage.setItem(storageKey, JSON.stringify(newState));
  } catch (error) {
    console.error('Erro ao salvar estado:', error);
  }
};

export const clearState = (storageKey: string) => {
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Erro ao limpar estado:', error);
  }
};