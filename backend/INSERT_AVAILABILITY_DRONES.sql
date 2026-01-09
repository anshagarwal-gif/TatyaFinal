-- SQL INSERT Queries for Availability Data
-- Add available dates and time slots for Drone 1 and Drone 2
-- Table: availability
-- Columns: id (auto-increment), drone_id, available_date, start_time, end_time, is_booked

-- ============================================
-- AVAILABILITY FOR DRONE 1
-- ============================================
-- Three time slots per day: 06:00-10:00, 10:00-14:00, 14:00-18:00
-- Adding availability for the next 14 days starting from today

-- Day 1 (Today)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, CURDATE(), '06:00:00', '10:00:00', 0),
    (1, CURDATE(), '10:00:00', '14:00:00', 0),
    (1, CURDATE(), '14:00:00', '18:00:00', 0);

-- Day 2 (Tomorrow)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '18:00:00', 0);

-- Day 3
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '18:00:00', 0);

-- Day 4
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00', '18:00:00', 0);

-- Day 5
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '14:00:00', '18:00:00', 0);

-- Day 6
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00:00', '18:00:00', 0);

-- Day 7
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '14:00:00', '18:00:00', 0);

-- Day 8
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '14:00:00', '18:00:00', 0);

-- Day 9
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '14:00:00', '18:00:00', 0);

-- Day 10
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '14:00:00', '18:00:00', 0);

-- Day 11
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '14:00:00', '18:00:00', 0);

-- Day 12
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 11 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 11 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 11 DAY), '14:00:00', '18:00:00', 0);

-- Day 13
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 12 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 12 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 12 DAY), '14:00:00', '18:00:00', 0);

-- Day 14
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (1, DATE_ADD(CURDATE(), INTERVAL 13 DAY), '06:00:00', '10:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 13 DAY), '10:00:00', '14:00:00', 0),
    (1, DATE_ADD(CURDATE(), INTERVAL 13 DAY), '14:00:00', '18:00:00', 0);

-- ============================================
-- AVAILABILITY FOR DRONE 2
-- ============================================
-- Same time slots: 06:00-10:00, 10:00-14:00, 14:00-18:00
-- Adding availability for the next 14 days starting from today

-- Day 1 (Today)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, CURDATE(), '06:00:00', '10:00:00', 0),
    (2, CURDATE(), '10:00:00', '14:00:00', 0),
    (2, CURDATE(), '14:00:00', '18:00:00', 0);

-- Day 2 (Tomorrow)
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '18:00:00', 0);

-- Day 3
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '18:00:00', 0);

-- Day 4
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00', '18:00:00', 0);

-- Day 5
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '14:00:00', '18:00:00', 0);

-- Day 6
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00:00', '18:00:00', 0);

-- Day 7
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '14:00:00', '18:00:00', 0);

-- Day 8
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '14:00:00', '18:00:00', 0);

-- Day 9
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '14:00:00', '18:00:00', 0);

-- Day 10
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '14:00:00', '18:00:00', 0);

-- Day 11
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '14:00:00', '18:00:00', 0);

-- Day 12
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 11 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 11 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 11 DAY), '14:00:00', '18:00:00', 0);

-- Day 13
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 12 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 12 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 12 DAY), '14:00:00', '18:00:00', 0);

-- Day 14
INSERT INTO availability (drone_id, available_date, start_time, end_time, is_booked)
VALUES 
    (2, DATE_ADD(CURDATE(), INTERVAL 13 DAY), '06:00:00', '10:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 13 DAY), '10:00:00', '14:00:00', 0),
    (2, DATE_ADD(CURDATE(), INTERVAL 13 DAY), '14:00:00', '18:00:00', 0);

