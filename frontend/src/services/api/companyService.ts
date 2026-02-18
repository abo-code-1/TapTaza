import apiClient from './client';
import {
  CompanyResponse,
  CompanyDetailResponse,
  PageResponse,
} from './types';

class CompanyService {
  /**
   * Get list of companies with optional filters
   */
  async getCompanies(params?: {
    page?: number;
    size?: number;
    search?: string;
    minRating?: number;
    verified?: boolean;
    sortBy?: 'rating' | 'price' | 'reviews';
  }): Promise<PageResponse<CompanyResponse>> {
    const response = await apiClient.get<PageResponse<CompanyResponse>>('/companies', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        search: params?.search,
        minRating: params?.minRating,
        verified: params?.verified,
        sortBy: params?.sortBy,
      },
    });
    return response.data;
  }

  /**
   * Get company details by ID
   */
  async getCompanyById(id: string): Promise<CompanyDetailResponse> {
    const response = await apiClient.get<CompanyDetailResponse>(`/companies/${id}`);
    return response.data;
  }

  /**
   * Get featured/top companies
   */
  async getFeaturedCompanies(): Promise<CompanyResponse[]> {
    const response = await apiClient.get<CompanyResponse[]>('/companies/featured');
    return response.data;
  }

  /**
   * Search companies by name or service
   */
  async searchCompanies(query: string): Promise<CompanyResponse[]> {
    const response = await apiClient.get<CompanyResponse[]>('/companies/search', {
      params: { q: query },
    });
    return response.data;
  }
}

export const companyService = new CompanyService();
export default companyService;
