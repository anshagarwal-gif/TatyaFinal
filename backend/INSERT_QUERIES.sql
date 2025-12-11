-- SQL INSERT Queries for Demo Data
-- Run these queries in your MySQL database to insert 2 drones with their specifications

USE tatyaapp;

-- Step 1: Insert Users (Vendors)
INSERT INTO users (full_name, email, phone, password_hash, role, status, created_at, updated_at)
VALUES 
    ('Rajesh Kumar', 'rajesh.kumar@tatya.com', '9876543210', '$2a$10$exampleHash1', 'VENDOR', 'ACTIVE', NOW(), NOW()),
    ('Priya Sharma', 'priya.sharma@tatya.com', '9876543211', '$2a$10$exampleHash2', 'VENDOR', 'ACTIVE', NOW(), NOW());

-- Step 2: Insert Vendors (linked to users)
-- Note: Replace the user IDs below with the actual IDs from Step 1 if auto-increment doesn't match
INSERT INTO vendors (vendor_id, aadhaar_no, license_no, experience_years, service_area, rating_avg, verified_status)
VALUES 
    (1, '123456789012', 'DRONE-LIC-001', 5, 'geolocation', 4.75, 'VERIFIED'),
    (2, '123456789013', 'DRONE-LIC-002', 3, 'district', 4.50, 'VERIFIED');

-- Step 3: Insert Drones
INSERT INTO drones (
    vendor_id, 
    drone_model, 
    capacity_liters, 
    flight_time_minutes, 
    battery_count, 
    status, 
    price_per_hour, 
    price_per_acre, 
    notes, 
    created_at
)
VALUES 
    -- Drone 1: Agricultural Sprayer Pro
    (
        1, 
        'Agricultural Sprayer Pro', 
        15.0, 
        25, 
        2, 
        'AVAILABLE', 
        500.00, 
        300.00, 
        'Professional agricultural spraying drone with advanced features', 
        NOW()
    ),
    -- Drone 2: Crop Guardian X1
    (
        2, 
        'Crop Guardian X1', 
        18.0, 
        30, 
        3, 
        'AVAILABLE', 
        600.00, 
        350.00, 
        'High-capacity crop protection drone', 
        NOW()
    );

-- Step 4: Insert Specifications for Drone 1 (Agricultural Sprayer Pro)
-- Get drone_id = 1 (first inserted drone)
INSERT INTO drone_specifications (
    option_set, 
    tank_size_liters, 
    sprinkler_type, 
    time_per_acre_minutes, 
    spray_width_meters, 
    is_available, 
    auto_return_safety, 
    solid_sprayer_compatibility, 
    drone_id
)
VALUES 
    -- Option Set 1 for Drone 1
    (
        1, 
        12.0, 
        'Dual Nozzle Sprayer', 
        '4-6', 
        6.0, 
        true, 
        true, 
        true, 
        1
    ),
    -- Option Set 2 for Drone 1
    (
        2, 
        16.0, 
        'Centrifugal Disc Sprayer', 
        '5', 
        7.0, 
        true, 
        true, 
        true, 
        1
    );

-- Step 5: Insert Specifications for Drone 2 (Crop Guardian X1)
-- Get drone_id = 2 (second inserted drone)
INSERT INTO drone_specifications (
    option_set, 
    tank_size_liters, 
    sprinkler_type, 
    time_per_acre_minutes, 
    spray_width_meters, 
    is_available, 
    auto_return_safety, 
    solid_sprayer_compatibility, 
    drone_id
)
VALUES 
    -- Option Set 1 for Drone 2
    (
        1, 
        12.0, 
        'Dual Nozzle Sprayer', 
        '4-6', 
        6.0, 
        true, 
        true, 
        true, 
        2
    ),
    -- Option Set 2 for Drone 2
    (
        2, 
        16.0, 
        'Centrifugal Disc Sprayer', 
        '5', 
        7.0, 
        true, 
        true, 
        true, 
        2
    );

-- Step 6: Insert Availability Slots for Drones
-- Note: Adjust dates as needed. These queries use DATE_ADD to create dates relative to today
-- Replace drone_id values (1, 2) with actual drone IDs from your database if different

-- Availability for Drone 1 (Agricultural Sprayer Pro) - Next 14 days
-- Day 1 (Today)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, CURDATE(), '06:00:00', '10:00:00', false),
    (1, CURDATE(), '10:00:00', '14:00:00', false),
    (1, CURDATE(), '14:00:00', '18:00:00', false);

-- Day 2 (Tomorrow)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '18:00:00', false);

-- Day 3
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '18:00:00', false);

-- Day 4
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00', '18:00:00', false);

-- Day 5
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '14:00:00', '18:00:00', false);

-- Day 6
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00:00', '18:00:00', false);

-- Day 7
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '14:00:00', '18:00:00', false);

-- Day 8-14 (Batch insert for efficiency)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
SELECT 
    1 as drone_id,
    DATE_ADD(CURDATE(), INTERVAL n DAY) as available_date,
    '06:00:00' as start_time,
    '10:00:00' as end_time,
    false as is_booked
FROM (
    SELECT 7 as n UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
) days
UNION ALL
SELECT 
    1,
    DATE_ADD(CURDATE(), INTERVAL n DAY),
    '10:00:00',
    '14:00:00',
    false
FROM (
    SELECT 7 as n UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
) days
UNION ALL
SELECT 
    1,
    DATE_ADD(CURDATE(), INTERVAL n DAY),
    '14:00:00',
    '18:00:00',
    false
FROM (
    SELECT 7 as n UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
) days;

-- Availability for Drone 2 (Crop Guardian X1) - Next 14 days
-- Day 1 (Today)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, CURDATE(), '07:00:00', '11:00:00', false),
    (2, CURDATE(), '11:00:00', '15:00:00', false),
    (2, CURDATE(), '15:00:00', '19:00:00', false);

-- Day 2 (Tomorrow)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', '19:00:00', false);

-- Day 3
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:00:00', '19:00:00', false);

-- Day 4
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:00:00', '19:00:00', false);

-- Day 5
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '15:00:00', '19:00:00', false);

-- Day 6
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '15:00:00', '19:00:00', false);

-- Day 7
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '15:00:00', '19:00:00', false);

-- Day 8-14 (Batch insert for efficiency)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
SELECT 
    2 as drone_id,
    DATE_ADD(CURDATE(), INTERVAL n DAY) as available_date,
    '07:00:00' as start_time,
    '11:00:00' as end_time,
    false as is_booked
FROM (
    SELECT 7 as n UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
) days
UNION ALL
SELECT 
    2,
    DATE_ADD(CURDATE(), INTERVAL n DAY),
    '11:00:00',
    '15:00:00',
    false
FROM (
    SELECT 7 as n UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
) days
UNION ALL
SELECT 
    2,
    DATE_ADD(CURDATE(), INTERVAL n DAY),
    '15:00:00',
    '19:00:00',
    false
FROM (
    SELECT 7 as n UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
) days;
