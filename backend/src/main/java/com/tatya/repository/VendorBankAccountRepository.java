package com.tatya.repository;

import com.tatya.entity.VendorBankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorBankAccountRepository extends JpaRepository<VendorBankAccount, Long> {
    Optional<VendorBankAccount> findByVendor_VendorIdAndIsActiveTrue(Long vendorId);
}
