package com.tatya.service;

import com.tatya.dto.AdminUserResponse;
import com.tatya.dto.AdminVendorResponse;
import com.tatya.entity.Drone;
import com.tatya.entity.Vendor;
import com.tatya.repository.DroneRepository;
import com.tatya.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelExportService {

    private final VendorRepository vendorRepository;
    private final DroneRepository droneRepository;

    /**
     * Export all vendors and their drones to Excel
     */
    public byte[] exportVendorsAndDrones() throws IOException {
        log.info("Exporting vendors and drones to Excel");
        
        List<Vendor> vendors = vendorRepository.findAll();
        
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Vendors & Drones");
            
            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                "Vendor ID", "Vendor Name", "Email", "Phone", "Business Name",
                "Status", "Approval Status", "Rating", "Drone ID", "Drone Model",
                "Drone Name", "Brand", "Equipment Type", "Status", "Price Per Hour", "Price Per Acre"
            };
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Create data rows
            int rowNum = 1;
            for (Vendor vendor : vendors) {
                List<Drone> drones = droneRepository.findByVendor_VendorId(vendor.getVendorId());
                
                if (drones.isEmpty()) {
                    // If vendor has no drones, still add vendor row
                    Row row = sheet.createRow(rowNum++);
                    createVendorRow(row, vendor, null, 0);
                } else {
                    // Add a row for each drone
                    for (Drone drone : drones) {
                        Row row = sheet.createRow(rowNum++);
                        createVendorRow(row, vendor, drone, rowNum - 1);
                    }
                }
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void createVendorRow(Row row, Vendor vendor, Drone drone, int rowNum) {
        int cellNum = 0;
        
        row.createCell(cellNum++).setCellValue(vendor.getVendorId());
        row.createCell(cellNum++).setCellValue(vendor.getUser().getFullName());
        row.createCell(cellNum++).setCellValue(vendor.getUser().getEmail());
        row.createCell(cellNum++).setCellValue(vendor.getUser().getPhone());
        row.createCell(cellNum++).setCellValue(vendor.getUser().getFullName() + " Services");
        row.createCell(cellNum++).setCellValue(vendor.getUser().getStatus().name());
        row.createCell(cellNum++).setCellValue(vendor.getVerifiedStatus().name());
        row.createCell(cellNum++).setCellValue(
            vendor.getRatingAvg() != null ? vendor.getRatingAvg().doubleValue() : 0.0
        );
        
        if (drone != null) {
            row.createCell(cellNum++).setCellValue(drone.getDroneId());
            row.createCell(cellNum++).setCellValue(drone.getDroneModel() != null ? drone.getDroneModel() : "");
            row.createCell(cellNum++).setCellValue(drone.getDroneName() != null ? drone.getDroneName() : "");
            row.createCell(cellNum++).setCellValue(drone.getBrand() != null ? drone.getBrand() : "");
            row.createCell(cellNum++).setCellValue(drone.getEquipmentType() != null ? drone.getEquipmentType() : "");
            row.createCell(cellNum++).setCellValue(drone.getStatus().name());
            row.createCell(cellNum++).setCellValue(
                drone.getPricePerHour() != null ? drone.getPricePerHour().doubleValue() : 0.0
            );
            row.createCell(cellNum++).setCellValue(
                drone.getPricePerAcre() != null ? drone.getPricePerAcre().doubleValue() : 0.0
            );
        } else {
            // Fill empty cells for drone columns
            for (int i = 0; i < 8; i++) {
                row.createCell(cellNum++).setCellValue("");
            }
        }
    }

    /**
     * Export all users to Excel
     */
    public byte[] exportUsers(List<AdminUserResponse> users) throws IOException {
        log.info("Exporting users to Excel");
        
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Users");
            
            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                "ID", "Phone", "Email", "Full Name", "Status", "Role", "Created Date", "Created Time"
            };
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Create data rows
            int rowNum = 1;
            for (AdminUserResponse user : users) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getPhone() != null ? user.getPhone() : "");
                row.createCell(2).setCellValue(user.getEmail() != null ? user.getEmail() : "");
                row.createCell(3).setCellValue(user.getFullName() != null ? user.getFullName() : "");
                row.createCell(4).setCellValue(user.getStatus() != null ? user.getStatus() : "");
                row.createCell(5).setCellValue(user.getRole() != null ? user.getRole() : "");
                row.createCell(6).setCellValue(
                    user.getCreatedDate() != null ? user.getCreatedDate().toString() : ""
                );
                row.createCell(7).setCellValue(user.getCreatedTime() != null ? user.getCreatedTime() : "");
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return out.toByteArray();
        }
    }
}
