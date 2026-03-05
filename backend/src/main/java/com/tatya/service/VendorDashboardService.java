package com.tatya.service;

import com.tatya.dto.*;
import com.tatya.entity.Booking;
import com.tatya.entity.Payment;
import com.tatya.entity.Vendor;
import com.tatya.repository.BookingRepository;
import com.tatya.repository.PaymentRepository;
import com.tatya.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendorDashboardService {

    private final VendorRepository vendorRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    /**
     * Stats are read only from the database. No fake data.
     * - Earnings: SUM of Payment.amount where Payment.booking.vendor = vendorId, status = PAID, timestamp in month.
     *   (Tables: payments -> booking_id -> bookings.vendor_id.) If no payments exist, query returns 0 (COALESCE in DB).
     * - Rating: vendors.rating_avg (null -> 0).
     * - Jobs completed: COUNT of bookings where vendor_id = vendorId and status = COMPLETED.
     * - Success rate: completed / (accepted + completed); if no bookings, returns 100%.
     */
    public VendorDashboardStatsResponse getStats(Long vendorId) {
        vendorRepository.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor not found"));

        LocalDate now = LocalDate.now();
        LocalDateTime monthStart = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = monthStart.plusMonths(1);
        LocalDateTime lastMonthStart = monthStart.minusMonths(1);
        LocalDateTime lastMonthEnd = monthStart;

        // Earnings: from payments table (joined to booking -> vendor). No rows => SUM is null => we use 0.
        BigDecimal thisMonthEarnings = paymentRepository.sumAmountByVendorAndStatusAndTimestampBetween(
                vendorId, Payment.PaymentStatus.PAID, monthStart, monthEnd);
        BigDecimal lastMonthEarnings = paymentRepository.sumAmountByVendorAndStatusAndTimestampBetween(
                vendorId, Payment.PaymentStatus.PAID, lastMonthStart, lastMonthEnd);

        if (thisMonthEarnings == null) thisMonthEarnings = BigDecimal.ZERO;
        if (lastMonthEarnings == null) lastMonthEarnings = BigDecimal.ZERO;

        Double earningsChangePercent = null;
        if (lastMonthEarnings.compareTo(BigDecimal.ZERO) != 0) {
            earningsChangePercent = thisMonthEarnings.subtract(lastMonthEarnings)
                    .divide(lastMonthEarnings, 4, RoundingMode.HALF_UP)
                    .doubleValue() * 100;
        } else if (thisMonthEarnings.compareTo(BigDecimal.ZERO) != 0) {
            earningsChangePercent = 100.0;
        }

        Vendor vendor = vendorRepository.findById(vendorId).orElse(null);
        BigDecimal rating = vendor != null && vendor.getRatingAvg() != null ? vendor.getRatingAvg() : BigDecimal.ZERO;

        long jobsCompleted = bookingRepository.countByVendor_VendorIdAndStatus(vendorId, Booking.BookingStatus.COMPLETED);
        long totalAcceptedOrCompleted = bookingRepository.countByVendor_VendorIdAndStatus(vendorId, Booking.BookingStatus.ACCEPTED)
                + jobsCompleted;
        Double successRate = totalAcceptedOrCompleted > 0
                ? (jobsCompleted * 100.0 / totalAcceptedOrCompleted) : 100.0;

        return new VendorDashboardStatsResponse(
                thisMonthEarnings,
                lastMonthEarnings,
                earningsChangePercent,
                rating,
                jobsCompleted,
                successRate
        );
    }

    public VendorDashboardChartResponse getChartData(Long vendorId, String period) {
        vendorRepository.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor not found"));

        List<String> labels = new ArrayList<>();
        List<BigDecimal> values = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        if ("year".equalsIgnoreCase(period)) {
            startDate = endDate.minusYears(1);
            Map<String, BigDecimal> monthAcres = new LinkedHashMap<>();
            for (int i = 11; i >= 0; i--) {
                LocalDate m = endDate.minusMonths(i);
                String key = m.getMonth().name().substring(0, 1) + m.getMonth().name().substring(1).toLowerCase() + " " + m.getYear();
                monthAcres.put(key, BigDecimal.ZERO);
            }
            List<Booking> bookings = bookingRepository.findByVendor_VendorIdAndServiceDateBetween(vendorId, startDate, endDate);
            for (Booking b : bookings) {
                if (b.getStatus() != Booking.BookingStatus.COMPLETED) continue;
                LocalDate d = b.getServiceDate();
                String key = d.getMonth().name().substring(0, 1) + d.getMonth().name().substring(1).toLowerCase() + " " + d.getYear();
                BigDecimal acres = b.getFarmAreaAcres() != null ? b.getFarmAreaAcres() : BigDecimal.ZERO;
                monthAcres.put(key, monthAcres.get(key).add(acres));
            }
            labels.addAll(monthAcres.keySet());
            values.addAll(monthAcres.values());
        } else if ("month".equalsIgnoreCase(period)) {
            startDate = endDate.minusDays(29);
            Map<LocalDate, BigDecimal> dayAcres = new LinkedHashMap<>();
            for (int i = 29; i >= 0; i--) {
                LocalDate d = endDate.minusDays(i);
                dayAcres.put(d, BigDecimal.ZERO);
            }
            List<Booking> bookings = bookingRepository.findByVendor_VendorIdAndServiceDateBetween(vendorId, startDate, endDate);
            for (Booking b : bookings) {
                if (b.getStatus() != Booking.BookingStatus.COMPLETED) continue;
                LocalDate d = b.getServiceDate();
                BigDecimal acres = b.getFarmAreaAcres() != null ? b.getFarmAreaAcres() : BigDecimal.ZERO;
                dayAcres.put(d, dayAcres.get(d).add(acres));
            }
            for (LocalDate d : dayAcres.keySet()) {
                labels.add(d.getDayOfMonth() + "/" + d.getMonthValue());
                values.add(dayAcres.get(d));
            }
        } else {
            // week: last 7 days, label = day name
            startDate = endDate.minusDays(6);
            String[] dayNames = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
            Map<LocalDate, BigDecimal> dayAcres = new LinkedHashMap<>();
            for (int i = 6; i >= 0; i--) {
                LocalDate d = endDate.minusDays(i);
                dayAcres.put(d, BigDecimal.ZERO);
            }
            List<Booking> bookings = bookingRepository.findByVendor_VendorIdAndServiceDateBetween(vendorId, startDate, endDate);
            for (Booking b : bookings) {
                if (b.getStatus() != Booking.BookingStatus.COMPLETED) continue;
                LocalDate d = b.getServiceDate();
                BigDecimal acres = b.getFarmAreaAcres() != null ? b.getFarmAreaAcres() : BigDecimal.ZERO;
                dayAcres.put(d, dayAcres.get(d).add(acres));
            }
            for (LocalDate d : dayAcres.keySet()) {
                labels.add(dayNames[d.getDayOfWeek().getValue() % 7]);
                values.add(dayAcres.get(d));
            }
        }

        BigDecimal totalAcres = values.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        int daysCount = "year".equalsIgnoreCase(period) ? 365 : ("month".equalsIgnoreCase(period) ? 30 : 7);
        BigDecimal avgPerDay = daysCount > 0 ? totalAcres.divide(BigDecimal.valueOf(daysCount), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        return new VendorDashboardChartResponse(period, labels, values, totalAcres, avgPerDay);
    }

    public List<VendorDashboardBookingResponse> getBookings(Long vendorId, LocalDate date) {
        vendorRepository.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor not found"));
        List<Booking> bookings = bookingRepository.findByVendor_VendorIdAndServiceDate(vendorId, date);
        return bookings.stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    public VendorDashboardDaySummaryResponse getDaySummary(Long vendorId, LocalDate date) {
        vendorRepository.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor not found"));
        List<Booking> bookings = bookingRepository.findByVendor_VendorIdAndServiceDate(vendorId, date);
        BigDecimal planned = BigDecimal.ZERO;
        BigDecimal completed = BigDecimal.ZERO;
        for (Booking b : bookings) {
            if (b.getStatus() == Booking.BookingStatus.CANCELLED || b.getStatus() == Booking.BookingStatus.REJECTED) continue;
            BigDecimal acres = b.getFarmAreaAcres() != null ? b.getFarmAreaAcres() : BigDecimal.ZERO;
            planned = planned.add(acres);
            if (b.getStatus() == Booking.BookingStatus.COMPLETED) completed = completed.add(acres);
        }
        BigDecimal remaining = planned.subtract(completed);
        Double progressPercent = planned.compareTo(BigDecimal.ZERO) != 0
                ? completed.divide(planned, 4, RoundingMode.HALF_UP).doubleValue() * 100 : 0.0;
        return new VendorDashboardDaySummaryResponse(date, planned, completed, remaining, progressPercent);
    }

    private VendorDashboardBookingResponse toBookingResponse(Booking b) {
        String locationDisplay = b.getLocationLat() != null && b.getLocationLong() != null
                ? b.getLocationLat().setScale(4, RoundingMode.HALF_UP) + ", " + b.getLocationLong().setScale(4, RoundingMode.HALF_UP)
                : "—";
        return new VendorDashboardBookingResponse(
                b.getBookingId(),
                b.getServiceDate(),
                b.getStartTime(),
                b.getEndTime(),
                b.getFarmAreaAcres(),
                b.getServiceType() != null ? b.getServiceType().name() : null,
                b.getStatus() != null ? b.getStatus().name() : null,
                locationDisplay,
                b.getTotalCost()
        );
    }
}
