package com.tatya.repository;

import com.tatya.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByBooking_BookingId(Long bookingId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.booking.vendor.vendorId = :vendorId AND p.paymentStatus = :status AND p.timestamp >= :start AND p.timestamp < :end")
    BigDecimal sumAmountByVendorAndStatusAndTimestampBetween(
            @Param("vendorId") Long vendorId,
            @Param("status") Payment.PaymentStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
