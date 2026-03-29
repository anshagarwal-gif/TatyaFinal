package com.tatya.util;

import java.util.Optional;

/**
 * Parses "lat,lng" strings as stored on {@link com.tatya.entity.Drone#getCoordinates()}.
 */
public final class GeoUtils {

    private GeoUtils() {
    }

    public static Optional<double[]> parseLatLngCommaSeparated(String coordinates) {
        if (coordinates == null) {
            return Optional.empty();
        }
        String trimmed = coordinates.trim();
        if (trimmed.isEmpty()) {
            return Optional.empty();
        }
        String[] parts = trimmed.split(",");
        if (parts.length < 2) {
            return Optional.empty();
        }
        try {
            double lat = Double.parseDouble(parts[0].trim());
            double lng = Double.parseDouble(parts[1].trim());
            if (Double.isNaN(lat) || Double.isNaN(lng) || Double.isInfinite(lat) || Double.isInfinite(lng)) {
                return Optional.empty();
            }
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                return Optional.empty();
            }
            return Optional.of(new double[] { lat, lng });
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }
}
