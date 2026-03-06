package com.tatya.dto;

import jakarta.validation.constraints.Min;
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
    
    // Kept for backwards compatibility. Server will override this with the computed value.
    private BigDecimal totalCost;
    
    @NotNull(message = "Number of days is required")
    @Min(value = 1, message = "Number of days must be at least 1")
    private Integer numberOfDays;
    
    private Integer quantity;
    
    private String unit; // Acre, Hour, Day
}

