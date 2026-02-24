package com.taptaza.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing address.
 * All fields are optional - only non-null values will be updated.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAddressRequest {

    @Size(max = 50, message = "Label must not exceed 50 characters")
    private String label;

    @Size(max = 255, message = "Street must not exceed 255 characters")
    private String street;

    @Size(max = 50, message = "Apartment must not exceed 50 characters")
    private String apartment;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    private Boolean isDefault;
}
