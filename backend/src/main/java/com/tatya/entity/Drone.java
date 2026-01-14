package com.tatya.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "drones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Drone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drone_id")
    private Long droneId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    @JsonIgnoreProperties({ "drones" })
    private Vendor vendor;

    @Column(name = "drone_model", nullable = false)
    private String droneModel;

    @Column(name = "drone_name")
    private String droneName;

    @Column(name = "drone_type")
    private String droneType; // Spraying, Surveillance, Logistic

    @Column(name = "equipment_type")
    private String equipmentType; // agricultural-drone, spraying-drone, etc.

    @Column(name = "brand")
    private String brand;

    @Column(name = "model_name")
    private String modelName;

    @Column(name = "year_of_make")
    private Integer yearOfMake;

    @Column(name = "serial_no")
    private String serialNo;

    @Column(name = "capacity_liters")
    private Double capacityLiters;

    @Column(name = "tank_size_liters")
    private Double tankSizeLiters;

    @Column(name = "spray_width_meters")
    private Double sprayWidthMeters;

    @Column(name = "battery_capacity_mah")
    private Integer batteryCapacityMah;

    @Column(name = "flight_time_minutes")
    private Integer flightTimeMinutes;

    @Column(name = "battery_swap_time_minutes")
    private Integer batterySwapTimeMinutes;

    @Column(name = "battery_count")
    private Integer batteryCount;

    @Column(name = "uin")
    private String uin;

    @Column(name = "uaop")
    private String uaop;

    @Column(name = "pilot_license")
    private String pilotLicense;

    @Column(name = "return_to_home")
    private Boolean returnToHome = false;

    @Column(name = "terrain_following")
    private Boolean terrainFollowing = false;

    // Capacity & Coverage fields
    @Column(name = "max_acres_per_day")
    private Integer maxAcresPerDay;

    @Column(name = "min_booking_acres")
    private Integer minBookingAcres;

    @Column(name = "service_radius_km")
    private Double serviceRadiusKm;

    @Column(name = "operational_months", columnDefinition = "TEXT")
    private String operationalMonths; // JSON array or comma-separated

    @Column(name = "operational_days", columnDefinition = "TEXT")
    private String operationalDays; // JSON array or comma-separated

    @Column(name = "lead_time_days")
    private Integer leadTimeDays;

    // Location & Logistics fields
    @Column(name = "base_location")
    private String baseLocation;

    @Column(name = "coordinates")
    private String coordinates; // lat/lng

    @Column(name = "service_areas")
    private String serviceAreas;

    @Column(name = "has_charging_facility")
    private Boolean hasChargingFacility = false;

    @Column(name = "number_of_spare_batteries")
    private Integer numberOfSpareBatteries;

    @Column(name = "drone_warehouse", columnDefinition = "TEXT")
    private String droneWarehouse;

    // Availability & SLA fields
    @Column(name = "sla_reach_time_hours")
    private Integer slaReachTimeHours;

    @Column(name = "time_batches", columnDefinition = "TEXT")
    private String timeBatches; // JSON array

    @Column(name = "availability_status")
    private String availabilityStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DroneStatus status = DroneStatus.AVAILABLE;

    @Column(name = "price_per_hour", precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @Column(name = "price_per_acre", precision = 10, scale = 2)
    private BigDecimal pricePerAcre;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "drone", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Availability> availabilities = new ArrayList<>();

    @OneToMany(mappedBy = "drone", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({ "drone" })
    private List<DroneSpecification> specifications = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum DroneStatus {
        AVAILABLE, BUSY, MAINTENANCE
    }
}
