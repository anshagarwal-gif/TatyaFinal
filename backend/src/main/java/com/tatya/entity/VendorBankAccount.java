package com.tatya.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_bank_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorBankAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bank_account_id")
    private Long bankAccountId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;
    
    @Column(name = "account_holder_name", nullable = false)
    private String accountHolderName;
    
    @Column(name = "account_number", nullable = false)
    private String accountNumber;
    
    @Column(name = "bank_ifsc_code", nullable = false, length = 11)
    private String bankIfscCode;
    
    @Column(name = "bank_name")
    private String bankName;
    
    @Column(name = "upi_id")
    private String upiId;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
