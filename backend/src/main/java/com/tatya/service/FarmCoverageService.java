package com.tatya.service;

import com.tatya.entity.Cluster;
import com.tatya.entity.Farm;
import com.tatya.repository.ClusterRepository;
import com.tatya.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FarmCoverageService {

    private static final double RADIUS_M = 5000.0; // 5km radius
    private static final double CONNECTION_DIST_M = 2 * RADIUS_M; // If circles overlap (centers closer than 2R)
    private static final double EARTH_R = 6371000.0;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private ClusterRepository clusterRepository;

    /**
     * Generates clusters from unassigned farms.
     * Step 1-9 of the flow.
     */
    @Transactional
    public List<Cluster> generateClusters() {
        // 1. Get all farms (In real app, filter those not already in an ACTIVE cluster)
        // For now, we fetch all. In a real scenario, we'd check cluster_farms/status.
        // Assuming we want to cluster ALL farms for this demo.
        List<Farm> allFarms = farmRepository.findAll();

        if (allFarms.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Build Adjacency Graph (Graph of Farms)
        // Two farms are connected if distance(f1, f2) <= CONNECTION_DIST_M
        Map<Long, List<Farm>> adjacencyList = new HashMap<>();
        for (Farm f : allFarms) {
            adjacencyList.put(f.getId(), new ArrayList<>());
        }

        for (int i = 0; i < allFarms.size(); i++) {
            for (int j = i + 1; j < allFarms.size(); j++) {
                Farm f1 = allFarms.get(i);
                Farm f2 = allFarms.get(j);
                double dist = haversineM(
                        f1.getLatitude().doubleValue(), f1.getLongitude().doubleValue(),
                        f2.getLatitude().doubleValue(), f2.getLongitude().doubleValue());
                if (dist <= CONNECTION_DIST_M) {
                    adjacencyList.get(f1.getId()).add(f2);
                    adjacencyList.get(f2.getId()).add(f1);
                }
            }
        }

        // 3. Find Connected Components (Clusters)
        Set<Long> visited = new HashSet<>();
        List<Cluster> newClusters = new ArrayList<>();

        for (Farm farm : allFarms) {
            if (!visited.contains(farm.getId())) {
                List<Farm> component = new ArrayList<>();
                bfs(farm, adjacencyList, visited, component);

                // 4. Validate Cluster Size (Step 6)
                // Example: At least 2 farms (User said 20, but for demo/testing we use 2)
                if (component.size() >= 2) {
                    Cluster cluster = createClusterFromComponent(component);
                    newClusters.add(cluster);
                }
            }
        }

        return clusterRepository.saveAll(newClusters);
    }

    private void bfs(Farm startNode, Map<Long, List<Farm>> graph, Set<Long> visited, List<Farm> component) {
        Queue<Farm> queue = new LinkedList<>();
        queue.add(startNode);
        visited.add(startNode.getId());

        while (!queue.isEmpty()) {
            Farm current = queue.poll();
            component.add(current);

            for (Farm neighbor : graph.get(current.getId())) {
                if (!visited.contains(neighbor.getId())) {
                    visited.add(neighbor.getId());
                    queue.add(neighbor);
                }
            }
        }
    }

    private Cluster createClusterFromComponent(List<Farm> farms) {
        Cluster cluster = new Cluster();

        // Step 7: Name (Auto-generated)
        // E.g., "Cluster [FirstFarm.City/Id] - [Random]"
        // For simplicity: "Cluster-{Random 4 chars}-{Count}Farms"
        String name = "Cluster-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase() + "-" + farms.size()
                + "Farms";
        cluster.setName(name);

        cluster.setStatus(Cluster.ClusterStatus.PENDING);
        cluster.setFarms(new HashSet<>(farms));

        // Step 8: Suggest Dates (Today + 2 days, for 3 days duration)
        cluster.setStartDate(LocalDate.now().plusDays(2));
        cluster.setEndDate(LocalDate.now().plusDays(5));

        return cluster;
    }

    private double haversineM(double lat1, double lon1, double lat2, double lon2) {
        double toRad = Math.PI / 180.0;
        double dLat = (lat2 - lat1) * toRad;
        double dLon = (lon2 - lon1) * toRad;
        double a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.pow(Math.sin(dLon / 2), 2);
        return 2 * EARTH_R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
