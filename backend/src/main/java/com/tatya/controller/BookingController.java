package com.tatya.controller;

import com.tatya.dto.ApiResponse;
import com.tatya.dto.BookingRequest;
import com.tatya.dto.UpdateBookingRequest;
import com.tatya.entity.Booking;
import com.tatya.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request) {
        try {
            log.info("Received booking request: {}", request);
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
        } catch (RuntimeException e) {
            log.error("Error creating booking", e);
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Failed to create booking: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating booking", e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to create booking: " + e.getMessage()));
        }
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByCustomer(@PathVariable Long customerId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByCustomerId(customerId);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            log.error("Error fetching bookings for customer {}", customerId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch bookings: " + e.getMessage()));
        }
    }
    
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByVendor(@PathVariable Long vendorId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByVendorId(vendorId);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            log.error("Error fetching bookings for vendor {}", vendorId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch bookings: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long bookingId) {
        try {
            return bookingService.getBookingById(bookingId)
                .map(booking -> ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking)))
                .orElse(ResponseEntity.status(404)
                    .body(ApiResponse.error("Booking not found")));
        } catch (Exception e) {
            log.error("Error fetching booking {}", bookingId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch booking: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> updateBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody UpdateBookingRequest request) {
        try {
            log.info("Received update booking request for booking {}: {}", bookingId, request);
            Booking booking = bookingService.updateBooking(bookingId, request);
            return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", booking));
        } catch (RuntimeException e) {
            log.error("Error updating booking {}", bookingId, e);
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Failed to update booking: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error updating booking {}", bookingId, e);
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to update booking: " + e.getMessage()));
        }
    }
}

