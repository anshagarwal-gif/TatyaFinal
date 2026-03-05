package com.tatya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorDashboardStatsResponse {
    private BigDecimal totalEarningsThisMonth;
    private BigDecimal totalEarningsLastMonth;
    private Double earningsChangePercent;
    private BigDecimal rating;
    private Long jobsCompleted;
    private Double successRate;
}
