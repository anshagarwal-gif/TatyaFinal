package com.tatya.controller;

import com.tatya.dto.*;
import com.tatya.entity.Drone;
import com.tatya.entity.VendorBankAccount;
import com.tatya.entity.VendorDocument;
import com.tatya.repository.VendorBankAccountRepository;
import com.tatya.service.FileUploadService;
import com.tatya.service.VendorOnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/vendors/onboarding")
@RequiredArgsConstructor
@Slf4j
public class VendorOnboardingController {
    
    private final VendorOnboardingService onboardingService;
    private final FileUploadService fileUploadService;
    private final VendorBankAccountRepository bankAccountRepository;
    
    /**
     * Save Step 1: Equipment Basics
     * POST /api/vendors/onboarding/step1
     */
    @PostMapping("/step1")
    public ResponseEntity<ApiResponse<Drone>> saveStep1(@Valid @RequestBody VendorOnboardingStep1Request request) {
        try {
            Drone drone = onboardingService.saveStep1(request);
            return ResponseEntity.ok(ApiResponse.success("Step 1 saved successfully", drone));
        } catch (Exception e) {
            log.error("Error saving step 1", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Save Step 2: Drone-Specific Details
     * POST /api/vendors/onboarding/step2
     */
    @PostMapping("/step2")
    public ResponseEntity<ApiResponse<Drone>> saveStep2(@Valid @RequestBody VendorOnboardingStep2Request request) {
        try {
            Drone drone = onboardingService.saveStep2(request);
            return ResponseEntity.ok(ApiResponse.success("Step 2 saved successfully", drone));
        } catch (Exception e) {
            log.error("Error saving step 2", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Save Step 3: Capacity & Coverage
     * POST /api/vendors/onboarding/step3
     */
    @PostMapping("/step3")
    public ResponseEntity<ApiResponse<Drone>> saveStep3(@Valid @RequestBody VendorOnboardingStep3Request request) {
        try {
            Drone drone = onboardingService.saveStep3(request);
            return ResponseEntity.ok(ApiResponse.success("Step 3 saved successfully", drone));
        } catch (Exception e) {
            log.error("Error saving step 3", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Save Step 4: Location & Logistics
     * POST /api/vendors/onboarding/step4
     */
    @PostMapping("/step4")
    public ResponseEntity<ApiResponse<Drone>> saveStep4(@Valid @RequestBody VendorOnboardingStep4Request request) {
        try {
            Drone drone = onboardingService.saveStep4(request);
            return ResponseEntity.ok(ApiResponse.success("Step 4 saved successfully", drone));
        } catch (Exception e) {
            log.error("Error saving step 4", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Save Step 5: Availability & SLA
     * POST /api/vendors/onboarding/step5
     */
    @PostMapping("/step5")
    public ResponseEntity<ApiResponse<Drone>> saveStep5(@Valid @RequestBody VendorOnboardingStep5Request request) {
        try {
            Drone drone = onboardingService.saveStep5(request);
            return ResponseEntity.ok(ApiResponse.success("Step 5 saved successfully", drone));
        } catch (Exception e) {
            log.error("Error saving step 5", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Save Step 6: Payouts
     * POST /api/vendors/onboarding/step6
     */
    @PostMapping("/step6")
    public ResponseEntity<ApiResponse<VendorBankAccount>> saveStep6(@Valid @RequestBody VendorOnboardingStep6Request request) {
        try {
            VendorBankAccount bankAccount = onboardingService.saveStep6(request);
            return ResponseEntity.ok(ApiResponse.success("Step 6 saved successfully. Onboarding complete!", bankAccount));
        } catch (Exception e) {
            log.error("Error saving step 6", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Upload equipment images
     * POST /api/vendors/onboarding/upload-images
     */
    @PostMapping("/upload-images")
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(
            @RequestParam("vendorId") Long vendorId,
            @RequestParam(value = "droneId", required = false) Long droneId,
            @RequestParam("files") MultipartFile[] files) {
        try {
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                String filePath = fileUploadService.uploadFile(file, "vendors/" + vendorId + "/images");
                onboardingService.saveDocument(vendorId, droneId, VendorDocument.DocumentType.EQUIPMENT_IMAGE,
                    file.getOriginalFilename(), filePath, file.getSize(), file.getContentType());
                filePaths.add(filePath);
            }
            return ResponseEntity.ok(ApiResponse.success("Images uploaded successfully", filePaths));
        } catch (Exception e) {
            log.error("Error uploading images", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Upload documents
     * POST /api/vendors/onboarding/upload-documents
     */
    @PostMapping("/upload-documents")
    public ResponseEntity<ApiResponse<List<String>>> uploadDocuments(
            @RequestParam("vendorId") Long vendorId,
            @RequestParam(value = "droneId", required = false) Long droneId,
            @RequestParam("files") MultipartFile[] files) {
        try {
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                String filePath = fileUploadService.uploadFile(file, "vendors/" + vendorId + "/documents");
                onboardingService.saveDocument(vendorId, droneId, VendorDocument.DocumentType.EQUIPMENT_DOCUMENT,
                    file.getOriginalFilename(), filePath, file.getSize(), file.getContentType());
                filePaths.add(filePath);
            }
            return ResponseEntity.ok(ApiResponse.success("Documents uploaded successfully", filePaths));
        } catch (Exception e) {
            log.error("Error uploading documents", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get saved onboarding data for a vendor
     * GET /api/vendors/onboarding/{vendorId}/data
     */
    @GetMapping("/{vendorId}/data")
    public ResponseEntity<ApiResponse<OnboardingDataResponse>> getOnboardingData(@PathVariable Long vendorId) {
        try {
            Drone drone = onboardingService.getOnboardingData(vendorId);
            VendorBankAccount bankAccount = bankAccountRepository
                .findByVendor_VendorIdAndIsActiveTrue(vendorId)
                .orElse(null);
            
            OnboardingDataResponse response = new OnboardingDataResponse();
            response.setDrone(drone);
            response.setBankAccount(bankAccount);
            
            return ResponseEntity.ok(ApiResponse.success("Onboarding data retrieved successfully", response));
        } catch (Exception e) {
            log.error("Error fetching onboarding data for vendor {}", vendorId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Response DTO for onboarding data
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class OnboardingDataResponse {
        private Drone drone;
        private VendorBankAccount bankAccount;
    }
}
