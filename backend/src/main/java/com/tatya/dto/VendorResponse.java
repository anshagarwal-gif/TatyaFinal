package com.tatya.dto;

import com.tatya.entity.User;
import com.tatya.entity.Vendor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {
    private Long vendorId;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String vendorType;
    private Vendor.VerifiedStatus verifiedStatus;
    private User.UserStatus userStatus;
    
    public static VendorResponse fromVendor(Vendor vendor) {
        if (vendor == null || vendor.getUser() == null) {
            return null;
        }
        
        VendorResponse response = new VendorResponse();
        response.setVendorId(vendor.getVendorId());
        response.setUserId(vendor.getUser().getId());
        response.setFullName(vendor.getUser().getFullName());
        response.setEmail(vendor.getUser().getEmail());
        response.setPhone(vendor.getUser().getPhone());
        response.setVerifiedStatus(vendor.getVerifiedStatus());
        response.setUserStatus(vendor.getUser().getStatus());
        
        return response;
    }
}
