package com.taptaza.dto.response;

import com.taptaza.model.Address;

import java.util.UUID;

public class AddressResponse {

    private UUID id;
    private String label;
    private String street;
    private String apartment;
    private String city;
    private Boolean isDefault;

    public AddressResponse() {
    }

    public AddressResponse(UUID id, String label, String street, String apartment,
                           String city, Boolean isDefault) {
        this.id = id;
        this.label = label;
        this.street = street;
        this.apartment = apartment;
        this.city = city;
        this.isDefault = isDefault;
    }

    public static AddressResponse fromAddress(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLabel(),
                address.getStreet(),
                address.getApartment(),
                address.getCity(),
                address.getIsDefault()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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
