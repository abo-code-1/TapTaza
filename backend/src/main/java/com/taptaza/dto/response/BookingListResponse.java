package com.taptaza.dto.response;

import com.taptaza.model.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class BookingListResponse {

    private UUID id;
    private BookingStatus status;
    private LocalDate date;
    private String time;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private String companyName;
    private String companyLogoUrl;
    private String serviceName;
    private String addressStreet;

    public BookingListResponse() {
    }

    public BookingListResponse(UUID id, BookingStatus status, LocalDate date, String time,
                                BigDecimal totalPrice, LocalDateTime createdAt,
                                String companyName, String companyLogoUrl,
                                String serviceName, String addressStreet) {
        this.id = id;
        this.status = status;
        this.date = date;
        this.time = time;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.companyName = companyName;
        this.companyLogoUrl = companyLogoUrl;
        this.serviceName = serviceName;
        this.addressStreet = addressStreet;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLogoUrl() {
        return companyLogoUrl;
    }

    public void setCompanyLogoUrl(String companyLogoUrl) {
        this.companyLogoUrl = companyLogoUrl;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getAddressStreet() {
        return addressStreet;
    }

    public void setAddressStreet(String addressStreet) {
        this.addressStreet = addressStreet;
    }
}
