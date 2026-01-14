package com.tatya.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tatya.dto.*;
import com.tatya.entity.*;
import com.tatya.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendorOnboardingService {
    
    private final VendorRepository vendorRepository;
    private final DroneRepository droneRepository;
    private final VendorBankAccountRepository bankAccountRepository;
    private final VendorDocumentRepository documentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Save Step 1: Equipment Basics
     */
    @Transactional
    public Drone saveStep1(VendorOnboardingStep1Request request) {
        log.info("Saving Step 1 for vendor ID: {}", request.getVendorId());
        
        Vendor vendor = vendorRepository.findById(request.getVendorId())
            .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        // Check if drone already exists for this vendor
        Drone drone = droneRepository.findByVendor_VendorId(request.getVendorId())
            .stream()
            .findFirst()
            .orElseGet(() -> {
                Drone newDrone = new Drone();
                newDrone.setVendor(vendor);
                newDrone.setStatus(Drone.DroneStatus.AVAILABLE);
                return newDrone;
            });
        
        drone.setEquipmentType(request.getEquipmentType());
        drone.setBrand(request.getBrand());
        drone.setModelName(request.getModelName());
        drone.setYearOfMake(request.getYearOfMake());
        drone.setSerialNo(request.getSerialNo());
        
        if (request.getModelName() != null) {
            drone.setDroneModel(request.getModelName());
        }
        
        return droneRepository.save(drone);
    }
    
    /**
     * Save Step 2: Drone-Specific Details
     */
    @Transactional
    public Drone saveStep2(VendorOnboardingStep2Request request) {
        log.info("Saving Step 2 for vendor ID: {}", request.getVendorId());
        
        Drone drone = getOrCreateDrone(request.getVendorId());
        
        drone.setDroneName(request.getDroneName());
        drone.setDroneType(request.getDroneType());
        drone.setTankSizeLiters(request.getTankSize());
        drone.setSprayWidthMeters(request.getSprayWidth());
        drone.setBatteryCapacityMah(request.getBatteryCapacity());
        drone.setBatteryCount(request.getNumberOfBatteries());
        drone.setFlightTimeMinutes(request.getFlightTime());
        drone.setBatterySwapTimeMinutes(request.getBatterySwapTime());
        drone.setUin(request.getUin());
        drone.setUaop(request.getUaop());
        drone.setPilotLicense(request.getPilotLicense());
        drone.setReturnToHome(request.getReturnToHome());
        drone.setTerrainFollowing(request.getTerrainFollowing());
        
        if (request.getTankSize() != null) {
            drone.setCapacityLiters(request.getTankSize());
        }
        
        return droneRepository.save(drone);
    }
    
    /**
     * Save Step 3: Capacity & Coverage
     */
    @Transactional
    public Drone saveStep3(VendorOnboardingStep3Request request) {
        log.info("Saving Step 3 for vendor ID: {}", request.getVendorId());
        
        Drone drone = getOrCreateDrone(request.getVendorId());
        
        drone.setMaxAcresPerDay(request.getMaxAcresPerDay());
        drone.setMinBookingAcres(request.getMinBookingAcres());
        drone.setServiceRadiusKm(request.getServiceRadius());
        drone.setLeadTimeDays(request.getLeadTime());
        
        // Convert lists to JSON strings
        if (request.getOperationalMonths() != null) {
            try {
                drone.setOperationalMonths(objectMapper.writeValueAsString(request.getOperationalMonths()));
            } catch (JsonProcessingException e) {
                log.error("Error serializing operational months", e);
                drone.setOperationalMonths(String.join(",", request.getOperationalMonths()));
            }
        }
        
        if (request.getOperationalDays() != null) {
            try {
                drone.setOperationalDays(objectMapper.writeValueAsString(request.getOperationalDays()));
            } catch (JsonProcessingException e) {
                log.error("Error serializing operational days", e);
                drone.setOperationalDays(String.join(",", request.getOperationalDays()));
            }
        }
        
        return droneRepository.save(drone);
    }
    
    /**
     * Save Step 4: Location & Logistics
     */
    @Transactional
    public Drone saveStep4(VendorOnboardingStep4Request request) {
        log.info("Saving Step 4 for vendor ID: {}", request.getVendorId());
        
        Drone drone = getOrCreateDrone(request.getVendorId());
        
        drone.setBaseLocation(request.getBaseLocation());
        drone.setCoordinates(request.getCoordinates());
        drone.setServiceAreas(request.getServiceAreas());
        drone.setHasChargingFacility(request.getHasChargingFacility());
        drone.setNumberOfSpareBatteries(request.getNumberOfSpareBatteries());
        drone.setDroneWarehouse(request.getDroneWarehouse());
        
        return droneRepository.save(drone);
    }
    
    /**
     * Save Step 5: Availability & SLA
     */
    @Transactional
    public Drone saveStep5(VendorOnboardingStep5Request request) {
        log.info("Saving Step 5 for vendor ID: {}", request.getVendorId());
        
        Drone drone = getOrCreateDrone(request.getVendorId());
        
        // Handle availability dates and create/update Availability records
        if (request.getStartDate() != null && request.getEndDate() != null) {
            List<Availability> existingAvailabilities = availabilityRepository.findByDrone_DroneId(drone.getDroneId());
            
            // If no availability records exist, create them for the date range
            if (existingAvailabilities.isEmpty()) {
                log.info("No existing availability records found. Creating new records from {} to {}", 
                    request.getStartDate(), request.getEndDate());
                
                // Parse time batches to get time slots
                List<TimeSlot> timeSlots = parseTimeBatches(request.getTimeBatches());
                
                // Create availability records for each day in the range
                LocalDate currentDate = request.getStartDate();
                while (!currentDate.isAfter(request.getEndDate())) {
                    for (TimeSlot slot : timeSlots) {
                        Availability availability = new Availability();
                        availability.setDrone(drone);
                        availability.setAvailableDate(currentDate);
                        availability.setStartDate(request.getStartDate());
                        availability.setEndDate(request.getEndDate());
                        availability.setStartTime(slot.startTime);
                        availability.setEndTime(slot.endTime);
                        availability.setIsBooked(false);
                        availabilityRepository.save(availability);
                    }
                    currentDate = currentDate.plusDays(1);
                }
                log.info("Created availability records for {} days with {} time slots each", 
                    ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1, 
                    timeSlots.size());
            } else {
                // Update existing availability records with start and end dates
                log.info("Updating {} existing availability records with date range", existingAvailabilities.size());
                for (Availability availability : existingAvailabilities) {
                    availability.setStartDate(request.getStartDate());
                    availability.setEndDate(request.getEndDate());
                    availabilityRepository.save(availability);
                }
            }
        } else if (request.getStartDate() != null || request.getEndDate() != null) {
            // Update existing records if only one date is provided
            List<Availability> availabilities = availabilityRepository.findByDrone_DroneId(drone.getDroneId());
            for (Availability availability : availabilities) {
                if (request.getStartDate() != null) {
                    availability.setStartDate(request.getStartDate());
                }
                if (request.getEndDate() != null) {
                    availability.setEndDate(request.getEndDate());
                }
                availabilityRepository.save(availability);
            }
        }
        
        drone.setSlaReachTimeHours(request.getSlaReachTime());
        drone.setAvailabilityStatus(request.getAvailabilityStatus());
        
        if (request.getTimeBatches() != null) {
            try {
                drone.setTimeBatches(objectMapper.writeValueAsString(request.getTimeBatches()));
            } catch (JsonProcessingException e) {
                log.error("Error serializing time batches", e);
                drone.setTimeBatches(String.join(",", request.getTimeBatches()));
            }
        }
        
        return droneRepository.save(drone);
    }
    
    /**
     * Parse time batches into time slots
     * Supports formats like "morning", "afternoon", "evening" or "06:00-10:00"
     */
    private List<TimeSlot> parseTimeBatches(List<String> timeBatches) {
        List<TimeSlot> slots = new ArrayList<>();
        
        if (timeBatches == null || timeBatches.isEmpty()) {
            // Default time slots if none provided
            slots.add(new TimeSlot(LocalTime.of(6, 0), LocalTime.of(10, 0)));
            slots.add(new TimeSlot(LocalTime.of(10, 0), LocalTime.of(14, 0)));
            slots.add(new TimeSlot(LocalTime.of(14, 0), LocalTime.of(18, 0)));
            return slots;
        }
        
        for (String batch : timeBatches) {
            if (batch == null || batch.trim().isEmpty()) {
                continue;
            }
            
            String lowerBatch = batch.toLowerCase().trim();
            
            // Handle named batches
            if (lowerBatch.contains("morning")) {
                slots.add(new TimeSlot(LocalTime.of(6, 0), LocalTime.of(11, 0)));
            } else if (lowerBatch.contains("afternoon")) {
                slots.add(new TimeSlot(LocalTime.of(11, 0), LocalTime.of(17, 0)));
            } else if (lowerBatch.contains("evening")) {
                slots.add(new TimeSlot(LocalTime.of(17, 0), LocalTime.of(20, 0)));
            } else if (lowerBatch.contains("night")) {
                slots.add(new TimeSlot(LocalTime.of(20, 0), LocalTime.of(22, 0)));
            } else if (batch.contains("-") || batch.contains("to")) {
                // Parse time range like "06:00-10:00" or "06:00 to 10:00"
                try {
                    String[] parts = batch.split("[-to]");
                    if (parts.length == 2) {
                        LocalTime start = parseTime(parts[0].trim());
                        LocalTime end = parseTime(parts[1].trim());
                        if (start != null && end != null) {
                            slots.add(new TimeSlot(start, end));
                        }
                    }
                } catch (Exception e) {
                    log.warn("Could not parse time batch: {}", batch, e);
                }
            }
        }
        
        // If no valid slots were parsed, use defaults
        if (slots.isEmpty()) {
            slots.add(new TimeSlot(LocalTime.of(6, 0), LocalTime.of(10, 0)));
            slots.add(new TimeSlot(LocalTime.of(10, 0), LocalTime.of(14, 0)));
            slots.add(new TimeSlot(LocalTime.of(14, 0), LocalTime.of(18, 0)));
        }
        
        return slots;
    }
    
    /**
     * Parse time string to LocalTime
     * Supports formats like "06:00", "6:00 AM", "18:00"
     */
    private LocalTime parseTime(String timeStr) {
        try {
            timeStr = timeStr.trim().toUpperCase();
            
            // Remove AM/PM and handle 12-hour format
            boolean isPM = timeStr.contains("PM");
            timeStr = timeStr.replaceAll("(AM|PM)", "").trim();
            
            String[] parts = timeStr.split(":");
            if (parts.length >= 2) {
                int hour = Integer.parseInt(parts[0]);
                int minute = Integer.parseInt(parts[1]);
                
                if (isPM && hour != 12) {
                    hour += 12;
                } else if (!isPM && hour == 12) {
                    hour = 0;
                }
                
                return LocalTime.of(hour, minute);
            }
        } catch (Exception e) {
            log.warn("Could not parse time: {}", timeStr, e);
        }
        return null;
    }
    
    /**
     * Helper class for time slots
     */
    private static class TimeSlot {
        LocalTime startTime;
        LocalTime endTime;
        
        TimeSlot(LocalTime startTime, LocalTime endTime) {
            this.startTime = startTime;
            this.endTime = endTime;
        }
    }
    
    /**
     * Save Step 6: Payouts (Bank Account)
     */
    @Transactional
    public VendorBankAccount saveStep6(VendorOnboardingStep6Request request) {
        log.info("Saving Step 6 for vendor ID: {}", request.getVendorId());
        
        Vendor vendor = vendorRepository.findById(request.getVendorId())
            .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        // Deactivate existing bank accounts
        bankAccountRepository.findByVendor_VendorIdAndIsActiveTrue(request.getVendorId())
            .ifPresent(account -> {
                account.setIsActive(false);
                bankAccountRepository.save(account);
            });
        
        // Create new bank account
        VendorBankAccount bankAccount = new VendorBankAccount();
        bankAccount.setVendor(vendor);
        bankAccount.setAccountHolderName(request.getAccountHolderName());
        bankAccount.setAccountNumber(request.getAccountNumber());
        bankAccount.setBankIfscCode(request.getBankIfscCode());
        bankAccount.setBankName(request.getBankName());
        bankAccount.setUpiId(request.getUpiId());
        bankAccount.setIsActive(true);
        
        return bankAccountRepository.save(bankAccount);
    }
    
    /**
     * Save uploaded document
     */
    @Transactional
    public VendorDocument saveDocument(Long vendorId, Long droneId, VendorDocument.DocumentType documentType,
                                      String fileName, String filePath, Long fileSize, String mimeType) {
        Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        VendorDocument document = new VendorDocument();
        document.setVendor(vendor);
        if (droneId != null) {
            Drone drone = droneRepository.findById(droneId)
                .orElseThrow(() -> new RuntimeException("Drone not found"));
            document.setDrone(drone);
        }
        document.setDocumentType(documentType);
        document.setFileName(fileName);
        document.setFilePath(filePath);
        document.setFileSize(fileSize);
        document.setMimeType(mimeType);
        
        return documentRepository.save(document);
    }
    
    /**
     * Get saved onboarding data for a vendor
     */
    public Drone getOnboardingData(Long vendorId) {
        log.info("Fetching onboarding data for vendor ID: {}", vendorId);
        
        Optional<Drone> droneOpt = droneRepository.findByVendor_VendorId(vendorId)
            .stream()
            .findFirst();
        
        if (droneOpt.isPresent()) {
            Drone drone = droneOpt.get();
            // Load availability records to get start and end dates
            List<Availability> availabilities = availabilityRepository.findByDrone_DroneId(drone.getDroneId());
            drone.setAvailabilities(availabilities);
            return drone;
        }
        
        // Return null if no drone exists yet (vendor hasn't started onboarding)
        return null;
    }
    
    /**
     * Get or create drone for vendor
     */
    private Drone getOrCreateDrone(Long vendorId) {
        Optional<Drone> existingDrone = droneRepository.findByVendor_VendorId(vendorId)
            .stream()
            .findFirst();
        
        if (existingDrone.isPresent()) {
            return existingDrone.get();
        }
        
        Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        Drone drone = new Drone();
        drone.setVendor(vendor);
        drone.setStatus(Drone.DroneStatus.AVAILABLE);
        return droneRepository.save(drone);
    }
}
