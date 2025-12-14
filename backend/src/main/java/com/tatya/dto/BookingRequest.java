package com.tatya.dto;

import com.tatya.entity.Booking;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @NotNull(message = "Drone ID is required")
    private Long droneId;
    
    private Long specificationId; // Optional: Selected drone specification
    
    @NotNull(message = "Service date is required")
    private LocalDate serviceDate;
    
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalTime endTime;
    
    @NotNull(message = "Location latitude is required")
    private BigDecimal locationLat;
    
    @NotNull(message = "Location longitude is required")
    private BigDecimal locationLong;
    
    private BigDecimal farmAreaAcres;
    
    @NotNull(message = "Service type is required")
    private Booking.ServiceType serviceType;
    
    @NotNull(message = "Total cost is required")
    private BigDecimal totalCost;
    
    private Integer quantity;
    
    private String unit; // Acre, Hour, Day
}

