package com.tatya.repository;

import com.tatya.entity.Drone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DroneRepository extends JpaRepository<Drone, Long> {
    
    List<Drone> findByStatus(Drone.DroneStatus status);
    
    List<Drone> findByVendor_VendorId(Long vendorId);
    
    @Query("SELECT d FROM Drone d LEFT JOIN FETCH d.specifications WHERE d.droneId = :droneId")
    Optional<Drone> findByIdWithSpecifications(Long droneId);
    
    @Query("SELECT d FROM Drone d LEFT JOIN FETCH d.specifications WHERE d.status = :status")
    List<Drone> findByStatusWithSpecifications(Drone.DroneStatus status);
    
    @Query("SELECT d FROM Drone d LEFT JOIN FETCH d.specifications")
    List<Drone> findAllWithSpecifications();
}

