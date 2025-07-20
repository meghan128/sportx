# SportXTracker Database Seeding Guide

This guide provides comprehensive instructions for seeding your SportXTracker platform with realistic dummy data for testing and development purposes.

## 🎯 Overview

The seeding system creates realistic professional data for your SportX India CPD platform, including:

- **Users**: Sports medicine professionals, physiotherapists, coaches, nutritionists
- **Events**: Workshops, webinars, conferences with realistic pricing and details
- **Courses**: Professional development courses with proper structure
- **CPD Activities**: Continuing Professional Development tracking
- **Community Content**: Forum discussions, mentorship opportunities
- **Professional Credentials**: Certifications, degrees, licenses

## 📁 Available Seeding Options

### Option 1: SQL Seeding (Recommended)
**File**: `scripts/seed.sql`
**Method**: Direct SQL insertion with PostgreSQL

```bash
# Run the seeding script
./scripts/run-seed.sh

# Or manually with psql
psql $DATABASE_URL -f scripts/seed.sql
```

### Option 2: TypeScript Seeding (Advanced)
**File**: `scripts/seed-database.ts`
**Method**: Programmatic seeding with Faker.js and Drizzle ORM

```bash
# Run with tsx (if you have the npm script)
npx tsx scripts/seed-database.ts
```

## 🗃️ Created Data Structure

### Users (5 Professional Profiles)
1. **Dr. Sarah Smith** - Senior Physiotherapist & Resource Person
   - Email: `sarah.smith@sportsmedicine.com`
   - Specialization: Sports Injury Prevention
   - Location: Mumbai, Maharashtra

2. **Rahul Sharma** - Strength & Conditioning Coach
   - Email: `rahul.sharma@performancelab.com`
   - Specialization: Performance Enhancement
   - Location: New Delhi, Delhi

3. **Dr. Priya Patel** - Sports Nutritionist
   - Email: `priya.patel@sportsnutrition.in`
   - Specialization: Performance Nutrition
   - Location: Bangalore, Karnataka

4. **Rajesh Kumar** - Physiotherapist (Regular User)
   - Email: `rajesh.kumar@rehabcenter.com`
   - Specialization: Orthopedic Rehabilitation
   - Location: Pune, Maharashtra

5. **Anjali Gupta** - Exercise Physiology Student
   - Email: `anjali.gupta@student.edu`
   - Specialization: Cardiac Rehabilitation
   - Location: Mumbai, Maharashtra

### Events (3 Professional Events)
1. **Advanced Sports Injury Assessment Workshop**
   - Date: August 15, 2025
   - Location: Mumbai, India
   - Price: ₹2,500 | CPD Points: 6

2. **Nutrition for Endurance Athletes Webinar**
   - Date: August 22, 2025
   - Format: Virtual
   - Price: ₹1,500 | CPD Points: 3

3. **Strength Training for Injury Prevention Conference**
   - Date: September 5, 2025
   - Format: Hybrid (Delhi, India)
   - Price: ₹3,500 | CPD Points: 8

### Courses (3 Professional Development Courses)
1. **Fundamentals of Sports Biomechanics**
   - Duration: 8 weeks | 24 lessons
   - Price: ₹8,500 | CPD Points: 12

2. **Advanced Manual Therapy Techniques**
   - Duration: 12 weeks | 36 lessons
   - Price: ₹12,500 | CPD Points: 18

3. **Sports Nutrition Certification Program**
   - Duration: 16 weeks | 48 lessons
   - Price: ₹15,000 | CPD Points: 25

### CPD Categories (5 Professional Categories)
- Clinical Practice (15 points required)
- Education & Training (10 points required)
- Research & Development (8 points required)
- Professional Activities (7 points required)
- Self-Directed Learning (10 points required)

### Community Content
- **6 Forum Categories**: General Discussion, Clinical Cases, Research & Evidence, Career Development, Technology & Tools, Student Corner
- **4 Active Discussions**: ACL injury prevention, career transitions, concussion management, movement analysis technology
- **3 Mentorship Opportunities**: From senior professionals offering guidance
- **Professional Credentials**: Certifications, degrees, and licenses for each user

## 🔐 Demo Login Credentials

After seeding, you can test the platform with these accounts:

### Resource Person Account
- **Email**: `resource@example.com`
- **Password**: `password`
- **Role**: Resource Person (Can create content, mentor others)

### Regular User Account
- **Email**: `user@example.com`
- **Password**: `password`
- **Role**: User (Can enroll in courses, attend events)

## 🛠️ Technical Implementation

### Database Schema Compatibility
The seeding data is designed to work with your existing Drizzle ORM schema in `shared/schema.ts`. All foreign key relationships are properly maintained.

### Data Relationships
- Users have multiple CPD activities tracked across different categories
- Course enrollments show realistic progress tracking
- Event registrations include proper ticket type selections
- Forum discussions have realistic engagement metrics
- Mentorship opportunities are linked to qualified professionals

### Professional Authenticity
All data reflects realistic Indian sports medicine context:
- Proper Indian names and locations
- Realistic pricing in Indian Rupees
- Accreditation bodies relevant to India (Sports Medicine India, ACSM, NSCA)
- Professional specializations common in sports medicine
- Authentic course durations and CPD point allocations

## 🚀 Running the Seeding

### Prerequisites
1. PostgreSQL database running and accessible via `DATABASE_URL`
2. Database schema already applied (run `npm run db:push` first)

### Execution Steps
1. **Ensure database is ready**:
   ```bash
   npm run db:push
   ```

2. **Run the seeding script**:
   ```bash
   ./scripts/run-seed.sh
   ```

3. **Verify seeding success**:
   - Check the script output for confirmation
   - Login with demo credentials to test the platform

### Troubleshooting
- **Permission denied**: Run `chmod +x scripts/run-seed.sh`
- **Database connection error**: Verify `DATABASE_URL` is set correctly
- **Table not found**: Run `npm run db:push` to create schema first

## 🧹 Clearing Data

The seeding script includes TRUNCATE statements to clear existing data. To manually clear:

```sql
TRUNCATE TABLE notifications, messages, credentials, mentorship_connections, 
mentorship_opportunities, discussion_replies, discussions, forum_categories, 
cpd_activities, cpd_categories, course_enrollments, courses, event_registrations, 
ticket_types, events, users RESTART IDENTITY CASCADE;
```

## 📈 Testing Scenarios

After seeding, you can test these realistic scenarios:

1. **User Registration & Profile Setup**
2. **Course Enrollment & Progress Tracking**
3. **Event Registration & Ticket Selection**
4. **CPD Activity Logging & Verification**
5. **Community Discussions & Mentorship**
6. **Professional Credential Management**
7. **Career Path Recommendations**

## 🔄 Production Considerations

- **Never run seeding on production** - This will delete existing data
- **Backup before seeding** - Always backup your database first
- **Customize data** - Modify the seed files to match your specific requirements
- **Security** - Change default passwords before production use

## 📞 Support

If you encounter issues with seeding:
1. Check database connectivity
2. Verify schema is up to date
3. Review the console output for specific errors
4. Ensure all required dependencies are installed

The seeded data provides a comprehensive foundation for testing all platform features while maintaining professional authenticity and realistic user scenarios.