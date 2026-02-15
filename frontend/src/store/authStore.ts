import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, AuthResponse, UserResponse } from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  avatar?: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  phone: string;
  error: string | null;

  // Actions
  setPhone: (phone: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (code: string, firstName?: string, lastName?: string) => Promise<AuthResponse>;
  loginWithResponse: (response: AuthResponse) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;

  // Hydration
  setHydrated: (state: boolean) => void;
}

// Transform API user to store user
const transformUser = (apiUser: UserResponse): User => ({
  id: String(apiUser.id),
  firstName: apiUser.firstName,
  lastName: apiUser.lastName,
  phone: apiUser.phone,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      phone: '',
      error: null,

      // Simple setters
      setPhone: (phone) => set({ phone, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setHydrated: (isHydrated) => set({ isHydrated }),

      // Send OTP to phone
      sendOtp: async (phone: string) => {
        set({ isLoading: true, error: null, phone });
        try {
          await authService.sendOtp(phone);
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Не удалось отправить код'
          });
          return false;
        }
      },

      // Verify OTP and login
      verifyOtp: async (code: string, firstName?: string, lastName?: string) => {
        const { phone } = get();
        set({ isLoading: true, error: null });

        try {
          const response = await authService.verifyOtp(phone, code, firstName, lastName);

          // If new user, don't login yet - need name first
          if (response.newUser && !firstName) {
            set({ isLoading: false });
            return response;
          }

          // Login with response
          set({
            user: transformUser(response.user),
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Неверный код'
          });
          throw error;
        }
      },

      // Login with auth response (after name entry)
      loginWithResponse: (response: AuthResponse) => {
        set({
          user: transformUser(response.user),
          token: response.accessToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      // Logout
      logout: async () => {
        await authService.clearAuth();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          phone: '',
          error: null,
        });
      },

      // Update profile
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selector hooks for better performance
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
