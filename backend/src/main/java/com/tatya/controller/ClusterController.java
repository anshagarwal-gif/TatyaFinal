package com.tatya.controller;

import com.tatya.entity.Cluster;
import com.tatya.service.FarmCoverageService;
import com.tatya.repository.ClusterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clusters")
@CrossOrigin(origins = "*")
public class ClusterController {

    @Autowired
    private FarmCoverageService coverageService;

    @Autowired
    private ClusterRepository clusterRepository;

    // Step 3-7: Admin generates clusters
    @PostMapping("/generate")
    public ResponseEntity<List<Cluster>> generateClusters() {
        return ResponseEntity.ok(coverageService.generateClusters());
    }

    // Step 10: User finds nearby/active clusters
    @GetMapping("/active")
    public ResponseEntity<List<Cluster>> getActiveClusters() {
        return ResponseEntity.ok(clusterRepository.findByStatus(Cluster.ClusterStatus.ACTIVE));
    }

    @GetMapping
    public ResponseEntity<List<Cluster>> getAllClusters() {
        return ResponseEntity.ok(clusterRepository.findAll());
    }

    // Step 9: Vendor accepts cluster logic would go here (PUT /:id/accept)
}
