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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendorOnboardingService {
    
    private final VendorRepository vendorRepository;
    private final DroneRepository droneRepository;
    private final VendorBankAccountRepository bankAccountRepository;
    private final VendorDocumentRepository documentRepository;
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
        
        drone.setAvailabilityStartDate(request.getStartDate());
        drone.setAvailabilityEndDate(request.getEndDate());
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
