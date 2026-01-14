package com.tatya.dto;

import lombok.Data;

@Data
public class UpdateVendorProfileRequest {
    // Personal Information
    private String fullName;
    private String email;
    
    // Equipment Details
    private String equipmentType;
    private String brand;
    private String modelName;
    private Integer yearOfMake;
    private String serialNo;
    
    // Drone Details
    private String droneName;
    private String droneType;
    private Double tankSizeLiters;
    private Double sprayWidthMeters;
    private Integer batteryCapacityMah;
    private Integer batteryCount;
    private Integer flightTimeMinutes;
    private Integer batterySwapTimeMinutes;
    private String uin;
    private String uaop;
    private String pilotLicense;
    private Boolean returnToHome;
    private Boolean terrainFollowing;
    
    // Capacity & Coverage
    private Integer maxAcresPerDay;
    private Integer minBookingAcres;
    private Double serviceRadiusKm;
    private String operationalMonths;
    private String operationalDays;
    private Integer leadTimeDays;
    
    // Location & Logistics
    private String baseLocation;
    private String coordinates;
    private String serviceAreas;
    private Boolean hasChargingFacility;
    private Integer numberOfSpareBatteries;
    private String droneWarehouseDescription;
    
    // Availability & SLA
    private String availabilityStartDate;
    private String availabilityEndDate;
    private Integer slaReachTimeHours;
    private String workingHoursBatches;
    private String availabilityStatus;
    
    // Payouts
    private String accountHolderName;
    private String accountNumber;
    private String bankIfscCode;
    private String bankName;
    private String upiId;
}
