package com.taptaza.dto.request;

import jakarta.validation.constraints.Size;

/**
 * Request DTO for updating an existing address.
 * All fields are optional - only non-null values will be updated.
 */
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

    public UpdateAddressRequest() {
    }

    public UpdateAddressRequest(String label, String street, String apartment,
                                 String city, Boolean isDefault) {
        this.label = label;
        this.street = street;
        this.apartment = apartment;
        this.city = city;
        this.isDefault = isDefault;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getApartment() {
        return apartment;
    }

    public void setApartment(String apartment) {
        this.apartment = apartment;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
}
