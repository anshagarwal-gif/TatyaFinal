package com.tatya.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class UpdateBookingRequest {
    
    @NotNull(message = "Service date is required")
    private LocalDate serviceDate;
    
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalTime endTime;
    
    private BigDecimal farmAreaAcres;
    
    @NotNull(message = "Total cost is required")
    private BigDecimal totalCost;
    
    private Integer quantity;
    
    private String unit; // Acre, Hour, Day
}

