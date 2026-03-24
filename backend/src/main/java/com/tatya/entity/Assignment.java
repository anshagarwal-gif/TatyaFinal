package com.tatya.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cluster_id", nullable = false)
    private Cluster cluster;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "scheduled_time_slot")
    private String scheduledTimeSlot; // e.g. "09:00 AM - 05:00 PM"

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }
}
