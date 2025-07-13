# Supabase Setup Guide for SportX CPD Platform

## Quick Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: "SportX CPD Platform"
   - Database Password: (create a strong password)
   - Region: Choose closest to your users

### 2. Get Your Credentials
After project creation:
1. Go to Settings → API
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Add Environment Variables
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Database Migration
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-migration.sql`
4. Run the migration

### 5. Restart Your Application
The application will automatically detect Supabase credentials and switch from in-memory storage to Supabase.

## Features You'll Get After Migration

### Real-time Updates
- Live course enrollment updates
- Instant notifications
- Real-time community discussions

### Enhanced Authentication
- Social login (Google, LinkedIn, GitHub)
- Email verification
- Password reset functionality

### Better Performance
- Optimized database queries
- Connection pooling
- Edge caching

### Scalability
- Handle thousands of concurrent users
- Automatic scaling
- 99.9% uptime

### Security
- Row Level Security (RLS)
- API rate limiting
- Data encryption

## Migration Benefits

### Before (In-Memory)
- ❌ Data lost on restart
- ❌ Single server limitation
- ❌ No real-time features
- ❌ Basic authentication only

### After (Supabase)
- ✅ Persistent data storage
- ✅ Horizontal scaling
- ✅ Real-time subscriptions
- ✅ Advanced authentication
- ✅ File storage capabilities
- ✅ Built-in API documentation

## Testing the Integration

1. **Verify Connection**: Check server logs for "🚀 Using Supabase storage"
2. **Test User Registration**: Create a new user account
3. **Test Course Enrollment**: Enroll in a course and verify persistence
4. **Test Real-time**: Open multiple browser tabs and see live updates

## Troubleshooting

### Common Issues
1. **"Using in-memory storage" message**: Check environment variables
2. **Connection errors**: Verify Supabase URL and key
3. **RLS errors**: Ensure policies are properly configured

### Support
- Supabase Documentation: [docs.supabase.com](https://docs.supabase.com)
- Discord Community: [discord.supabase.com](https://discord.supabase.com)

## Next Steps After Setup

1. **Configure Authentication**: Set up social providers
2. **Add File Storage**: Enable file uploads for course materials
3. **Set up Edge Functions**: Add server-side business logic
4. **Configure Real-time**: Enable live features
5. **Add Analytics**: Track user engagement

## Cost Considerations

### Free Tier Includes:
- Up to 50,000 monthly active users
- 500MB database space
- 1GB file storage
- 2GB bandwidth
- No credit card required

### Pro Tier ($25/month):
- Up to 100,000 monthly active users
- 8GB database space
- 100GB file storage
- 250GB bandwidth
- Daily backups

Perfect for most educational platforms starting out!