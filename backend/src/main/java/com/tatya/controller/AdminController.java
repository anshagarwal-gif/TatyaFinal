package com.tatya.controller;

import com.tatya.dto.*;
import com.tatya.entity.Vendor;
import com.tatya.service.AdminService;
import com.tatya.service.ExcelExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final ExcelExportService excelExportService;

    /**
     * Admin login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminLoginResponse>> login(@Valid @RequestBody AdminLoginRequest request) {
        try {
            log.info("Admin login request for email: {}", request.getEmail());
            AdminLoginResponse response = adminService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            log.error("Admin login failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboardStats() {
        try {
            log.info("Fetching admin dashboard statistics");
            AdminDashboardStats stats = adminService.getDashboardStats();
            return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved", stats));
        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch dashboard statistics"));
        }
    }

    /**
     * Get all vendors
     */
    @GetMapping("/vendors")
    public ResponseEntity<ApiResponse<List<AdminVendorResponse>>> getAllVendors() {
        try {
            log.info("Fetching all vendors");
            List<AdminVendorResponse> vendors = adminService.getAllVendors();
            return ResponseEntity.ok(ApiResponse.success("Vendors retrieved successfully", vendors));
        } catch (Exception e) {
            log.error("Error fetching vendors", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch vendors"));
        }
    }

    /**
     * Get pending vendors
     */
    @GetMapping("/vendors/pending")
    public ResponseEntity<ApiResponse<List<AdminVendorResponse>>> getPendingVendors() {
        try {
            log.info("Fetching pending vendors");
            List<AdminVendorResponse> vendors = adminService.getPendingVendors();
            return ResponseEntity.ok(ApiResponse.success("Pending vendors retrieved successfully", vendors));
        } catch (Exception e) {
            log.error("Error fetching pending vendors", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch pending vendors"));
        }
    }

    /**
     * Get vendor details by ID
     */
    @GetMapping("/vendors/{vendorId}")
    public ResponseEntity<ApiResponse<AdminVendorResponse>> getVendorDetails(@PathVariable Long vendorId) {
        try {
            log.info("Fetching vendor details for ID: {}", vendorId);
            AdminVendorResponse vendor = adminService.getVendorDetails(vendorId);
            return ResponseEntity.ok(ApiResponse.success("Vendor details retrieved successfully", vendor));
        } catch (RuntimeException e) {
            log.error("Vendor not found: {}", vendorId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching vendor details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch vendor details"));
        }
    }

    /**
     * Approve or reject a vendor
     */
    @PostMapping("/vendors/approve-reject")
    public ResponseEntity<ApiResponse<String>> approveOrRejectVendor(@Valid @RequestBody VendorApprovalRequest request) {
        try {
            log.info("Processing vendor approval/rejection for vendor ID: {}", request.getVendorId());
            adminService.approveOrRejectVendor(request);
            
            // Determine success message based on action
            String message;
            if (request.getAction() != null && request.getAction() == Vendor.VerifiedStatus.VERIFIED) {
                message = "Vendor approved successfully";
            } else {
                message = "Vendor rejected successfully";
            }
            
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (RuntimeException e) {
            log.error("Error processing vendor approval/rejection", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error processing vendor approval/rejection", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process vendor approval/rejection"));
        }
    }

    /**
     * Deactivate a vendor
     */
    @PutMapping("/vendors/{vendorId}/deactivate")
    public ResponseEntity<ApiResponse<String>> deactivateVendor(@PathVariable Long vendorId) {
        try {
            log.info("Deactivating vendor ID: {}", vendorId);
            adminService.deactivateVendor(vendorId);
            return ResponseEntity.ok(ApiResponse.success("Vendor deactivated successfully"));
        } catch (RuntimeException e) {
            log.error("Error deactivating vendor", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error deactivating vendor", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to deactivate vendor"));
        }
    }

    /**
     * Reactivate a vendor
     */
    @PutMapping("/vendors/{vendorId}/reactivate")
    public ResponseEntity<ApiResponse<String>> reactivateVendor(@PathVariable Long vendorId) {
        try {
            log.info("Reactivating vendor ID: {}", vendorId);
            adminService.reactivateVendor(vendorId);
            return ResponseEntity.ok(ApiResponse.success("Vendor reactivated successfully"));
        } catch (RuntimeException e) {
            log.error("Error reactivating vendor", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error reactivating vendor", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to reactivate vendor"));
        }
    }

    /**
     * Get all users (customers)
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers() {
        try {
            log.info("Fetching all users");
            List<AdminUserResponse> users = adminService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            log.error("Error fetching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch users"));
        }
    }

    /**
     * Get only customer users
     */
    @GetMapping("/users/customers")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllCustomers() {
        try {
            log.info("Fetching all customers");
            List<AdminUserResponse> users = adminService.getAllCustomers();
            return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", users));
        } catch (Exception e) {
            log.error("Error fetching customers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch customers"));
        }
    }

    /**
     * Get user details by ID
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> getUserDetails(@PathVariable Long userId) {
        try {
            log.info("Fetching user details for ID: {}", userId);
            AdminUserResponse user = adminService.getUserDetails(userId);
            return ResponseEntity.ok(ApiResponse.success("User details retrieved successfully", user));
        } catch (RuntimeException e) {
            log.error("User not found: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching user details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch user details"));
        }
    }

    /**
     * Delete a user
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long userId) {
        try {
            log.info("Deleting user ID: {}", userId);
            adminService.deleteUser(userId);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
        } catch (RuntimeException e) {
            log.error("Error deleting user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete user"));
        }
    }

    /**
     * Get finance statistics
     */
    @GetMapping("/finance/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getFinanceStats() {
        try {
            log.info("Fetching finance statistics");
            AdminDashboardStats stats = adminService.getFinanceStats();
            return ResponseEntity.ok(ApiResponse.success("Finance statistics retrieved", stats));
        } catch (Exception e) {
            log.error("Error fetching finance stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch finance statistics"));
        }
    }

    /**
     * Export vendors and drones to Excel
     */
    @GetMapping("/vendors/export/excel")
    public ResponseEntity<byte[]> exportVendorsAndDrones() {
        try {
            log.info("Exporting vendors and drones to Excel");
            byte[] excelData = excelExportService.exportVendorsAndDrones();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "vendors_and_drones.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (Exception e) {
            log.error("Error exporting vendors and drones", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Export users to Excel
     */
    @GetMapping("/users/export/excel")
    public ResponseEntity<byte[]> exportUsers() {
        try {
            log.info("Exporting users to Excel");
            List<AdminUserResponse> users = adminService.getAllUsers();
            byte[] excelData = excelExportService.exportUsers(users);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "users.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (Exception e) {
            log.error("Error exporting users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
