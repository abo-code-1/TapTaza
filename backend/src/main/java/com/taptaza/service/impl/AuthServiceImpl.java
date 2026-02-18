package com.taptaza.service.impl;

import com.taptaza.dto.response.AuthResponse;
import com.taptaza.dto.response.UserResponse;
import com.taptaza.exception.BadRequestException;
import com.taptaza.model.OtpCode;
import com.taptaza.model.User;
import com.taptaza.repository.OtpCodeRepository;
import com.taptaza.repository.UserRepository;
import com.taptaza.security.JwtTokenProvider;
import com.taptaza.service.AuthService;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final int OTP_EXPIRATION_MINUTES = 5;
    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final int MAX_SEND_PER_HOUR = 5;

    private final OtpCodeRepository otpCodeRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final SecureRandom secureRandom;

    @Value("${twilio.whatsapp-from}")
    private String twilioWhatsappFrom;

    private final ConcurrentHashMap<String, AtomicInteger> verifyAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> sendCooldowns = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicInteger> sendCounts = new ConcurrentHashMap<>();

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
        // Rate limit: max 5 OTPs per phone per hour
        AtomicInteger count = sendCounts.computeIfAbsent(phone, k -> new AtomicInteger(0));
        if (count.get() >= MAX_SEND_PER_HOUR) {
            throw new BadRequestException("Too many OTP requests. Please try again later.", "RATE_LIMITED");
        }

        // Cooldown: 60 seconds between sends
        LocalDateTime lastSent = sendCooldowns.get(phone);
        if (lastSent != null && LocalDateTime.now().isBefore(lastSent.plusSeconds(60))) {
            throw new BadRequestException("Please wait before requesting another code.", "COOLDOWN");
        }

        // Invalidate previous unverified OTPs for this phone
        otpCodeRepository.deleteByPhoneAndVerifiedFalse(phone);

        String code = generateOtpCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);

        OtpCode otpCode = OtpCode.builder()
                .phone(phone)
                .code(code)
                .expiresAt(expiresAt)
                .verified(false)
                .build();
        otpCodeRepository.save(otpCode);

        // Send OTP via Twilio WhatsApp
        try {
            sendWhatsAppMessage(phone, code);
        } catch (ApiException e) {
            logger.error("Failed to send WhatsApp OTP to {}: {}", maskPhone(phone), e.getMessage());
            throw new BadRequestException("Failed to send verification code. Please check your phone number.", "SMS_FAILED");
        }

        count.incrementAndGet();
        sendCooldowns.put(phone, LocalDateTime.now());
        // Reset verify attempts on new OTP
        verifyAttempts.remove(phone);

        logger.info("OTP sent successfully to phone: {}", maskPhone(phone));
    }

    @Override
    @Transactional
    public AuthResponse verifyOtp(String phone, String code, String firstName, String lastName) {
        // Brute-force protection: max 5 attempts per phone
        AtomicInteger attempts = verifyAttempts.computeIfAbsent(phone, k -> new AtomicInteger(0));
        if (attempts.get() >= MAX_OTP_ATTEMPTS) {
            // Invalidate the OTP after too many attempts
            otpCodeRepository.deleteByPhoneAndVerifiedFalse(phone);
            verifyAttempts.remove(phone);
            throw new BadRequestException("Too many failed attempts. Please request a new code.", "MAX_ATTEMPTS");
        }

        OtpCode otpCode = otpCodeRepository.findTopByPhoneAndVerifiedFalseOrderByCreatedAtDesc(phone)
                .orElseThrow(() -> new BadRequestException("No verification code found for this phone number.", "OTP_NOT_FOUND"));

        if (LocalDateTime.now().isAfter(otpCode.getExpiresAt())) {
            throw new BadRequestException("Verification code has expired. Please request a new one.", "OTP_EXPIRED");
        }

        if (!otpCode.getCode().equals(code)) {
            attempts.incrementAndGet();
            throw new BadRequestException("Invalid verification code.", "OTP_INVALID");
        }

        // Mark OTP as verified
        otpCode.setVerified(true);
        otpCodeRepository.save(otpCode);

        // Reset attempts on success
        verifyAttempts.remove(phone);
        sendCounts.remove(phone);

        // Find or create user
        boolean isNewUser = !userRepository.findByPhone(phone).isPresent();
        User user = userRepository.findByPhone(phone)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .phone(phone)
                            .firstName(firstName)
                            .lastName(lastName)
                            .build();
                    return userRepository.save(newUser);
                });

        // Update name if provided and user already exists
        if (!isNewUser && (firstName != null || lastName != null)) {
            if (firstName != null) user.setFirstName(firstName);
            if (lastName != null) user.setLastName(lastName);
            user = userRepository.save(user);
        }

        // Generate JWT token
        String accessToken = jwtTokenProvider.generateToken(phone);

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getPhone(),
                user.getFirstName(),
                user.getLastName()
        );

        return new AuthResponse(accessToken, "Bearer", jwtTokenProvider.getExpirationMs() / 1000, isNewUser, userResponse);
    }

    private String generateOtpCode() {
        int code = 1000 + secureRandom.nextInt(9000);
        return String.valueOf(code);
    }

    private void sendWhatsAppMessage(String toPhone, String code) {
        String messageBody = "Your Tap-Taza code is: " + code;

        Message message = Message.creator(
                new PhoneNumber("whatsapp:" + toPhone),
                new PhoneNumber(twilioWhatsappFrom),
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
