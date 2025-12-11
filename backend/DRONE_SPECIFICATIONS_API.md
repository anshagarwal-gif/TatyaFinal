# Drone Specifications API Documentation

## Overview

API endpoints for managing and fetching drone specifications/options for the booking page.

## Database Schema

### Table: `drone_specifications`

- `spec_id` (PK) - Primary key
- `option_set` - Option set number (1 or 2)
- `tank_size_liters` - Tank capacity in liters
- `sprinkler_type` - Type of sprinkler/sprayer
- `time_per_acre_minutes` - Time required per acre (e.g., "4-6" or "5")
- `spray_width_meters` - Spray width in meters
- `is_available` - Availability status (✅/❎)
- `auto_return_safety` - Auto-return safety system (✅/❎)
- `solid_sprayer_compatibility` - Solid sprayer compatibility (✅/❎)
- `drone_id` (FK) - Optional reference to specific drone

## API Endpoints

### 1. Get All Specifications

**GET** `/api/drone-specifications`

Returns all drone specifications.

**Response:**
```json
{
  "success": true,
  "message": "Specifications retrieved successfully",
  "data": [
    {
      "specId": 1,
      "optionSet": 1,
      "tankSizeLiters": 12.0,
      "sprinklerType": "Dual Nozzle Sprayer",
      "timePerAcreMinutes": "4-6",
      "sprayWidthMeters": 6.0,
      "isAvailable": true,
      "autoReturnSafety": true,
      "solidSprayerCompatibility": true,
      "drone": null
    },
    {
      "specId": 2,
      "optionSet": 2,
      "tankSizeLiters": 16.0,
      "sprinklerType": "Centrifugal Disc Sprayer",
      "timePerAcreMinutes": "5",
      "sprayWidthMeters": 7.0,
      "isAvailable": true,
      "autoReturnSafety": true,
      "solidSprayerCompatibility": true,
      "drone": null
    }
  ]
}
```

### 2. Get Available Specifications

**GET** `/api/drone-specifications/available`

Returns only available specifications (isAvailable = true).

**Response:** Same format as above, filtered by availability.

### 3. Get Specifications by Drone ID

**GET** `/api/drone-specifications/drone/{droneId}`

Returns specifications for a specific drone.

**Parameters:**
- `droneId` (path) - The drone ID

**Response:** List of specifications for the specified drone.

### 4. Get Available Specifications by Drone ID

**GET** `/api/drone-specifications/drone/{droneId}/available`

Returns only available specifications for a specific drone.

**Parameters:**
- `droneId` (path) - The drone ID

### 5. Get Specific Option Set for Drone

**GET** `/api/drone-specifications/drone/{droneId}/option-set/{optionSet}`

Returns a specific option set for a drone.

**Parameters:**
- `droneId` (path) - The drone ID
- `optionSet` (path) - Option set number (1 or 2)

**Response:** Single specification object.

### 6. Initialize Default Specifications

**POST** `/api/drone-specifications/initialize`

Initializes default option sets (Option Set 1 and Option Set 2).

**Response:**
```json
{
  "success": true,
  "message": "Default specifications initialized successfully"
}
```

## Default Specifications

### Option Set 1
- **Tank Size:** 12 Liters
- **Sprinkler Type:** Dual Nozzle Sprayer
- **Time per Acre:** 4-6 Minutes
- **Spray Width:** 6 Meters
- **Availability:** ✅
- **Auto-Return Safety System:** ✅
- **Solid Sprayer Compatibility:** ✅

### Option Set 2
- **Tank Size:** 16 Liters
- **Sprinkler Type:** Centrifugal Disc Sprayer
- **Time per Acre:** 5 Minutes
- **Spray Width:** 7 Meters
- **Availability:** ✅
- **Auto-Return Safety System:** ✅
- **Solid Sprayer Compatibility:** ✅

## Usage in Frontend

### Fetching Specifications for Booking Page

```javascript
// Fetch all available specifications
const response = await fetch('http://localhost:8080/api/drone-specifications/available');
const data = await response.json();

if (data.success) {
  const specifications = data.data;
  // Display options in booking page
  specifications.forEach(spec => {
    console.log(`Option Set ${spec.optionSet}:`);
    console.log(`- Tank: ${spec.tankSizeLiters}L`);
    console.log(`- Sprinkler: ${spec.sprinklerType}`);
    console.log(`- Time: ${spec.timePerAcreMinutes} min/acre`);
    console.log(`- Width: ${spec.sprayWidthMeters}m`);
  });
}
```

### Fetching Specifications for Specific Drone

```javascript
// If you have a drone ID
const droneId = 1;
const response = await fetch(`http://localhost:8080/api/drone-specifications/drone/${droneId}/available`);
const data = await response.json();
```

## Data Initialization

Default specifications are automatically initialized when the application starts via `DataInitializer`. You can also manually trigger initialization using the `/initialize` endpoint.

## Notes

- Specifications can be global (drone_id = NULL) or specific to a drone
- Global specifications are available for all drones
- Drone-specific specifications override global ones
- Use `isAvailable` flag to enable/disable options

