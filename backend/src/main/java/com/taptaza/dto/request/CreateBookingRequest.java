package com.taptaza.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.util.UUID;

public class CreateBookingRequest {

    @NotNull(message = "Company ID is required")
    private UUID companyId;

    @NotNull(message = "Service ID is required")
    private UUID serviceId;

    @NotNull(message = "Address ID is required")
    private UUID addressId;

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Booking date must be today or in the future")
    private LocalDate date;

    @NotBlank(message = "Time is required")
    @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$", message = "Time must be in HH:mm format")
    private String time;

    private Integer roomCount;

    private Boolean hasPets;

    private Boolean ecoFriendly;

    private String notes;

    public CreateBookingRequest() {
    }

    public CreateBookingRequest(UUID companyId, UUID serviceId, UUID addressId, LocalDate date,
                                 String time, Integer roomCount, Boolean hasPets,
                                 Boolean ecoFriendly, String notes) {
        this.companyId = companyId;
        this.serviceId = serviceId;
        this.addressId = addressId;
        this.date = date;
        this.time = time;
        this.roomCount = roomCount;
        this.hasPets = hasPets;
        this.ecoFriendly = ecoFriendly;
        this.notes = notes;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public void setCompanyId(UUID companyId) {
        this.companyId = companyId;
    }

    public UUID getServiceId() {
        return serviceId;
    }

    public void setServiceId(UUID serviceId) {
        this.serviceId = serviceId;
    }

    public UUID getAddressId() {
        return addressId;
    }

    public void setAddressId(UUID addressId) {
        this.addressId = addressId;
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
}
