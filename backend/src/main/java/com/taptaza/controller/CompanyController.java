package com.taptaza.controller;

import com.taptaza.dto.response.CompanyDetailResponse;
import com.taptaza.dto.response.CompanyResponse;
import com.taptaza.dto.response.PageResponse;
import com.taptaza.dto.response.ReviewResponse;
import com.taptaza.dto.response.ServiceResponse;
import com.taptaza.service.CompanyService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    /**
     * Get list of companies with optional search and pagination
     */
    @GetMapping
    public ResponseEntity<PageResponse<CompanyResponse>> getCompanies(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, 100));
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<CompanyResponse> response = companyService.getCompanies(search, pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * Get company details by ID including services
     */
    @GetMapping("/{id}")
    public ResponseEntity<CompanyDetailResponse> getCompanyById(@PathVariable UUID id) {
        CompanyDetailResponse response = companyService.getCompanyById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get services for a specific company
     */
    @GetMapping("/{id}/services")
    public ResponseEntity<List<ServiceResponse>> getCompanyServices(@PathVariable UUID id) {
        List<ServiceResponse> response = companyService.getCompanyServices(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get reviews for a specific company with pagination
     */
    @GetMapping("/{id}/reviews")
    public ResponseEntity<PageResponse<ReviewResponse>> getCompanyReviews(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, 100));
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ReviewResponse> response = companyService.getCompanyReviews(id, pageable);

        return ResponseEntity.ok(response);
    }
}
