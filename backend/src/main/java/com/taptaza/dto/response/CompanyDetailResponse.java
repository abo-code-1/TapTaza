package com.taptaza.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class CompanyDetailResponse extends CompanyResponse {

    private List<ServiceResponse> services;
    private List<ReviewResponse> reviews;

    public CompanyDetailResponse() {
        super();
    }

    public CompanyDetailResponse(UUID id, String name, String description, BigDecimal rating,
                                  Integer reviewCount, String priceRange, Boolean verified,
                                  String logoUrl, List<ServiceResponse> services,
                                  List<ReviewResponse> reviews) {
        super(id, name, description, rating, reviewCount, priceRange, verified, logoUrl);
        this.services = services;
        this.reviews = reviews;
    }

    public List<ServiceResponse> getServices() {
        return services;
    }

    public void setServices(List<ServiceResponse> services) {
        this.services = services;
    }

    public List<ReviewResponse> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewResponse> reviews) {
        this.reviews = reviews;
    }
}
