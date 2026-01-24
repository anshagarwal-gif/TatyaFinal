package com.tatya.service;

import com.tatya.dto.UpdateVendorProfileRequest;
import com.tatya.dto.VendorProfileResponse;
import com.tatya.dto.VendorRegistrationRequest;
import com.tatya.dto.VendorResponse;
import com.tatya.exception.VendorKycPendingException;
import com.tatya.exception.VendorRejectedException;
import com.tatya.entity.Availability;
import com.tatya.entity.Drone;
import com.tatya.entity.User;
import com.tatya.entity.Vendor;
import com.tatya.entity.VendorBankAccount;
import com.tatya.repository.AvailabilityRepository;
import com.tatya.repository.DroneRepository;
import com.tatya.repository.UserRepository;
import com.tatya.repository.VendorBankAccountRepository;
import com.tatya.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendorService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final DroneRepository droneRepository;
    private final VendorBankAccountRepository bankAccountRepository;
    private final AvailabilityRepository availabilityRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    private void ensureVendorApproved(Vendor vendor) {
        if (vendor == null) {
            throw new RuntimeException("Vendor not found");
        }
        if (vendor.getVerifiedStatus() == Vendor.VerifiedStatus.REJECTED) {
            throw new VendorRejectedException("Your KYC was rejected. Please contact support.");
        }
        if (vendor.getVerifiedStatus() != Vendor.VerifiedStatus.VERIFIED) {
            throw new VendorKycPendingException("KYC under processing. Please wait for admin approval.");
        }
    }

    /**
     * Register a new vendor - saves vendor data and sends OTP
     * 
     * @param request Vendor registration request
     * @return VendorResponse if successful
     */
    @Transactional
    public VendorResponse registerVendor(VendorRegistrationRequest request) {
        log.info("Registering vendor with phone: {}", request.getPhoneNumber());

        // Check if user already exists
        Optional<User> existingUser = userRepository.findByPhone(request.getPhoneNumber());
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // If user exists and is a vendor, return existing vendor
            if (user.getRole() == User.UserRole.VENDOR) {
                Optional<Vendor> existingVendor = vendorRepository.findByUser_Id(user.getId());
                if (existingVendor.isPresent()) {
                    log.info("Vendor already exists with phone: {}", request.getPhoneNumber());
                    // Still send OTP for login
                    String otpCode = otpService.generateOtp(request.getPhoneNumber());
                    VendorResponse response = VendorResponse.fromVendor(existingVendor.get());
                    response.setOtpCode(otpCode); // Include OTP in response
                    return response;
                }
            } else {
                throw new RuntimeException("User with this phone number already exists with a different role");
            }
        }

        // Check if email is already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new User
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhoneNumber());
        // Generate a random password hash (not used for OTP-based auth, but required by
        // entity)
        String randomPassword = UUID.randomUUID().toString();
        user.setPasswordHash(passwordEncoder.encode(randomPassword));
        user.setRole(User.UserRole.VENDOR);
        user.setStatus(User.UserStatus.ACTIVE);

        user = userRepository.save(user);
        log.info("Created user with ID: {}", user.getId());

        // Create new Vendor
        Vendor vendor = new Vendor();
        vendor.setUser(user);
        vendor.setVerifiedStatus(Vendor.VerifiedStatus.PENDING);
        // Store vendorType in serviceArea temporarily (can be moved to a dedicated
        // field later)
        vendor.setServiceArea(request.getVendorType());

        vendor = vendorRepository.save(vendor);
        log.info("Created vendor with ID: {}", vendor.getVendorId());

        // Send OTP and get the code
        String otpCode = otpService.generateOtp(request.getPhoneNumber());
        log.info("OTP sent to phone: {}", request.getPhoneNumber());

        VendorResponse response = VendorResponse.fromVendor(vendor);
        response.setOtpCode(otpCode); // Include OTP in response for frontend snackbar
        return response;
    }

    /**
     * Verify OTP and login vendor
     * 
     * @param phoneNumber Phone number
     * @param otpCode     OTP code
     * @return VendorResponse if OTP is valid
     */
    @Transactional
    public VendorResponse verifyAndLogin(String phoneNumber, String otpCode) {
        log.info("Verifying OTP for vendor login with phone: {}", phoneNumber);

        // Verify OTP
        boolean isValid = otpService.verifyOtp(phoneNumber, otpCode);
        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // Find vendor by phone
        Optional<Vendor> vendorOptional = vendorRepository.findByUser_Phone(phoneNumber);
        if (vendorOptional.isEmpty()) {
            throw new RuntimeException("Vendor not found with phone number: " + phoneNumber);
        }

        Vendor vendor = vendorOptional.get();
        log.info("Vendor login successful for vendor ID: {}", vendor.getVendorId());

        return VendorResponse.fromVendor(vendor);
    }

    /**
     * Vendor login using email + password. Only allowed after admin approval.
     */
    public VendorResponse loginWithPassword(String email, String password) {
        String safeEmail = email != null ? email.trim() : "";
        String safePassword = password != null ? password.trim() : "";

        if (safeEmail.isEmpty() || safePassword.isEmpty()) {
            throw new RuntimeException("Email and password are required");
        }

        User user = userRepository.findByEmailIgnoreCase(safeEmail)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (user.getRole() != User.UserRole.VENDOR) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("Vendor account is not active");
        }

        if (!passwordEncoder.matches(safePassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        Vendor vendor = vendorRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        ensureVendorApproved(vendor);
        return VendorResponse.fromVendor(vendor);
    }

    /**
     * Get vendor by phone number
     * 
     * @param phoneNumber Phone number
     * @return VendorResponse
     */
    public VendorResponse getVendorByPhone(String phoneNumber) {
        Optional<Vendor> vendorOptional = vendorRepository.findByUser_Phone(phoneNumber);
        if (vendorOptional.isEmpty()) {
            throw new RuntimeException("Vendor not found with phone number: " + phoneNumber);
        }
        return VendorResponse.fromVendor(vendorOptional.get());
    }

    /**
     * Get vendor by ID
     * 
     * @param vendorId Vendor ID
     * @return VendorResponse
     */
    public VendorResponse getVendorById(Long vendorId) {
        Optional<Vendor> vendorOptional = vendorRepository.findById(vendorId);
        if (vendorOptional.isEmpty()) {
            throw new RuntimeException("Vendor not found with ID: " + vendorId);
        }
        return VendorResponse.fromVendor(vendorOptional.get());
    }

    /**
     * Get complete vendor profile with drone and bank account information
     * 
     * @param vendorId Vendor ID
     * @return VendorProfileResponse
     */
    public VendorProfileResponse getVendorProfile(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));
        ensureVendorApproved(vendor);

        // Get first drone for this vendor
        Drone drone = droneRepository.findByVendor_VendorId(vendorId)
                .stream()
                .findFirst()
                .orElse(null);

        // Get active bank account
        VendorBankAccount bankAccount = bankAccountRepository
                .findByVendor_VendorIdAndIsActiveTrue(vendorId)
                .orElse(null);

        // Get availability records for the drone
        List<Availability> availabilities = null;
        if (drone != null) {
            availabilities = availabilityRepository.findByDrone_DroneId(drone.getDroneId());
        }

        return VendorProfileResponse.fromVendor(vendor, drone, bankAccount, availabilities);
    }

    /**
     * Update vendor profile
     * 
     * @param vendorId Vendor ID
     * @param request  Update request
     * @return VendorProfileResponse
     */
    @Transactional
    public VendorProfileResponse updateVendorProfile(Long vendorId, UpdateVendorProfileRequest request) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));
        ensureVendorApproved(vendor);

        // Update user information
        User user = vendor.getUser();
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        userRepository.save(user);

        // Get or create drone
        Drone drone = droneRepository.findByVendor_VendorId(vendorId)
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Drone newDrone = new Drone();
                    newDrone.setVendor(vendor);
                    newDrone.setStatus(Drone.DroneStatus.AVAILABLE);
                    return droneRepository.save(newDrone);
                });

        // Update drone information
        if (request.getEquipmentType() != null)
            drone.setEquipmentType(request.getEquipmentType());
        if (request.getBrand() != null)
            drone.setBrand(request.getBrand());
        if (request.getModelName() != null)
            drone.setModelName(request.getModelName());
        if (request.getYearOfMake() != null)
            drone.setYearOfMake(request.getYearOfMake());
        if (request.getSerialNo() != null)
            drone.setSerialNo(request.getSerialNo());
        if (request.getDroneName() != null)
            drone.setDroneName(request.getDroneName());
        if (request.getDroneType() != null)
            drone.setDroneType(request.getDroneType());
        if (request.getTankSizeLiters() != null)
            drone.setTankSizeLiters(request.getTankSizeLiters());
        if (request.getSprayWidthMeters() != null)
            drone.setSprayWidthMeters(request.getSprayWidthMeters());
        if (request.getBatteryCapacityMah() != null)
            drone.setBatteryCapacityMah(request.getBatteryCapacityMah());
        if (request.getBatteryCount() != null)
            drone.setBatteryCount(request.getBatteryCount());
        if (request.getFlightTimeMinutes() != null)
            drone.setFlightTimeMinutes(request.getFlightTimeMinutes());
        if (request.getBatterySwapTimeMinutes() != null)
            drone.setBatterySwapTimeMinutes(request.getBatterySwapTimeMinutes());
        if (request.getUin() != null)
            drone.setUin(request.getUin());
        if (request.getUaop() != null)
            drone.setUaop(request.getUaop());
        if (request.getPilotLicense() != null)
            drone.setPilotLicense(request.getPilotLicense());
        if (request.getReturnToHome() != null)
            drone.setReturnToHome(request.getReturnToHome());
        if (request.getTerrainFollowing() != null)
            drone.setTerrainFollowing(request.getTerrainFollowing());
        if (request.getMaxAcresPerDay() != null)
            drone.setMaxAcresPerDay(request.getMaxAcresPerDay());
        if (request.getMinBookingAcres() != null)
            drone.setMinBookingAcres(request.getMinBookingAcres());
        if (request.getServiceRadiusKm() != null)
            drone.setServiceRadiusKm(request.getServiceRadiusKm());
        if (request.getOperationalMonths() != null)
            drone.setOperationalMonths(request.getOperationalMonths());
        if (request.getOperationalDays() != null)
            drone.setOperationalDays(request.getOperationalDays());
        if (request.getLeadTimeDays() != null)
            drone.setLeadTimeDays(request.getLeadTimeDays());
        if (request.getBaseLocation() != null)
            drone.setBaseLocation(request.getBaseLocation());
        if (request.getCoordinates() != null)
            drone.setCoordinates(request.getCoordinates());
        if (request.getServiceAreas() != null)
            drone.setServiceAreas(request.getServiceAreas());
        if (request.getHasChargingFacility() != null)
            drone.setHasChargingFacility(request.getHasChargingFacility());
        if (request.getNumberOfSpareBatteries() != null)
            drone.setNumberOfSpareBatteries(request.getNumberOfSpareBatteries());
        if (request.getDroneWarehouseDescription() != null)
            drone.setDroneWarehouse(request.getDroneWarehouseDescription());
        
        // Update availability start and end dates in Availability records
        if (request.getAvailabilityStartDate() != null || request.getAvailabilityEndDate() != null) {
            java.util.List<Availability> availabilities = availabilityRepository.findByDrone_DroneId(drone.getDroneId());
            for (Availability availability : availabilities) {
                if (request.getAvailabilityStartDate() != null) {
                    try {
                        availability.setStartDate(java.time.LocalDate.parse(request.getAvailabilityStartDate()));
                    } catch (Exception e) {
                        log.warn("Invalid date format: {}", request.getAvailabilityStartDate());
                    }
                }
                if (request.getAvailabilityEndDate() != null) {
                    try {
                        availability.setEndDate(java.time.LocalDate.parse(request.getAvailabilityEndDate()));
                    } catch (Exception e) {
                        log.warn("Invalid date format: {}", request.getAvailabilityEndDate());
                    }
                }
                availabilityRepository.save(availability);
            }
        }
        
        if (request.getSlaReachTimeHours() != null)
            drone.setSlaReachTimeHours(request.getSlaReachTimeHours());
        if (request.getWorkingHoursBatches() != null)
            drone.setTimeBatches(request.getWorkingHoursBatches());
        if (request.getAvailabilityStatus() != null)
            drone.setAvailabilityStatus(request.getAvailabilityStatus());

        drone = droneRepository.save(drone);

        // Update or create bank account
        if (request.getAccountHolderName() != null || request.getAccountNumber() != null) {
            VendorBankAccount bankAccount = bankAccountRepository
                    .findByVendor_VendorIdAndIsActiveTrue(vendorId)
                    .orElseGet(() -> {
                        VendorBankAccount newAccount = new VendorBankAccount();
                        newAccount.setVendor(vendor);
                        newAccount.setIsActive(true);
                        return newAccount;
                    });

            if (request.getAccountHolderName() != null)
                bankAccount.setAccountHolderName(request.getAccountHolderName());
            if (request.getAccountNumber() != null)
                bankAccount.setAccountNumber(request.getAccountNumber());
            if (request.getBankIfscCode() != null)
                bankAccount.setBankIfscCode(request.getBankIfscCode());
            if (request.getBankName() != null)
                bankAccount.setBankName(request.getBankName());
            if (request.getUpiId() != null)
                bankAccount.setUpiId(request.getUpiId());

            bankAccountRepository.save(bankAccount);
        }

        // Get updated bank account
        VendorBankAccount bankAccount = bankAccountRepository
                .findByVendor_VendorIdAndIsActiveTrue(vendorId)
                .orElse(null);

        // Get availability records for the drone
        List<Availability> availabilities = null;
        if (drone != null) {
            availabilities = availabilityRepository.findByDrone_DroneId(drone.getDroneId());
        }

        return VendorProfileResponse.fromVendor(vendor, drone, bankAccount, availabilities);
    }
}
