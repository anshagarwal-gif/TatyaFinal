package com.tatya.dto;

import com.tatya.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String phone;
    private String otp;
    private String location;
    private String status;
    private LocalDateTime createdDate;
    private String createdTime;
    private String email;
    private String fullName;
    private String role;
    
    public static AdminUserResponse fromUser(User user) {
        AdminUserResponse response = new AdminUserResponse();
        response.setId(user.getId());
        response.setPhone(user.getPhone());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setStatus(user.getStatus().name());
        response.setRole(user.getRole().name());
        response.setCreatedDate(user.getCreatedAt().toLocalDate().atStartOfDay());
        response.setCreatedTime(user.getCreatedAt().toLocalTime().toString());
        // OTP and location would need to be fetched from related entities if needed
        return response;
    }
}
