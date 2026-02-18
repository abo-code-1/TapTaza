import apiClient from './client';
import {
  UserResponse,
  UpdateUserRequest,
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from './types';

class UserService {
  /**
   * Get current user's profile
   */
  async getProfile(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/users/me');
    return response.data;
  }

  /**
   * Update current user's profile
   */
  async updateProfile(data: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>('/users/me', data);
    return response.data;
  }

  // ==================== ADDRESSES ====================

  /**
   * Get user's saved addresses
   */
  async getAddresses(): Promise<AddressResponse[]> {
    const response = await apiClient.get<AddressResponse[]>('/users/me/addresses');
    return response.data;
  }

  /**
   * Create a new address
   */
  async createAddress(data: CreateAddressRequest): Promise<AddressResponse> {
    const response = await apiClient.post<AddressResponse>('/users/me/addresses', data);
    return response.data;
  }

  /**
   * Update an address
   */
  async updateAddress(id: string, data: UpdateAddressRequest): Promise<AddressResponse> {
    const response = await apiClient.put<AddressResponse>(`/users/me/addresses/${id}`, data);
    return response.data;
  }

  /**
   * Delete an address
   */
  async deleteAddress(id: string): Promise<void> {
    await apiClient.delete(`/users/me/addresses/${id}`);
  }

  /**
   * Set address as default
   */
  async setDefaultAddress(id: string): Promise<AddressResponse> {
    const response = await apiClient.put<AddressResponse>(`/users/me/addresses/${id}/default`);
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
