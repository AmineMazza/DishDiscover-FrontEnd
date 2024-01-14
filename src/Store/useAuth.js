import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuth = create(
  persist(
    (set, get) => ({
      auth: {
        token: null,
        user: null,
        isAuth: false
      },
      signIn: (token, user) => set({ auth: {token, user, isAuth: true} }),
      signOut: () => set({auth: {token: null, user: null, isAuth: false}})
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)