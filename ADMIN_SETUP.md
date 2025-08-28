# Admin Dashboard Setup Guide

## How to Set Up Admin Users

The admin dashboard is now integrated into the navbar and will only appear for users with admin role.

### Steps to Create Admin Users:

1. **Register a new user** through the normal registration process (`/auth/register`)

2. **Go to Supabase Dashboard**:

   - Navigate to your Supabase project
   - Go to "Authentication" → "Users"
   - Find the user you just created

3. **Update User Role in Database**:

   - Go to "Table Editor" → "profiles" table
   - Find the user record by email
   - Change the `role` column from `user` to `admin`
   - Save the changes

4. **Alternative: Use SQL Script**:
   ```sql
   -- Update existing user to admin
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-admin-email@example.com';
   ```

### Admin Dashboard Features:

- **Admin Navigation**: Admin users will see "Admin Dashboard" in the user dropdown menu
- **Route Protection**: `/admin` routes are protected and only accessible to admin users
- **Order Management**: View and update order statuses
- **User Management**: View user information and order history
- **Statistics**: View total products, orders, revenue, and pending orders

### How to Access:

1. **Login** as an admin user
2. **Click on your profile icon** in the top-right corner
3. **Select "Admin Dashboard"** from the dropdown menu
4. You'll be redirected to `/admin` page

### User Experience:

- **Regular users**: Will only see "My Orders" in the dropdown
- **Admin users**: Will see both "Admin Dashboard" and "My Orders"
- **Non-logged in users**: Will see "Sign In" button

### Security:

- Middleware automatically checks user roles
- Non-admin users are redirected to homepage if they try to access admin routes
- Database policies ensure only admins can access admin-specific data

### Testing:

1. Create a test admin user using the steps above
2. Login with admin credentials
3. Verify "Admin Dashboard" appears in the navbar dropdown
4. Test that regular users don't see the admin option
