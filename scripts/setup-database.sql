-- Complete Database Setup for Sport Jerseys E-commerce
-- Run this script in your Supabase SQL Editor

-- First, create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table (this is the main table causing your error)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table  
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(255),
    size VARCHAR(10),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for orders
CREATE POLICY IF NOT EXISTS "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY IF NOT EXISTS "Admins can update all orders" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policies for order_items
CREATE POLICY IF NOT EXISTS "Users can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY IF NOT EXISTS "Users can insert their own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY IF NOT EXISTS "Admins can view all order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Insert a trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create or update an admin user (optional - for testing)
-- You can modify the email to match your account
DO $$
BEGIN
    -- Only insert if no admin exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
        -- Update this email to match your Supabase auth user email
        UPDATE public.profiles 
        SET role = 'admin', 
            updated_at = NOW()
        WHERE email = 'your-email@example.com'; -- Change this to your email
        
        -- If no user with that email exists, you'll need to sign up first
        -- then run: UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
    END IF;
END $$;
