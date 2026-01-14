package com.tatya.dto;

import lombok.Data;

@Data
public class VendorOnboardingStep6Request {
    private Long vendorId;
    private String accountHolderName;
    private String accountNumber;
    private String bankIfscCode;
    private String bankName;
    private String upiId;
}
