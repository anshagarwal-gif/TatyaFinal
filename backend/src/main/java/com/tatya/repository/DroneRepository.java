package com.tatya.repository;

import com.tatya.entity.Drone;
import com.tatya.entity.User;
import com.tatya.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DroneRepository extends JpaRepository<Drone, Long> {
    
    List<Drone> findByStatus(Drone.DroneStatus status);
    
    List<Drone> findByVendor_VendorId(Long vendorId);
    
    @Query("SELECT d FROM Drone d LEFT JOIN FETCH d.specifications WHERE d.droneId = :droneId")
    Optional<Drone> findByIdWithSpecifications(Long droneId);
    
    @Query("SELECT d FROM Drone d LEFT JOIN FETCH d.specifications " +
           "LEFT JOIN FETCH d.vendor v LEFT JOIN FETCH v.user u " +
           "WHERE d.status = :status " +
           "AND v IS NOT NULL " +
           "AND u IS NOT NULL " +
           "AND u.status = :userStatus " +
           "AND v.verifiedStatus = :verifiedStatus")
    List<Drone> findByStatusWithSpecifications(
        @Param("status") Drone.DroneStatus status, 
        @Param("userStatus") User.UserStatus userStatus,
        @Param("verifiedStatus") Vendor.VerifiedStatus verifiedStatus
    );
    
    @Query("SELECT d FROM Drone d LEFT JOIN FETCH d.specifications")
    List<Drone> findAllWithSpecifications();
    
    long countByVendor_VendorId(Long vendorId);
}






