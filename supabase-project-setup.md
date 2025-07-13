# Supabase Project Setup - Step by Step Guide

## Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (green button)
3. Sign up with GitHub, Google, or email
4. Complete account verification if using email

## Step 2: Create New Project
1. Once logged in, click "New project"
2. Select your organization (or create one)
3. Fill in project details:
   - **Project Name**: `SportX CPD Platform`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East, EU West)
   - **Pricing Plan**: Free tier is perfect for development

## Step 3: Wait for Database Creation
- Project creation takes 2-3 minutes
- You'll see a progress indicator
- Don't close the browser tab

## Step 4: Get Your Credentials
Once the project is ready:
1. Go to **Settings** → **API** (in left sidebar)
2. Copy these two values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 5: Set Up Environment Variables
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Run Database Migration
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of `supabase-migration.sql`
4. Click **Run** to execute the migration
5. You should see "Success" messages

## Step 7: Verify Setup
1. Restart your Replit application
2. Check server logs for "🚀 Using Supabase storage"
3. Visit Settings page to see storage status

## What You'll See After Success
- Server logs will show "🚀 Using Supabase storage" instead of "📝 Using in-memory storage"
- Storage status dashboard will show "Supabase Database" with green checkmarks
- All data will persist between server restarts
- Real-time features will be available

## Troubleshooting
- **Project creation stuck**: Refresh page and try again
- **Environment variables not working**: Make sure `.env` file is in root directory
- **Migration errors**: Check SQL syntax and try running sections individually
- **Connection issues**: Verify URL and key are correct

## Security Notes
- Keep your database password secure
- The anon key is safe to use in frontend code
- Row Level Security (RLS) is enabled by default
- Only authenticated users can access data

## Next Steps After Setup
1. Test user registration and login
2. Verify course enrollment persistence
3. Check real-time updates
4. Explore Supabase dashboard features