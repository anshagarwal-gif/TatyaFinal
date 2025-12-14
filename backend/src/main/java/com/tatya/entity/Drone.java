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
    @JsonIgnoreProperties({"drones"})
    private Vendor vendor;
    
    @Column(name = "drone_model", nullable = false)
    private String droneModel;
    
    @Column(name = "capacity_liters")
    private Double capacityLiters;
    
    @Column(name = "flight_time_minutes")
    private Integer flightTimeMinutes;
    
    @Column(name = "battery_count")
    private Integer batteryCount;
    
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
    @JsonIgnoreProperties({"drone"})
    private List<DroneSpecification> specifications = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum DroneStatus {
        AVAILABLE, BUSY, MAINTENANCE
    }
}

