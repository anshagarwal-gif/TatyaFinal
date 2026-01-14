package com.tatya.dto;

import lombok.Data;

@Data
public class VendorOnboardingStep2Request {
    private Long vendorId;
    private String droneName;
    private String droneType;
    private Double tankSize;
    private Double sprayWidth;
    private Integer batteryCapacity;
    private Integer numberOfBatteries;
    private Integer flightTime;
    private Integer batterySwapTime;
    private String uin;
    private String uaop;
    private String pilotLicense;
    private Boolean returnToHome;
    private Boolean terrainFollowing;
}
