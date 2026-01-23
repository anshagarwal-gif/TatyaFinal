package com.tatya.controller;

import com.tatya.entity.User;
import com.tatya.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Temporary test controller to debug admin login issues
 * Remove this after fixing the login issue
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PasswordTestController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/check-admin-password")
    public ResponseEntity<Map<String, Object>> checkAdminPassword(@RequestParam String email, @RequestParam String password) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
            
            if (userOpt.isEmpty()) {
                result.put("error", "User not found");
                result.put("found", false);
                return ResponseEntity.ok(result);
            }
            
            User user = userOpt.get();
            result.put("found", true);
            result.put("email", user.getEmail());
            result.put("role", user.getRole().name());
            result.put("status", user.getStatus().name());
            result.put("hasPasswordHash", user.getPasswordHash() != null);
            
            if (user.getPasswordHash() != null) {
                result.put("hashLength", user.getPasswordHash().length());
                result.put("hashPrefix", user.getPasswordHash().substring(0, Math.min(30, user.getPasswordHash().length())));
                
                boolean matches = passwordEncoder.matches(password, user.getPasswordHash());
                result.put("passwordMatches", matches);
                
                if (!matches) {
                    result.put("message", "Password does NOT match the stored hash");
                } else {
                    result.put("message", "Password matches successfully!");
                }
            } else {
                result.put("passwordMatches", false);
                result.put("message", "No password hash stored");
            }
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
            log.error("Error checking password", e);
        }
        
        return ResponseEntity.ok(result);
    }
}
