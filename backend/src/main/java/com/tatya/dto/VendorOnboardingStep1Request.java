package com.tatya.dto;

import lombok.Data;

@Data
public class VendorOnboardingStep1Request {
    private Long vendorId;
    private String equipmentType;
    private String brand;
    private String modelName;
    private Integer yearOfMake;
    private String serialNo;
}
