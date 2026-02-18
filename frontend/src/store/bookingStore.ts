import { create } from 'zustand';
import { bookingService, CreateBookingRequest, BookingResponse } from '../services/api';

interface Company {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceRange?: string;
  verified: boolean;
}

interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

interface Address {
  id: string;
  label: string;
  street: string;
  apartment?: string;
  city: string;
}

interface BookingOptions {
  roomCount: number;
  area: number;
  hasPets: boolean;
  ecoFriendly: boolean;
  notes: string;
}

interface BookingState {
  // Selection
  company: Company | null;
  service: Service | null;
  date: string | null;
  time: string | null;
  address: Address | null;
  options: BookingOptions;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Computed
  totalPrice: number;

  // Actions
  setCompany: (company: Company) => void;
  setService: (service: Service) => void;
  setDateTime: (date: string, time: string) => void;
  setAddress: (address: Address) => void;
  setOptions: (options: Partial<BookingOptions>) => void;
  calculatePrice: () => number;
  reset: () => void;

  // API Actions
  createBooking: () => Promise<BookingResponse>;
}

const defaultOptions: BookingOptions = {
  roomCount: 2,
  area: 50,
  hasPets: false,
  ecoFriendly: false,
  notes: '',
};

const initialState = {
  company: null,
  service: null,
  date: null,
  time: null,
  address: null,
  options: defaultOptions,
  isLoading: false,
  error: null,
  totalPrice: 0,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setCompany: (company) => set({ company, error: null }),

  setService: (service) => {
    set({ service, error: null });
    // Recalculate price
    const price = get().calculatePrice();
    set({ totalPrice: price });
  },

  setDateTime: (date, time) => set({ date, time, error: null }),

  setAddress: (address) => set({ address, error: null }),

  setOptions: (options) => {
    set((state) => ({
      options: { ...state.options, ...options },
      error: null,
    }));
    // Recalculate price
    const price = get().calculatePrice();
    set({ totalPrice: price });
  },

  calculatePrice: () => {
    const { service, options } = get();
    if (!service) return 0;

    let price = service.price;

    // Room count multiplier
    if (options.roomCount > 2) {
      price += (options.roomCount - 2) * 2000;
    }

    // Area multiplier
    if (options.area > 50) {
      price += Math.floor((options.area - 50) / 10) * 1000;
    }

    // Pet surcharge
    if (options.hasPets) {
      price += 2000;
    }

    // Eco-friendly surcharge
    if (options.ecoFriendly) {
      price += 3000;
    }

    return price;
  },

  reset: () => set(initialState),

  // Create booking via API
  createBooking: async () => {
    const { company, service, date, time, address, options } = get();

    if (!company || !service || !date || !time || !address) {
      throw new Error('Заполните все поля');
    }

    set({ isLoading: true, error: null });

    try {
      const request: CreateBookingRequest = {
        companyId: company.id,
        serviceId: service.id,
        addressId: address.id,
        date: date,
        time: time,
        notes: options.notes,
        roomCount: options.roomCount,
        area: options.area,
        hasPets: options.hasPets,
        ecoFriendly: options.ecoFriendly,
      };

      const booking = await bookingService.createBooking(request);

      set({ isLoading: false });

      return booking;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Не удалось создать заказ',
      });
      throw error;
    }
  },
}));

// Selector hooks
export const useBookingLoading = () => useBookingStore((state) => state.isLoading);
export const useBookingError = () => useBookingStore((state) => state.error);
export const useTotalPrice = () => useBookingStore((state) => state.totalPrice);
