package com.tatya.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitForApprovalRequest {
    @NotNull(message = "Vendor ID is required")
    private Long vendorId;
}
