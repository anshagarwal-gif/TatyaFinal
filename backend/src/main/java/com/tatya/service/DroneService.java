package com.tatya.service;

import com.tatya.entity.Drone;
import com.tatya.repository.DroneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        return droneRepository.findByStatusWithSpecifications(Drone.DroneStatus.AVAILABLE);
    }
    
    public Optional<Drone> getDroneWithSpecifications(Long droneId) {
        return droneRepository.findByIdWithSpecifications(droneId);
    }
}

