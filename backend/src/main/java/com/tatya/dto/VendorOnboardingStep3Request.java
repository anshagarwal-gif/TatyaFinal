package com.tatya.dto;

import lombok.Data;
import java.util.List;

@Data
public class VendorOnboardingStep3Request {
    private Long vendorId;
    private Integer maxAcresPerDay;
    private Integer minBookingAcres;
    private Double serviceRadius;
    private List<String> operationalMonths;
    private List<String> operationalDays;
    private Integer leadTime;
}
