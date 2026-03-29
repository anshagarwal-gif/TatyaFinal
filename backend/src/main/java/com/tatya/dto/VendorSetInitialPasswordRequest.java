package com.tatya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VendorSetInitialPasswordRequest {

    @NotBlank(message = "Link token is required")
    private String token;

    @NotBlank(message = "Temporary password is required")
    private String temporaryPassword;

    @NotBlank(message = "New password is required")
    @Pattern(regexp = "^\\d{6}$", message = "New password must be exactly 6 digits")
    private String newPassword;
}
