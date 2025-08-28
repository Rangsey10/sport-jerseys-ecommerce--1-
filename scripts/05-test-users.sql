-- Test data for profiles table
-- This script helps you create test admin and user accounts
-- 
-- IMPORTANT: Before running this script, you need to:
-- 1. Go to Supabase Auth dashboard
-- 2. Create users with these email addresses manually
-- 3. Get their user IDs from the auth.users table
-- 4. Replace the placeholder IDs below with the actual user IDs

-- Example test admin user
-- Replace 'admin-user-id-here' with the actual UUID from auth.users
INSERT INTO public.profiles (id, first_name, last_name, email, role) 
VALUES (
  'admin-user-id-here',  -- Replace with actual user ID from auth.users
  'Admin', 
  'Administrator', 
  'admin@jerseys.com', 
  'admin'
) ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  first_name = 'Admin',
  last_name = 'Administrator',
  email = 'admin@jerseys.com';

-- Example test customer user
-- Replace 'customer-user-id-here' with the actual UUID from auth.users
INSERT INTO public.profiles (id, first_name, last_name, email, role) 
VALUES (
  'customer-user-id-here',  -- Replace with actual user ID from auth.users
  'John', 
  'Customer', 
  'customer@jerseys.com', 
  'user'
) ON CONFLICT (id) DO UPDATE SET 
  role = 'user',
  first_name = 'John',
  last_name = 'Customer',
  email = 'customer@jerseys.com';

-- Query to check existing users and their roles
SELECT p.id, p.email, p.role, p.first_name, p.last_name, p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;
