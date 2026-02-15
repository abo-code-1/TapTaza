package com.taptaza.dto.response;

import com.taptaza.model.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class BookingResponse {

    private UUID id;
    private BookingStatus status;
    private LocalDate date;
    private String time;
    private Integer roomCount;
    private Boolean hasPets;
    private Boolean ecoFriendly;
    private String notes;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private CompanyResponse company;
    private ServiceResponse service;
    private AddressResponse address;

    public BookingResponse() {
    }

    public BookingResponse(UUID id, BookingStatus status, LocalDate date, String time,
                           Integer roomCount, Boolean hasPets, Boolean ecoFriendly,
                           String notes, BigDecimal totalPrice, LocalDateTime createdAt,
                           CompanyResponse company, ServiceResponse service, AddressResponse address) {
        this.id = id;
        this.status = status;
        this.date = date;
        this.time = time;
        this.roomCount = roomCount;
        this.hasPets = hasPets;
        this.ecoFriendly = ecoFriendly;
        this.notes = notes;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
        this.company = company;
        this.service = service;
        this.address = address;
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

    public Integer getRoomCount() {
        return roomCount;
    }

    public void setRoomCount(Integer roomCount) {
        this.roomCount = roomCount;
    }

    public Boolean getHasPets() {
        return hasPets;
    }

    public void setHasPets(Boolean hasPets) {
        this.hasPets = hasPets;
    }

    public Boolean getEcoFriendly() {
        return ecoFriendly;
    }

    public void setEcoFriendly(Boolean ecoFriendly) {
        this.ecoFriendly = ecoFriendly;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public CompanyResponse getCompany() {
        return company;
    }

    public void setCompany(CompanyResponse company) {
        this.company = company;
    }

    public ServiceResponse getService() {
        return service;
    }

    public void setService(ServiceResponse service) {
        this.service = service;
    }

    public AddressResponse getAddress() {
        return address;
    }

    public void setAddress(AddressResponse address) {
        this.address = address;
    }
}
