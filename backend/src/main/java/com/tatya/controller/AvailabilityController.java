package com.tatya.controller;

import com.tatya.dto.ApiResponse;
import com.tatya.entity.Availability;
import com.tatya.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class AvailabilityController {
    
    private final AvailabilityService availabilityService;
    
    @GetMapping("/drone/{droneId}/dates")
    public ResponseEntity<ApiResponse<List<LocalDate>>> getAvailableDates(
            @PathVariable Long droneId) {
        try {
            List<LocalDate> availableDates = availabilityService.getAvailableDatesByDroneId(droneId);
            return ResponseEntity.ok(ApiResponse.success(
                "Available dates retrieved successfully", availableDates));
        } catch (Exception e) {
            log.error("Error fetching available dates for drone {}", droneId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch available dates: " + e.getMessage()));
        }
    }
    
    @GetMapping("/drone/{droneId}/slots")
    public ResponseEntity<ApiResponse<List<Availability>>> getAvailableSlots(
            @PathVariable Long droneId) {
        try {
            List<Availability> slots = availabilityService.getAvailableSlotsByDroneId(droneId);
            return ResponseEntity.ok(ApiResponse.success(
                "Available slots retrieved successfully", slots));
        } catch (Exception e) {
            log.error("Error fetching available slots for drone {}", droneId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch available slots: " + e.getMessage()));
        }
    }
    
    @GetMapping("/drone/{droneId}/date/{date}/slots")
    public ResponseEntity<ApiResponse<List<Availability>>> getAvailableSlotsByDate(
            @PathVariable Long droneId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<Availability> slots = availabilityService.getAvailableSlotsByDroneIdAndDate(droneId, date);
            return ResponseEntity.ok(ApiResponse.success(
                "Available slots for date retrieved successfully", slots));
        } catch (Exception e) {
            log.error("Error fetching available slots for drone {} on date {}", droneId, date, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch available slots: " + e.getMessage()));
        }
    }
}

