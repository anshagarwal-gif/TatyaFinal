package com.tatya.repository;

import com.tatya.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    // Basic finding logic. Real geo-queries would need Spatial extensions or
    // Haversine SQL.
    // For now, fetch all and filter in memory, or add a custom query if needed.
    // Assuming simple demo: find all active vendors.

    // Optimized: Find vendors within a loose bounding box (approx range) to avoid
    // loading ALL vendors.
    // This uses database indices (if available on lat/long) and significantly
    // reduces memory usage.
    List<Vendor> findByLatitudeBetweenAndLongitudeBetween(
            java.math.BigDecimal minLat, java.math.BigDecimal maxLat,
            java.math.BigDecimal minLon, java.math.BigDecimal maxLon);
}
