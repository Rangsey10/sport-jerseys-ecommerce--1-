# Database Setup Instructions

## 🚀 How to Set Up Your Database Tables

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project
4. Click on **"SQL Editor"** in the left sidebar

### Step 2: Run the Setup Script
1. In the SQL Editor, create a new query
2. Copy the entire content from `scripts/complete-database-setup.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** button

### Step 3: Create Admin User
After running the script, you need to create an admin user:

1. **Sign up normally** on your website with your admin email
2. After signup, go back to Supabase SQL Editor
3. Run this command (replace with your actual email):
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### Step 4: Verify Setup
1. Go to **"Table Editor"** in Supabase
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `orders` 
   - ✅ `order_items`

### Step 5: Test Your Setup
1. Visit your test page: `http://localhost:3000/test-orders`
2. Click "Create Test Order" button
3. Check if orders appear in the admin dashboard

## 🔧 Troubleshooting

### If you get permission errors:
- Make sure you're signed in to Supabase
- Verify you have admin access to your project

### If tables already exist:
- The script will drop and recreate them
- **⚠️ Warning**: This will delete existing data

### If you can't access admin features:
- Make sure you updated your user role to 'admin'
- Sign out and sign back in

## 📊 What This Script Creates

### Tables:
- **profiles**: User information with roles (customer/admin)
- **orders**: Order information with status, shipping, payment
- **order_items**: Individual items within each order

### Security:
- Row Level Security (RLS) policies
- Proper user permissions
- Admin-only access controls

### Features:
- Automatic user profile creation on signup
- Timestamp tracking
- Data validation
- Performance indexes

## ✅ Success Indicators

After setup, you should be able to:
- ✅ Sign up and login
- ✅ Place orders through checkout
- ✅ View orders in admin dashboard (as admin)
- ✅ See test orders created successfully

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase project URL and keys
3. Make sure all environment variables are set correctly
4. Try the test page to verify database connectivity
