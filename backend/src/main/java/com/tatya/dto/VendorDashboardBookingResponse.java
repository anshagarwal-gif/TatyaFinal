package com.tatya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorDashboardBookingResponse {
    private Long bookingId;
    private LocalDate serviceDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal farmAreaAcres;
    private String serviceType;
    private String status;
    private String locationDisplay; // e.g. "Pune, Maharashtra" or coordinates
    private BigDecimal totalCost;
}
