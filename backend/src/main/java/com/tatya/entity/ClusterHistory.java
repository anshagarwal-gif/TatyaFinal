package com.tatya.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cluster_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_cluster_id")
    private Long originalClusterId;

    @Column(nullable = false)
    private String name;

    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime archivedAt;

    @PrePersist
    protected void onCreate() {
        archivedAt = LocalDateTime.now();
    }
}
