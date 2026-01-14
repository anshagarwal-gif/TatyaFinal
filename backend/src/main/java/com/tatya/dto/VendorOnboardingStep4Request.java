package com.tatya.dto;

import lombok.Data;

@Data
public class VendorOnboardingStep4Request {
    private Long vendorId;
    private String baseLocation;
    private String coordinates;
    private String serviceAreas;
    private Boolean hasChargingFacility;
    private Integer numberOfSpareBatteries;
    private String droneWarehouse;
}
