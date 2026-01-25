package com.tatya.controller;

import com.tatya.dto.ApiResponse;
import com.tatya.dto.OtpRequest;
import com.tatya.dto.OtpVerifyRequest;
import com.tatya.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
@Slf4j
public class OtpController {
    
    private final OtpService otpService;
    
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<String>> generateOtp(@Valid @RequestBody OtpRequest request) {
        try {
            log.info("Generating OTP for phone number: {}", request.getPhoneNumber());
            
            // Check if resend is allowed
            if (!otpService.canResendOtp(request.getPhoneNumber())) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(ApiResponse.error("Please wait before requesting a new OTP"));
            }
            
            String otpCode = otpService.generateOtp(request.getPhoneNumber());
            
            // OTP has been sent via SMS service
            log.info("OTP generated and sent via SMS for phone number: {}", request.getPhoneNumber());
            
            // Return OTP code in response for frontend snackbar display (development/testing)
            return ResponseEntity.ok(ApiResponse.success(
                "OTP has been sent to your mobile number. Please check your SMS.",
                otpCode
            ));
        } catch (Exception e) {
            log.error("Error generating OTP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to generate OTP. Please try again."));
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        try {
            log.info("Verifying OTP for phone number: {}", request.getPhoneNumber());
            
            boolean isValid = otpService.verifyOtp(request.getPhoneNumber(), request.getOtpCode());
            
            if (isValid) {
                return ResponseEntity.ok(ApiResponse.success("OTP verified successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid or expired OTP"));
            }
        } catch (Exception e) {
            log.error("Error verifying OTP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to verify OTP. Please try again."));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("OTP Service is running"));
    }
}

