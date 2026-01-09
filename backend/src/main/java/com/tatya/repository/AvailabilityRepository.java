package com.tatya.repository;

import com.tatya.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    
    List<Availability> findByDrone_DroneId(Long droneId);
    
    List<Availability> findByDrone_DroneIdAndIsBookedFalse(Long droneId);
    
    List<Availability> findByDrone_DroneIdAndAvailableDateGreaterThanEqualAndIsBookedFalse(
        Long droneId, LocalDate date);
    
    @Query("SELECT DISTINCT a.availableDate FROM Availability a " +
           "WHERE a.drone.droneId = :droneId " +
           "AND a.isBooked = false " +
           "AND a.availableDate >= :startDate " +
           "ORDER BY a.availableDate")
    List<LocalDate> findAvailableDatesByDroneId(
        @Param("droneId") Long droneId,
        @Param("startDate") LocalDate startDate);
    
    @Query("SELECT a FROM Availability a " +
           "WHERE a.drone.droneId = :droneId " +
           "AND a.availableDate = :date " +
           "AND a.isBooked = false")
    List<Availability> findAvailableSlotsByDroneIdAndDate(
        @Param("droneId") Long droneId,
        @Param("date") LocalDate date);
}






