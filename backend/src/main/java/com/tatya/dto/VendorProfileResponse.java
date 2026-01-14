package com.tatya.dto;

import com.tatya.entity.Availability;
import com.tatya.entity.Drone;
import com.tatya.entity.Vendor;
import com.tatya.entity.VendorBankAccount;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfileResponse {
    private Long vendorId;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String vendorType;
    private Vendor.VerifiedStatus verifiedStatus;
    
    // Drone information (first drone if multiple)
    private DroneInfo drone;
    
    // Bank account information
    private BankAccountInfo bankAccount;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DroneInfo {
        private Long droneId;
        private String equipmentType;
        private String brand;
        private String modelName;
        private Integer yearOfMake;
        private String serialNo;
        private String droneName;
        private String droneType;
        private Double tankSizeLiters;
        private Double sprayWidthMeters;
        private Integer batteryCapacityMah;
        private Integer batteryCount;
        private Integer flightTimeMinutes;
        private Integer batterySwapTimeMinutes;
        private String uin;
        private String uaop;
        private String pilotLicense;
        private Boolean returnToHome;
        private Boolean terrainFollowing;
        private Integer maxAcresPerDay;
        private Integer minBookingAcres;
        private Double serviceRadiusKm;
        private String operationalMonths;
        private String operationalDays;
        private Integer leadTimeDays;
        private String baseLocation;
        private String coordinates;
        private String serviceAreas;
        private Boolean hasChargingFacility;
        private Integer numberOfSpareBatteries;
        private String droneWarehouseDescription;
        private String availabilityStartDate;
        private String availabilityEndDate;
        private Integer slaReachTimeHours;
        private String workingHoursBatches;
        private String availabilityStatus;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BankAccountInfo {
        private Long bankAccountId;
        private String accountHolderName;
        private String accountNumber;
        private String bankIfscCode;
        private String bankName;
        private String upiId;
    }
    
    public static VendorProfileResponse fromVendor(Vendor vendor, Drone drone, VendorBankAccount bankAccount) {
        return fromVendor(vendor, drone, bankAccount, null);
    }
    
    public static VendorProfileResponse fromVendor(Vendor vendor, Drone drone, VendorBankAccount bankAccount, List<Availability> availabilities) {
        VendorProfileResponse response = new VendorProfileResponse();
        response.setVendorId(vendor.getVendorId());
        response.setUserId(vendor.getUser().getId());
        response.setFullName(vendor.getUser().getFullName());
        response.setEmail(vendor.getUser().getEmail());
        response.setPhone(vendor.getUser().getPhone());
        response.setVendorType(vendor.getServiceArea());
        response.setVerifiedStatus(vendor.getVerifiedStatus());
        
        if (drone != null) {
            DroneInfo droneInfo = new DroneInfo();
            droneInfo.setDroneId(drone.getDroneId());
            droneInfo.setEquipmentType(drone.getEquipmentType());
            droneInfo.setBrand(drone.getBrand());
            droneInfo.setModelName(drone.getModelName());
            droneInfo.setYearOfMake(drone.getYearOfMake());
            droneInfo.setSerialNo(drone.getSerialNo());
            droneInfo.setDroneName(drone.getDroneName());
            droneInfo.setDroneType(drone.getDroneType());
            droneInfo.setTankSizeLiters(drone.getTankSizeLiters());
            droneInfo.setSprayWidthMeters(drone.getSprayWidthMeters());
            droneInfo.setBatteryCapacityMah(drone.getBatteryCapacityMah());
            droneInfo.setBatteryCount(drone.getBatteryCount());
            droneInfo.setFlightTimeMinutes(drone.getFlightTimeMinutes());
            droneInfo.setBatterySwapTimeMinutes(drone.getBatterySwapTimeMinutes());
            droneInfo.setUin(drone.getUin());
            droneInfo.setUaop(drone.getUaop());
            droneInfo.setPilotLicense(drone.getPilotLicense());
            droneInfo.setReturnToHome(drone.getReturnToHome());
            droneInfo.setTerrainFollowing(drone.getTerrainFollowing());
            droneInfo.setMaxAcresPerDay(drone.getMaxAcresPerDay());
            droneInfo.setMinBookingAcres(drone.getMinBookingAcres());
            droneInfo.setServiceRadiusKm(drone.getServiceRadiusKm());
            droneInfo.setOperationalMonths(drone.getOperationalMonths());
            droneInfo.setOperationalDays(drone.getOperationalDays());
            droneInfo.setLeadTimeDays(drone.getLeadTimeDays());
            droneInfo.setBaseLocation(drone.getBaseLocation());
            droneInfo.setCoordinates(drone.getCoordinates());
            droneInfo.setServiceAreas(drone.getServiceAreas());
            droneInfo.setHasChargingFacility(drone.getHasChargingFacility());
            droneInfo.setNumberOfSpareBatteries(drone.getNumberOfSpareBatteries());
            droneInfo.setDroneWarehouseDescription(drone.getDroneWarehouse() != null ? drone.getDroneWarehouse() : null);
            
            // Get availability dates from Availability records (use first one if available)
            if (availabilities != null && !availabilities.isEmpty()) {
                Availability firstAvailability = availabilities.get(0);
                droneInfo.setAvailabilityStartDate(firstAvailability.getStartDate() != null ? firstAvailability.getStartDate().toString() : null);
                droneInfo.setAvailabilityEndDate(firstAvailability.getEndDate() != null ? firstAvailability.getEndDate().toString() : null);
            } else {
                droneInfo.setAvailabilityStartDate(null);
                droneInfo.setAvailabilityEndDate(null);
            }
            
            droneInfo.setSlaReachTimeHours(drone.getSlaReachTimeHours());
            droneInfo.setWorkingHoursBatches(drone.getTimeBatches());
            droneInfo.setAvailabilityStatus(drone.getAvailabilityStatus());
            response.setDrone(droneInfo);
        }
        
        if (bankAccount != null) {
            BankAccountInfo bankInfo = new BankAccountInfo();
            bankInfo.setBankAccountId(bankAccount.getBankAccountId());
            bankInfo.setAccountHolderName(bankAccount.getAccountHolderName());
            bankInfo.setAccountNumber(bankAccount.getAccountNumber());
            bankInfo.setBankIfscCode(bankAccount.getBankIfscCode());
            bankInfo.setBankName(bankAccount.getBankName());
            bankInfo.setUpiId(bankAccount.getUpiId());
            response.setBankAccount(bankInfo);
        }
        
        return response;
    }
}
