package com.taptaza.service;

import com.taptaza.dto.response.AuthResponse;

public interface AuthService {

    void sendOtp(String phone);

    AuthResponse verifyOtp(String phone, String code, String firstName, String lastName);
}
