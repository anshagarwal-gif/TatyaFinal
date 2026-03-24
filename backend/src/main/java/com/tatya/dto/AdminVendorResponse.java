package com.tatya.dto;

import com.tatya.entity.Vendor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminVendorResponse {
    private Long vendorId;
    private String name;
    private String business;
    private String email;
    private String phone;
    private String contact;
    private String status;
    private String approval;
    private BigDecimal ratingAvg;
    private LocalDateTime createdAt;
    private Long totalDrones;
    private Long totalBookings;
    
    public static AdminVendorResponse fromVendor(Vendor vendor, Long totalDrones, Long totalBookings) {
        if (vendor == null || vendor.getUser() == null) {
            throw new IllegalArgumentException("Vendor or vendor user cannot be null");
        }
        
        AdminVendorResponse response = new AdminVendorResponse();
        response.setVendorId(vendor.getVendorId());
        response.setName(vendor.getUser().getFullName());
        response.setBusiness(vendor.getUser().getFullName() + " Services"); // Can be enhanced with business name field
        response.setEmail(vendor.getUser().getEmail());
        response.setPhone(vendor.getUser().getPhone());
        response.setContact(vendor.getUser().getPhone());
        response.setStatus(vendor.getUser().getStatus() != null ? vendor.getUser().getStatus().name() : "UNKNOWN");
        response.setApproval(vendor.getVerifiedStatus() != null ? vendor.getVerifiedStatus().name() : "UNKNOWN");
        response.setRatingAvg(vendor.getRatingAvg());
        response.setCreatedAt(vendor.getUser().getCreatedAt());
        response.setTotalDrones(totalDrones != null ? totalDrones : 0L);
        response.setTotalBookings(totalBookings != null ? totalBookings : 0L);
        return response;
    }
}
