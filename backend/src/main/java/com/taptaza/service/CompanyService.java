package com.taptaza.service;

import com.taptaza.dto.response.CompanyDetailResponse;
import com.taptaza.dto.response.CompanyResponse;
import com.taptaza.dto.response.PageResponse;
import com.taptaza.dto.response.ReviewResponse;
import com.taptaza.dto.response.ServiceResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CompanyService {

    /**
     * Search companies with pagination
     *
     * @param search   optional search term to filter companies by name or description
     * @param pageable pagination parameters
     * @return paginated list of companies
     */
    PageResponse<CompanyResponse> getCompanies(String search, Pageable pageable);

    /**
     * Get company details with services
     *
     * @param id company UUID
     * @return company details including services
     */
    CompanyDetailResponse getCompanyById(UUID id);

    /**
     * Get services for a company
     *
     * @param companyId company UUID
     * @return list of services offered by the company
     */
    List<ServiceResponse> getCompanyServices(UUID companyId);

    /**
     * Get reviews for a company with pagination
     *
     * @param companyId company UUID
     * @param pageable  pagination parameters
     * @return paginated list of reviews
     */
    PageResponse<ReviewResponse> getCompanyReviews(UUID companyId, Pageable pageable);
}
