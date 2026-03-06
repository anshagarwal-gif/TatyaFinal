package com.tatya.service;

import com.tatya.entity.Booking;
import com.tatya.entity.Cluster;
import java.math.BigDecimal;
import com.tatya.repository.BookingRepository;
import com.tatya.repository.ClusterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmCoverageService {

    private static final double RADIUS_M = 5000.0; // 5km radius
    private static final double CONNECTION_DIST_M = 2 * RADIUS_M; // If circles overlap (centers closer than 2R)
    private static final double CLUSTER_RADIUS_M = 5000.0; // Max distance any node may be from the cluster centre
    private static final double EARTH_R = 6371000.0;

    private final BookingRepository bookingRepository;
    private final ClusterRepository clusterRepository;

    /**
     * Generates clusters from ACCEPTED booking locations.
     * Only bookings with status ACCEPTED are used as clustering nodes.
     * Step 1-9 of the flow.
     */
    @Transactional
    public List<Cluster> generateClusters() {
        // 1. Get all ACCEPTED bookings — only confirmed orders drive clustering
        List<Booking> acceptedBookings = bookingRepository.findByStatus(Booking.BookingStatus.ACCEPTED);

        if (acceptedBookings.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Build Adjacency Graph (Graph of Booking Locations)
        // Two booking locations are connected if distance(b1, b2) <= CONNECTION_DIST_M
        Map<Long, List<Booking>> adjacencyList = new HashMap<>();
        for (Booking b : acceptedBookings) {
            adjacencyList.put(b.getBookingId(), new ArrayList<>());
        }

        for (int i = 0; i < acceptedBookings.size(); i++) {
            for (int j = i + 1; j < acceptedBookings.size(); j++) {
                Booking b1 = acceptedBookings.get(i);
                Booking b2 = acceptedBookings.get(j);
                double dist = haversineM(
                        b1.getLocationLat().doubleValue(), b1.getLocationLong().doubleValue(),
                        b2.getLocationLat().doubleValue(), b2.getLocationLong().doubleValue());
                if (dist <= CONNECTION_DIST_M) {
                    adjacencyList.get(b1.getBookingId()).add(b2);
                    adjacencyList.get(b2.getBookingId()).add(b1);
                }
            }
        }

        // 3. Find Connected Components (Clusters)
        Set<Long> visited = new HashSet<>();
        List<Cluster> newClusters = new ArrayList<>();

        for (Booking booking : acceptedBookings) {
            if (!visited.contains(booking.getBookingId())) {
                List<Booking> component = new ArrayList<>();
                bfs(booking, adjacencyList, visited, component);

                // 4. Validate Cluster Size & Area (Step 6 + 10-acre rule)
                if (component.size() >= 1) {
                    BigDecimal totalArea = component.stream()
                            .map(b -> b.getFarmAreaAcres() != null ? b.getFarmAreaAcres() : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    if (totalArea.compareTo(BigDecimal.valueOf(10)) <= 0) {
                        // Fits in one cluster
                        if (component.size() >= 2) {
                            newClusters.add(createClusterFromComponent(component));
                        }
                    } else {
                        // Exceeds 10 acres - Split logic
                        List<Cluster> splitClusters = splitComponentIntoClusters(component, adjacencyList);
                        newClusters.addAll(splitClusters);
                    }
                }
            }
        }

        return clusterRepository.saveAll(newClusters);
    }

    /**
     * Radius-constrained BFS.
     *
     * Standard BFS is extended with one extra gate before a neighbor is accepted:
     * haversine(neighbor, clusterCentre) <= CLUSTER_RADIUS_M (5 km)
     *
     * If a neighbor fails this check it is NOT marked visited, so the outer loop
     * in generateClusters() will pick it up as a fresh seed and start a new,
     * spatially compact cluster from it. This breaks the chain-clustering effect
     * where Farm1--Farm2--Farm3 (each pair <=10 km apart) would otherwise all
     * land in a single component even if Farm1 and Farm3 are 16 km apart.
     *
     * The cluster centre is maintained as a running incremental average so it
     * reflects the true centroid of all accepted nodes at every step.
     */
    private void bfs(Booking startNode, Map<Long, List<Booking>> graph, Set<Long> visited, List<Booking> component) {
        Queue<Booking> queue = new LinkedList<>();

        // Seed: mark visited and add to component immediately
        visited.add(startNode.getBookingId());
        component.add(startNode);
        queue.add(startNode);

        // Cluster centre starts at the seed location
        double centerLat = startNode.getLocationLat().doubleValue();
        double centerLon = startNode.getLocationLong().doubleValue();

        while (!queue.isEmpty()) {
            Booking current = queue.poll();

            for (Booking neighbor : graph.get(current.getBookingId())) {
                if (visited.contains(neighbor.getBookingId())) {
                    continue;
                }

                // Radius gate:
                // 1. If component is just the seed (size == 1), accept the direct neighbor
                // because their edge is <= 10km (guaranteeing their mutual center is <= 5km
                // from both).
                // 2. Once the cluster is formed (size > 1), strictly prevent long chains by
                // requiring all new additions to be within CLUSTER_RADIUS_M (5km) of the
                // running center.
                double distToCenter = haversineM(
                        neighbor.getLocationLat().doubleValue(), neighbor.getLocationLong().doubleValue(),
                        centerLat, centerLon);

                if (component.size() == 1 || distToCenter <= CLUSTER_RADIUS_M) {
                    // Accept: mark visited, add to component, enqueue
                    visited.add(neighbor.getBookingId());
                    component.add(neighbor);
                    queue.add(neighbor);

                    // Update cluster centre using incremental running average
                    // newCenter = oldCenter + (newPoint - oldCenter) / newSize
                    int n = component.size();
                    centerLat = centerLat + (neighbor.getLocationLat().doubleValue() - centerLat) / n;
                    centerLon = centerLon + (neighbor.getLocationLong().doubleValue() - centerLon) / n;
                }
                // Rejected neighbor: do NOT mark visited — it will seed its own cluster
            }
        }
    }

    private Cluster createClusterFromComponent(List<Booking> bookings) {
        Cluster cluster = new Cluster();

        // Step 7: Name (Auto-generated)
        String name = "Cluster-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase() + "-" + bookings.size()
                + "Bookings";
        cluster.setName(name);

        cluster.setStatus(Cluster.ClusterStatus.PENDING);
        // Farms left empty — cluster is now keyed to booking locations, not Farm FK
        // rows
        cluster.setFarms(new HashSet<>());

        // Calculate Center from booking locations
        if (!bookings.isEmpty()) {
            double avgLat = bookings.stream().mapToDouble(b -> b.getLocationLat().doubleValue()).average().orElse(0.0);
            double avgLon = bookings.stream().mapToDouble(b -> b.getLocationLong().doubleValue()).average().orElse(0.0);
            cluster.setCenterLatitude(BigDecimal.valueOf(avgLat));
            cluster.setCenterLongitude(BigDecimal.valueOf(avgLon));
        }

        // Set Priority (Random 1-10 as per requirement)
        cluster.setPriority((int) (Math.random() * 10) + 1);

        // Step 8: Suggest Dates (Today + 2 days, for 3 days duration)
        cluster.setStartDate(LocalDate.now().plusDays(2));
        cluster.setEndDate(LocalDate.now().plusDays(5));

        return cluster;
    }

    private List<Cluster> splitComponentIntoClusters(List<Booking> component, Map<Long, List<Booking>> adjacencyList) {
        List<Cluster> result = new ArrayList<>();
        Set<Long> unassignedIds = component.stream().map(Booking::getBookingId).collect(Collectors.toSet());
        Map<Long, Booking> bookingMap = component.stream().collect(Collectors.toMap(Booking::getBookingId, b -> b));

        int safetyCounter = 0;
        final int MAX_ITERATIONS = 5000;

        while (!unassignedIds.isEmpty()) {
            if (++safetyCounter > MAX_ITERATIONS) {
                // Failsafe to prevent infinite loops if logic is flawed or data is unusual
                break;
            }

            Long seedId = unassignedIds.iterator().next();
            Booking seed = bookingMap.get(seedId);

            List<Booking> clusterBookings = new ArrayList<>();
            clusterBookings.add(seed);
            unassignedIds.remove(seedId);

            BigDecimal currentArea = seed.getFarmAreaAcres() != null ? seed.getFarmAreaAcres() : BigDecimal.ZERO;

            boolean addedAnything = true;
            while (addedAnything && currentArea.compareTo(BigDecimal.valueOf(10)) < 0) {
                addedAnything = false;

                Booking bestCandidate = null;

                for (Booking member : clusterBookings) {
                    List<Booking> neighbors = adjacencyList.get(member.getBookingId());
                    if (neighbors != null) {
                        for (Booking n : neighbors) {
                            if (unassignedIds.contains(n.getBookingId())) {
                                BigDecimal nArea = n.getFarmAreaAcres() != null ? n.getFarmAreaAcres()
                                        : BigDecimal.ZERO;
                                if (currentArea.add(nArea).compareTo(BigDecimal.valueOf(10)) <= 0) {
                                    bestCandidate = n;
                                    break;
                                }
                            }
                        }
                    }
                    if (bestCandidate != null)
                        break;
                }

                if (bestCandidate != null) {
                    clusterBookings.add(bestCandidate);
                    BigDecimal nArea = bestCandidate.getFarmAreaAcres() != null ? bestCandidate.getFarmAreaAcres()
                            : BigDecimal.ZERO;
                    currentArea = currentArea.add(nArea);
                    unassignedIds.remove(bestCandidate.getBookingId());
                    addedAnything = true;
                }
            }
            if (!clusterBookings.isEmpty()) {
                result.add(createClusterFromComponent(clusterBookings));
            }
        }
        return result;
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
