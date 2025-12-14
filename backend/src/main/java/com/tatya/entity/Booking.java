package com.tatya.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drone_id", nullable = false)
    @JsonIgnoreProperties({"availabilities", "specifications"})
    private Drone drone;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "specification_id")
    @JsonIgnoreProperties({"drone"})
    private DroneSpecification specification;
    
    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;
    
    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "location_lat", nullable = false, precision = 10, scale = 8)
    private BigDecimal locationLat;
    
    @Column(name = "location_long", nullable = false, precision = 11, scale = 8)
    private BigDecimal locationLong;
    
    @Column(name = "farm_area_acres", precision = 10, scale = 2)
    private BigDecimal farmAreaAcres;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (bookingDate == null) {
            bookingDate = LocalDate.now();
        }
    }
    
    public enum ServiceType {
        SPRAYING, MAPPING, SEEDING
    }
    
    public enum BookingStatus {
        PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED
    }
}

