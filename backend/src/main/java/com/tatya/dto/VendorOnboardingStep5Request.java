package com.tatya.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class VendorOnboardingStep5Request {
    private Long vendorId;
    private LocalDate startDate;
    private Integer slaReachTime;
    private List<String> timeBatches;
    private String availabilityStatus;
    private Integer maxAcresPerDay;
    private BigDecimal perAcreRate;
}
