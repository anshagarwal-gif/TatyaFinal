package com.tatya.repository;

import com.tatya.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByCustomer_Id(Long customerId);
    
    List<Booking> findByVendor_VendorId(Long vendorId);
    
    List<Booking> findByDrone_DroneId(Long droneId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.serviceDate = :serviceDate AND b.drone.droneId = :droneId")
    List<Booking> findByServiceDateAndDroneId(LocalDate serviceDate, Long droneId);
}





