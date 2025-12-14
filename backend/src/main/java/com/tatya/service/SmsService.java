package com.tatya.service;

public interface SmsService {
    boolean sendOtp(String phoneNumber, String otpCode);
}

