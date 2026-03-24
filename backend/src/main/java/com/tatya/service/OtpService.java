package com.tatya.service;

import com.tatya.entity.Otp;
import com.tatya.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {
    
    private final OtpRepository otpRepository;
    private final Msg91SmsService smsService;
    private final Random random = new Random();
    
    @Value("${otp.expiry.minutes:5}")
    private int otpExpiryMinutes;
    
    @Value("${otp.length:4}")
    private int otpLength;
    
    @Transactional
    public String generateOtp(String phoneNumber) {
        // Mark all previous OTPs as used
        otpRepository.markAllAsUsedByPhoneNumber(phoneNumber);
        
        // Generate new OTP
        String otpCode = generateRandomOtp();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(otpExpiryMinutes);
        
        Otp otp = new Otp();
        otp.setPhoneNumber(phoneNumber);
        otp.setOtpCode(otpCode);
        otp.setExpiresAt(expiresAt);
        otp.setIsUsed(false);
        otp.setAttempts(0);
        
        otpRepository.save(otp);
        
        // Send OTP via SMS
        log.info("Attempting to send OTP via SMS to phone number: {}", phoneNumber);
        boolean smsSent = smsService.sendOtp(phoneNumber, otpCode);
        if (smsSent) {
            log.info("✓ OTP SMS sent successfully to {}", phoneNumber);
        } else {
            log.error("✗ Failed to send OTP SMS to {}. OTP code: {}", phoneNumber, otpCode);
            log.error("Please check SMS configuration and server logs for details.");
        }
        
        // Clean up expired OTPs
        cleanupExpiredOtps();
        
        return otpCode;
    }
    
    @Transactional
    public boolean verifyOtp(String phoneNumber, String otpCode) {
        Optional<Otp> otpOptional = otpRepository.findByPhoneNumberAndOtpCodeAndIsUsedFalse(
            phoneNumber, otpCode);
        
        if (otpOptional.isEmpty()) {
            return false;
        }
        
        Otp otp = otpOptional.get();
        
        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(otp.getExpiresAt())) {
            otp.setIsUsed(true);
            otpRepository.save(otp);
            return false;
        }
        
        // Check attempts (max 5 attempts)
        if (otp.getAttempts() >= 5) {
            otp.setIsUsed(true);
            otpRepository.save(otp);
            return false;
        }
        
        // Increment attempts
        otp.setAttempts(otp.getAttempts() + 1);
        
        // Verify OTP
        if (otp.getOtpCode().equals(otpCode)) {
            otp.setIsUsed(true);
            otpRepository.save(otp);
            // Mark all other OTPs for this phone number as used
            otpRepository.markAllAsUsedByPhoneNumber(phoneNumber);
            return true;
        }
        
        otpRepository.save(otp);
        return false;
    }
    
    public boolean canResendOtp(String phoneNumber) {
        Optional<Otp> lastOtp = otpRepository.findTopByPhoneNumberOrderByCreatedAtDesc(phoneNumber);
        
        if (lastOtp.isEmpty()) {
            return true;
        }
        
        Otp otp = lastOtp.get();
        // Allow resend if last OTP was created more than 1 minute ago
        return LocalDateTime.now().isAfter(otp.getCreatedAt().plusMinutes(1));
    }
    
    private String generateRandomOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
    
    private void cleanupExpiredOtps() {
        otpRepository.deleteExpiredOtps(LocalDateTime.now());
    }
}

