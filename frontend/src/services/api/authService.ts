import apiClient, { STORAGE_KEYS } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  AuthResponse,
  ApiError,
} from './types';

class AuthService {
  /**
   * Send OTP to phone number via WhatsApp
   */
  async sendOtp(phone: string): Promise<SendOtpResponse> {
    const response = await apiClient.post<SendOtpResponse>('/auth/send-otp', {
      phone,
    } as SendOtpRequest);
    return response.data;
  }

  /**
   * Verify OTP and get JWT token
   * For new users, firstName is required
   */
  async verifyOtp(
    phone: string,
    code: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
      phone,
      code,
      firstName,
      lastName,
    } as VerifyOtpRequest);

    // Store token
    if (response.data.accessToken) {
      await this.setToken(response.data.accessToken);
      await this.setUser(response.data.user);
    }

    return response.data;
  }

  /**
   * Store JWT token
   */
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * Get stored JWT token
   */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Store user data
   */
  async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Get stored user data
   */
  async getUser(): Promise<any | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Clear all auth data (logout)
   */
  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.USER,
    ]);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
export default authService;
