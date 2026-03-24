package com.tatya.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate BCrypt password hashes
 * Run this main method to generate a hash for your password
 */
public class PasswordHashGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hash for "admin123"
        String password = "admin123";
        String hash = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("\nUse this hash in your SQL UPDATE statement:");
        System.out.println("UPDATE users SET password_hash = '" + hash + "' WHERE email = 'admin@tatya.com' AND role = 'ADMIN';");
        
        // Verify the hash works
        boolean matches = encoder.matches(password, hash);
        System.out.println("\nVerification: Password matches hash = " + matches);
    }
}
