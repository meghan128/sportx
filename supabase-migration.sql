
-- Supabase Migration for SportX CPD Platform
-- This script creates the database schema compatible with the Drizzle application schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order due to dependencies)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS credentials CASCADE;
DROP TABLE IF EXISTS mentorship_connections CASCADE;
DROP TABLE IF EXISTS mentorship_opportunities CASCADE;
DROP TABLE IF EXISTS discussion_replies CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS forum_categories CASCADE;
DROP TABLE IF EXISTS cpd_activities CASCADE;
DROP TABLE IF EXISTS cpd_categories CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS ticket_types CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS document_verifications CASCADE;
DROP TABLE IF EXISTS resource_person_profiles CASCADE;
DROP TABLE IF EXISTS professional_profiles CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- Session storage table for authentication
CREATE TABLE sessions (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IDX_session_expire ON sessions(expire);

-- Users table - Enhanced with authentication system
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth TEXT,
  alternative_names JSONB DEFAULT '[]',
  password TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'professional', 'resource_person')),
  auth_status TEXT NOT NULL DEFAULT 'pending' CHECK (auth_status IN ('pending', 'approved', 'rejected', 'under_review')),
  profession TEXT,
  specialization TEXT,
  bio TEXT,
  organization TEXT,
  location TEXT,
  profile_image TEXT,
  contact_info JSONB,
  social_links JSONB,
  privacy_settings JSONB DEFAULT '{"profilePublic": true, "showEmail": false, "showPhone": false, "allowMessages": true, "allowMentorship": true, "showCourses": true, "showEvents": true, "showCpd": false}',
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Student-specific information
CREATE TABLE student_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  degree_program TEXT NOT NULL,
  current_year INTEGER NOT NULL,
  expected_graduation TEXT,
  university TEXT NOT NULL,
  student_id TEXT,
  marksheet_url TEXT NOT NULL,
  marksheet_verified BOOLEAN DEFAULT false,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Professional-specific information
CREATE TABLE professional_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  degree_type TEXT NOT NULL,
  degree_name TEXT NOT NULL,
  university TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  degree_url TEXT NOT NULL,
  degree_verified BOOLEAN DEFAULT false,
  license_number TEXT,
  license_expiry_date TEXT,
  affiliations JSONB DEFAULT '[]',
  years_of_experience INTEGER,
  current_workplace TEXT,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Resource person-specific information
CREATE TABLE resource_person_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  degree_type TEXT NOT NULL,
  degree_name TEXT NOT NULL,
  university TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  degree_url TEXT NOT NULL,
  degree_verified BOOLEAN DEFAULT false,
  mandatory_affiliations JSONB NOT NULL,
  additional_certifications JSONB DEFAULT '[]',
  years_of_experience INTEGER NOT NULL,
  expertise_areas JSONB DEFAULT '[]',
  publications JSONB DEFAULT '[]',
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Document verification logs
CREATE TABLE document_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  ocr_extracted_text TEXT,
  ocr_confidence DECIMAL(5,2),
  name_matches JSONB,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'under_review')),
  verified_by INTEGER REFERENCES users(id),
  verification_date TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Events table - Enhanced with real-time updates
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('In-person', 'Virtual', 'Hybrid')),
  category TEXT NOT NULL,
  location TEXT,
  image TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cpd_points INTEGER NOT NULL DEFAULT 0,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  accreditation_body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  learning_outcomes JSONB,
  speakers JSONB,
  schedule JSONB,
  tags JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Ticket types for events
CREATE TABLE ticket_types (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  max_quantity INTEGER,
  available_quantity INTEGER,
  available_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Event registrations
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id INTEGER NOT NULL REFERENCES ticket_types(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Courses table - Enhanced with progress tracking
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  cpd_points INTEGER NOT NULL DEFAULT 0,
  duration TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  instructor TEXT NOT NULL,
  instructor_bio TEXT,
  instructor_image TEXT,
  accreditation_body TEXT NOT NULL,
  learning_outcomes JSONB,
  modules JSONB,
  tags JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Course enrollments
CREATE TABLE course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  completed_modules JSONB DEFAULT '[]',
  current_lesson INTEGER DEFAULT 1,
  time_spent INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  certificate_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- CPD Categories table
CREATE TABLE cpd_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  required_points INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'Book',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- CPD Activities table
CREATE TABLE cpd_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id INTEGER REFERENCES cpd_categories(id),
  points INTEGER NOT NULL DEFAULT 0,
  hours DECIMAL(5,2),
  source TEXT,
  certificate_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by INTEGER REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  evidence_urls JSONB DEFAULT '[]',
  reflection_notes TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Forum Categories table
CREATE TABLE forum_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  topics INTEGER DEFAULT 0,
  posts INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Discussions table
CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES forum_categories(id),
  comments INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 1,
  tags JSONB DEFAULT '[]',
  is_pinned BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  last_reply_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Discussion Replies table
CREATE TABLE discussion_replies (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES discussion_replies(id),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Mentorship Opportunities table
CREATE TABLE mentorship_opportunities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position TEXT NOT NULL,
  specialties JSONB DEFAULT '[]',
  availability TEXT NOT NULL,
  max_mentees INTEGER NOT NULL,
  current_mentees INTEGER DEFAULT 0,
  preferred_experience TEXT NOT NULL,
  meeting_format TEXT NOT NULL,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Mentorship Connections table
CREATE TABLE mentorship_connections (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id INTEGER REFERENCES mentorship_opportunities(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  goals JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(mentor_id, mentee_id, opportunity_id)
);

-- Credentials table
CREATE TABLE credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiry_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  verification_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending')),
  is_public BOOLEAN DEFAULT true,
  attachments JSONB DEFAULT '[]',
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  message_type TEXT DEFAULT 'direct' CHECK (message_type IN ('direct', 'system', 'announcement')),
  thread_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_cpd_activities_user ON cpd_activities(user_id);
CREATE INDEX idx_cpd_activities_date ON cpd_activities(date);
CREATE INDEX idx_discussions_category ON discussions(category_id);
CREATE INDEX idx_discussions_author ON discussions(author_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cpd_activities_updated_at BEFORE UPDATE ON cpd_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentorship_opportunities_updated_at BEFORE UPDATE ON mentorship_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
