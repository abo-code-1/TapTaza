package com.taptaza.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+[1-9]\\d{6,14}$", message = "Phone number must be in E.164 format (e.g. +77771234567)")
    private String phone;

    @NotBlank(message = "Verification code is required")
    private String code;
    private String firstName;
    private String lastName;
}
