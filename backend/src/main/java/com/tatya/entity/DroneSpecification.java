package com.tatya.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "drone_specifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DroneSpecification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Long specId;
    
    @Column(name = "option_set", nullable = false)
    private Integer optionSet; // 1 or 2
    
    @Column(name = "tank_size_liters", nullable = false)
    private Double tankSizeLiters;
    
    @Column(name = "sprinkler_type", nullable = false)
    private String sprinklerType;
    
    @Column(name = "time_per_acre_minutes")
    private String timePerAcreMinutes; // e.g., "4-6" or "5"
    
    @Column(name = "spray_width_meters", nullable = false)
    private Double sprayWidthMeters;
    
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;
    
    @Column(name = "auto_return_safety", nullable = false)
    private Boolean autoReturnSafety = false;
    
    @Column(name = "solid_sprayer_compatibility", nullable = false)
    private Boolean solidSprayerCompatibility = false;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drone_id")
    @JsonIgnoreProperties({"specifications"})
    private Drone drone;
}

