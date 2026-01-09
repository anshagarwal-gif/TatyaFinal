package com.tatya.repository;

import com.tatya.entity.Cluster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClusterRepository extends JpaRepository<Cluster, Long> {
    List<Cluster> findByStatus(Cluster.ClusterStatus status);

    List<Cluster> findByVendorVendorId(Long vendorId);
}
