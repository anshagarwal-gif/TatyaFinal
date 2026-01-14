package com.tatya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VendorLoginRequest {
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;
    
    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^[0-9]{4}$", message = "OTP must be 4 digits")
    private String otpCode;
}
