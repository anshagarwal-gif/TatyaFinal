package com.tatya.service;

import com.tatya.entity.Availability;
import com.tatya.repository.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvailabilityService {
    
    private final AvailabilityRepository availabilityRepository;
    
    public List<Availability> getAvailabilitiesByDroneId(Long droneId) {
        return availabilityRepository.findByDrone_DroneId(droneId);
    }
    
    public List<Availability> getAvailableSlotsByDroneId(Long droneId) {
        return availabilityRepository.findByDrone_DroneIdAndIsBookedFalse(droneId);
    }
    
    public List<LocalDate> getAvailableDatesByDroneId(Long droneId) {
        LocalDate today = LocalDate.now();
        return availabilityRepository.findAvailableDatesByDroneId(droneId, today);
    }
    
    public List<Availability> getAvailableSlotsByDroneIdAndDate(Long droneId, LocalDate date) {
        return availabilityRepository.findAvailableSlotsByDroneIdAndDate(droneId, date);
    }
}



