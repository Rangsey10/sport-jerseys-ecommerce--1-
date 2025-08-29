-- Quick Fix for Order Creation Issue
-- Run this in your Supabase SQL Editor

-- 1. Create the ensure_user_profile function
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id UUID, user_email TEXT)
RETURNS UUID AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (user_id, user_email, user_email)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update the trigger function to handle conflicts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create profiles for any existing auth users who don't have profiles
INSERT INTO public.profiles (id, email, full_name)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email)
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 4. Grant execute permission on the new function
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID, TEXT) TO anon, authenticated;

-- Success message
SELECT 'Profile fix applied successfully! 🎉' as message;
