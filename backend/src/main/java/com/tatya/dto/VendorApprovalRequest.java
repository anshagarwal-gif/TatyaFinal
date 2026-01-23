package com.tatya.dto;

import com.tatya.entity.Vendor;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorApprovalRequest {
    
    @NotNull(message = "Vendor ID is required")
    private Long vendorId;
    
    @NotNull(message = "Approval action is required")
    private Vendor.VerifiedStatus action; // VERIFIED or REJECTED
}
