import { create } from 'zustand';

interface Company {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  verified: boolean;
}

interface Address {
  id: string;
  label: string;
  street: string;
  apartment?: string;
}

interface BookingOptions {
  roomCount: number;
  hasPets: boolean;
  ecoFriendly: boolean;
  notes?: string;
}

interface BookingState {
  // Selection
  company: Company | null;
  date: string | null;
  time: string | null;
  address: Address | null;
  options: BookingOptions | null;

  // Actions
  setCompany: (company: Company) => void;
  setDateTime: (date: string, time: string) => void;
  setAddress: (address: Address) => void;
  setOptions: (options: BookingOptions) => void;
  reset: () => void;
}

const initialState = {
  company: null,
  date: null,
  time: null,
  address: null,
  options: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setCompany: (company) => set({ company }),
  setDateTime: (date, time) => set({ date, time }),
  setAddress: (address) => set({ address }),
  setOptions: (options) => set({ options }),
  reset: () => set(initialState),
}));
