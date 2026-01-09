package com.tatya.repository;

import com.tatya.entity.DroneSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DroneSpecificationRepository extends JpaRepository<DroneSpecification, Long> {
    
    List<DroneSpecification> findByDrone_DroneId(Long droneId);
    
    List<DroneSpecification> findByIsAvailableTrue();
    
    Optional<DroneSpecification> findByDrone_DroneIdAndOptionSet(Long droneId, Integer optionSet);
    
    List<DroneSpecification> findByDrone_DroneIdAndIsAvailableTrue(Long droneId);
}





