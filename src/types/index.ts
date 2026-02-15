// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  verified: boolean;
  responseTime: string;
  description?: string;
  services: string[];
  images?: string[];
}

// Service types
export interface Service {
  id: string;
  title: string;
  price: string;
  info: string;
  offers: string;
  tag?: string;
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  companyId: string;
  serviceId: string;
  status: BookingStatus;
  date: string;
  time: string;
  address: Address;
  totalPrice: number;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// Address types
export interface Address {
  id: string;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  isDefault: boolean;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
