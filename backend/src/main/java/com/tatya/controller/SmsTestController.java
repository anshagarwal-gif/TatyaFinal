package com.tatya.controller;

import com.tatya.dto.ApiResponse;
import com.tatya.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sms")
@RequiredArgsConstructor
@Slf4j
public class SmsTestController {
    
    private final SmsService smsService;
    
    @Value("${msg91.auth.key:}")
    private String msg91AuthKey;
    
    @Value("${sms.enabled:true}")
    private boolean smsEnabled;
    
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Object>> getSmsStatus() {
        boolean configured = msg91AuthKey != null && !msg91AuthKey.isEmpty();
        String message = "";
        
        if (!smsEnabled) {
            message = "SMS is disabled in configuration";
        } else if (configured) {
            message = "MSG91 is configured and ready! SMS will be sent to your phone.";
        } else {
            message = "MSG91 Auth Key not configured. Get your FREE Auth Key from https://msg91.com/ and add it to application.properties as: msg91.auth.key=your_key_here";
        }
        
        return ResponseEntity.ok(ApiResponse.success(message));
    }
    
    @PostMapping("/test")
    public ResponseEntity<ApiResponse<String>> testSms(@RequestParam String phoneNumber) {
        try {
            String testOtp = "1234";
            boolean sent = smsService.sendOtp(phoneNumber, testOtp);
            
            if (sent) {
                return ResponseEntity.ok(ApiResponse.success(
                    "Test SMS API call successful. Message ID received from MSG91. " +
                    "If SMS not received, check: 1) DLT registration status in MSG91 dashboard, " +
                    "2) Sender ID approval, 3) Message template approval. " +
                    "See MSG91_DLT_SETUP.md for details. OTP: " + testOtp
                ));
            } else {
                return ResponseEntity.status(500).body(ApiResponse.error(
                    "Failed to send test SMS. Check server logs for details. " +
                    "Common issues: DLT registration, sender ID approval, or insufficient credits."
                ));
            }
        } catch (Exception e) {
            log.error("Error in test SMS", e);
            return ResponseEntity.status(500).body(ApiResponse.error(
                "Error: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/check-delivery")
    public ResponseEntity<ApiResponse<String>> checkDeliveryStatus() {
        String message = "To check SMS delivery status:\n" +
            "1. Login to MSG91 Dashboard: https://msg91.com/\n" +
            "2. Go to Reports → SMS Reports\n" +
            "3. Check delivery status of sent messages\n" +
            "4. Verify DLT registration status\n" +
            "5. Check if sender ID 'TATYA' is approved\n\n" +
            "If API returns message ID but SMS not received, DLT registration is likely required.\n" +
            "See MSG91_DLT_SETUP.md for complete DLT registration guide.";
        
        return ResponseEntity.ok(ApiResponse.success(message));
    }
}

