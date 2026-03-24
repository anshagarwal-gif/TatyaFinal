package com.tatya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    private Long totalOrders;
    private Long activeVendors;
    private Long totalVendors;  // Total vendors regardless of status
    private Long activeUsers;
    private Long totalUsers;  // Total users (customers) regardless of status
    private BigDecimal financeToday;
    private BigDecimal totalCollection;
}
