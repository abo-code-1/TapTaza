package com.taptaza.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new address.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAddressRequest {

    @NotBlank(message = "Label is required")
    @Size(max = 50, message = "Label must not exceed 50 characters")
    private String label;

    @NotBlank(message = "Street is required")
    @Size(max = 255, message = "Street must not exceed 255 characters")
    private String street;

    @Size(max = 50, message = "Apartment must not exceed 50 characters")
    private String apartment;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    private Boolean isDefault;

}
