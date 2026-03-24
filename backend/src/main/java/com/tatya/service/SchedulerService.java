package com.tatya.service;

import com.tatya.entity.Cluster;
import com.tatya.entity.ClusterHistory;
import com.tatya.repository.ClusterHistoryRepository;
import com.tatya.repository.ClusterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final FarmCoverageService farmCoverageService;
    private final VendorAllocationService vendorAllocationService;
    private final ClusterRepository clusterRepository;
    private final ClusterHistoryRepository clusterHistoryRepository;

    /**
     * Job 1: Cluster Creation
     * Runs every day at 4:00 AM.
     */
    @Scheduled(cron = "0 0 4 * * ?")
    public void runClusterCreationJob() {
        log.info("Starting Cluster Creation Job at {}", LocalDateTime.now());
        farmCoverageService.generateClusters();
        log.info("Cluster Creation Job Completed.");
    }

    /**
     * Job 2: Vendor Allocation
     * Runs every day at 5:00 AM.
     */
    @Scheduled(cron = "0 0 5 * * ?")
    public void runVendorAllocationJob() {
        log.info("Starting Vendor Allocation Job at {}", LocalDateTime.now());
        vendorAllocationService.allocateVendors();
        log.info("Vendor Allocation Job Completed.");
    }

    /**
     * Job 3: Archiving
     * Runs every day at 12:00 AM (Midnight).
     * Moves completed clusters to history.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void runArchivingJob() {
        log.info("Starting Archiving Job at {}", LocalDateTime.now());

        // Find completed clusters (or maybe cancelled ones too)
        List<Cluster> completedClusters = clusterRepository.findByStatus(Cluster.ClusterStatus.COMPLETED);

        for (Cluster cluster : completedClusters) {
            // Create History Record
            ClusterHistory history = new ClusterHistory();
            history.setOriginalClusterId(cluster.getId());
            history.setName(cluster.getName());
            history.setStartDate(cluster.getStartDate());
            history.setEndDate(cluster.getEndDate());
            // Assuming current day/service_date is completion date
            history.setCompletionDate(cluster.getEndDate());

            if (cluster.getVendor() != null) {
                history.setVendorId(cluster.getVendor().getVendorId());
            }

            clusterHistoryRepository.save(history);
        }

        log.info("Archived {} clusters.", completedClusters.size());
    }
}
