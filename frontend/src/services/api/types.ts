// API Response Types

// Auth
export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  message: string;
  expiresIn: number;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
  newUser: boolean;
}

// User
export interface UserResponse {
  id: string;
  phone: string;
  firstName: string;
  lastName?: string;
  createdAt?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
}

// Address
export interface AddressResponse {
  id: string;
  label: string;
  street: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  city: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  label: string;
  street: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  city: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

// Company
export interface CompanyResponse {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  priceRange?: string;
  verified: boolean;
}

export interface ServiceResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

export interface ReviewResponse {
  id: string;
  rating: number;
  comment?: string;
  userName: string;
  createdAt: string;
}

export interface CompanyDetailResponse extends CompanyResponse {
  services: ServiceResponse[];
  reviews: ReviewResponse[];
  images?: string[];
}

// Booking
export interface CreateBookingRequest {
  companyId: string;
  serviceId: string;
  addressId: string;
  date: string;
  time: string;
  notes?: string;
  roomCount?: number;
  area?: number;
  hasPets?: boolean;
  ecoFriendly?: boolean;
}

export interface BookingResponse {
  id: string;
  status: BookingStatus;
  date: string;
  time: string;
  roomCount?: number;
  hasPets?: boolean;
  ecoFriendly?: boolean;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  company: CompanyResponse;
  service: ServiceResponse;
  address: AddressResponse;
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// Pagination
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Error
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
