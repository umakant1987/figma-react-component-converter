import { create } from "zustand";
export const useFigmaStore = create((set) => ({
  figmaData: null,
  setFigmaData: (data) => set({ figmaData: data }),
}));