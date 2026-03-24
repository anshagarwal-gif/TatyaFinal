package com.tatya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminLoginResponse {
    private Long adminId;
    private String email;
    private String fullName;
    private String token; // For future JWT implementation
}
