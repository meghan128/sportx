import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // USERS ROUTES
  
  // Get current user
  app.get('/api/users/current', async (req, res) => {
    try {
      // For demo purposes, return a sample user
      const user = await storage.getUserById(1);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
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

  const httpServer = createServer(app);
  return httpServer;
}
