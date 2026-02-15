package com.taptaza.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public class CompanyResponse {

    private UUID id;
    private String name;
    private String description;
    private BigDecimal rating;
    private Integer reviewCount;
    private String priceRange;
    private Boolean verified;
    private String logoUrl;

    public CompanyResponse() {
    }

    public CompanyResponse(UUID id, String name, String description, BigDecimal rating,
                           Integer reviewCount, String priceRange, Boolean verified, String logoUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.priceRange = priceRange;
        this.verified = verified;
        this.logoUrl = logoUrl;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public String getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(String priceRange) {
        this.priceRange = priceRange;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
}
