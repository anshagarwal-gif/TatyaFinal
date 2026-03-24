package com.tatya.repository;

import com.tatya.entity.VendorDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorDocumentRepository extends JpaRepository<VendorDocument, Long> {
    List<VendorDocument> findByVendor_VendorId(Long vendorId);
    List<VendorDocument> findByVendor_VendorIdAndDocumentType(Long vendorId, VendorDocument.DocumentType documentType);
    List<VendorDocument> findByDrone_DroneId(Long droneId);
}
