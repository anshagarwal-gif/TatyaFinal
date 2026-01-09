-- SQL INSERT Queries for Availability Data
-- Run these queries in your MySQL database to insert availability slots for drones
-- Make sure drones exist in the database before running these queries

USE tatyaapp;

-- ============================================
-- AVAILABILITY FOR DRONE 1 (Agricultural Sprayer Pro)
-- ============================================
-- Replace drone_id = 1 with your actual drone ID if different

-- Today - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, CURDATE(), '06:00:00', '10:00:00', false),
    (1, CURDATE(), '10:00:00', '14:00:00', false),
    (1, CURDATE(), '14:00:00', '18:00:00', false);

-- Tomorrow - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '18:00:00', false);

-- Day 3 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '18:00:00', false);

-- Day 4 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00', '18:00:00', false);

-- Day 5 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '14:00:00', '18:00:00', false);

-- Day 6 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00:00', '18:00:00', false);

-- Day 7 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '06:00:00', '10:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:00:00', '14:00:00', false),
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '14:00:00', '18:00:00', false);

-- Days 8-14 - Batch insert (21 slots total: 7 days × 3 slots)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
SELECT 1, DATE_ADD(CURDATE(), INTERVAL n DAY), '06:00:00', '10:00:00', false FROM (SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13) AS days(n)
UNION ALL
SELECT 1, DATE_ADD(CURDATE(), INTERVAL n DAY), '10:00:00', '14:00:00', false FROM (SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13) AS days(n)
UNION ALL
SELECT 1, DATE_ADD(CURDATE(), INTERVAL n DAY), '14:00:00', '18:00:00', false FROM (SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13) AS days(n);


-- ============================================
-- AVAILABILITY FOR DRONE 2 (Crop Guardian X1)
-- ============================================
-- Replace drone_id = 2 with your actual drone ID if different

-- Today - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, CURDATE(), '07:00:00', '11:00:00', false),
    (2, CURDATE(), '11:00:00', '15:00:00', false),
    (2, CURDATE(), '15:00:00', '19:00:00', false);

-- Tomorrow - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', '19:00:00', false);

-- Day 3 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:00:00', '19:00:00', false);

-- Day 4 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:00:00', '19:00:00', false);

-- Day 5 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '15:00:00', '19:00:00', false);

-- Day 6 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '15:00:00', '19:00:00', false);

-- Day 7 - 3 time slots
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '07:00:00', '11:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '11:00:00', '15:00:00', false),
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '15:00:00', '19:00:00', false);

-- Days 8-14 - Batch insert (21 slots total: 7 days × 3 slots)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
SELECT 2, DATE_ADD(CURDATE(), INTERVAL n DAY), '07:00:00', '11:00:00', false FROM (SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13) AS days(n)
UNION ALL
SELECT 2, DATE_ADD(CURDATE(), INTERVAL n DAY), '11:00:00', '15:00:00', false FROM (SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13) AS days(n)
UNION ALL
SELECT 2, DATE_ADD(CURDATE(), INTERVAL n DAY), '15:00:00', '19:00:00', false FROM (SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13) AS days(n);


-- ============================================
-- ALTERNATIVE: Insert specific dates manually
-- ============================================
-- If you prefer to use specific dates instead of relative dates, use this format:
-- Replace '2024-01-15' with your desired date

/*
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, '2024-01-15', '06:00:00', '10:00:00', false),
    (1, '2024-01-15', '10:00:00', '14:00:00', false),
    (1, '2024-01-15', '14:00:00', '18:00:00', false),
    (1, '2024-01-16', '06:00:00', '10:00:00', false),
    (1, '2024-01-16', '10:00:00', '14:00:00', false),
    (1, '2024-01-16', '14:00:00', '18:00:00', false);
*/

-- ============================================
-- NOTES:
-- ============================================
-- 1. Make sure drone_id values (1, 2) match your actual drone IDs
-- 2. All slots are set to is_booked = false (available)
-- 3. Dates are calculated relative to today using CURDATE() and DATE_ADD()
-- 4. Time slots are in HH:MM:SS format (24-hour)
-- 5. Each drone gets 3 time slots per day for 14 days (42 slots total per drone)
-- 6. To add more days, increase the INTERVAL values or add more INSERT statements




