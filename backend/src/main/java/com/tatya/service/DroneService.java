package com.tatya.service;

import com.tatya.entity.Drone;
import com.tatya.entity.User;
import com.tatya.entity.Vendor;
import com.tatya.exception.VendorKycPendingException;
import com.tatya.exception.VendorRejectedException;
import com.tatya.repository.DroneRepository;
import com.tatya.repository.VendorRepository;
import com.tatya.util.GeoUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DroneService {

    /** Used when {@link Drone#getServiceRadiusKm()} is missing but base coordinates exist. */
    private static final double DEFAULT_SERVICE_RADIUS_KM = 50.0;

    private final DroneRepository droneRepository;
    private final VendorRepository vendorRepository;
    
    public List<Drone> getAllDrones() {
        return droneRepository.findAll();
    }
    
    public List<Drone> getAvailableDrones() {
        return droneRepository.findByStatus(Drone.DroneStatus.AVAILABLE);
    }
    
    public Optional<Drone> getDroneById(Long droneId) {
        return droneRepository.findById(droneId);
    }
    
    public List<Drone> getDronesByVendorId(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));
        if (vendor.getVerifiedStatus() == Vendor.VerifiedStatus.REJECTED) {
            throw new VendorRejectedException("Your KYC was rejected. Please contact support.");
        }
        if (vendor.getVerifiedStatus() != Vendor.VerifiedStatus.VERIFIED) {
            throw new VendorKycPendingException("KYC under processing. Please wait for admin approval.");
        }
        return droneRepository.findByVendor_VendorId(vendorId);
    }
    
    public List<Drone> getAllDronesWithSpecifications() {
        return droneRepository.findAllWithSpecifications();
    }
    
    public List<Drone> getAvailableDronesWithSpecifications() {
        return getAvailableDronesWithSpecifications(null, null);
    }

    /**
     * When customerLat/customerLng are set, only drones whose base point (vendor lat/lng, or else
     * {@link Drone#getCoordinates()} as "lat,lng") is within {@link Drone#getServiceRadiusKm()} km are returned.
     */
    public List<Drone> getAvailableDronesWithSpecifications(Double customerLat, Double customerLng) {
        List<Drone> drones = droneRepository.findByStatusWithSpecifications(
            Drone.DroneStatus.AVAILABLE,
            User.UserStatus.ACTIVE,
            Vendor.VerifiedStatus.VERIFIED
        );

        List<Drone> filteredDrones = drones.stream()
            .filter(drone -> drone != null
                && drone.getVendor() != null
                && drone.getVendor().getUser() != null
                && drone.getVendor().getUser().getStatus() == User.UserStatus.ACTIVE
                && drone.getVendor().getVerifiedStatus() == Vendor.VerifiedStatus.VERIFIED)
            .collect(Collectors.toList());

        if (customerLat != null && customerLng != null) {
            int before = filteredDrones.size();
            filteredDrones = filteredDrones.stream()
                .filter(d -> isWithinVendorServiceRadius(d, customerLat, customerLng))
                .collect(Collectors.toList());
            log.info("Location filter: {} drones within vendor service radius (from {} candidates)",
                filteredDrones.size(), before);
        }

        log.info("Found {} available drones with verified and active pilots (filtered from {} total)",
            filteredDrones.size(), drones.size());

        return filteredDrones;
    }

    private static boolean isWithinVendorServiceRadius(Drone drone, double customerLat, double customerLng) {
        Optional<double[]> base = resolveServiceBaseLatLng(drone);
        if (base.isEmpty()) {
            return false;
        }
        double vendorLat = base.get()[0];
        double vendorLng = base.get()[1];
        Double radiusKm = drone.getServiceRadiusKm();
        double effectiveRadius = (radiusKm != null && radiusKm > 0) ? radiusKm : DEFAULT_SERVICE_RADIUS_KM;
        double distKm = haversineKm(customerLat, customerLng, vendorLat, vendorLng);
        return distKm <= effectiveRadius + 1e-9;
    }

    /**
     * Prefer {@link Vendor} table coords; otherwise onboarding/profile store base as {@link Drone#getCoordinates()}.
     */
    private static Optional<double[]> resolveServiceBaseLatLng(Drone drone) {
        Vendor v = drone.getVendor();
        if (v.getLatitude() != null && v.getLongitude() != null) {
            return Optional.of(new double[] {
                v.getLatitude().doubleValue(),
                v.getLongitude().doubleValue()
            });
        }
        return GeoUtils.parseLatLngCommaSeparated(drone.getCoordinates());
    }

    /** Great-circle distance on Earth (WGS84 mean radius), in kilometers. */
    private static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double earthRadiusKm = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
            * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }
    
    public Optional<Drone> getDroneWithSpecifications(Long droneId) {
        return droneRepository.findByIdWithSpecifications(droneId);
    }
}

