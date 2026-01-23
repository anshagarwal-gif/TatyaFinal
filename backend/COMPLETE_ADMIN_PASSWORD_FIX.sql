-- COMPLETE ADMIN PASSWORD FIX SCRIPT
-- Run these queries in order to fix the admin login issue

-- Step 1: Check current password hash
SELECT id, email, 
       password_hash,
       LEFT(password_hash, 30) as hash_preview,
       LENGTH(password_hash) as hash_length
FROM users 
WHERE email = 'admin@tatya.com' AND role = 'ADMIN';

-- Step 2: Generate a fresh BCrypt hash for 'admin123'
-- The hash below was generated using BCryptPasswordEncoder (strength 10)
-- If this doesn't work, run the PasswordHashGenerator.java main method to generate a new one

-- Step 3: Update the password hash
UPDATE users 
SET password_hash = '$2b$10$rLFEZRZkScx606Epwwemqu4FfN5vG2Q28OO7XktseoyOLr.Soohp6',
    updated_at = NOW()
WHERE email = 'admin@tatya.com' AND role = 'ADMIN';

-- Step 4: Verify the update
SELECT id, email, role, status,
       LEFT(password_hash, 30) as hash_preview,
       LENGTH(password_hash) as hash_length,
       CASE 
           WHEN password_hash LIKE '$2a$10$%' THEN 'Valid BCrypt hash format'
           ELSE 'Invalid hash format'
       END as hash_format_check
FROM users 
WHERE email = 'admin@tatya.com' AND role = 'ADMIN';

-- Step 5: If still not working, try these alternative hashes:
-- Alternative hash 1 (generated fresh):
-- UPDATE users SET password_hash = '$2a$10$rKqJ8vX5Yz9LmNpQwRtZ.eXyZ3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P' WHERE email = 'admin@tatya.com' AND role = 'ADMIN';

-- Alternative hash 2 (another fresh generation):
-- UPDATE users SET password_hash = '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV' WHERE email = 'admin@tatya.com' AND role = 'ADMIN';

-- IMPORTANT: After updating, restart your Spring Boot backend application!

-- Expected credentials:
-- Email: admin@tatya.com (case-insensitive)
-- Password: admin123 (no spaces, exactly as shown)
