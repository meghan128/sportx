import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  studentRegistrationSchema,
  professionalRegistrationSchema,
  resourcePersonRegistrationSchema,
  type StudentRegistration,
  type ProfessionalRegistration,
  type ResourcePersonRegistration,
} from "@shared/schema";
import { upload, getFileUrl } from "./fileUpload";
import { performOCR, validateDocumentAuthenticity } from "./ocr";
import { getSession, requireAuth, requireApprovedAuth, requireUserType } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(getSession());
  
  // AUTH ROUTES
  
  // Registration endpoint for students
  app.post('/api/auth/register/student', upload.single('marksheet'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Marksheet file is required" });
      }

      const registrationData = {
        ...req.body,
        marksheet: getFileUrl(req.file.filename),
        currentYear: parseInt(req.body.currentYear),
        alternativeNames: req.body.alternativeNames ? JSON.parse(req.body.alternativeNames) : []
      };

      const validatedData = studentRegistrationSchema.parse(registrationData);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username) || 
                           await storage.getUserByEmail(validatedData.email);
      
      if (existingUser) {
        return res.status(400).json({ error: "User with this username or email already exists" });
      }

      const result = await storage.registerStudent(validatedData);
      
      // Perform OCR verification
      const userNames = [result.user.name, ...result.user.alternativeNames];
      const ocrResult = await performOCR(req.file.path, userNames, "marksheet");
      const validation = validateDocumentAuthenticity(ocrResult);
      
      // Update document verification
      await storage.verifyUserDocument(
        result.user.id,
        "marksheet",
        ocrResult.extractedText,
        ocrResult.nameMatches
      );

      // Set up session
      (req as any).session.userId = result.user.id;
      
      res.json({
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          userType: result.user.userType,
          authStatus: result.user.authStatus,
        },
        profile: result.profile,
        verification: {
          isValid: validation.isValid,
          confidence: validation.confidence,
          issues: validation.issues
        }
      });
    } catch (error) {
      console.error('Student registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Registration endpoint for professionals
  app.post('/api/auth/register/professional', upload.single('degree'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Degree certificate is required" });
      }

      const registrationData = {
        ...req.body,
        degree: getFileUrl(req.file.filename),
        yearsOfExperience: req.body.yearsOfExperience ? parseInt(req.body.yearsOfExperience) : undefined,
        alternativeNames: req.body.alternativeNames ? JSON.parse(req.body.alternativeNames) : [],
        affiliations: req.body.affiliations ? JSON.parse(req.body.affiliations) : []
      };

      const validatedData = professionalRegistrationSchema.parse(registrationData);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username) || 
                           await storage.getUserByEmail(validatedData.email);
      
      if (existingUser) {
        return res.status(400).json({ error: "User with this username or email already exists" });
      }

      const result = await storage.registerProfessional(validatedData);
      
      // Perform OCR verification
      const userNames = [result.user.name, ...result.user.alternativeNames];
      const ocrResult = await performOCR(req.file.path, userNames, "degree");
      const validation = validateDocumentAuthenticity(ocrResult);
      
      // Update document verification
      await storage.verifyUserDocument(
        result.user.id,
        "degree",
        ocrResult.extractedText,
        ocrResult.nameMatches
      );

      // Set up session
      (req as any).session.userId = result.user.id;
      
      res.json({
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          userType: result.user.userType,
          authStatus: result.user.authStatus,
        },
        profile: result.profile,
        verification: {
          isValid: validation.isValid,
          confidence: validation.confidence,
          issues: validation.issues
        }
      });
    } catch (error) {
      console.error('Professional registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Registration endpoint for resource persons
  app.post('/api/auth/register/resource-person', upload.single('degree'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Degree certificate is required" });
      }

      const registrationData = {
        ...req.body,
        degree: getFileUrl(req.file.filename),
        yearsOfExperience: parseInt(req.body.yearsOfExperience),
        alternativeNames: req.body.alternativeNames ? JSON.parse(req.body.alternativeNames) : [],
        mandatoryAffiliations: JSON.parse(req.body.mandatoryAffiliations),
        additionalCertifications: req.body.additionalCertifications ? JSON.parse(req.body.additionalCertifications) : [],
        expertiseAreas: req.body.expertiseAreas ? JSON.parse(req.body.expertiseAreas) : [],
        publications: req.body.publications ? JSON.parse(req.body.publications) : []
      };

      const validatedData = resourcePersonRegistrationSchema.parse(registrationData);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username) || 
                           await storage.getUserByEmail(validatedData.email);
      
      if (existingUser) {
        return res.status(400).json({ error: "User with this username or email already exists" });
      }

      const result = await storage.registerResourcePerson(validatedData);
      
      // Perform OCR verification
      const userNames = [result.user.name, ...result.user.alternativeNames];
      const ocrResult = await performOCR(req.file.path, userNames, "degree");
      const validation = validateDocumentAuthenticity(ocrResult);
      
      // Update document verification
      await storage.verifyUserDocument(
        result.user.id,
        "degree",
        ocrResult.extractedText,
        ocrResult.nameMatches
      );

      // Set up session
      (req as any).session.userId = result.user.id;
      
      res.json({
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name,
          userType: result.user.userType,
          authStatus: result.user.authStatus,
        },
        profile: result.profile,
        verification: {
          isValid: validation.isValid,
          confidence: validation.confidence,
          issues: validation.issues
        }
      });
    } catch (error) {
      console.error('Resource person registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await storage.authenticateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set up session
      (req as any).session.userId = user.id;
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          userType: user.userType,
          authStatus: user.authStatus,
          profession: user.profession,
          specialization: user.specialization,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  // Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get('/api/auth/user', requireAuth, async (req, res) => {
    const user = (req as any).user;
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      userType: user.userType,
      authStatus: user.authStatus,
      profession: user.profession,
      specialization: user.specialization,
    });
  });

  // Get user profile based on type
  app.get('/api/profile', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      let profile = null;

      switch (user.userType) {
        case 'student':
          profile = await storage.getStudentProfile(user.id);
          break;
        case 'professional':
          profile = await storage.getProfessionalProfile(user.id);
          break;
        case 'resource_person':
          profile = await storage.getResourcePersonProfile(user.id);
          break;
      }

      const verifications = await storage.getDocumentVerifications(user.id);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          userType: user.userType,
          authStatus: user.authStatus,
          profession: user.profession,
          specialization: user.specialization,
        },
        profile,
        verifications
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Protected routes that require approved authentication
  app.get('/api/dashboard', requireApprovedAuth, (req, res) => {
    const user = (req as any).user;
    res.json({
      message: `Welcome to your ${user.userType} dashboard!`,
      user: {
        id: user.id,
        name: user.name,
        userType: user.userType,
        authStatus: user.authStatus
      }
    });
  });

  // Admin routes for resource persons only
  app.get('/api/admin/pending-verifications', requireUserType(['resource_person']), async (req, res) => {
    try {
      // This would normally fetch all pending verifications for admin review
      res.json({
        message: "Admin panel - pending verifications",
        // Implementation would go here
      });
    } catch (error) {
      console.error('Admin route error:', error);
      res.status(500).json({ error: "Failed to fetch pending verifications" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}