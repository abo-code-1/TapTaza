package com.taptaza.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
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

}
