package com.tatya.service;

import com.tatya.dto.*;
import com.tatya.entity.*;
import com.tatya.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final DroneRepository droneRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Admin login authentication
     */
    public AdminLoginResponse login(AdminLoginRequest request) {
        log.info("Admin login attempt for email: {}", request.getEmail());
        
        // Trim whitespace from email and password
        String email = request.getEmail() != null ? request.getEmail().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";
        
        log.debug("Trimmed email: '{}', password length: {}", email, password.length());
        
        // Use case-insensitive email lookup
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        
        // Check if user exists
        if (userOpt.isEmpty()) {
            log.warn("Login attempt with non-existent email: {}", email);
            throw new RuntimeException("Invalid email or password");
        }
        
        User user = userOpt.get();
        log.debug("User found: ID={}, Email={}, Role={}, Status={}", 
                user.getId(), user.getEmail(), user.getRole(), user.getStatus());
        
        // Check if user is an admin
        if (user.getRole() != User.UserRole.ADMIN) {
            log.warn("Login attempt with non-admin email: {} (role: {})", email, user.getRole());
            throw new RuntimeException("Invalid email or password");
        }
        
        // Check if password hash exists
        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            log.error("Admin user {} has no password hash stored!", email);
            throw new RuntimeException("Admin account configuration error. Please contact support.");
        }
        
        // Verify password
        boolean passwordMatches = passwordEncoder.matches(password, user.getPasswordHash());
        log.info("Password match result for {}: {} (hash prefix: {})", 
                email, passwordMatches, user.getPasswordHash().substring(0, Math.min(20, user.getPasswordHash().length())));
        
        if (!passwordMatches) {
            log.warn("Invalid password attempt for admin email: {} (entered password length: {}, stored hash length: {})", 
                    email, password.length(), user.getPasswordHash().length());
            throw new RuntimeException("Invalid email or password");
        }
        
        // Check if admin is active
        if (user.getStatus() != User.UserStatus.ACTIVE) {
            log.warn("Login attempt for inactive admin account: {} (status: {})", 
                    email, user.getStatus());
            throw new RuntimeException("Admin account is not active. Please contact support.");
        }
        
        AdminLoginResponse response = new AdminLoginResponse();
        response.setAdminId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setToken("admin-token"); // Placeholder for future JWT implementation
        
        log.info("Admin login successful for: {}", email);
        return response;
    }

    /**
     * Get dashboard statistics
     */
    public AdminDashboardStats getDashboardStats() {
        log.info("Fetching admin dashboard statistics");
        
        // Total orders (bookings)
        Long totalOrders = bookingRepository.count();
        
        // Total vendors (all vendors in the database)
        Long totalVendorsCount = vendorRepository.count();
        
        // Active vendors (verified and active users) - with null safety
        Long activeVendors = vendorRepository.findAll().stream()
                .filter(v -> v != null 
                        && v.getUser() != null 
                        && v.getVerifiedStatus() == Vendor.VerifiedStatus.VERIFIED 
                        && v.getUser().getStatus() == User.UserStatus.ACTIVE)
                .count();
        
        // Debug logging for vendors
        long verifiedVendors = vendorRepository.findAll().stream()
                .filter(v -> v != null && v.getVerifiedStatus() == Vendor.VerifiedStatus.VERIFIED)
                .count();
        long pendingVendors = vendorRepository.findAll().stream()
                .filter(v -> v != null && v.getVerifiedStatus() == Vendor.VerifiedStatus.PENDING)
                .count();
        long rejectedVendors = vendorRepository.findAll().stream()
                .filter(v -> v != null && v.getVerifiedStatus() == Vendor.VerifiedStatus.REJECTED)
                .count();
        long vendorsWithNullUser = vendorRepository.findAll().stream()
                .filter(v -> v != null && v.getUser() == null)
                .count();
        
        log.info("Vendor counts - Total: {}, Verified: {}, Pending: {}, Rejected: {}, Active (Verified+Active): {}, With Null User: {}", 
                totalVendorsCount, verifiedVendors, pendingVendors, rejectedVendors, activeVendors, vendorsWithNullUser);
        
        // Active users (customers)
        Long activeUsers = (long) userRepository.findByRoleAndStatus(
                User.UserRole.CUSTOMER, User.UserStatus.ACTIVE).size();
        
        // Total users (all customers regardless of status)
        // Count all users including admins, vendors, and customers
        Long totalUsers = userRepository.count();
        
        // Debug logging
        long totalCustomers = userRepository.countByRole(User.UserRole.CUSTOMER);
        long totalVendorUsers = userRepository.countByRole(User.UserRole.VENDOR);
        long totalAdmins = userRepository.countByRole(User.UserRole.ADMIN);
        long totalNonAdminUsers = userRepository.countAllNonAdminUsers();
        long totalAllUsers = userRepository.count();
        
        log.info("User counts - Customers: {}, Vendor Users: {}, Admins: {}, Non-Admin: {}, Total (All Users): {}", 
                totalCustomers, totalVendorUsers, totalAdmins, totalNonAdminUsers, totalAllUsers);
        
        // Finance today
        LocalDate today = LocalDate.now();
        BigDecimal financeToday = paymentRepository.findAll().stream()
                .filter(p -> p.getTimestamp().toLocalDate().equals(today) 
                        && p.getPaymentStatus() == Payment.PaymentStatus.PAID)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Total collection
        BigDecimal totalCollection = paymentRepository.findAll().stream()
                .filter(p -> p.getPaymentStatus() == Payment.PaymentStatus.PAID)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        AdminDashboardStats stats = new AdminDashboardStats();
        stats.setTotalOrders(totalOrders);
        stats.setActiveVendors(activeVendors);
        stats.setTotalVendors(totalVendorsCount);
        stats.setActiveUsers(activeUsers);
        stats.setTotalUsers(totalUsers);
        stats.setFinanceToday(financeToday != null ? financeToday : BigDecimal.ZERO);
        stats.setTotalCollection(totalCollection != null ? totalCollection : BigDecimal.ZERO);
        
        return stats;
    }

    /**
     * Get all vendors with details
     */
    public List<AdminVendorResponse> getAllVendors() {
        log.info("Fetching all vendors for admin");
        
        List<Vendor> vendors = vendorRepository.findAll();
        
        return vendors.stream()
                .filter(vendor -> vendor != null && vendor.getUser() != null)
                .map(vendor -> {
                    try {
                        Long totalDrones = droneRepository.countByVendor_VendorId(vendor.getVendorId());
                        Long totalBookings = (long) bookingRepository.findByVendor_VendorId(vendor.getVendorId()).size();
                        return AdminVendorResponse.fromVendor(vendor, totalDrones, totalBookings);
                    } catch (Exception e) {
                        log.error("Error processing vendor {}: {}", vendor.getVendorId(), e.getMessage());
                        return null;
                    }
                })
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    /**
     * Get all vendors for approval/rejection (includes pending, verified, and rejected)
     * This method returns all vendors so admins can see their approval status
     */
    public List<AdminVendorResponse> getPendingVendors() {
        log.info("Fetching all vendors for approval/rejection page");
        
        // Return all vendors (not just pending) so admins can see all statuses
        List<Vendor> allVendors = vendorRepository.findAll();
        
        return allVendors.stream()
                .filter(v -> v != null && v.getUser() != null)
                .map(vendor -> {
                    try {
                        Long totalDrones = droneRepository.countByVendor_VendorId(vendor.getVendorId());
                        Long totalBookings = (long) bookingRepository.findByVendor_VendorId(vendor.getVendorId()).size();
                        return AdminVendorResponse.fromVendor(vendor, totalDrones, totalBookings);
                    } catch (Exception e) {
                        log.error("Error processing vendor {}: {}", vendor.getVendorId(), e.getMessage());
                        return null;
                    }
                })
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    /**
     * Approve or reject a vendor
     */
    @Transactional
    public void approveOrRejectVendor(VendorApprovalRequest request) {
        log.info("Processing vendor approval/rejection for vendor ID: {}", request.getVendorId());
        
        Optional<Vendor> vendorOpt = vendorRepository.findById(request.getVendorId());
        
        if (vendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found");
        }
        
        Vendor vendor = vendorOpt.get();
        vendor.setVerifiedStatus(request.getAction());
        
        // If approved, ensure user is active
        if (request.getAction() == Vendor.VerifiedStatus.VERIFIED) {
            vendor.getUser().setStatus(User.UserStatus.ACTIVE);
        }
        
        vendorRepository.save(vendor);
        log.info("Vendor {} status updated to: {}", request.getVendorId(), request.getAction());
    }

    /**
     * Deactivate a vendor
     */
    @Transactional
    public void deactivateVendor(Long vendorId) {
        log.info("Deactivating vendor ID: {}", vendorId);
        
        Optional<Vendor> vendorOpt = vendorRepository.findById(vendorId);
        
        if (vendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found");
        }
        
        Vendor vendor = vendorOpt.get();
        vendor.getUser().setStatus(User.UserStatus.INACTIVE);
        vendorRepository.save(vendor);
        
        log.info("Vendor {} deactivated successfully", vendorId);
    }

    /**
     * Reactivate a vendor
     */
    @Transactional
    public void reactivateVendor(Long vendorId) {
        log.info("Reactivating vendor ID: {}", vendorId);
        
        Optional<Vendor> vendorOpt = vendorRepository.findById(vendorId);
        
        if (vendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found");
        }
        
        Vendor vendor = vendorOpt.get();
        vendor.getUser().setStatus(User.UserStatus.ACTIVE);
        vendorRepository.save(vendor);
        
        log.info("Vendor {} reactivated successfully", vendorId);
    }

    /**
     * Get vendor details by ID
     */
    public AdminVendorResponse getVendorDetails(Long vendorId) {
        log.info("Fetching vendor details for ID: {}", vendorId);
        
        Optional<Vendor> vendorOpt = vendorRepository.findById(vendorId);
        
        if (vendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found");
        }
        
        Vendor vendor = vendorOpt.get();
        Long totalDrones = droneRepository.countByVendor_VendorId(vendorId);
        Long totalBookings = (long) bookingRepository.findByVendor_VendorId(vendorId).size();
        
        return AdminVendorResponse.fromVendor(vendor, totalDrones, totalBookings);
    }

    /**
     * Get all users (customers and vendors, excluding admins)
     */
    public List<AdminUserResponse> getAllUsers() {
        log.info("Fetching all users for admin");
        
        // Get all users except admins
        List<User> allUsers = userRepository.findAll();
        
        List<AdminUserResponse> users = allUsers.stream()
                .filter(user -> user != null && user.getRole() != User.UserRole.ADMIN)
                .map(user -> {
                    AdminUserResponse response = AdminUserResponse.fromUser(user);
                    
                    // Fetch latest OTP for this user's phone number
                    try {
                        Optional<Otp> latestOtp = otpRepository.findTopByPhoneNumberOrderByCreatedAtDesc(user.getPhone());
                        if (latestOtp.isPresent()) {
                            response.setOtp(latestOtp.get().getOtpCode());
                        } else {
                            response.setOtp(null);
                        }
                    } catch (Exception e) {
                        log.debug("Could not fetch OTP for user {}: {}", user.getId(), e.getMessage());
                        response.setOtp(null);
                    }
                    
                    // Location is not directly stored in User entity, set to null
                    response.setLocation(null);
                    
                    return response;
                })
                .collect(Collectors.toList());
        
        log.info("Fetched {} users (excluding {} admins) out of {} total users", 
                users.size(), 
                allUsers.stream().filter(u -> u.getRole() == User.UserRole.ADMIN).count(),
                allUsers.size());
        
        return users;
    }

    /**
     * Delete a user
     */
    @Transactional
    public void deleteUser(Long userId) {
        log.info("Deleting user ID: {}", userId);
        
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        
        // Prevent deleting admin users
        if (user.getRole() == User.UserRole.ADMIN) {
            throw new RuntimeException("Cannot delete admin user");
        }
        
        userRepository.delete(user);
        log.info("User {} deleted successfully", userId);
    }

    /**
     * Get user details by ID
     */
    public AdminUserResponse getUserDetails(Long userId) {
        log.info("Fetching user details for ID: {}", userId);
        
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        return AdminUserResponse.fromUser(userOpt.get());
    }

    /**
     * Get finance statistics
     */
    public AdminDashboardStats getFinanceStats() {
        log.info("Fetching finance statistics");
        
        Long totalOrders = bookingRepository.count();
        
        BigDecimal totalCollection = paymentRepository.findAll().stream()
                .filter(p -> p.getPaymentStatus() == Payment.PaymentStatus.PAID)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        AdminDashboardStats stats = new AdminDashboardStats();
        stats.setTotalOrders(totalOrders);
        stats.setTotalCollection(totalCollection != null ? totalCollection : BigDecimal.ZERO);
        
        return stats;
    }
}
