package com.tatya.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "clusters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cluster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClusterStatus status = ClusterStatus.PENDING;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "cluster_farms", joinColumns = @JoinColumn(name = "cluster_id"), inverseJoinColumns = @JoinColumn(name = "farm_id"))
    private Set<Farm> farms = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ClusterStatus {
        PENDING, // Generated but not assigned/confirmed
        ACTIVE, // Assigned to vendor, dates fixed
        COMPLETED, // Service done
        CANCELLED
    }
}
