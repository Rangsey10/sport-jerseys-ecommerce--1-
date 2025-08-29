-- Complete Database Setup for Sport Jerseys E-commerce
-- Run this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful with this in production!)
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

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Separate policy for admin access to avoid recursion
CREATE POLICY "Service role can access all profiles" ON public.profiles
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for orders table
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all orders" ON public.orders
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for order_items table
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create order items for own orders" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can access all order items" ON public.order_items
    FOR ALL USING (auth.role() = 'service_role');

-- Create trigger function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
    RETURN COALESCE(user_role, 'customer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role FROM public.profiles WHERE id = user_id) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert admin user (replace with your actual admin email)
-- You'll need to sign up with this email first, then run this update
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Insert some sample data for testing (optional)
-- Uncomment the lines below if you want sample data

/*
-- Sample admin user (make sure this user exists in auth.users first)
INSERT INTO public.profiles (id, email, full_name, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@sportjerseys.com', 'Admin User', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Sample customer
INSERT INTO public.profiles (id, email, full_name, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'customer@example.com', 'John Doe', 'customer')
ON CONFLICT (email) DO NOTHING;

-- Sample order
INSERT INTO public.orders (id, user_id, total_amount, status, shipping_address) VALUES 
    ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 129.99, 'pending', '{
        "firstName": "John",
        "lastName": "Doe", 
        "email": "customer@example.com",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
    }');

-- Sample order item
INSERT INTO public.order_items (order_id, product_id, product_name, product_image, size, quantity, unit_price, total_price) VALUES 
    ('650e8400-e29b-41d4-a716-446655440000', 'jersey-001', 'Lakers Jersey', '/placeholder.png', 'L', 1, 129.99, 129.99);
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Database setup completed successfully! 🎉' as message;
