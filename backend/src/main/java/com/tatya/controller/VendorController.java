package com.tatya.controller;

import com.tatya.dto.ApiResponse;
import com.tatya.dto.UpdateVendorProfileRequest;
import com.tatya.dto.VendorLoginRequest;
import com.tatya.dto.VendorPasswordLoginRequest;
import com.tatya.dto.VendorProfileResponse;
import com.tatya.dto.VendorRegistrationRequest;
import com.tatya.dto.VendorResponse;
import com.tatya.exception.VendorKycPendingException;
import com.tatya.exception.VendorRejectedException;
import com.tatya.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@Slf4j
public class VendorController {

    private final VendorService vendorService;

    /**
     * Register a new vendor - saves vendor data and sends OTP
     * POST /api/vendors/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<VendorResponse>> registerVendor(
            @Valid @RequestBody VendorRegistrationRequest request) {
        try {
            log.info("Vendor registration request received for phone: {}", request.getPhoneNumber());

            VendorResponse vendor = vendorService.registerVendor(request);

            return ResponseEntity.ok(ApiResponse.success(
                    "Vendor registered successfully. OTP has been sent to your phone number.",
                    vendor));
        } catch (RuntimeException e) {
            log.error("Error registering vendor", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error registering vendor", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to register vendor. Please try again."));
        }
    }

    /**
     * Verify OTP and login vendor
     * POST /api/vendors/verify-and-login
     */
    @PostMapping("/verify-and-login")
    public ResponseEntity<ApiResponse<VendorResponse>> verifyAndLogin(
            @Valid @RequestBody VendorLoginRequest request) {
        try {
            log.info("Vendor login request received for phone: {}", request.getPhoneNumber());

            VendorResponse vendor = vendorService.verifyAndLogin(
                    request.getPhoneNumber(),
                    request.getOtpCode());

            return ResponseEntity.ok(ApiResponse.success(
                    "OTP verified successfully. Login successful.",
                    vendor));
        } catch (RuntimeException e) {
            log.error("Error verifying OTP for vendor login", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during vendor login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to verify OTP. Please try again."));
        }
    }

    /**
     * Vendor login using email + password (allowed only after admin approval)
     * POST /api/vendors/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<VendorResponse>> loginWithPassword(
            @Valid @RequestBody VendorPasswordLoginRequest request) {
        try {
            log.info("Vendor password login request received for email: {}", request.getEmail());

            VendorResponse vendor = vendorService.loginWithPassword(request.getEmail(), request.getPassword());

            return ResponseEntity.ok(ApiResponse.success("Login successful", vendor));
        } catch (VendorKycPendingException | VendorRejectedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            log.error("Error during vendor password login", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during vendor password login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Login failed. Please try again."));
        }
    }

    /**
     * Get vendor by phone number
     * GET /api/vendors/phone/{phoneNumber}
     */
    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorByPhone(
            @PathVariable String phoneNumber) {
        try {
            VendorResponse vendor = vendorService.getVendorByPhone(phoneNumber);
            return ResponseEntity.ok(ApiResponse.success("Vendor found", vendor));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get vendor by ID
     * GET /api/vendors/{vendorId}
     */
    @GetMapping("/{vendorId}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorById(
            @PathVariable Long vendorId) {
        try {
            VendorResponse vendor = vendorService.getVendorById(vendorId);
            return ResponseEntity.ok(ApiResponse.success("Vendor found", vendor));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get complete vendor profile with drone and bank account
     * GET /api/vendors/{vendorId}/profile
     */
    @GetMapping("/{vendorId}/profile")
    public ResponseEntity<ApiResponse<VendorProfileResponse>> getVendorProfile(
            @PathVariable Long vendorId) {
        try {
            VendorProfileResponse profile = vendorService.getVendorProfile(vendorId);
            return ResponseEntity.ok(ApiResponse.success("Vendor profile retrieved successfully", profile));
        } catch (VendorKycPendingException | VendorRejectedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching vendor profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch vendor profile"));
        }
    }

    /**
     * Update vendor profile
     * PUT /api/vendors/{vendorId}/profile
     */
    @PutMapping("/{vendorId}/profile")
    public ResponseEntity<ApiResponse<VendorProfileResponse>> updateVendorProfile(
            @PathVariable Long vendorId,
            @Valid @RequestBody UpdateVendorProfileRequest request) {
        try {
            VendorProfileResponse profile = vendorService.updateVendorProfile(vendorId, request);
            return ResponseEntity.ok(ApiResponse.success("Vendor profile updated successfully", profile));
        } catch (VendorKycPendingException | VendorRejectedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating vendor profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update vendor profile"));
        }
    }
}
