package com.tatya.controller;

import com.tatya.dto.ApiResponse;
import com.tatya.entity.Drone;
import com.tatya.service.DroneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drones")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class DroneController {
    
    private final DroneService droneService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Drone>>> getAllDrones() {
        try {
            List<Drone> drones = droneService.getAllDrones();
            return ResponseEntity.ok(ApiResponse.success("Drones retrieved successfully", drones));
        } catch (Exception e) {
            log.error("Error fetching drones", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch drones: " + e.getMessage()));
        }
    }
    
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Drone>>> getAvailableDrones() {
        try {
            List<Drone> drones = droneService.getAvailableDrones();
            return ResponseEntity.ok(ApiResponse.success("Available drones retrieved successfully", drones));
        } catch (Exception e) {
            log.error("Error fetching available drones", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch available drones: " + e.getMessage()));
        }
    }
    
    @GetMapping("/with-specifications")
    public ResponseEntity<ApiResponse<List<Drone>>> getAllDronesWithSpecifications() {
        try {
            List<Drone> drones = droneService.getAllDronesWithSpecifications();
            return ResponseEntity.ok(ApiResponse.success("Drones with specifications retrieved successfully", drones));
        } catch (Exception e) {
            log.error("Error fetching drones with specifications", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch drones: " + e.getMessage()));
        }
    }
    
    @GetMapping("/available/with-specifications")
    public ResponseEntity<ApiResponse<List<Drone>>> getAvailableDronesWithSpecifications() {
        try {
            List<Drone> drones = droneService.getAvailableDronesWithSpecifications();
            return ResponseEntity.ok(ApiResponse.success("Available drones with specifications retrieved successfully", drones));
        } catch (Exception e) {
            log.error("Error fetching available drones with specifications", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch drones: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{droneId}")
    public ResponseEntity<ApiResponse<Drone>> getDroneById(@PathVariable Long droneId) {
        try {
            return droneService.getDroneById(droneId)
                .map(drone -> ResponseEntity.ok(ApiResponse.success("Drone retrieved successfully", drone)))
                .orElse(ResponseEntity.status(404)
                    .body(ApiResponse.error("Drone not found")));
        } catch (Exception e) {
            log.error("Error fetching drone {}", droneId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch drone: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{droneId}/with-specifications")
    public ResponseEntity<ApiResponse<Drone>> getDroneWithSpecifications(@PathVariable Long droneId) {
        try {
            return droneService.getDroneWithSpecifications(droneId)
                .map(drone -> ResponseEntity.ok(ApiResponse.success("Drone with specifications retrieved successfully", drone)))
                .orElse(ResponseEntity.status(404)
                    .body(ApiResponse.error("Drone not found")));
        } catch (Exception e) {
            log.error("Error fetching drone {} with specifications", droneId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch drone: " + e.getMessage()));
        }
    }
    
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<Drone>>> getDronesByVendorId(@PathVariable Long vendorId) {
        try {
            List<Drone> drones = droneService.getDronesByVendorId(vendorId);
            return ResponseEntity.ok(ApiResponse.success("Drones for vendor retrieved successfully", drones));
        } catch (Exception e) {
            log.error("Error fetching drones for vendor {}", vendorId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch drones: " + e.getMessage()));
        }
    }
}






