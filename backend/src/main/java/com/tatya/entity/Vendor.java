package com.tatya.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {
    
    @Id
    @Column(name = "vendor_id")
    private Long vendorId;
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", referencedColumnName = "id")
    @MapsId
    @JsonIgnoreProperties({"passwordHash"})
    private User user;
    
    @Column(name = "aadhaar_no", unique = true, length = 12)
    private String aadhaarNo;
    
    @Column(name = "license_no")
    private String licenseNo;
    
    @Column(name = "experience_years")
    private Integer experienceYears;
    
    @Column(name = "service_area")
    private String serviceArea; // 'geolocation' or 'district'
    
    @Column(name = "rating_avg", precision = 3, scale = 2)
    private BigDecimal ratingAvg;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "verified_status", nullable = false)
    private VerifiedStatus verifiedStatus = VerifiedStatus.PENDING;
    
    public enum VerifiedStatus {
        PENDING, VERIFIED, REJECTED
    }
}

