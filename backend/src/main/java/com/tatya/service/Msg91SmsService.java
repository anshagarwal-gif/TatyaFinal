package com.tatya.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * MSG91 SMS Service - Perfect for India!
 * Popular SMS provider in India with excellent delivery rates
 * 
 * Get your API key from: https://msg91.com/
 * Free credits available for new accounts!
 */
@Service
@Slf4j
public class Msg91SmsService implements SmsService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${msg91.auth.key:}")
    private String authKey;
    
    @Value("${msg91.sender.id:TATYA}")
    private String senderId;
    
    @Value("${msg91.route:4}")
    private String route; // 4 for transactional SMS
    
    @Value("${msg91.country.code:91}")
    private String countryCode;
    
    @Value("${sms.enabled:true}")
    private boolean smsEnabled;
    
    @Override
    public boolean sendOtp(String phoneNumber, String otpCode) {
        try {
            // Format phone number (10 digits for India)
            String formattedNumber = formatPhoneNumber(phoneNumber);
            String message = String.format("Your Tatya OTP is %s. Valid for 5 minutes. Do not share this code.", otpCode);
            
            log.info("Attempting to send SMS via MSG91 to: {}", formattedNumber);
            
            // Check if API key is configured
            if (authKey == null || authKey.isEmpty()) {
                log.error("========================================");
                log.error("MSG91 API KEY NOT CONFIGURED!");
                log.error("Get your free API key from: https://msg91.com/");
                log.error("Then add to application.properties:");
                log.error("  msg91.auth.key=your_api_key_here");
                log.error("========================================");
                log.error("OTP for {}: {}", formattedNumber, otpCode);
                return false;
            }
            
            if (!smsEnabled) {
                log.warn("SMS is disabled. OTP for {}: {}", formattedNumber, otpCode);
                return false;
            }
            
            // Try Method 1: Simple HTTP API (works if DLT is configured)
            String url = "https://control.msg91.com/api/sendhttp.php";
            
            // Build query parameters
            StringBuilder urlBuilder = new StringBuilder(url);
            urlBuilder.append("?authkey=").append(authKey);
            urlBuilder.append("&mobiles=").append(formattedNumber);
            urlBuilder.append("&message=").append(encodeMessage(message));
            urlBuilder.append("&sender=").append(senderId);
            urlBuilder.append("&route=").append(route);
            urlBuilder.append("&country=").append(countryCode);
            
            String fullUrl = urlBuilder.toString();
            
            log.info("MSG91 API URL: {}", fullUrl.replace(authKey, "***"));
            
            // Send SMS via GET request
            ResponseEntity<String> response = restTemplate.getForEntity(fullUrl, String.class);
            
            String responseBody = response.getBody();
            log.info("MSG91 API Response: {}", responseBody);
            
            // MSG91 returns:
            // - Hexadecimal message ID (e.g., "356c6b6c586f43576633654d") when successful
            // - Error message string when failed
            if (responseBody != null) {
                // Check if response is a hexadecimal message ID (success)
                // MSG91 message IDs are typically 24-character hex strings
                if (responseBody.matches("[0-9a-fA-F]{20,}")) {
                    // Response is a hexadecimal message ID - success!
                    log.info("✓ SMS sent successfully to {} via MSG91. Message ID: {}", formattedNumber, responseBody);
                    log.info("NOTE: If SMS not received, check MSG91 dashboard for DLT registration status");
                    return true;
                } else if (responseBody.matches("\\d+")) {
                    // Response is a numeric message ID - also success!
                    log.info("✓ SMS sent successfully to {} via MSG91. Message ID: {}", formattedNumber, responseBody);
                    log.info("NOTE: If SMS not received, check MSG91 dashboard for DLT registration status");
                    return true;
                } else {
                    // Response contains error message - log it clearly
                    log.error("========================================");
                    log.error("MSG91 API ERROR:");
                    log.error("Response: {}", responseBody);
                    log.error("========================================");
                    log.error("Common issues:");
                    log.error("1. DLT registration required in India");
                    log.error("2. Sender ID not approved");
                    log.error("3. Insufficient credits");
                    log.error("4. Check MSG91 dashboard for details");
                    log.error("========================================");
                    log.error("OTP for {}: {}", formattedNumber, otpCode);
                    return false;
                }
            }
            
            log.error("MSG91 API returned null response");
            log.error("OTP for {}: {}", formattedNumber, otpCode);
            return false;
            
        } catch (Exception e) {
            log.error("Error sending SMS via MSG91: {}", e.getMessage(), e);
            log.error("OTP for {}: {}", formatPhoneNumber(phoneNumber), otpCode);
            return false;
        }
    }
    
    private String formatPhoneNumber(String phoneNumber) {
        // Remove all non-digit characters
        String cleaned = phoneNumber.replaceAll("[^0-9]", "");
        
        // If it's 12 digits starting with 91, remove 91
        if (cleaned.length() == 12 && cleaned.startsWith("91")) {
            return cleaned.substring(2);
        }
        
        // If it's 10 digits, return as is
        if (cleaned.length() == 10) {
            return cleaned;
        }
        
        // Return last 10 digits if longer
        if (cleaned.length() > 10) {
            return cleaned.substring(cleaned.length() - 10);
        }
        
        return cleaned;
    }
    
    private String encodeMessage(String message) {
        try {
            return java.net.URLEncoder.encode(message, "UTF-8");
        } catch (Exception e) {
            log.warn("Error encoding message: {}", e.getMessage());
            return message;
        }
    }
}

