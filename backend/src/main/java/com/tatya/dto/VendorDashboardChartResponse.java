package com.tatya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorDashboardChartResponse {
    private String period; // "week", "month", "year"
    private List<String> labels;
    private List<BigDecimal> values; // acres per label (day/week/month)
    private BigDecimal totalAcres;
    private BigDecimal avgPerDay;
}
