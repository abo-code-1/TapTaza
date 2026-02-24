package com.taptaza.service.impl;

import com.taptaza.dto.response.CompanyDetailResponse;
import com.taptaza.dto.response.CompanyResponse;
import com.taptaza.dto.response.PageResponse;
import com.taptaza.dto.response.ReviewResponse;
import com.taptaza.dto.response.ServiceResponse;
import com.taptaza.exception.ResourceNotFoundException;
import com.taptaza.model.Company;
import com.taptaza.model.Review;
import com.taptaza.model.Service;
import com.taptaza.model.User;
import com.taptaza.repository.CompanyRepository;
import com.taptaza.repository.ReviewRepository;
import com.taptaza.repository.ServiceRepository;
import com.taptaza.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public PageResponse<CompanyResponse> getCompanies(String search, Pageable pageable) {
        Page<Company> companiesPage = companyRepository.searchCompanies(search, pageable);

        List<CompanyResponse> companyResponses = companiesPage.getContent().stream()
                .map(this::mapToCompanyResponse)
                .collect(Collectors.toList());

        return PageResponse.of(
                companyResponses,
                companiesPage.getNumber(),
                companiesPage.getSize(),
                companiesPage.getTotalElements()
        );
    }

    @Override
    public CompanyDetailResponse getCompanyById(UUID id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));

        List<Service> services = serviceRepository.findByCompanyId(id);
        List<ServiceResponse> serviceResponses = services.stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());

        // Include recent reviews (up to 10)
        Page<Review> reviewsPage = reviewRepository.findByCompanyIdOrderByCreatedAtDesc(
                id, PageRequest.of(0, 10));
        List<ReviewResponse> reviewResponses = reviewsPage.getContent().stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());

        return new CompanyDetailResponse(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getRating(),
                company.getReviewCount(),
                company.getPriceRange(),
                company.getVerified(),
                company.getLogoUrl(),
                serviceResponses,
                reviewResponses
        );
    }

    @Override
    public List<ServiceResponse> getCompanyServices(UUID companyId) {
        // Verify company exists
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company", "id", companyId);
        }

        List<Service> services = serviceRepository.findByCompanyId(companyId);

        return services.stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PageResponse<ReviewResponse> getCompanyReviews(UUID companyId, Pageable pageable) {
        // Verify company exists
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company", "id", companyId);
        }

        Page<Review> reviewsPage = reviewRepository.findByCompanyIdOrderByCreatedAtDesc(companyId, pageable);

        List<ReviewResponse> reviewResponses = reviewsPage.getContent().stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());

        return PageResponse.of(
                reviewResponses,
                reviewsPage.getNumber(),
                reviewsPage.getSize(),
                reviewsPage.getTotalElements()
        );
    }

    private CompanyResponse mapToCompanyResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getRating(),
                company.getReviewCount(),
                company.getPriceRange(),
                company.getVerified(),
                company.getLogoUrl()
        );
    }

    private ServiceResponse mapToServiceResponse(Service service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getDurationMinutes()
        );
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        User user = review.getUser();
        String userName = buildUserName(user);

        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                userName,
                review.getCreatedAt()
        );
    }

    private String buildUserName(User user) {
        if (user == null) {
            return "Anonymous";
        }
        String firstName = user.getFirstName() != null ? user.getFirstName() : "";
        String lastName = user.getLastName() != null ? user.getLastName() : "";
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? "Anonymous" : fullName;
    }
}
