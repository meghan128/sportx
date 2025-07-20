-- SportXTracker Platform Seed Data
-- This file contains realistic dummy data for the platform

-- Clear existing data (use with caution in production)
TRUNCATE TABLE notifications, messages, credentials, mentorship_connections, mentorship_opportunities, discussion_replies, discussions, forum_categories, cpd_activities, cpd_categories, course_enrollments, courses, event_registrations, ticket_types, events, users RESTART IDENTITY CASCADE;

-- Insert CPD Categories
INSERT INTO cpd_categories (name, description, required_points, color, icon) VALUES
('Clinical Practice', 'Direct patient care and clinical skills', 15, '#EF4444', 'Stethoscope'),
('Education & Training', 'Formal education and training programs', 10, '#3B82F6', 'GraduationCap'),
('Research & Development', 'Research activities and evidence-based practice', 8, '#10B981', 'FlaskConical'),
('Professional Activities', 'Professional service and leadership', 7, '#F59E0B', 'Users'),
('Self-Directed Learning', 'Independent learning and reflection', 10, '#8B5CF6', 'Book');

-- Insert Users (Sports and Health Professionals)
INSERT INTO users (username, password, name, email, role, profession, specialization, bio, organization, location, profile_image, contact_info, social_links, privacy_settings, is_online, last_seen) VALUES
('dr_smith_physio', '$2b$10$YourHashedPasswordHere', 'Dr. Sarah Smith', 'sarah.smith@sportsmedicine.com', 'resource_person', 'Physiotherapist', 'Sports Injury Prevention', 'Expert physiotherapist with 15 years in sports medicine, specializing in injury prevention and rehabilitation for elite athletes.', 'SportsMed Clinic Mumbai', 'Mumbai, Maharashtra', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face', '{"phone": "+91-9876543210", "website": "https://drsarahsmith.com"}', '{"linkedin": "https://linkedin.com/in/drsarahsmith", "twitter": "https://twitter.com/drsarahsmith"}', '{"profilePublic": true, "allowMessages": true, "allowMentorship": true}', true, NOW()),

('coach_rahul', '$2b$10$YourHashedPasswordHere', 'Rahul Sharma', 'rahul.sharma@performancelab.com', 'resource_person', 'Strength & Conditioning Coach', 'Performance Enhancement', 'Certified strength and conditioning specialist working with professional cricket and football teams across India.', 'Elite Performance Center Delhi', 'New Delhi, Delhi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '{"phone": "+91-9876543211", "website": "https://rahulsharma.fitness"}', '{"linkedin": "https://linkedin.com/in/rahulsharma", "instagram": "https://instagram.com/coachrahul"}', '{"profilePublic": true, "allowMessages": true, "allowMentorship": true}', false, NOW() - INTERVAL '2 hours'),

('nutritionist_priya', '$2b$10$YourHashedPasswordHere', 'Dr. Priya Patel', 'priya.patel@sportsnutrition.in', 'resource_person', 'Sports Nutritionist', 'Performance Nutrition', 'Sports nutritionist with expertise in performance nutrition for endurance athletes and weight management.', 'Sports Nutrition Institute Bangalore', 'Bangalore, Karnataka', 'https://images.unsplash.com/photo-1594824681814-2e9c1bfe8dae?w=150&h=150&fit=crop&crop=face', '{"phone": "+91-9876543212", "website": "https://sportsnutrition.in"}', '{"linkedin": "https://linkedin.com/in/drpriyapatel", "website": "https://sportsnutrition.in"}', '{"profilePublic": true, "allowMessages": true, "allowMentorship": true}', true, NOW()),

('physio_rajesh', '$2b$10$YourHashedPasswordHere', 'Rajesh Kumar', 'rajesh.kumar@rehabcenter.com', 'user', 'Physiotherapist', 'Orthopedic Rehabilitation', 'Experienced physiotherapist specializing in orthopedic rehabilitation and manual therapy techniques.', 'Rehabilitation Institute Pune', 'Pune, Maharashtra', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face', '{"phone": "+91-9876543213"}', '{"linkedin": "https://linkedin.com/in/rajeshkumar"}', '{"profilePublic": true, "allowMessages": true}', false, NOW() - INTERVAL '1 day'),

('student_anjali', '$2b$10$YourHashedPasswordHere', 'Anjali Gupta', 'anjali.gupta@student.edu', 'user', 'Exercise Physiologist', 'Cardiac Rehabilitation', 'Final year student pursuing Masters in Exercise Physiology with interest in cardiac rehabilitation programs.', 'University Sports Medicine Mumbai', 'Mumbai, Maharashtra', 'https://images.unsplash.com/photo-1494790108755-2616b15c2d15?w=150&h=150&fit=crop&crop=face', '{"phone": "+91-9876543214"}', '{"linkedin": "https://linkedin.com/in/anjaligupta", "instagram": "https://instagram.com/anjali_exphys"}', '{"profilePublic": true, "allowMessages": true, "showCpd": false}', true, NOW());

-- Insert Forum Categories
INSERT INTO forum_categories (name, description, icon, color, topics, posts, last_activity, sort_order) VALUES
('General Discussion', 'General topics and announcements', 'MessageSquare', '#3B82F6', 25, 150, NOW() - INTERVAL '2 hours', 1),
('Clinical Cases', 'Discuss challenging cases and treatments', 'FileText', '#EF4444', 18, 89, NOW() - INTERVAL '1 hour', 2),
('Research & Evidence', 'Latest research and evidence-based practice', 'FlaskConical', '#10B981', 12, 67, NOW() - INTERVAL '3 hours', 3),
('Career Development', 'Career advice and professional growth', 'TrendingUp', '#F59E0B', 31, 234, NOW() - INTERVAL '30 minutes', 4),
('Technology & Tools', 'Technology applications in sports medicine', 'Laptop', '#8B5CF6', 9, 45, NOW() - INTERVAL '1 day', 5),
('Student Corner', 'Space for students and new professionals', 'GraduationCap', '#EC4899', 22, 112, NOW() - INTERVAL '4 hours', 6);

-- Insert Events
INSERT INTO events (title, description, date, start_time, end_time, type, category, location, image, price, cpd_points, max_attendees, current_attendees, accreditation_body, status, learning_outcomes, speakers, schedule, tags) VALUES
('Advanced Sports Injury Assessment Workshop', 'Comprehensive workshop covering latest techniques in sports injury assessment and diagnosis. Learn from leading experts in the field.', '2025-08-15', '09:00', '17:00', 'In-person', 'Sports Medicine', 'Mumbai, India', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', 2500.00, 6, 50, 23, 'Sports Medicine India', 'upcoming', '["Master advanced assessment techniques", "Understand injury biomechanics", "Develop clinical reasoning skills", "Learn evidence-based protocols"]', '[{"id": "1", "name": "Dr. Sarah Smith", "bio": "Expert physiotherapist with 15 years experience", "expertise": ["Sports Injury Prevention", "Manual Therapy"]}]', '[{"time": "09:00", "activity": "Registration & Welcome", "duration": "30 minutes"}, {"time": "09:30", "activity": "Keynote: Modern Sports Assessment", "speaker": "Dr. Sarah Smith", "duration": "90 minutes"}]', '["workshop", "assessment", "sports", "injury"]'),

('Nutrition for Endurance Athletes Webinar', 'Learn evidence-based nutrition strategies for optimizing endurance performance. Covers pre, during, and post-exercise nutrition.', '2025-08-22', '19:00', '21:00', 'Virtual', 'Nutrition', 'Online', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', 1500.00, 3, 100, 67, 'ACSM', 'upcoming', '["Understand energy systems", "Master fueling strategies", "Learn hydration protocols", "Apply nutrition periodization"]', '[{"id": "2", "name": "Dr. Priya Patel", "bio": "Sports nutritionist with expertise in performance nutrition", "expertise": ["Performance Nutrition", "Weight Management"]}]', '[{"time": "19:00", "activity": "Introduction to Endurance Nutrition", "speaker": "Dr. Priya Patel", "duration": "120 minutes"}]', '["nutrition", "endurance", "webinar", "performance"]'),

('Strength Training for Injury Prevention Conference', 'Two-day conference exploring the role of strength training in injury prevention across different sports and populations.', '2025-09-05', '08:30', '17:30', 'Hybrid', 'Exercise Physiology', 'Delhi, India', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 3500.00, 8, 150, 89, 'NSCA', 'upcoming', '["Understand injury mechanisms", "Design prevention programs", "Apply periodization principles", "Evaluate program effectiveness"]', '[{"id": "3", "name": "Rahul Sharma", "bio": "Certified strength and conditioning specialist", "expertise": ["Performance Enhancement", "Injury Prevention"]}]', '[{"time": "08:30", "activity": "Registration", "duration": "30 minutes"}, {"time": "09:00", "activity": "Opening Keynote", "speaker": "Rahul Sharma", "duration": "60 minutes"}]', '["strength", "prevention", "conference", "training"]');

-- Insert Ticket Types
INSERT INTO ticket_types (event_id, name, description, price, max_quantity, available_quantity, available_until) VALUES
(1, 'Early Bird', 'Special early bird pricing', 2000.00, 20, 15, '2025-07-30 23:59:59'),
(1, 'Regular', 'Standard workshop ticket', 2500.00, 30, 25, '2025-08-10 23:59:59'),
(2, 'Standard', 'Webinar access with materials', 1500.00, 100, 33, '2025-08-20 23:59:59'),
(3, 'Student', 'Discounted rate for students', 2500.00, 50, 38, '2025-08-30 23:59:59'),
(3, 'Professional', 'Full conference access', 3500.00, 100, 51, '2025-08-30 23:59:59');

-- Insert Courses
INSERT INTO courses (title, description, thumbnail, category, duration, modules, lessons, cpd_points, difficulty, accredited_by, price, rating, reviews, enrollment_count, learning_outcomes, target_audience, prerequisites, video_hours, resources, instructors, curriculum, tags, is_published) VALUES
('Fundamentals of Sports Biomechanics', 'Comprehensive course covering the fundamentals of biomechanical analysis in sports performance and injury prevention.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 'Exercise Science', '8 weeks', 6, 24, 12, 'Intermediate', 'BASES', 8500.00, 4.7, 156, 892, '["Understand biomechanical principles", "Analyze movement patterns", "Apply assessment techniques", "Develop intervention strategies"]', '["Physiotherapists", "Exercise Physiologists", "Sports Therapists"]', '["Basic anatomy knowledge", "Understanding of physics concepts"]', '16 hours', '45 downloadable resources', '[{"id": "1", "name": "Dr. Sarah Smith", "bio": "Expert in biomechanics and sports medicine", "expertise": ["Biomechanics", "Movement Analysis"]}]', '[{"module": 1, "title": "Introduction to Biomechanics", "description": "Basic principles and concepts", "lessons": [{"id": "1", "title": "What is Biomechanics?", "duration": "20 minutes", "type": "video"}]}]', '["biomechanics", "movement", "analysis", "sports"]', true),

('Advanced Manual Therapy Techniques', 'Master advanced manual therapy techniques for treating sports-related injuries and optimizing athletic performance.', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', 'Clinical Skills', '12 weeks', 8, 36, 18, 'Advanced', 'Sports Medicine India', 12500.00, 4.9, 89, 234, '["Master manual techniques", "Understand tissue mechanics", "Develop clinical reasoning", "Apply evidence-based practice"]', '["Physiotherapists", "Sports Therapists", "Manual Therapists"]', '["Clinical experience required", "Basic manual therapy knowledge"]', '24 hours', '60 downloadable resources', '[{"id": "1", "name": "Dr. Sarah Smith", "bio": "Expert manual therapist with 15 years experience", "expertise": ["Manual Therapy", "Sports Medicine"]}]', '[{"module": 1, "title": "Assessment Principles", "description": "Comprehensive assessment techniques", "lessons": [{"id": "1", "title": "Clinical Assessment", "duration": "45 minutes", "type": "video"}]}]', '["manual therapy", "advanced", "techniques", "clinical"]', true),

('Sports Nutrition Certification Program', 'Complete certification program in sports nutrition covering all aspects from basic nutrition to advanced performance strategies.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', 'Sports Nutrition', '16 weeks', 12, 48, 25, 'Beginner', 'ACSM', 15000.00, 4.8, 278, 567, '["Master nutrition fundamentals", "Design nutrition plans", "Understand supplementation", "Apply sport-specific strategies"]', '["Nutritionists", "Coaches", "Athletes", "Health Professionals"]', '["Basic health science knowledge"]', '32 hours', '80 downloadable resources', '[{"id": "2", "name": "Dr. Priya Patel", "bio": "Certified sports nutritionist", "expertise": ["Sports Nutrition", "Performance Enhancement"]}]', '[{"module": 1, "title": "Nutrition Basics", "description": "Fundamental nutrition concepts", "lessons": [{"id": "1", "title": "Macronutrients Overview", "duration": "30 minutes", "type": "video"}]}]', '["nutrition", "sports", "certification", "performance"]', true);

-- Insert Course Enrollments
INSERT INTO course_enrollments (user_id, course_id, progress, status, completed_lessons, current_lesson, time_spent, last_accessed_at, enrolled_at) VALUES
(4, 1, 65, 'in_progress', '["1", "2", "3", "4", "5"]', '6', 420, NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 weeks'),
(5, 3, 25, 'in_progress', '["1", "2"]', '3', 180, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 week'),
(4, 2, 100, 'completed', '["1", "2", "3", "4", "5", "6", "7", "8"]', null, 1200, NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 months');

-- Insert CPD Activities
INSERT INTO cpd_activities (user_id, title, description, date, type, category, category_id, points, hours, source, certificate_url, verification_status, reflection_notes, is_public) VALUES
(1, 'Sports Medicine Conference 2024', 'Attended international conference on latest developments in sports medicine', '2024-12-15', 'Conference', 'Education & Training', 2, 8, 6.0, 'International Sports Medicine Association', 'https://example.com/certificate1', 'verified', 'Excellent conference with practical insights on injury prevention and new treatment modalities.', true),
(2, 'Strength Training Workshop', 'Hands-on workshop on advanced strength training techniques for athletes', '2024-11-20', 'Workshop', 'Clinical Practice', 1, 5, 4.0, 'Elite Performance Center', 'https://example.com/certificate2', 'verified', 'Great practical session that enhanced my coaching methodology.', true),
(3, 'Nutrition Research Publication', 'Published research paper on sports nutrition and performance', '2024-10-10', 'Publication', 'Research & Development', 3, 6, 20.0, 'Journal of Sports Nutrition', 'https://example.com/publication1', 'verified', 'Valuable research experience that contributed to evidence-based practice.', true),
(4, 'Manual Therapy Course', 'Completed advanced manual therapy certification course', '2024-09-30', 'Course', 'Education & Training', 2, 12, 40.0, 'Manual Therapy Institute', 'https://example.com/certificate3', 'verified', 'Comprehensive course that significantly improved my clinical skills.', false),
(5, 'Exercise Prescription Seminar', 'Attended seminar on evidence-based exercise prescription', '2024-08-15', 'Seminar', 'Self-Directed Learning', 5, 3, 2.5, 'University Sports Department', 'https://example.com/certificate4', 'pending', 'Informative session on latest exercise prescription guidelines.', true);

-- Insert Discussions
INSERT INTO discussions (title, content, author_id, category_id, comments, likes, views, tags, is_pinned, last_reply_at, last_reply_by) VALUES
('Best practices for ACL injury prevention', 'Looking for evidence-based strategies for ACL injury prevention in female athletes. What protocols have you found most effective?', 1, 2, 12, 23, 156, '["ACL", "prevention", "female athletes"]', true, NOW() - INTERVAL '2 hours', 4),
('Career transition from clinical to sports setting', 'Seeking advice on transitioning from clinical physiotherapy to sports medicine. What skills should I focus on developing?', 5, 4, 8, 15, 89, '["career", "transition", "sports medicine"]', false, NOW() - INTERVAL '1 day', 2),
('Latest research on concussion management', 'Discussion on recent research findings in concussion assessment and return-to-play protocols.', 2, 3, 15, 31, 234, '["concussion", "research", "return to play"]', false, NOW() - INTERVAL '3 hours', 1),
('Technology in movement analysis', 'What are your experiences with different movement analysis technologies? Looking for cost-effective solutions for clinic use.', 3, 5, 6, 9, 67, '["technology", "movement analysis", "clinic"]', false, NOW() - INTERVAL '1 hour', 4);

-- Insert Mentorship Opportunities
INSERT INTO mentorship_opportunities (user_id, title, description, position, specialties, availability, max_mentees, current_mentees, preferred_experience, meeting_format, rating, reviews, is_active) VALUES
(1, 'Senior Sports Physiotherapist Mentor', 'Mentoring junior physiotherapists in sports medicine and injury prevention', 'Senior Physiotherapist', '["Sports Injury Prevention", "Manual Therapy", "Return to Sport"]', 'Evenings and weekends', 5, 3, 'Entry to Mid-Level', 'Both', 4.9, 23, true),
(2, 'Strength & Conditioning Expert Mentor', 'Guidance for coaches looking to develop expertise in strength and conditioning', 'Head Strength Coach', '["Performance Enhancement", "Program Design", "Athletic Development"]', 'Flexible', 3, 1, 'Any Level', 'Virtual', 4.8, 12, true),
(3, 'Sports Nutrition Career Mentor', 'Supporting nutritionists in building successful sports nutrition careers', 'Senior Sports Nutritionist', '["Performance Nutrition", "Career Development", "Business Skills"]', 'Weekdays', 4, 2, 'Entry Level', 'Virtual', 4.7, 8, true);

-- Insert Credentials
INSERT INTO credentials (user_id, type, name, organization, issue_date, expiry_date, credential_id, status, is_public, verified_by, verified_at) VALUES
(1, 'certification', 'Certified Sports Medicine Professional', 'Sports Medicine India', '2020-06-15', '2025-06-15', 'SMI-2020-001', 'active', true, 'Sports Medicine India', '2020-06-20'),
(1, 'degree', 'Master of Physiotherapy (Sports)', 'Mumbai University', '2015-05-30', null, 'MPT-2015-456', 'active', true, 'Mumbai University', '2015-06-01'),
(2, 'certification', 'Certified Strength & Conditioning Specialist', 'NSCA', '2018-03-22', '2026-03-22', 'CSCS-18-789', 'active', true, 'NSCA', '2018-03-25'),
(3, 'certification', 'Certified Sports Nutritionist', 'ACSM', '2019-09-10', '2025-09-10', 'CSN-2019-123', 'active', true, 'ACSM', '2019-09-15'),
(4, 'degree', 'Bachelor of Physiotherapy', 'Pune University', '2018-04-15', null, 'BPT-2018-234', 'active', true, 'Pune University', '2018-04-20'),
(5, 'degree', 'Master of Exercise Physiology', 'Mumbai University', '2023-05-20', null, 'MEP-2023-567', 'active', true, 'Mumbai University', '2023-05-25');

-- Insert Messages
INSERT INTO messages (sender_id, receiver_id, subject, content, message_type, is_read, read_at) VALUES
(1, 4, 'Welcome to Sports Medicine', 'Hi Rajesh! I noticed you''re interested in sports medicine. Feel free to reach out if you need any guidance or have questions about transitioning into this field.', 'direct', true, NOW() - INTERVAL '1 day'),
(2, 5, 'Mentorship Opportunity', 'Hi Anjali! I saw your profile and think you might benefit from some guidance in exercise physiology. Would you be interested in a mentorship discussion?', 'direct', false, null),
(3, 4, 'Nutrition Course Recommendation', 'Based on your interests, I''d recommend checking out our sports nutrition certification program. It could complement your physiotherapy background well.', 'direct', true, NOW() - INTERVAL '2 hours');

-- Insert Notifications
INSERT INTO notifications (user_id, title, message, type, action_url, action_text, is_read) VALUES
(4, 'New Course Available', 'A new course "Advanced Manual Therapy Techniques" has been published that matches your interests.', 'course', '/courses/2', 'View Course', false),
(5, 'Event Registration Reminder', 'Don''t forget to register for the "Nutrition for Endurance Athletes Webinar" - only 5 days left!', 'event', '/events/2', 'Register Now', false),
(1, 'New Mentorship Request', 'You have received a new mentorship request from Anjali Gupta.', 'community', '/mentorship', 'View Request', true),
(2, 'CPD Milestone Achieved', 'Congratulations! You have completed 15 CPD points this quarter.', 'cpd', '/cpd', 'View Progress', true),
(3, 'Forum Reply', 'Someone replied to your discussion "Latest research on concussion management".', 'community', '/community/discussions/3', 'View Discussion', false);

COMMIT;