package com.tatya.repository;

import com.tatya.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    Optional<Vendor> findByUser_Phone(String phone);
    
    Optional<Vendor> findByUser_Email(String email);
    
    Optional<Vendor> findByUser_Id(Long userId);
    
    boolean existsByUser_Phone(String phone);
    
    boolean existsByUser_Email(String email);
}
