package com.tatya.service;

import com.tatya.entity.DroneSpecification;
import com.tatya.repository.DroneSpecificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DroneSpecificationService {
    
    private final DroneSpecificationRepository specificationRepository;
    
    public List<DroneSpecification> getAllSpecifications() {
        return specificationRepository.findAll();
    }
    
    public List<DroneSpecification> getSpecificationsByDroneId(Long droneId) {
        return specificationRepository.findByDrone_DroneId(droneId);
    }
    
    public List<DroneSpecification> getAvailableSpecifications() {
        return specificationRepository.findByIsAvailableTrue();
    }
    
    public List<DroneSpecification> getAvailableSpecificationsByDroneId(Long droneId) {
        return specificationRepository.findByDrone_DroneIdAndIsAvailableTrue(droneId);
    }
    
    public Optional<DroneSpecification> getSpecificationByDroneAndOptionSet(Long droneId, Integer optionSet) {
        return specificationRepository.findByDrone_DroneIdAndOptionSet(droneId, optionSet);
    }
    
    @Transactional
    public DroneSpecification saveSpecification(DroneSpecification specification) {
        return specificationRepository.save(specification);
    }
}

