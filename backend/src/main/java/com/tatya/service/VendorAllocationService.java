package com.tatya.service;

import com.tatya.entity.Assignment;
import com.tatya.entity.Cluster;
import com.tatya.entity.Vendor;
import com.tatya.repository.AssignmentRepository; // Need to create this too!
import com.tatya.repository.ClusterRepository;
import com.tatya.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorAllocationService {

    private final ClusterRepository clusterRepository;
    private final VendorRepository vendorRepository;
    private final AssignmentRepository assignmentRepository;

    private static final double MAX_VENDOR_DISTANCE_KM = 50.0;
    private static final double EARTH_R_KM = 6371.0;

    /**
     * Allocates vendors to pending clusters.
     */
    @Transactional
    public void allocateVendors() {
        // 1. Find all PENDING clusters
        List<Cluster> pendingClusters = clusterRepository.findByStatus(Cluster.ClusterStatus.PENDING);

        for (Cluster cluster : pendingClusters) {
            // Optimization: Find best vendor within range (Bounding Box Check in DB)
            Vendor bestVendor = findBestVendorOptimized(cluster);

            if (bestVendor != null) {
                // Assign
                cluster.setVendor(bestVendor);
                cluster.setStatus(Cluster.ClusterStatus.ACTIVE);
                clusterRepository.save(cluster);

                // Create Assignment Record
                Assignment assignment = new Assignment();
                assignment.setCluster(cluster);
                assignment.setVendor(bestVendor);
                // Simple placeholder slot
                assignment.setScheduledTimeSlot("09:00 AM - 05:00 PM");
                assignmentRepository.save(assignment);
            }
        }
    }

    private Vendor findBestVendorOptimized(Cluster cluster) {
        if (cluster.getCenterLatitude() == null || cluster.getCenterLongitude() == null) {
            // Fallback if center not set (e.g. manually created cluster without farms)
            if (cluster.getFarms().isEmpty())
                return null;
            var farm = cluster.getFarms().iterator().next();
            // Just use farm location as temp center
            return findBestVendorNear(
                    farm.getLatitude().doubleValue(),
                    farm.getLongitude().doubleValue());
        }
        return findBestVendorNear(
                cluster.getCenterLatitude().doubleValue(),
                cluster.getCenterLongitude().doubleValue());
    }

    private Vendor findBestVendorNear(double lat, double lon) {
        // Calculate Bounding Box for ~50km
        // 1 deg lat ~= 111km
        double latRange = MAX_VENDOR_DISTANCE_KM / 111.0;
        // 1 deg lon = 111km * cos(lat)
        double lonRange = MAX_VENDOR_DISTANCE_KM / (111.0 * Math.cos(Math.toRadians(lat)));

        BigDecimal minLat = BigDecimal.valueOf(lat - latRange);
        BigDecimal maxLat = BigDecimal.valueOf(lat + latRange);
        BigDecimal minLon = BigDecimal.valueOf(lon - lonRange);
        BigDecimal maxLon = BigDecimal.valueOf(lon + lonRange);

        // Fetch only candidates in box
        // Fetch only candidates in box
        List<Vendor> candidates = vendorRepository.findByLatitudeBetweenAndLongitudeBetween(minLat, maxLat, minLon,
                maxLon);

        Vendor best = null;
        double minDistance = MAX_VENDOR_DISTANCE_KM;

        for (Vendor vendor : candidates) {
            if (vendor.getLatitude() != null && vendor.getLongitude() != null) {
                double dist = haversineKm(lat, lon, vendor.getLatitude().doubleValue(),
                        vendor.getLongitude().doubleValue());
                if (dist < minDistance) {
                    minDistance = dist;
                    best = vendor;
                }
            }
        }
        return best;
    }

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_R_KM * c;
    }
}
