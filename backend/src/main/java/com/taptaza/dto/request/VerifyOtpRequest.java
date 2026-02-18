package com.taptaza.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class VerifyOtpRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+[1-9]\\d{6,14}$", message = "Phone number must be in E.164 format (e.g. +77771234567)")
    private String phone;

    @NotBlank(message = "Verification code is required")
    private String code;

    private String firstName;

    private String lastName;

    public VerifyOtpRequest() {
    }

    public VerifyOtpRequest(String phone, String code, String firstName, String lastName) {
        this.phone = phone;
        this.code = code;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
