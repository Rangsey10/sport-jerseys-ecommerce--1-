# Deployment Guide

## Environment Variables

For the application to work properly in production, you need to set up the following environment variables in your deployment platform (Vercel, Netlify, etc.):

### Required Variables

#### Supabase Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Stripe Configuration (Optional - for payment functionality)

```env
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Setting Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each variable with the appropriate values
4. Redeploy your application

### Setting Environment Variables on Netlify

1. Go to your Netlify project dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add each variable with the appropriate values
4. Redeploy your application

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 2. Database Setup

Run the following SQL scripts in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  sizes TEXT[],
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders ON DELETE CASCADE,
  product_id INTEGER REFERENCES products ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  selected_size TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Products are readable by everyone
CREATE POLICY "Products are readable by everyone" ON products
  FOR SELECT TO anon, authenticated USING (true);

-- Admins can manage products
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### 3. Create an Admin User

After deployment, you can create an admin user by:

1. Registering a new account through your application
2. Going to your Supabase dashboard > Authentication > Users
3. Finding the user and updating their profile in the profiles table to set `role = 'admin'`

## Stripe Setup (Optional)

If you want to enable payment functionality:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Set up webhooks pointing to your deployed application URL + `/api/webhooks/stripe`
4. Add the environment variables to your deployment platform

## Build Error Troubleshooting

The application is designed to build successfully even without environment variables configured. All Supabase clients include fallback mock implementations that prevent build errors.

### Common Issues:

1. **"supabaseUrl is required" error**: This has been fixed with mock clients
2. **Build fails during static generation**: The middleware and API routes now handle missing environment variables gracefully
3. **Authentication not working**: Make sure your Supabase environment variables are correctly set

## Production Checklist

- [ ] Supabase project created and configured
- [ ] Database tables and policies set up
- [ ] Environment variables configured in deployment platform
- [ ] Application builds successfully
- [ ] Admin user created
- [ ] Stripe configured (if using payments)
- [ ] DNS and custom domain configured (optional)

## Support

If you encounter any issues during deployment, check:

1. Environment variables are correctly set
2. Supabase project is active and accessible
3. Database tables and RLS policies are properly configured
4. Build logs for any specific error messages
