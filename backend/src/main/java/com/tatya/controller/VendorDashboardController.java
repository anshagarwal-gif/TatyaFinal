package com.tatya.controller;

import com.tatya.dto.ApiResponse;
import com.tatya.dto.VendorDashboardBookingResponse;
import com.tatya.dto.VendorDashboardChartResponse;
import com.tatya.dto.VendorDashboardDaySummaryResponse;
import com.tatya.dto.VendorDashboardStatsResponse;
import com.tatya.service.VendorDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vendors/{vendorId}/dashboard")
@RequiredArgsConstructor
@Slf4j
public class VendorDashboardController {

    private final VendorDashboardService dashboardService;

    /**
     * Get dashboard stats: earnings, rating, jobs completed, success rate.
     * GET /api/vendors/{vendorId}/dashboard/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<VendorDashboardStatsResponse>> getStats(@PathVariable Long vendorId) {
        try {
            VendorDashboardStatsResponse stats = dashboardService.getStats(vendorId);
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
        } catch (RuntimeException e) {
            log.error("Error fetching dashboard stats for vendor {}", vendorId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get chart data for performance graph.
     * GET /api/vendors/{vendorId}/dashboard/chart?period=week|month|year
     */
    @GetMapping("/chart")
    public ResponseEntity<ApiResponse<VendorDashboardChartResponse>> getChart(
            @PathVariable Long vendorId,
            @RequestParam(defaultValue = "week") String period) {
        try {
            VendorDashboardChartResponse chart = dashboardService.getChartData(vendorId, period);
            return ResponseEntity.ok(ApiResponse.success("Chart data retrieved", chart));
        } catch (RuntimeException e) {
            log.error("Error fetching chart data for vendor {}", vendorId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get bookings for a given date (schedule).
     * GET /api/vendors/{vendorId}/dashboard/bookings?date=2024-03-15
     */
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<VendorDashboardBookingResponse>>> getBookings(
            @PathVariable Long vendorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<VendorDashboardBookingResponse> bookings = dashboardService.getBookings(vendorId, date);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
        } catch (RuntimeException e) {
            log.error("Error fetching bookings for vendor {}", vendorId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get day summary: acres planned, completed, remaining, progress.
     * GET /api/vendors/{vendorId}/dashboard/day-summary?date=2024-03-15
     */
    @GetMapping("/day-summary")
    public ResponseEntity<ApiResponse<VendorDashboardDaySummaryResponse>> getDaySummary(
            @PathVariable Long vendorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            VendorDashboardDaySummaryResponse summary = dashboardService.getDaySummary(vendorId, date);
            return ResponseEntity.ok(ApiResponse.success("Day summary retrieved", summary));
        } catch (RuntimeException e) {
            log.error("Error fetching day summary for vendor {}", vendorId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }
}
