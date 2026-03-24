package com.tatya.exception;

/**
 * Thrown when a vendor tries to access vendor-only features before admin approval.
 */
public class VendorKycPendingException extends RuntimeException {
    public VendorKycPendingException(String message) {
        super(message);
    }
}

