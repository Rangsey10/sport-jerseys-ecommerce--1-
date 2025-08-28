-- Simple profiles table setup (run this if you're getting errors)

-- Drop everything and start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create the profiles table
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade not null,
  first_name text,
  last_name text,
  email text,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Enable read access for users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert for users" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for users" ON public.profiles FOR UPDATE USING (true);

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;
