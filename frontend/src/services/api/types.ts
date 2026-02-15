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
  id: number;
  phone: string;
  firstName: string;
  lastName?: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
}

// Address
export interface AddressResponse {
  id: number;
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
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  rating: number;
  reviewsCount: number;
  minPrice: number;
  verified: boolean;
  responseTime: string;
}

export interface ServiceResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment?: string;
  userName: string;
  createdAt: string;
}

export interface CompanyDetailResponse extends CompanyResponse {
  services: ServiceResponse[];
  reviews: ReviewResponse[];
  images: string[];
}

// Booking
export interface CreateBookingRequest {
  companyId: number;
  serviceId: number;
  addressId: number;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  roomCount?: number;
  area?: number;
  hasPets?: boolean;
  ecoFriendly?: boolean;
}

export interface BookingResponse {
  id: number;
  companyName: string;
  serviceName: string;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: AddressResponse;
  totalPrice: number;
  notes?: string;
  createdAt: string;
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
