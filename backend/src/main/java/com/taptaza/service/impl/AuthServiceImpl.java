package com.taptaza.service.impl;

import com.taptaza.dto.response.AuthResponse;
import com.taptaza.dto.response.UserResponse;
import com.taptaza.entity.OtpCode;
import com.taptaza.entity.User;
import com.taptaza.repository.OtpCodeRepository;
import com.taptaza.repository.UserRepository;
import com.taptaza.security.JwtTokenProvider;
import com.taptaza.service.AuthService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final String TWILIO_WHATSAPP_SANDBOX_NUMBER = "whatsapp:+14155238886";
    private static final int OTP_EXPIRATION_MINUTES = 5;

    private final OtpCodeRepository otpCodeRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final SecureRandom secureRandom;

    public AuthServiceImpl(OtpCodeRepository otpCodeRepository,
                           UserRepository userRepository,
                           JwtTokenProvider jwtTokenProvider) {
        this.otpCodeRepository = otpCodeRepository;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.secureRandom = new SecureRandom();
    }

    @Override
    @Transactional
    public void sendOtp(String phone) {
        // Generate 4-digit OTP code
        String code = generateOtpCode();

        // Calculate expiration time
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);

        // Save OTP to database
        OtpCode otpCode = new OtpCode(phone, code, expiresAt);
        otpCodeRepository.save(otpCode);

        // Send OTP via Twilio WhatsApp Sandbox
        sendWhatsAppMessage(phone, code);

        logger.info("OTP sent successfully to phone: {}", maskPhone(phone));
    }

    @Override
    @Transactional
    public AuthResponse verifyOtp(String phone, String code) {
        // Find the latest unused OTP for this phone
        OtpCode otpCode = otpCodeRepository.findTopByPhoneAndUsedFalseOrderByCreatedAtDesc(phone)
                .orElseThrow(() -> new IllegalArgumentException("No OTP found for this phone number"));

        // Check if OTP is expired
        if (otpCode.isExpired()) {
            throw new IllegalArgumentException("OTP has expired");
        }

        // Verify the code
        if (!otpCode.getCode().equals(code)) {
            throw new IllegalArgumentException("Invalid OTP code");
        }

        // Mark OTP as used
        otpCode.setUsed(true);
        otpCodeRepository.save(otpCode);

        // Find or create user
        User user = userRepository.findByPhone(phone)
                .orElseGet(() -> {
                    User newUser = new User(phone);
                    return userRepository.save(newUser);
                });

        // Generate JWT token
        String accessToken = jwtTokenProvider.generateToken(phone);

        // Build response
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getPhone(),
                user.getFirstName(),
                user.getLastName()
        );

        return new AuthResponse(accessToken, userResponse);
    }

    private String generateOtpCode() {
        int code = 1000 + secureRandom.nextInt(9000);
        return String.valueOf(code);
    }

    private void sendWhatsAppMessage(String toPhone, String code) {
        String messageBody = "Your Tap-Taza code is: " + code;

        Message message = Message.creator(
                new PhoneNumber("whatsapp:" + toPhone),
                new PhoneNumber(TWILIO_WHATSAPP_SANDBOX_NUMBER),
                messageBody
        ).create();

        logger.info("WhatsApp message sent with SID: {}", message.getSid());
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) {
            return "****";
        }
        return phone.substring(0, phone.length() - 4) + "****";
    }
}
