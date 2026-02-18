import apiClient from './client';
import {
  CreateBookingRequest,
  BookingResponse,
  PageResponse,
  BookingStatus,
} from './types';

class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingRequest): Promise<BookingResponse> {
    const response = await apiClient.post<BookingResponse>('/bookings', data);
    return response.data;
  }

  /**
   * Get user's bookings with optional status filter
   */
  async getMyBookings(params?: {
    page?: number;
    size?: number;
    status?: BookingStatus;
  }): Promise<PageResponse<BookingResponse>> {
    const response = await apiClient.get<PageResponse<BookingResponse>>('/bookings', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        status: params?.status,
      },
    });
    return response.data;
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<BookingResponse> {
    const response = await apiClient.get<BookingResponse>(`/bookings/${id}`);
    return response.data;
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: string): Promise<BookingResponse> {
    const response = await apiClient.put<BookingResponse>(`/bookings/${id}/cancel`);
    return response.data;
  }

  /**
   * Get upcoming bookings
   */
  async getUpcomingBookings(): Promise<BookingResponse[]> {
    const response = await apiClient.get<BookingResponse[]>('/bookings/upcoming');
    return response.data;
  }

  /**
   * Get past bookings
   */
  async getPastBookings(): Promise<BookingResponse[]> {
    const response = await apiClient.get<BookingResponse[]>('/bookings/history');
    return response.data;
  }
}

export const bookingService = new BookingService();
export default bookingService;
