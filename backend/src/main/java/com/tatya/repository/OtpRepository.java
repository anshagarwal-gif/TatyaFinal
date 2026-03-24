package com.tatya.repository;

import com.tatya.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    Optional<Otp> findByPhoneNumberAndOtpCodeAndIsUsedFalse(String phoneNumber, String otpCode);
    
    Optional<Otp> findTopByPhoneNumberOrderByCreatedAtDesc(String phoneNumber);
    
    @Modifying
    @Query("UPDATE Otp o SET o.isUsed = true WHERE o.phoneNumber = :phoneNumber AND o.isUsed = false")
    void markAllAsUsedByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Modifying
    @Query("DELETE FROM Otp o WHERE o.expiresAt < :now")
    void deleteExpiredOtps(@Param("now") LocalDateTime now);
}






