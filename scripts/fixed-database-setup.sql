-- FIXED Database Setup - No Recursion Issues
-- Run this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables and policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Service role can access all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can access all orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for own orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can update all order items" ON public.order_items;
DROP POLICY IF EXISTS "Service role can access all order items" ON public.order_items;

DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address JSONB NOT NULL,
    payment_method TEXT DEFAULT 'stripe',
    stripe_payment_intent_id TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    size TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies without recursion
-- Profiles table policies
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Orders table policies
CREATE POLICY "orders_select_own" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_own" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Order items table policies
CREATE POLICY "order_items_select_own" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "order_items_insert_own" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

-- Create utility functions
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

-- Create function to ensure user profile exists
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id UUID, user_email TEXT)
RETURNS UUID AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (user_id, user_email, user_email)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all orders for admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_orders_admin()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    total_amount DECIMAL,
    status TEXT,
    shipping_address JSONB,
    payment_method TEXT,
    stripe_payment_intent_id TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_email TEXT,
    user_full_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.payment_method,
        o.stripe_payment_intent_id,
        o.tracking_number,
        o.notes,
        o.created_at,
        o.updated_at,
        p.email as user_email,
        p.full_name as user_full_name
    FROM public.orders o
    LEFT JOIN public.profiles p ON o.user_id = p.id
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update order status (admin only)
CREATE OR REPLACE FUNCTION public.update_order_status(order_id UUID, new_status TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    -- Check if current user is admin
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) INTO is_admin;
    
    IF NOT is_admin THEN
        RAISE EXCEPTION 'Only admins can update order status';
    END IF;
    
    -- Update the order status
    UPDATE public.orders 
    SET status = new_status, updated_at = NOW()
    WHERE id = order_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get order statistics
CREATE OR REPLACE FUNCTION public.get_order_stats()
RETURNS TABLE (
    total_orders BIGINT,
    pending_orders BIGINT,
    processing_orders BIGINT,
    completed_orders BIGINT,
    total_revenue DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'processing') as processing_orders,
        COUNT(*) FILTER (WHERE status IN ('shipped', 'delivered')) as completed_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue
    FROM public.orders;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Fixed database setup completed! 🎉' as message;
