import { create } from 'zustand'

export const usePages = create((set) => ({
  selectPage: 'dashboard',
  setSelectPage: (page) => set({ selectPage: page }),
}))
export const useSelectedRest = create((set) => ({
  selectedRest: null,
  setSelectedRest: (rest) => set({ selectedRest: rest }),
}))

export const useCurrentUser = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null }),
  nullCurentuser: () => set({ currentUser: null }),
}))
