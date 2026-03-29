package com.tatya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorPasswordSetupStatusResponse {
    private boolean valid;
    /** Masked email when valid, e.g. a***@gmail.com */
    private String emailHint;
}
