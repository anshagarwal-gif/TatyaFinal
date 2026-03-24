package com.tatya.controller;

import com.tatya.dto.ApiResponse;
import com.tatya.entity.DroneSpecification;
import com.tatya.service.DroneSpecificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drone-specifications")
@RequiredArgsConstructor
@Slf4j
public class DroneSpecificationController {
    
    private final DroneSpecificationService specificationService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<DroneSpecification>>> getAllSpecifications() {
        try {
            List<DroneSpecification> specifications = specificationService.getAllSpecifications();
            return ResponseEntity.ok(ApiResponse.success("Specifications retrieved successfully", specifications));
        } catch (Exception e) {
            log.error("Error fetching specifications", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch specifications: " + e.getMessage()));
        }
    }
    
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<DroneSpecification>>> getAvailableSpecifications() {
        try {
            List<DroneSpecification> specifications = specificationService.getAvailableSpecifications();
            return ResponseEntity.ok(ApiResponse.success("Available specifications retrieved successfully", specifications));
        } catch (Exception e) {
            log.error("Error fetching available specifications", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch available specifications: " + e.getMessage()));
        }
    }
    
    @GetMapping("/drone/{droneId}")
    public ResponseEntity<ApiResponse<List<DroneSpecification>>> getSpecificationsByDroneId(
            @PathVariable Long droneId) {
        try {
            List<DroneSpecification> specifications = specificationService.getSpecificationsByDroneId(droneId);
            return ResponseEntity.ok(ApiResponse.success(
                "Specifications for drone retrieved successfully", specifications));
        } catch (Exception e) {
            log.error("Error fetching specifications for drone {}", droneId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch specifications: " + e.getMessage()));
        }
    }
    
    @GetMapping("/drone/{droneId}/available")
    public ResponseEntity<ApiResponse<List<DroneSpecification>>> getAvailableSpecificationsByDroneId(
            @PathVariable Long droneId) {
        try {
            List<DroneSpecification> specifications = specificationService.getAvailableSpecificationsByDroneId(droneId);
            return ResponseEntity.ok(ApiResponse.success(
                "Available specifications for drone retrieved successfully", specifications));
        } catch (Exception e) {
            log.error("Error fetching available specifications for drone {}", droneId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch available specifications: " + e.getMessage()));
        }
    }
    
    @GetMapping("/drone/{droneId}/option-set/{optionSet}")
    public ResponseEntity<ApiResponse<DroneSpecification>> getSpecificationByDroneAndOptionSet(
            @PathVariable Long droneId,
            @PathVariable Integer optionSet) {
        try {
            return specificationService.getSpecificationByDroneAndOptionSet(droneId, optionSet)
                .map(spec -> ResponseEntity.ok(ApiResponse.success("Specification retrieved successfully", spec)))
                .orElse(ResponseEntity.status(404)
                    .body(ApiResponse.error("Specification not found")));
        } catch (Exception e) {
            log.error("Error fetching specification for drone {} option set {}", droneId, optionSet, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch specification: " + e.getMessage()));
        }
    }
    
}

