package com.tatya.service;

import com.tatya.entity.Drone;
import com.tatya.entity.User;
import com.tatya.entity.Vendor;
import com.tatya.repository.DroneRepository;
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
    
    private final DroneRepository droneRepository;
    
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
        return droneRepository.findByVendor_VendorId(vendorId);
    }
    
    public List<Drone> getAllDronesWithSpecifications() {
        return droneRepository.findAllWithSpecifications();
    }
    
    public List<Drone> getAvailableDronesWithSpecifications() {
        // Fetch drones with ACTIVE pilot status and VERIFIED vendor status
        List<Drone> drones = droneRepository.findByStatusWithSpecifications(
            Drone.DroneStatus.AVAILABLE, 
            User.UserStatus.ACTIVE,
            Vendor.VerifiedStatus.VERIFIED
        );
        
        // Additional safety filter: ensure vendor and user exist, user is active, and vendor is verified
        List<Drone> filteredDrones = drones.stream()
            .filter(drone -> drone != null 
                && drone.getVendor() != null 
                && drone.getVendor().getUser() != null
                && drone.getVendor().getUser().getStatus() == User.UserStatus.ACTIVE
                && drone.getVendor().getVerifiedStatus() == Vendor.VerifiedStatus.VERIFIED)
            .collect(Collectors.toList());
        
        log.info("Found {} available drones with verified and active pilots (filtered from {} total)", 
            filteredDrones.size(), drones.size());
        
        return filteredDrones;
    }
    
    public Optional<Drone> getDroneWithSpecifications(Long droneId) {
        return droneRepository.findByIdWithSpecifications(droneId);
    }
}

