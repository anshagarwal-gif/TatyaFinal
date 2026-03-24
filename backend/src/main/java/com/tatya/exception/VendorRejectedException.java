package com.tatya.exception;

/**
 * Thrown when a vendor account was rejected by admin.
 */
public class VendorRejectedException extends RuntimeException {
    public VendorRejectedException(String message) {
        super(message);
    }
}

