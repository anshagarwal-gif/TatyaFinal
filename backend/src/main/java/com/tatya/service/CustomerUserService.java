package com.tatya.service;

import com.tatya.entity.User;
import com.tatya.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * Ensures a {@link User} row exists for customer OTP login so bookings can reference a real customer ID.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Long ensureCustomerIdForPhone(String phoneNumber) {
        String phone = phoneNumber != null ? phoneNumber.trim() : "";
        if (phone.length() != 10 || !phone.chars().allMatch(Character::isDigit)) {
            throw new IllegalArgumentException("Phone number must be 10 digits");
        }

        Optional<User> existing = userRepository.findByPhone(phone);
        if (existing.isPresent()) {
            User u = existing.get();
            if (u.getRole() == User.UserRole.CUSTOMER) {
                return u.getId();
            }
            if (u.getRole() == User.UserRole.VENDOR) {
                throw new RuntimeException(
                        "This mobile number is registered as a vendor. Please use vendor login.");
            }
            throw new RuntimeException("This mobile number cannot be used for customer login.");
        }

        User user = new User();
        user.setFullName("Customer");
        user.setPhone(phone);
        user.setEmail("cust." + phone + "@customers.tatya");
        user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole(User.UserRole.CUSTOMER);
        user.setStatus(User.UserStatus.ACTIVE);

        user = userRepository.save(user);
        log.info("Created customer user id={} for phone ***{}", user.getId(), phone.substring(6));
        return user.getId();
    }
}
