package com.tatya.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class VendorOnboardingStep5Request {
    private Long vendorId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer slaReachTime;
    private List<String> timeBatches;
    private String availabilityStatus;
}
