import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-factory";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { authLimiter, apiLimiter } from "./middleware/security";

export async function registerRoutes(app: Express): Promise<Server> {
  // AUTH ROUTES
  
  // Login endpoint for general users
  app.post('/api/auth/login/user', authLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Mock authentication for demo - replace with real authentication
      if (email === "user@example.com" && password === "password") {
        const user = {
          id: "1",
          name: "Demo User",
          email: "user@example.com",
          role: "user",
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
        };
        res.json({ user, token: "mock-token-user" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Login endpoint for resource persons
  app.post('/api/auth/login/resource-person', authLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Mock authentication for demo - replace with real authentication
      if (email === "resource@example.com" && password === "password") {
        const user = {
          id: "2",
          name: "Demo Resource Person",
          email: "resource@example.com",
          role: "resource_person",
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
        };
        res.json({ user, token: "mock-token-resource" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Logout user
  app.post('/api/auth/logout', (req, res) => {
    try {
      // In a real app with sessions, we would destroy the session
      // req.session.destroy();
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to logout' });
    }
  });
  
  // USERS ROUTES
  
  // Get current user
  app.get('/api/users/current', async (req, res) => {
    try {
      // For demo purposes, check authorization header for role
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header' });
      }
      
      // Mock user based on token
      if (authHeader.includes('mock-token-user')) {
        const user = {
          id: 1,
          name: "Demo User",
          email: "user@example.com",
          role: "user",
          username: "demouser",
          profession: "Sports Therapist",
          bio: "Passionate about sports rehabilitation",
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
        };
        res.json(user);
      } else if (authHeader.includes('mock-token-resource')) {
        const user = {
          id: 2,
          name: "Demo Resource Person",
          email: "resource@example.com",
          role: "resource_person", 
          username: "demoresource",
          profession: "Senior Physiotherapist",
          bio: "Expert in sports medicine and rehabilitation",
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
        };
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Update user profile
  app.patch('/api/users/profile', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // EVENTS ROUTES
  
  // Get upcoming events
  app.get('/api/events/upcoming', async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch events' });
    }
  });

  // Get all events with filtering
  app.get('/api/events', async (req, res) => {
    try {
      const { search, type, category, dateRange, cpdPoints } = req.query;
      const events = await storage.getAllEvents({
        search: search as string,
        type: type ? (type as string).split(',') : undefined,
        category: category ? (category as string).split(',') : undefined,
        dateRange: dateRange as string,
        cpdPoints: cpdPoints as string
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch events' });
    }
  });

  // Get event categories
  app.get('/api/events/categories', async (req, res) => {
    try {
      const categories = await storage.getEventCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch event categories' });
    }
  });

  // Get event by id
  app.get('/api/events/:id', async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch event' });
    }
  });

  // Register for an event
  app.post('/api/events/register', async (req, res) => {
    try {
      const schema = z.object({
        eventId: z.number().or(z.string().transform(val => parseInt(val))),
        ticketTypeId: z.string().or(z.number().transform(val => val.toString())),
        quantity: z.number().min(1).default(1)
      });

      const data = schema.parse(req.body);
      const userId = 1; // In a real app, this would come from the authenticated user's session
      
      const registration = await storage.registerForEvent(userId, data.eventId, data.ticketTypeId, data.quantity);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to register for event' });
    }
  });

  // COURSES ROUTES
  
  // Get courses in progress
  app.get('/api/courses/in-progress', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const courses = await storage.getUserCourses(userId, 'in_progress');
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  // Get recommended courses
  app.get('/api/courses/recommended', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const courses = await storage.getRecommendedCourses(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch recommended courses' });
    }
  });

  // Get all courses with filtering
  app.get('/api/courses', async (req, res) => {
    try {
      const { search, category, duration, cpdPoints, difficulty } = req.query;
      const courses = await storage.getAllCourses({
        search: search as string,
        category: category ? (category as string).split(',') : undefined,
        duration: duration as string,
        cpdPoints: cpdPoints as string,
        difficulty: difficulty as string
      });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  // Get course categories
  app.get('/api/courses/categories', async (req, res) => {
    try {
      const categories = await storage.getCourseCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch course categories' });
    }
  });

  // Get course by id
  app.get('/api/courses/:id', async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const course = await storage.getCourseById(courseId, userId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch course' });
    }
  });

  // Enroll in a course
  app.post('/api/courses/enroll', async (req, res) => {
    try {
      const schema = z.object({
        courseId: z.number().or(z.string().transform(val => parseInt(val)))
      });

      const data = schema.parse(req.body);
      const userId = 1; // In a real app, this would come from the authenticated user's session
      
      const enrollment = await storage.enrollInCourse(userId, data.courseId);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to enroll in course' });
    }
  });

  // CPD ROUTES
  
  // Get CPD summary
  app.get('/api/cpd/summary', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const summary = await storage.getCpdSummary(userId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch CPD summary' });
    }
  });

  // Get CPD status
  app.get('/api/cpd/status', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const status = await storage.getCpdStatus(userId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch CPD status' });
    }
  });

  // Get CPD activities
  app.get('/api/cpd/activities', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const { year, category, search } = req.query;
      const activities = await storage.getCpdActivities(userId, {
        year: year as string,
        category: category as string,
        search: search as string
      });
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch CPD activities' });
    }
  });

  // ACCREDITATION ROUTES
  
  // Get connected accreditation accounts
  app.get('/api/accreditation/accounts', async (req, res) => {
    try {
      // For demo purposes, we'll return sample data
      // In production, this would fetch from storage
      res.json([
        {
          id: "1",
          body: "CSP",
          membershipId: "CSP12345",
          status: "approved",
          lastSynced: "2 hours ago",
          totalCredits: 24,
          pendingCredits: 3
        },
        {
          id: "2",
          body: "BASES",
          membershipId: "B98765",
          status: "pending",
          lastSynced: "1 day ago",
          totalCredits: 12,
          pendingCredits: 6
        }
      ]);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch accreditation accounts' });
    }
  });
  
  // Get recent accreditation activities
  app.get('/api/accreditation/activities', async (req, res) => {
    try {
      // For demo purposes, we'll return sample data
      // In production, this would fetch from storage
      res.json([
        {
          id: "1",
          body: "CSP",
          activity: "Course completion: Advanced Rehabilitation Techniques",
          points: 3,
          status: "approved",
          date: "2023-05-12"
        },
        {
          id: "2",
          body: "CSP",
          activity: "Workshop attendance: Knee Injury Assessment",
          points: 2,
          status: "pending",
          date: "2023-05-10"
        },
        {
          id: "3",
          body: "BASES",
          activity: "Webinar: Performance Analytics in Team Sports",
          points: 1,
          status: "approved",
          date: "2023-05-05"
        }
      ]);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch accreditation activities' });
    }
  });
  
  // Connect new accreditation account
  app.post('/api/accreditation/connect', async (req, res) => {
    try {
      // In production, this would validate and store the connection
      // For demo purposes, we'll just return success
      setTimeout(() => {
        res.json({ success: true, message: 'Account connected successfully' });
      }, 1000);
    } catch (error) {
      res.status(500).json({ message: 'Failed to connect account' });
    }
  });
  
  // COMMUNITY ROUTES
  
  // Get forum categories
  app.get('/api/community/categories', async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch forum categories' });
    }
  });

  // Get recent/trending discussions
  app.get('/api/community/discussions/trending', async (req, res) => {
    try {
      const discussions = await storage.getTrendingDiscussions();
      res.json(discussions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch discussions' });
    }
  });

  // RESOURCE PERSONNEL ROUTES
  
  // Middleware to check if user is resource personnel
  function requireResourceRole(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes('mock-token-resource')) {
      return res.status(403).json({ message: 'Access denied: Resource personnel only' });
    }
    next();
  }

  // Get resource dashboard statistics
  app.get('/api/resource/stats', requireResourceRole, async (req, res) => {
    try {
      // Mock data for demo - replace with real data in production
      const stats = {
        totalCourses: 12,
        activeCourses: 8,
        totalStudents: 245,
        pendingReviews: 7,
        avgRating: 4.6,
        thisMonthCompletions: 34
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch resource statistics' });
    }
  });

  // Get resource person's courses
  app.get('/api/resource/courses', requireResourceRole, async (req, res) => {
    try {
      // Mock data for demo - replace with real data in production
      const courses = [
        {
          id: 1,
          title: "Advanced Sports Rehabilitation Techniques",
          enrolledStudents: 45,
          completionRate: 78,
          avgRating: 4.7,
          status: 'active',
          lastUpdated: '2024-01-15'
        },
        {
          id: 2,
          title: "Injury Prevention in Team Sports",
          enrolledStudents: 32,
          completionRate: 65,
          avgRating: 4.5,
          status: 'active',
          lastUpdated: '2024-01-10'
        },
        {
          id: 3,
          title: "Performance Analytics for Coaches",
          enrolledStudents: 28,
          completionRate: 92,
          avgRating: 4.8,
          status: 'completed',
          lastUpdated: '2023-12-20'
        }
      ];
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  // Get pending submissions for review
  app.get('/api/resource/submissions/pending', requireResourceRole, async (req, res) => {
    try {
      // Mock data for demo - replace with real data in production
      const submissions = [
        {
          id: 1,
          studentName: "Sarah Johnson",
          courseName: "Advanced Sports Rehabilitation Techniques",
          submissionType: "Final Assessment",
          submittedAt: '2024-01-18T10:30:00Z',
          status: 'pending'
        },
        {
          id: 2,
          studentName: "Mike Chen",
          courseName: "Injury Prevention in Team Sports",
          submissionType: "Case Study Report",
          submittedAt: '2024-01-17T14:20:00Z',
          status: 'pending'
        },
        {
          id: 3,
          studentName: "Emma Davis",
          courseName: "Advanced Sports Rehabilitation Techniques",
          submissionType: "Practical Assignment",
          submittedAt: '2024-01-16T09:45:00Z',
          status: 'needs_revision'
        }
      ];
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch submissions' });
    }
  });

  // Get pending approvals
  app.get('/api/resource/approvals/pending', requireResourceRole, async (req, res) => {
    try {
      // Mock data for demo - replace with real data in production
      const approvals = [
        {
          id: 1,
          type: 'course',
          title: 'New Course: Mental Health in Sports',
          submittedBy: 'Dr. Lisa Wong',
          submittedAt: '2024-01-19T11:15:00Z',
          priority: 'high'
        },
        {
          id: 2,
          type: 'badge',
          title: 'Sports Psychology Specialist Badge',
          submittedBy: 'Prof. James Wilson',
          submittedAt: '2024-01-18T16:30:00Z',
          priority: 'medium'
        },
        {
          id: 3,
          type: 'accreditation',
          title: 'CPD Event: Annual Sports Medicine Conference',
          submittedBy: 'Dr. Maria Rodriguez',
          submittedAt: '2024-01-17T13:45:00Z',
          priority: 'low'
        }
      ];
      res.json(approvals);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch pending approvals' });
    }
  });

  // Review submission
  app.post('/api/resource/submissions/:id/review', requireResourceRole, async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const { status, feedback } = req.body;
      
      // In production, this would update the submission in the database
      res.json({ 
        success: true, 
        message: 'Submission review submitted successfully',
        submissionId,
        status,
        feedback
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to submit review' });
    }
  });

  // Approve or reject item
  app.post('/api/resource/approvals/:id/action', requireResourceRole, async (req, res) => {
    try {
      const approvalId = parseInt(req.params.id);
      const { action, comments } = req.body; // action: 'approve' or 'reject'
      
      // In production, this would update the approval status in the database
      res.json({ 
        success: true, 
        message: `Item ${action}d successfully`,
        approvalId,
        action,
        comments
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to process approval' });
    }
  });

  // Create new course
  app.post('/api/resource/courses', requireResourceRole, async (req, res) => {
    try {
      const { title, description, category, duration, cpdPoints } = req.body;
      
      // In production, this would create a course in the database
      const newCourse = {
        id: Math.floor(Math.random() * 1000) + 100,
        title,
        description,
        category,
        duration,
        cpdPoints,
        enrolledStudents: 0,
        completionRate: 0,
        avgRating: 0,
        status: 'draft',
        lastUpdated: new Date().toISOString()
      };
      
      res.status(201).json(newCourse);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create course' });
    }
  });

  // Update course
  app.patch('/api/resource/courses/:id', requireResourceRole, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const updateData = req.body;
      
      // In production, this would update the course in the database
      res.json({ 
        success: true, 
        message: 'Course updated successfully',
        courseId,
        updateData
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update course' });
    }
  });

  // Get recent discussions
  app.get('/api/community/discussions/recent', async (req, res) => {
    try {
      const discussions = await storage.getRecentDiscussions();
      res.json(discussions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch recent discussions' });
    }
  });

  // Get mentorship opportunities
  app.get('/api/community/mentorships', async (req, res) => {
    try {
      const mentorships = await storage.getMentorshipOpportunities();
      res.json(mentorships);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch mentorship opportunities' });
    }
  });
  
  // CREDENTIALS ROUTES
  
  // Get user credentials
  app.get('/api/credentials', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const credentials = await storage.getUserCredentials(userId);
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch credentials' });
    }
  });
  
  // Get credential by id
  app.get('/api/credentials/:id', async (req, res) => {
    try {
      const credentialId = parseInt(req.params.id);
      const credential = await storage.getCredentialById(credentialId);
      if (!credential) {
        return res.status(404).json({ message: 'Credential not found' });
      }
      res.json(credential);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch credential' });
    }
  });
  
  // Add new credential
  app.post('/api/credentials', async (req, res) => {
    try {
      const schema = z.object({
        type: z.string(),
        name: z.string(),
        organization: z.string(),
        issueDate: z.string(),
        expiryDate: z.string().optional(),
        credentialId: z.string().optional(),
        credentialUrl: z.string().optional(),
        status: z.string().default('active')
      });
      
      const data = schema.parse(req.body);
      const userId = 1; // In a real app, this would come from the authenticated user's session
      
      const credential = await storage.createCredential({
        ...data,
        userId
      });
      
      res.status(201).json(credential);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create credential' });
    }
  });
  
  // Update credential
  app.patch('/api/credentials/:id', async (req, res) => {
    try {
      const credentialId = parseInt(req.params.id);
      const updatedCredential = await storage.updateCredential(credentialId, req.body);
      res.json(updatedCredential);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update credential' });
    }
  });
  
  // Delete credential
  app.delete('/api/credentials/:id', async (req, res) => {
    try {
      const credentialId = parseInt(req.params.id);
      const result = await storage.deleteCredential(credentialId);
      if (!result) {
        return res.status(404).json({ message: 'Credential not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete credential' });
    }
  });
  
  // SECURITY AND PRIVACY ROUTES
  
  // Update privacy settings
  app.patch('/api/users/privacy', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const schema = z.object({
        profilePublic: z.boolean().optional(),
        showEmail: z.boolean().optional(),
        showPhone: z.boolean().optional(),
        allowMessages: z.boolean().optional(),
        allowMentorship: z.boolean().optional(),
        showCourses: z.boolean().optional(),
        showEvents: z.boolean().optional(),
        showCpd: z.boolean().optional()
      });
      
      const data = schema.parse(req.body);
      const updatedUser = await storage.updateUserPrivacySettings(userId, data);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update privacy settings' });
    }
  });
  
  // Change password
  app.post('/api/users/change-password', async (req, res) => {
    try {
      const userId = 1; // In a real app, this would come from the authenticated user's session
      const schema = z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8)
      });
      
      const data = schema.parse(req.body);
      const result = await storage.changePassword(userId, data.currentPassword, data.newPassword);
      res.json({ success: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      
      // Handle specific error for incorrect password
      if (error instanceof Error && error.message === 'Current password is incorrect') {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      res.status(500).json({ message: 'Failed to change password' });
    }
  });

  // Storage status endpoint
  app.get("/api/storage/status", (req, res) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    res.json({
      type: supabaseUrl && supabaseKey ? 'supabase' : 'memory',
      connected: true,
      features: {
        realtime: !!(supabaseUrl && supabaseKey),
        persistence: !!(supabaseUrl && supabaseKey),
        multiUser: !!(supabaseUrl && supabaseKey),
        analytics: !!(supabaseUrl && supabaseKey)
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
