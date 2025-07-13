-- Supabase Migration for SportX CPD Platform
-- This script creates the database schema compatible with the existing application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  profession VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  bio TEXT,
  organization VARCHAR(255),
  location VARCHAR(255),
  profile_image VARCHAR(255),
  contact_info JSONB,
  social_links JSONB,
  privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "contact_visibility": "members"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50) NOT NULL CHECK (type IN ('In-person', 'Virtual', 'Hybrid')),
  category VARCHAR(100) NOT NULL,
  cpd_points INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_attendees INTEGER,
  image VARCHAR(255),
  accreditation_body VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Types table
CREATE TABLE IF NOT EXISTS ticket_types (
  id VARCHAR(50) PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  available_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id VARCHAR(50) REFERENCES ticket_types(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id, ticket_type_id)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category VARCHAR(100) NOT NULL,
  cpd_points INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image VARCHAR(255),
  accreditation_body VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- CPD Categories table
CREATE TABLE IF NOT EXISTS cpd_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CPD Activities table
CREATE TABLE IF NOT EXISTS cpd_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  cpd_points INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  hours DECIMAL(5,2),
  certificate_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Categories table
CREATE TABLE IF NOT EXISTS forum_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES forum_categories(id),
  replies_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentorship Opportunities table
CREATE TABLE IF NOT EXISTS mentorship_opportunities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  position VARCHAR(255) NOT NULL,
  experience VARCHAR(100) NOT NULL,
  specialization VARCHAR(255),
  description TEXT,
  availability VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpd_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpd_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be refined later)
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Events are readable by all authenticated users
CREATE POLICY "Events are readable by all" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Courses are readable by all authenticated users
CREATE POLICY "Courses are readable by all" ON courses
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can manage their own enrollments
CREATE POLICY "Users can manage own enrollments" ON course_enrollments
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Users can manage their own CPD activities
CREATE POLICY "Users can manage own CPD activities" ON cpd_activities
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Users can manage their own credentials
CREATE POLICY "Users can manage own credentials" ON credentials
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_cpd_activities_user ON cpd_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_cpd_activities_date ON cpd_activities(date);
CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category_id);
CREATE INDEX IF NOT EXISTS idx_discussions_author ON discussions(author_id);

-- Insert sample data
INSERT INTO users (username, password, name, email, profession, specialization, bio, organization, location) VALUES
('sarah_chen', '$2b$10$hashedpassword1', 'Dr. Sarah Chen', 'sarah.chen@example.com', 'Physiotherapist', 'Sports Rehabilitation', 'Specialized in sports injury rehabilitation with 8 years of experience.', 'Manchester Sports Clinic', 'Manchester, UK'),
('james_wright', '$2b$10$hashedpassword2', 'James Wright', 'james.wright@example.com', 'Sports Psychologist', 'Performance Psychology', 'Sports psychologist focusing on athlete performance and mental health.', 'Elite Performance Institute', 'London, UK'),
('emma_thompson', '$2b$10$hashedpassword3', 'Dr. Emma Thompson', 'emma.thompson@example.com', 'Sports Nutritionist', 'Performance Nutrition', 'Certified sports nutritionist with expertise in athlete dietary planning.', 'Nutrition Excellence Centre', 'Birmingham, UK');

INSERT INTO forum_categories (name, description, icon) VALUES
('Physio Hub', 'Discussions about physiotherapy techniques and best practices', 'activity'),
('Sports Psychology', 'Mental health and performance psychology topics', 'brain'),
('Nutrition Corner', 'Sports nutrition and dietary guidance', 'apple'),
('Research Updates', 'Latest research and scientific developments', 'book-open');

INSERT INTO cpd_categories (name, description) VALUES
('Clinical Practice', 'Hands-on clinical work and patient care'),
('Professional Development', 'Career advancement and professional skills'),
('Research and Evidence', 'Research participation and evidence-based practice'),
('Education and Training', 'Teaching, mentoring, and training activities');

-- Insert sample events
INSERT INTO events (title, description, date, start_time, end_time, location, type, category, cpd_points, price, accreditation_body) VALUES
('Advanced Sports Injury Management', 'Comprehensive workshop on managing complex sports injuries', '2024-02-15', '09:00', '17:00', 'Manchester Conference Centre', 'In-person', 'Physiotherapy', 8, 150.00, 'CSP'),
('Mental Health in Elite Sport', 'Understanding and supporting athlete mental health', '2024-02-20', '10:00', '16:00', 'Virtual Platform', 'Virtual', 'Psychology', 6, 120.00, 'BASES'),
('Nutrition for Peak Performance', 'Evidence-based nutrition strategies for athletes', '2024-02-25', '09:30', '17:30', 'Birmingham Sports Centre', 'Hybrid', 'Nutrition', 8, 180.00, 'HCPC');

-- Insert sample courses
INSERT INTO courses (title, description, instructor, duration, difficulty, category, cpd_points, price, accreditation_body) VALUES
('Advanced Rehabilitation Techniques', 'Master advanced rehabilitation methods for sports injuries', 'Dr. Michael Johnson', '6 weeks', 'Advanced', 'Physiotherapy', 12, 299.99, 'CSP'),
('Sports Psychology Fundamentals', 'Introduction to sports psychology principles and applications', 'Dr. Lisa Anderson', '4 weeks', 'Beginner', 'Psychology', 8, 199.99, 'BASES'),
('Sports Nutrition: Science to Practice', 'Evidence-based approach to sports nutrition', 'Prof. David Miller', '8 weeks', 'Intermediate', 'Nutrition', 16, 399.99, 'HCPC'),
('Leadership in Sports Medicine', 'Developing leadership skills in healthcare settings', 'Dr. Rachel Green', '5 weeks', 'Intermediate', 'Professional Development', 10, 249.99, 'CSP');

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