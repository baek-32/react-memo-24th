import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  email: string | null;
  setAuth: (accessToken: string, email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      email: null,

      setAuth: (accessToken, email) => {
        set({ accessToken, email });
      },

      clearAuth: () => {
        set({ accessToken: null, email: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        email: state.email,
      }),
    },
  ),
);
