import { create } from 'zustand';

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  phone: string;

  // Actions
  setPhone: (phone: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  phone: '',

  setPhone: (phone) => set({ phone }),

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  login: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      phone: '',
    }),

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
