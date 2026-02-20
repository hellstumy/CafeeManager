import { create } from 'zustand'

export const usePages = create((set) => ({
  selectPage: 'dashboard',
  setSelectPage: (page) => set({ selectPage: page }),
}))
