package com.tatya.service;

import com.tatya.dto.BookingRequest;
import com.tatya.entity.*;
import com.tatya.repository.BookingRepository;
import com.tatya.repository.DroneRepository;
import com.tatya.repository.UserRepository;
import com.tatya.repository.AvailabilityRepository;
import com.tatya.repository.DroneSpecificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final DroneRepository droneRepository;
    private final UserRepository userRepository;
    private final AvailabilityRepository availabilityRepository;
    private final DroneSpecificationRepository droneSpecificationRepository;
    
    @Transactional
    public Booking createBooking(BookingRequest request) {
        log.info("Creating booking for customer {} and drone {}", request.getCustomerId(), request.getDroneId());
        
        // Fetch customer
        User customer = userRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + request.getCustomerId()));
        
        // Fetch drone
        Drone drone = droneRepository.findById(request.getDroneId())
            .orElseThrow(() -> new RuntimeException("Drone not found with ID: " + request.getDroneId()));
        
        // Get vendor from drone
        Vendor vendor = drone.getVendor();
        if (vendor == null) {
            throw new RuntimeException("Vendor not found for drone ID: " + request.getDroneId());
        }
        
        // Fetch specification if provided
        DroneSpecification specification = null;
        if (request.getSpecificationId() != null) {
            specification = droneSpecificationRepository.findById(request.getSpecificationId())
                .orElseThrow(() -> new RuntimeException("Specification not found with ID: " + request.getSpecificationId()));
            // Verify specification belongs to the selected drone
            if (!specification.getDrone().getDroneId().equals(drone.getDroneId())) {
                throw new RuntimeException("Specification does not belong to the selected drone");
            }
        }
        
        // Check if availability slot exists and is available
        List<Availability> availableSlots = availabilityRepository
            .findAvailableSlotsByDroneIdAndDate(request.getDroneId(), request.getServiceDate());
        
        boolean slotFound = false;
        for (Availability slot : availableSlots) {
            if (!slot.getIsBooked() && 
                slot.getStartTime().equals(request.getStartTime()) &&
                slot.getEndTime().equals(request.getEndTime())) {
                slotFound = true;
                // Mark slot as booked
                slot.setIsBooked(true);
                availabilityRepository.save(slot);
                break;
            }
        }
        
        if (!slotFound) {
            log.warn("No available slot found for drone {} on {} from {} to {}", 
                request.getDroneId(), request.getServiceDate(), 
                request.getStartTime(), request.getEndTime());
            // Still create booking but log warning
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setVendor(vendor);
        booking.setDrone(drone);
        booking.setSpecification(specification); // Set the selected specification
        booking.setBookingDate(LocalDate.now());
        booking.setServiceDate(request.getServiceDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setLocationLat(request.getLocationLat());
        booking.setLocationLong(request.getLocationLong());
        booking.setFarmAreaAcres(request.getFarmAreaAcres());
        booking.setServiceType(request.getServiceType());
        booking.setTotalCost(request.getTotalCost());
        booking.setStatus(Booking.BookingStatus.PENDING);
        
        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with ID: {} for drone: {} with specification: {}", 
            savedBooking.getBookingId(), 
            savedBooking.getDrone().getDroneModel(),
            savedBooking.getSpecification() != null ? "Option Set " + savedBooking.getSpecification().getOptionSet() : "None");
        
        // Ensure drone and specification are loaded
        savedBooking = bookingRepository.findById(savedBooking.getBookingId())
            .orElse(savedBooking);
        
        return savedBooking;
    }
    
    public List<Booking> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomer_Id(customerId);
    }
    
    public List<Booking> getBookingsByVendorId(Long vendorId) {
        return bookingRepository.findByVendor_VendorId(vendorId);
    }
    
    public List<Booking> getBookingsByDroneId(Long droneId) {
        return bookingRepository.findByDrone_DroneId(droneId);
    }
    
    public Optional<Booking> getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId);
    }
    
    @Transactional
    public Booking updateBooking(Long bookingId, com.tatya.dto.UpdateBookingRequest request) {
        log.info("Updating booking {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
        
        // Free the old availability slot
        List<Availability> oldSlots = availabilityRepository
            .findAvailableSlotsByDroneIdAndDate(booking.getDrone().getDroneId(), booking.getServiceDate());
        
        for (Availability slot : oldSlots) {
            if (slot.getStartTime().equals(booking.getStartTime()) &&
                slot.getEndTime().equals(booking.getEndTime()) &&
                slot.getIsBooked()) {
                slot.setIsBooked(false);
                availabilityRepository.save(slot);
                log.info("Freed old availability slot for booking {}", bookingId);
                break;
            }
        }
        
        // Check and book new availability slot
        List<Availability> newSlots = availabilityRepository
            .findAvailableSlotsByDroneIdAndDate(booking.getDrone().getDroneId(), request.getServiceDate());
        
        boolean slotFound = false;
        for (Availability slot : newSlots) {
            if (!slot.getIsBooked() && 
                slot.getStartTime().equals(request.getStartTime()) &&
                slot.getEndTime().equals(request.getEndTime())) {
                slotFound = true;
                slot.setIsBooked(true);
                availabilityRepository.save(slot);
                log.info("Booked new availability slot for booking {}", bookingId);
                break;
            }
        }
        
        if (!slotFound) {
            log.warn("No available slot found for drone {} on {} from {} to {}", 
                booking.getDrone().getDroneId(), request.getServiceDate(), 
                request.getStartTime(), request.getEndTime());
            // Still update booking but log warning
        }
        
        // Update booking fields
        booking.setServiceDate(request.getServiceDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        if (request.getFarmAreaAcres() != null) {
            booking.setFarmAreaAcres(request.getFarmAreaAcres());
        }
        booking.setTotalCost(request.getTotalCost());
        
        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking {} updated successfully for drone: {}", 
            bookingId, updatedBooking.getDrone().getDroneModel());
        
        // Ensure drone is loaded with its name
        updatedBooking = bookingRepository.findById(updatedBooking.getBookingId())
            .orElse(updatedBooking);
        
        return updatedBooking;
    }
}

