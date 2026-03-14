package com.tatya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorDashboardDaySummaryResponse {
    private LocalDate date;
    private BigDecimal acresPlanned;
    private BigDecimal acresCompleted;
    private BigDecimal acresRemaining;
    private Double progressPercent;
}
