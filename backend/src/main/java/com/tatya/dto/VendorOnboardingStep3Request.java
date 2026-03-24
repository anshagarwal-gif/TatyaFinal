package com.tatya.dto;

import lombok.Data;
import java.util.List;

@Data
public class VendorOnboardingStep3Request {
    private Long vendorId;
    private Integer batteryCapacity; // Deprecated - kept for backward compatibility
    private Integer numberOfBatteries; // Deprecated - kept for backward compatibility
    private List<BatterySet> batterySets;
    private Integer acreTargetPerDay;
    private Integer maxAcresPerDay;
    private Integer minBookingAcres;
    private Double serviceRadius;
    private List<String> operationalMonths;
    private List<String> operationalDays;
    private Integer leadTime;
    // Storage Information fields
    private Boolean hasChargingFacility;
    private Integer numberOfSpareBatteries;
    private String droneWarehouse;
    private Boolean hasGenerator;
    private Double generatorHp;
    private Double chargerVoltage;
    
    @Data
    public static class BatterySet {
        private Integer id;
        private Integer capacity;
    }
}
