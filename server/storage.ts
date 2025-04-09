import { 
  users, 
  type User, 
  type InsertUser, 
  type Event, 
  type Course, 
  type TicketType, 
  type EventRegistration, 
  type CourseEnrollment, 
  type ForumCategory, 
  type Discussion, 
  type MentorshipOpportunity, 
  type CpdActivity
} from "@shared/schema";

export interface EventFilter {
  search?: string;
  type?: string[];
  category?: string[];
  dateRange?: string;
  cpdPoints?: string;
}

export interface CourseFilter {
  search?: string;
  category?: string[];
  duration?: string;
  cpdPoints?: string;
  difficulty?: string;
}

export interface CpdActivityFilter {
  year?: string;
  category?: string;
  search?: string;
}

export interface IStorage {
  // User operations
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  updateUserPrivacySettings(id: number, privacySettings: any): Promise<User>;
  
  // Event operations
  getUpcomingEvents(): Promise<Event[]>;
  getAllEvents(filters?: EventFilter): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventCategories(): Promise<string[]>;
  registerForEvent(userId: number, eventId: number, ticketTypeId: string, quantity: number): Promise<EventRegistration>;
  
  // Course operations
  getUserCourses(userId: number, status?: string): Promise<Course[]>;
  getRecommendedCourses(userId: number): Promise<Course[]>;
  getAllCourses(filters?: CourseFilter): Promise<Course[]>;
  getCourseById(id: number, userId?: number): Promise<Course | undefined>;
  getCourseCategories(): Promise<string[]>;
  enrollInCourse(userId: number, courseId: number): Promise<CourseEnrollment>;
  
  // CPD operations
  getCpdSummary(userId: number): Promise<any>;
  getCpdStatus(userId: number): Promise<any>;
  getCpdActivities(userId: number, filters?: CpdActivityFilter): Promise<CpdActivity[]>;
  
  // Community operations
  getForumCategories(): Promise<ForumCategory[]>;
  getTrendingDiscussions(): Promise<Discussion[]>;
  getRecentDiscussions(): Promise<Discussion[]>;
  getMentorshipOpportunities(): Promise<MentorshipOpportunity[]>;
  
  // Credential operations
  getUserCredentials(userId: number): Promise<Credential[]>;
  getCredentialById(id: number): Promise<Credential | undefined>;
  createCredential(credential: Partial<Credential>): Promise<Credential>;
  updateCredential(id: number, credentialData: Partial<Credential>): Promise<Credential>;
  deleteCredential(id: number): Promise<boolean>;
  
  // Security operations
  changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean>;
  logout(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private ticketTypes: Map<string, TicketType>;
  private eventRegistrations: Map<number, EventRegistration>;
  private courses: Map<number, Course>;
  private courseEnrollments: Map<number, CourseEnrollment>;
  private forumCategories: Map<number, ForumCategory>;
  private discussions: Map<number, Discussion>;
  private mentorshipOpportunities: Map<number, MentorshipOpportunity>;
  private cpdActivities: Map<number, CpdActivity>;
  
  private currentUserId: number;
  private currentEventId: number;
  private currentTicketTypeId: number;
  private currentEventRegistrationId: number;
  private currentCourseId: number;
  private currentCourseEnrollmentId: number;
  private currentForumCategoryId: number;
  private currentDiscussionId: number;
  private currentMentorshipOpportunityId: number;
  private currentCpdActivityId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.ticketTypes = new Map();
    this.eventRegistrations = new Map();
    this.courses = new Map();
    this.courseEnrollments = new Map();
    this.forumCategories = new Map();
    this.discussions = new Map();
    this.mentorshipOpportunities = new Map();
    this.cpdActivities = new Map();
    
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentTicketTypeId = 1;
    this.currentEventRegistrationId = 1;
    this.currentCourseId = 1;
    this.currentCourseEnrollmentId = 1;
    this.currentForumCategoryId = 1;
    this.currentDiscussionId = 1;
    this.currentMentorshipOpportunityId = 1;
    this.currentCpdActivityId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // USER OPERATIONS
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      name: insertUser.name || `User ${id}`,
      email: insertUser.email || `user${id}@example.com`,
      profileImage: undefined,
      bio: "",
      organization: "",
      location: "",
      specialization: "",
      contactInfo: {},
      socialLinks: {},
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // EVENT OPERATIONS
  async getUpcomingEvents(): Promise<Event[]> {
    // Return events with date in the future
    const now = new Date();
    return Array.from(this.events.values())
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3); // Limit to 3 events
  }

  async getAllEvents(filters?: EventFilter): Promise<Event[]> {
    let events = Array.from(this.events.values());
    
    if (filters) {
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        events = events.filter(event => 
          event.title.toLowerCase().includes(searchLower) || 
          event.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply type filter
      if (filters.type && filters.type.length > 0) {
        events = events.filter(event => filters.type!.includes(event.type));
      }
      
      // Apply category filter
      if (filters.category && filters.category.length > 0) {
        events = events.filter(event => 
          event.category && filters.category!.includes(event.category)
        );
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        switch (filters.dateRange) {
          case 'today':
            events = events.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate >= today && eventDate < tomorrow;
            });
            break;
          case 'this-week':
            events = events.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate >= today && eventDate < nextWeek;
            });
            break;
          case 'this-month':
            events = events.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate >= today && eventDate < nextMonth;
            });
            break;
          case 'next-month':
            const afterNextMonth = new Date(nextMonth);
            afterNextMonth.setMonth(afterNextMonth.getMonth() + 1);
            
            events = events.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate >= nextMonth && eventDate < afterNextMonth;
            });
            break;
        }
      }
      
      // Apply CPD points filter
      if (filters.cpdPoints && filters.cpdPoints !== 'all') {
        switch (filters.cpdPoints) {
          case '1-2':
            events = events.filter(event => event.cpdPoints >= 1 && event.cpdPoints <= 2);
            break;
          case '3-5':
            events = events.filter(event => event.cpdPoints >= 3 && event.cpdPoints <= 5);
            break;
          case '6-plus':
            events = events.filter(event => event.cpdPoints >= 6);
            break;
        }
      }
    }
    
    // Sort by date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const event = this.events.get(id);
    
    if (event) {
      // Add ticket types for this event
      const ticketTypesArray = Array.from(this.ticketTypes.values())
        .filter(ticket => ticket.eventId === id);
      
      return {
        ...event,
        ticketTypes: ticketTypesArray
      };
    }
    
    return undefined;
  }

  async getEventCategories(): Promise<string[]> {
    // Extract unique categories from events
    const categories = new Set<string>();
    
    this.events.forEach(event => {
      if (event.category) {
        categories.add(event.category);
      }
    });
    
    return Array.from(categories);
  }

  async registerForEvent(userId: number, eventId: number, ticketTypeId: string, quantity: number): Promise<EventRegistration> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    
    const ticketType = Array.from(this.ticketTypes.values())
      .find(ticket => ticket.id.toString() === ticketTypeId && ticket.eventId === eventId);
    
    if (!ticketType) {
      throw new Error(`Ticket type with ID ${ticketTypeId} not found for event ${eventId}`);
    }
    
    const totalPrice = ticketType.price * quantity;
    
    const registration: EventRegistration = {
      id: this.currentEventRegistrationId++,
      userId,
      eventId,
      ticketTypeId: parseInt(ticketTypeId),
      quantity,
      totalPrice,
      status: "confirmed",
      createdAt: new Date()
    };
    
    this.eventRegistrations.set(registration.id, registration);
    
    // Update attendees count for the event
    const updatedEvent = {
      ...event,
      attendees: (event.attendees || 0) + quantity
    };
    this.events.set(eventId, updatedEvent);
    
    return registration;
  }

  // COURSE OPERATIONS
  async getUserCourses(userId: number, status?: string): Promise<Course[]> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const enrollments = Array.from(this.courseEnrollments.values())
      .filter(enrollment => enrollment.userId === userId);
    
    if (status) {
      const filteredEnrollments = enrollments.filter(enrollment => enrollment.status === status);
      
      return Promise.all(
        filteredEnrollments.map(async enrollment => {
          const course = await this.getCourseById(enrollment.courseId, userId);
          return course!;
        })
      );
    }
    
    return Promise.all(
      enrollments.map(async enrollment => {
        const course = await this.getCourseById(enrollment.courseId, userId);
        return course!;
      })
    );
  }

  async getRecommendedCourses(userId: number): Promise<Course[]> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Get courses that the user is not enrolled in
    const enrolledCourseIds = new Set(
      Array.from(this.courseEnrollments.values())
        .filter(enrollment => enrollment.userId === userId)
        .map(enrollment => enrollment.courseId)
    );
    
    const recommendedCourses = Array.from(this.courses.values())
      .filter(course => !enrolledCourseIds.has(course.id))
      .slice(0, 2); // Limit to 2 courses
    
    return recommendedCourses;
  }

  async getAllCourses(filters?: CourseFilter): Promise<Course[]> {
    let courses = Array.from(this.courses.values());
    
    if (filters) {
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(searchLower) || 
          course.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply category filter
      if (filters.category && filters.category.length > 0) {
        courses = courses.filter(course => filters.category!.includes(course.category));
      }
      
      // Apply duration filter
      if (filters.duration && filters.duration !== 'all') {
        switch (filters.duration) {
          case 'short': // Less than 2 hours
            courses = courses.filter(course => {
              const hours = parseInt(course.duration.split(' ')[0]);
              return hours < 2;
            });
            break;
          case 'medium': // 2-5 hours
            courses = courses.filter(course => {
              const hours = parseInt(course.duration.split(' ')[0]);
              return hours >= 2 && hours <= 5;
            });
            break;
          case 'long': // More than 5 hours
            courses = courses.filter(course => {
              const hours = parseInt(course.duration.split(' ')[0]);
              return hours > 5;
            });
            break;
        }
      }
      
      // Apply CPD points filter
      if (filters.cpdPoints && filters.cpdPoints !== 'all') {
        switch (filters.cpdPoints) {
          case '1-2':
            courses = courses.filter(course => course.cpdPoints >= 1 && course.cpdPoints <= 2);
            break;
          case '3-5':
            courses = courses.filter(course => course.cpdPoints >= 3 && course.cpdPoints <= 5);
            break;
          case '6-plus':
            courses = courses.filter(course => course.cpdPoints >= 6);
            break;
        }
      }
      
      // Apply difficulty filter
      if (filters.difficulty && filters.difficulty !== 'all') {
        courses = courses.filter(course => course.difficulty.toLowerCase() === filters.difficulty!.toLowerCase());
      }
    }
    
    // Sort alphabetically by title
    return courses.sort((a, b) => a.title.localeCompare(b.title));
  }

  async getCourseById(id: number, userId?: number): Promise<Course | undefined> {
    const course = this.courses.get(id);
    
    if (!course) return undefined;
    
    // If userId is provided, check if the user is enrolled in the course
    if (userId) {
      const enrollment = Array.from(this.courseEnrollments.values())
        .find(enrollment => enrollment.userId === userId && enrollment.courseId === id);
      
      if (enrollment) {
        // Calculate last accessed days ago
        const daysAgo = Math.floor((new Date().getTime() - enrollment.lastAccessedAt.getTime()) / (1000 * 60 * 60 * 24));
        const lastAccessed = daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`;
        
        return {
          ...course,
          progress: {
            status: enrollment.status,
            percentage: enrollment.progress,
            lastAccessed
          }
        };
      }
    }
    
    return course;
  }

  async getCourseCategories(): Promise<string[]> {
    // Extract unique categories from courses
    const categories = new Set<string>();
    
    this.courses.forEach(course => {
      categories.add(course.category);
    });
    
    return Array.from(categories);
  }

  async enrollInCourse(userId: number, courseId: number): Promise<CourseEnrollment> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    
    // Check if user is already enrolled
    const existingEnrollment = Array.from(this.courseEnrollments.values())
      .find(enrollment => enrollment.userId === userId && enrollment.courseId === courseId);
    
    if (existingEnrollment) {
      throw new Error(`User is already enrolled in this course`);
    }
    
    const enrollment: CourseEnrollment = {
      id: this.currentCourseEnrollmentId++,
      userId,
      courseId,
      progress: 0,
      status: 'in_progress',
      completedLessons: [],
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.courseEnrollments.set(enrollment.id, enrollment);
    return enrollment;
  }

  // CPD OPERATIONS
  async getCpdSummary(userId: number): Promise<any> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Return summary with earned and required points
    return {
      currentPoints: 18,
      requiredPoints: 36,
      period: "Apr-Jun 2023",
      categories: [
        {
          id: "clinical",
          name: "Clinical Skills",
          earnedPoints: 10,
          requiredPoints: 15
        },
        {
          id: "research",
          name: "Research & Publication",
          earnedPoints: 5,
          requiredPoints: 10
        },
        {
          id: "development",
          name: "Professional Development",
          earnedPoints: 3,
          requiredPoints: 11
        }
      ]
    };
  }

  async getCpdStatus(userId: number): Promise<any> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return {
      pointsNeeded: 18,
      period: "Current Quarter (Apr-Jun 2023)"
    };
  }

  async getCpdActivities(userId: number, filters?: CpdActivityFilter): Promise<CpdActivity[]> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    let activities = Array.from(this.cpdActivities.values())
      .filter(activity => activity.userId === userId);
    
    if (filters) {
      // Apply year filter
      if (filters.year) {
        activities = activities.filter(activity => {
          const activityYear = new Date(activity.date).getFullYear().toString();
          return activityYear === filters.year;
        });
      }
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        activities = activities.filter(activity => {
          if (filters.category === 'clinical') return activity.categoryId === 1;
          if (filters.category === 'research') return activity.categoryId === 2;
          if (filters.category === 'development') return activity.categoryId === 3;
          return true;
        });
      }
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        activities = activities.filter(activity => 
          activity.title.toLowerCase().includes(searchLower) || 
          activity.source.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Sort by date (newest first)
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // COMMUNITY OPERATIONS
  async getForumCategories(): Promise<ForumCategory[]> {
    return Array.from(this.forumCategories.values());
  }

  async getTrendingDiscussions(): Promise<Discussion[]> {
    // Return discussions sorted by likes and comments
    return Array.from(this.discussions.values())
      .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
      .slice(0, 3) // Limit to 3 discussions
      .map(discussion => {
        const author = this.users.get(discussion.authorId);
        const forum = this.forumCategories.get(discussion.forumId);
        
        // Calculate time ago
        const now = new Date();
        const postedDate = discussion.createdAt;
        const diffTime = Math.abs(now.getTime() - postedDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let timeAgo;
        if (diffDays === 0) {
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            timeAgo = `${diffMinutes} minutes ago`;
          } else {
            timeAgo = `${diffHours} hours ago`;
          }
        } else if (diffDays === 1) {
          timeAgo = 'yesterday';
        } else {
          timeAgo = `${diffDays} days ago`;
        }
        
        return {
          ...discussion,
          author: {
            id: author!.id.toString(),
            name: author!.name,
            profileImage: author!.profileImage
          },
          forum: forum!.name,
          timeAgo
        };
      });
  }

  async getRecentDiscussions(): Promise<Discussion[]> {
    // Return most recent discussions
    return Array.from(this.discussions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 2) // Limit to 2 discussions
      .map(discussion => {
        const author = this.users.get(discussion.authorId);
        const forum = this.forumCategories.get(discussion.forumId);
        
        // Calculate time ago
        const now = new Date();
        const postedDate = discussion.createdAt;
        const diffTime = Math.abs(now.getTime() - postedDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let timeAgo;
        if (diffDays === 0) {
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            timeAgo = `${diffMinutes} minutes ago`;
          } else {
            timeAgo = `${diffHours} hours ago`;
          }
        } else if (diffDays === 1) {
          timeAgo = 'yesterday';
        } else {
          timeAgo = `${diffDays} days ago`;
        }
        
        return {
          ...discussion,
          author: {
            id: author!.id.toString(),
            name: author!.name,
            profileImage: author!.profileImage
          },
          forum: forum!.name,
          timeAgo
        };
      });
  }

  async getMentorshipOpportunities(): Promise<MentorshipOpportunity[]> {
    // Get mentorship opportunities with mentor details
    return Promise.all(
      Array.from(this.mentorshipOpportunities.values())
        .slice(0, 2) // Limit to 2 opportunities
        .map(async opportunity => {
          const mentor = await this.getUserById(opportunity.userId);
          
          return {
            ...opportunity,
            name: mentor!.name,
            profileImage: mentor!.profileImage
          };
        })
    );
  }
  
  // PRIVACY SETTINGS OPERATIONS
  async updateUserPrivacySettings(id: number, privacySettings: any): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      privacySettings: {
        ...user.privacySettings,
        ...privacySettings
      },
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // CREDENTIAL OPERATIONS
  private credentials: Map<number, Credential> = new Map();
  private currentCredentialId: number = 1;
  
  async getUserCredentials(userId: number): Promise<Credential[]> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Return credentials for this user
    return Array.from(this.credentials.values())
      .filter(credential => credential.userId === userId)
      .sort((a, b) => {
        // Sort by issue date, most recent first
        return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      });
  }
  
  async getCredentialById(id: number): Promise<Credential | undefined> {
    return this.credentials.get(id);
  }
  
  async createCredential(credentialData: Partial<Credential>): Promise<Credential> {
    const id = this.currentCredentialId++;
    const now = new Date();
    
    const credential: Credential = {
      id,
      userId: credentialData.userId!,
      type: credentialData.type!,
      name: credentialData.name!,
      organization: credentialData.organization!,
      issueDate: credentialData.issueDate!,
      expiryDate: credentialData.expiryDate,
      credentialId: credentialData.credentialId,
      credentialUrl: credentialData.credentialUrl,
      status: credentialData.status || "active",
      createdAt: now,
      updatedAt: now
    };
    
    this.credentials.set(id, credential);
    return credential;
  }
  
  async updateCredential(id: number, credentialData: Partial<Credential>): Promise<Credential> {
    const credential = await this.getCredentialById(id);
    if (!credential) {
      throw new Error(`Credential with ID ${id} not found`);
    }
    
    const updatedCredential = {
      ...credential,
      ...credentialData,
      updatedAt: new Date()
    };
    
    this.credentials.set(id, updatedCredential);
    return updatedCredential;
  }
  
  async deleteCredential(id: number): Promise<boolean> {
    const credential = await this.getCredentialById(id);
    if (!credential) {
      throw new Error(`Credential with ID ${id} not found`);
    }
    
    return this.credentials.delete(id);
  }
  
  // SECURITY OPERATIONS
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if current password matches
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Update password
    const updatedUser = {
      ...user,
      password: newPassword,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return true;
  }
  
  async logout(userId: number): Promise<boolean> {
    // In a real application, this would invalidate the user's session
    // For this demo, we'll just return true
    return true;
  }

  // Initialize sample data
  private initializeData() {
    // Create sample user
    const user: User = {
      id: this.currentUserId++,
      username: "sarah_chen",
      password: "password123", // In a real app, this would be hashed
      name: "Dr. Sarah Chen",
      email: "sarah.chen@example.com",
      profession: "Sports Physiotherapist",
      specialization: "Knee Rehabilitation",
      bio: "Sports physiotherapist with over 10 years of experience working with elite athletes in various sports.",
      organization: "SportsMed Clinic",
      location: "Mumbai, India",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      contactInfo: {
        phone: "+91 98765 43210",
        email: "sarah.chen@sportsmed.com",
        website: "https://www.sportsmed.com/sarah-chen"
      },
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarah-chen",
        twitter: "https://twitter.com/sarahchen"
      },
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-05-22")
    };
    this.users.set(user.id, user);
    
    // Create more sample users for community interactions
    const user2: User = {
      id: this.currentUserId++,
      username: "amit_patel",
      password: "password123",
      name: "Dr. Amit Patel",
      email: "amit.patel@example.com",
      profession: "Sports Physiotherapist",
      specialization: "ACL Rehabilitation",
      profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      bio: "",
      organization: "Indian Cricket Team",
      location: "Delhi, India",
      contactInfo: {},
      socialLinks: {},
      createdAt: new Date("2022-12-10"),
      updatedAt: new Date("2023-04-15")
    };
    this.users.set(user2.id, user2);
    
    const user3: User = {
      id: this.currentUserId++,
      username: "priya_sharma",
      password: "password123",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      profession: "Sports Nutritionist",
      specialization: "Endurance Sports",
      profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      bio: "",
      organization: "Elite Nutrition Hub",
      location: "Bangalore, India",
      contactInfo: {},
      socialLinks: {},
      createdAt: new Date("2023-01-22"),
      updatedAt: new Date("2023-03-18")
    };
    this.users.set(user3.id, user3);
    
    // Create sample events
    const event1: Event = {
      id: this.currentEventId++,
      title: "Advanced Sports Injury Management Symposium",
      description: "Learn cutting-edge techniques for managing complex sports injuries with internationally recognized experts.",
      date: "2023-06-15",
      startTime: "09:00:00",
      endTime: "17:00:00",
      type: "In-person",
      category: "Physiotherapy",
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      price: 4500,
      cpdPoints: 5,
      attendees: 45,
      accreditationBody: "Indian Association of Physiotherapists",
      learningOutcomes: [
        "Implement advanced assessment techniques for complex sports injuries",
        "Apply evidence-based rehabilitation protocols for elite athletes",
        "Utilize cutting-edge technologies in injury management",
        "Develop return-to-sport testing protocols"
      ],
      speakers: [
        {
          id: "1",
          name: "Dr. Rajiv Mehta",
          title: "Head Physiotherapist, Indian Cricket Team",
          bio: "Over 15 years of experience working with elite cricket players and specializing in shoulder rehabilitation."
        },
        {
          id: "2",
          name: "Dr. Lisa Thompson",
          title: "Sports Medicine Specialist",
          bio: "International expert in musculoskeletal ultrasound and image-guided interventions in athletes."
        }
      ],
      schedule: [
        {
          time: "09:00 AM - 09:30 AM",
          title: "Registration and Welcome Coffee"
        },
        {
          time: "09:30 AM - 11:00 AM",
          title: "Innovations in Sports Injury Assessment",
          speaker: "Dr. Rajiv Mehta"
        },
        {
          time: "11:15 AM - 12:45 PM",
          title: "Rehabilitation Strategies for Complex Cases",
          speaker: "Dr. Lisa Thompson"
        },
        {
          time: "12:45 PM - 13:45 PM",
          title: "Lunch Break"
        },
        {
          time: "13:45 PM - 15:15 PM",
          title: "Hands-on Workshop: Advanced Taping Techniques"
        },
        {
          time: "15:30 PM - 17:00 PM",
          title: "Panel Discussion: Return to Sport Decision Making"
        }
      ],
      createdAt: new Date("2023-03-10"),
      updatedAt: new Date("2023-03-10")
    };
    this.events.set(event1.id, event1);
    
    // Create ticket types for event 1
    const ticket1: TicketType = {
      id: this.currentTicketTypeId++,
      eventId: event1.id,
      name: "Early Bird",
      description: "Limited early bird tickets at a discounted rate",
      price: 4500,
      availableUntil: new Date("2023-05-15"),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketTypes.set(ticket1.id.toString(), ticket1);
    
    const ticket2: TicketType = {
      id: this.currentTicketTypeId++,
      eventId: event1.id,
      name: "Standard",
      description: "Regular admission ticket",
      price: 5500,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketTypes.set(ticket2.id.toString(), ticket2);
    
    const ticket3: TicketType = {
      id: this.currentTicketTypeId++,
      eventId: event1.id,
      name: "Group (3+ people)",
      description: "Discounted rate for groups of 3 or more",
      price: 4000,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketTypes.set(ticket3.id.toString(), ticket3);
    
    const event2: Event = {
      id: this.currentEventId++,
      title: "Performance Nutrition for Elite Athletes Workshop",
      description: "Evidence-based approaches to nutrition planning for peak performance and recovery in high-level competition.",
      date: "2023-07-02",
      startTime: "10:00:00",
      endTime: "16:00:00",
      type: "Hybrid",
      category: "Nutrition",
      location: "Delhi + Online",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      price: 3200,
      cpdPoints: 3,
      attendees: 62,
      accreditationBody: "Sports Nutrition Society of India",
      learningOutcomes: [
        "Design personalized nutrition plans for different sporting disciplines",
        "Implement effective hydration strategies for various environmental conditions",
        "Utilize nutrient timing for optimal performance and recovery",
        "Address common nutritional challenges faced by elite athletes"
      ],
      createdAt: new Date("2023-03-15"),
      updatedAt: new Date("2023-03-15")
    };
    this.events.set(event2.id, event2);
    
    // Create ticket types for event 2
    const ticket4: TicketType = {
      id: this.currentTicketTypeId++,
      eventId: event2.id,
      name: "In-person",
      description: "Attend in-person in Delhi",
      price: 3200,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketTypes.set(ticket4.id.toString(), ticket4);
    
    const ticket5: TicketType = {
      id: this.currentTicketTypeId++,
      eventId: event2.id,
      name: "Virtual",
      description: "Attend virtually from anywhere",
      price: 2500,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketTypes.set(ticket5.id.toString(), ticket5);
    
    const ticket6: TicketType = {
      id: this.currentTicketTypeId++,
      eventId: event2.id,
      name: "Group Discount",
      description: "For groups of 3 or more (in-person or virtual)",
      price: 2800,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketTypes.set(ticket6.id.toString(), ticket6);
    
    const event3: Event = {
      id: this.currentEventId++,
      title: "Mental Toughness & Resilience in Elite Sports",
      description: "Practical strategies for sports psychologists to build mental resilience in athletes facing high-pressure situations.",
      date: "2023-06-28",
      startTime: "14:00:00",
      endTime: "17:00:00",
      type: "Virtual",
      category: "Psychology",
      image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      price: 1800,
      cpdPoints: 2,
      attendees: 98,
      accreditationBody: "Sports Psychology Association",
      learningOutcomes: [
        "Apply evidence-based psychological techniques to enhance athlete performance",
        "Develop customized mental skills training programs",
        "Implement effective strategies for managing competition anxiety",
        "Create protocols for maintaining athlete well-being and preventing burnout"
      ],
      createdAt: new Date("2023-03-20"),
      updatedAt: new Date("2023-03-20")
    };
    this.events.set(event3.id, event3);
    
    // Create ticket types for event 3
    const ticket7: TicketType = {
      id: this.currentTicketTypeId++,
      eventId: event3.id,
      name: "Standard Access",
      description: "Full access to webinar and resources",
      price: 1800,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketTypes.set(ticket7.id.toString(), ticket7);
    
    const ticket8: TicketType = {
      id: this.currentTicketTypeId++,
      eventId: event3.id,
      name: "Premium Access",
      description: "Full access plus 1-hour group consultation",
      price: 2500,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketTypes.set(ticket8.id.toString(), ticket8);
    
    // Create sample courses
    const course1: Course = {
      id: this.currentCourseId++,
      title: "Advanced Rehabilitation Techniques for Knee Injuries",
      description: "A comprehensive course covering the latest evidence-based approaches to rehabilitating common and complex knee injuries in athletes across various sports.",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      category: "Physiotherapy",
      duration: "12 hours",
      modules: 8,
      cpdPoints: 8,
      difficulty: "Intermediate",
      accreditedBy: "Indian Association of Physiotherapists",
      rating: 4.8,
      reviews: 124,
      learningOutcomes: [
        "Apply advanced assessment techniques for knee pathologies",
        "Implement evidence-based rehabilitation protocols for ACL, PCL, meniscal, and complex multi-ligament injuries",
        "Design progressive return-to-sport programs specific to different sporting demands",
        "Utilize the latest technological aids in knee rehabilitation"
      ],
      targetAudience: [
        "Sports Physiotherapists",
        "Orthopedic Rehabilitation Specialists",
        "Team Medical Staff"
      ],
      videoHours: "8 hours",
      resources: "15 downloadable resources",
      instructors: [
        {
          id: "1",
          name: "Dr. Rajiv Mehta",
          title: "Head Physiotherapist, Indian Cricket Team",
          bio: "Over 15 years of experience working with elite cricket players and specializing in shoulder and knee rehabilitation.",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
          credentials: ["MPT Sports", "Certified Sports Physiotherapist", "FIFA Diploma in Football Medicine"]
        }
      ],
      curriculum: [
        {
          id: "m1",
          title: "Functional Anatomy and Biomechanics of the Knee",
          duration: "1.5 hours",
          lessons: [
            {
              id: "l1",
              title: "Advanced Functional Anatomy",
              type: "video",
              duration: "25 min",
              completed: true
            },
            {
              id: "l2",
              title: "Biomechanical Analysis of the Knee During Sport",
              type: "video",
              duration: "30 min",
              completed: true
            },
            {
              id: "l3",
              title: "Common Injury Mechanisms",
              type: "video",
              duration: "20 min",
              completed: true
            },
            {
              id: "l4",
              title: "Knowledge Check",
              type: "quiz",
              duration: "15 min",
              completed: true
            }
          ]
        },
        {
          id: "m2",
          title: "Assessment and Diagnosis",
          duration: "2 hours",
          lessons: [
            {
              id: "l5",
              title: "Subjective Examination Strategies",
              type: "video",
              duration: "30 min",
              completed: true
            },
            {
              id: "l6",
              title: "Objective Examination Techniques",
              type: "video",
              duration: "45 min",
              completed: true
            },
            {
              id: "l7",
              title: "Special Tests and their Clinical Utility",
              type: "video",
              duration: "35 min",
              completed: false
            },
            {
              id: "l8",
              title: "Clinical Practice Guidelines",
              type: "text",
              duration: "10 min",
              completed: false
            }
          ]
        },
        {
          id: "m3",
          title: "Rehabilitation Protocols",
          duration: "2.5 hours",
          lessons: [
            {
              id: "l9",
              title: "ACL Injury Rehabilitation",
              type: "video",
              duration: "45 min",
              completed: false
            },
            {
              id: "l10",
              title: "Meniscal Injury Rehabilitation",
              type: "video",
              duration: "40 min",
              completed: false
            },
            {
              id: "l11",
              title: "Patellofemoral Pain Syndrome Management",
              type: "video",
              duration: "35 min",
              completed: false
            },
            {
              id: "l12",
              title: "Multi-ligament Injury Approaches",
              type: "video",
              duration: "30 min",
              completed: false
            }
          ]
        }
      ],
      lessons: 24,
      createdAt: new Date("2022-11-15"),
      updatedAt: new Date("2023-01-20")
    };
    this.courses.set(course1.id, course1);
    
    const course2: Course = {
      id: this.currentCourseId++,
      title: "Mental Health Support for Athletes: A Comprehensive Approach",
      description: "This course provides sports psychology professionals with strategies to identify, address, and support mental health challenges in competitive athletes.",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      category: "Psychology",
      duration: "8 hours",
      modules: 6,
      cpdPoints: 6,
      difficulty: "Intermediate",
      accreditedBy: "Sports Psychology Association",
      rating: 4.9,
      reviews: 89,
      learningOutcomes: [
        "Identify signs of common mental health challenges in athletes",
        "Implement evidence-based interventions for performance anxiety",
        "Develop supportive communication strategies for athlete mental wellbeing",
        "Create effective referral networks for specialized mental health support"
      ],
      targetAudience: [
        "Sports Psychologists",
        "Team Physicians",
        "Performance Coaches",
        "Athletic Trainers"
      ],
      videoHours: "6 hours",
      resources: "12 downloadable resources",
      instructors: [
        {
          id: "2",
          name: "Dr. Sunita Rao",
          title: "Senior Sports Psychologist",
          bio: "Specialist in athlete mental health with 12 years experience working with Olympic and professional athletes.",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
          credentials: ["PhD Sports Psychology", "Licensed Clinical Psychologist", "Certified Mental Performance Consultant"]
        }
      ],
      curriculum: [
        {
          id: "m1",
          title: "Understanding Athlete Mental Health",
          duration: "1.5 hours",
          lessons: [
            {
              id: "l1",
              title: "Unique Pressures in Competitive Sports",
              type: "video",
              duration: "30 min",
              completed: false
            },
            {
              id: "l2",
              title: "Common Mental Health Challenges in Athletes",
              type: "video",
              duration: "40 min",
              completed: false
            },
            {
              id: "l3",
              title: "Early Warning Signs and Assessment",
              type: "video",
              duration: "20 min",
              completed: false
            }
          ]
        },
        {
          id: "m2",
          title: "Intervention Strategies",
          duration: "2 hours",
          lessons: [
            {
              id: "l4",
              title: "Evidence-Based Approaches for Performance Anxiety",
              type: "video",
              duration: "35 min",
              completed: false
            },
            {
              id: "l5",
              title: "Supporting Athletes Through Injury Recovery",
              type: "video",
              duration: "30 min",
              completed: false
            },
            {
              id: "l6",
              title: "Managing Burnout and Overtraining",
              type: "video",
              duration: "30 min",
              completed: false
            },
            {
              id: "l7",
              title: "Practical Exercise: Case Studies",
              type: "quiz",
              duration: "25 min",
              completed: false
            }
          ]
        }
      ],
      lessons: 18,
      createdAt: new Date("2022-10-20"),
      updatedAt: new Date("2023-02-15")
    };
    this.courses.set(course2.id, course2);
    
    const course3: Course = {
      id: this.currentCourseId++,
      title: "Sports Nutrition: Periodization for Performance",
      description: "Learn how to design and implement periodized nutrition strategies to optimize training adaptations and competition performance for various sports.",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      category: "Nutrition",
      duration: "6 hours",
      modules: 5,
      cpdPoints: 4,
      difficulty: "Advanced",
      accreditedBy: "Sports Nutrition Society of India",
      rating: 4.7,
      reviews: 63,
      learningOutcomes: [
        "Design sport-specific nutrition periodization plans",
        "Implement carbohydrate and protein periodization strategies",
        "Develop competition nutrition timelines for optimal performance",
        "Create recovery nutrition protocols for different training phases"
      ],
      createdAt: new Date("2022-12-10"),
      updatedAt: new Date("2023-03-05")
    };
    this.courses.set(course3.id, course3);
    
    const course4: Course = {
      id: this.currentCourseId++,
      title: "Biomechanics of Running: Analysis & Optimization",
      description: "A detailed exploration of running biomechanics, gait analysis techniques, and evidence-based approaches to optimizing running form and preventing injuries.",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      category: "Biomechanics",
      duration: "7 hours",
      modules: 6,
      cpdPoints: 5,
      difficulty: "Intermediate",
      accreditedBy: "Indian Association of Physiotherapists",
      rating: 4.6,
      reviews: 78,
      learningOutcomes: [
        "Perform comprehensive running gait analysis",
        "Identify biomechanical factors contributing to common running injuries",
        "Apply evidence-based interventions to optimize running form",
        "Design progressive return-to-running programs for injured athletes"
      ],
      createdAt: new Date("2023-01-05"),
      updatedAt: new Date("2023-04-10")
    };
    this.courses.set(course4.id, course4);
    
    // Create sample course enrollments
    const enrollment1: CourseEnrollment = {
      id: this.currentCourseEnrollmentId++,
      userId: 1, // Sarah Chen
      courseId: 1, // Knee rehab course
      progress: 68,
      status: "in_progress",
      completedLessons: ["l1", "l2", "l3", "l4", "l5", "l6"],
      lastAccessedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date("2023-04-10"),
      updatedAt: new Date("2023-05-25")
    };
    this.courseEnrollments.set(enrollment1.id, enrollment1);
    
    const enrollment2: CourseEnrollment = {
      id: this.currentCourseEnrollmentId++,
      userId: 1, // Sarah Chen
      courseId: 2, // Mental health course
      progress: 25,
      status: "in_progress",
      completedLessons: ["l1", "l2"],
      lastAccessedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      createdAt: new Date("2023-05-01"),
      updatedAt: new Date("2023-05-20")
    };
    this.courseEnrollments.set(enrollment2.id, enrollment2);
    
    // Create sample forum categories
    const category1: ForumCategory = {
      id: this.currentForumCategoryId++,
      name: "Physio Hub",
      description: "Discuss physiotherapy techniques, case studies, and best practices for sports injuries",
      icon: "Activity",
      topics: 145,
      posts: 1203,
      createdAt: new Date("2022-10-15")
    };
    this.forumCategories.set(category1.id, category1);
    
    const category2: ForumCategory = {
      id: this.currentForumCategoryId++,
      name: "Sports Nutrition",
      description: "Exchange knowledge about nutrition strategies for athletes across different sports",
      icon: "Apple",
      topics: 98,
      posts: 876,
      createdAt: new Date("2022-10-15")
    };
    this.forumCategories.set(category2.id, category2);
    
    const category3: ForumCategory = {
      id: this.currentForumCategoryId++,
      name: "Mental Performance",
      description: "Share approaches to enhancing mental toughness and psychological aspects of sport",
      icon: "Brain",
      topics: 112,
      posts: 934,
      createdAt: new Date("2022-10-15")
    };
    this.forumCategories.set(category3.id, category3);
    
    const category4: ForumCategory = {
      id: this.currentForumCategoryId++,
      name: "Research Collaboration",
      description: "Connect with peers for research projects and discuss latest findings in sports science",
      icon: "FileText",
      topics: 87,
      posts: 623,
      createdAt: new Date("2022-10-15")
    };
    this.forumCategories.set(category4.id, category4);
    
    // Create sample discussions
    const discussion1: Discussion = {
      id: this.currentDiscussionId++,
      title: "ACL Rehab Protocol Updates",
      content: "Has anyone implemented the latest Oslo protocol for ACL reconstruction? Looking to compare outcomes with traditional approaches in high-level athletes returning to sport...",
      authorId: 2, // Amit Patel
      forumId: 1, // Physio Hub
      comments: 28,
      likes: 45,
      tags: ["ACL", "Rehabilitation", "Protocol", "Return-to-Sport"],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    };
    this.discussions.set(discussion1.id, discussion1);
    
    const discussion2: Discussion = {
      id: this.currentDiscussionId++,
      title: "Nutrition Strategies for Ultra-Endurance Events",
      content: "Sharing my experience with periodized low-carb approach for ultra-marathon runners. Anyone tried incorporating strategic ketogenic phases in race preparation?",
      authorId: 3, // Priya Sharma
      forumId: 2, // Sports Nutrition
      comments: 19,
      likes: 32,
      tags: ["Ultra-Endurance", "Nutrition", "Ketogenic", "Carb-Loading"],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    };
    this.discussions.set(discussion2.id, discussion2);
    
    // Create sample mentorship opportunities
    const mentorship1: MentorshipOpportunity = {
      id: this.currentMentorshipOpportunityId++,
      userId: 2, // Amit Patel
      position: "Head Physiotherapist, Indian Cricket Team",
      specialties: ["Sports Injuries", "Cricket", "Rehabilitation"],
      availability: "2 hours per week",
      rating: 4.9,
      reviews: 23,
      createdAt: new Date("2023-03-15")
    };
    this.mentorshipOpportunities.set(mentorship1.id, mentorship1);
    
    const mentorship2: MentorshipOpportunity = {
      id: this.currentMentorshipOpportunityId++,
      userId: 3, // Priya Sharma
      position: "Senior Sports Nutritionist",
      specialties: ["Performance Nutrition", "Recovery", "Hydration"],
      availability: "Virtual sessions available",
      rating: 4.8,
      reviews: 17,
      createdAt: new Date("2023-04-02")
    };
    this.mentorshipOpportunities.set(mentorship2.id, mentorship2);
    
    // Create sample CPD activities
    const activity1: CpdActivity = {
      id: this.currentCpdActivityId++,
      userId: 1,
      title: "Advanced Sports Injury Management Symposium",
      date: "2023-04-15",
      type: "Event",
      categoryId: 1, // Clinical Skills
      points: 5,
      source: "Indian Association of Physiotherapists",
      certificateUrl: "https://example.com/certificates/123",
      createdAt: new Date("2023-04-15")
    };
    this.cpdActivities.set(activity1.id, activity1);
    
    const activity2: CpdActivity = {
      id: this.currentCpdActivityId++,
      userId: 1,
      title: "Knee Rehabilitation Masterclass",
      date: "2023-03-22",
      type: "Course",
      categoryId: 1, // Clinical Skills
      points: 3,
      source: "SportX India Platform",
      certificateUrl: "https://example.com/certificates/124",
      createdAt: new Date("2023-03-22")
    };
    this.cpdActivities.set(activity2.id, activity2);
    
    const activity3: CpdActivity = {
      id: this.currentCpdActivityId++,
      userId: 1,
      title: "Research Paper: Effects of Plyometric Training on ACL Prevention",
      date: "2023-05-10",
      type: "Publication",
      categoryId: 2, // Research & Publication
      points: 5,
      source: "Journal of Sports Physical Therapy",
      createdAt: new Date("2023-05-10")
    };
    this.cpdActivities.set(activity3.id, activity3);
    
    const activity4: CpdActivity = {
      id: this.currentCpdActivityId++,
      userId: 1,
      title: "Regional Sports Medicine Conference",
      date: "2023-02-18",
      type: "Event",
      categoryId: 1, // Clinical Skills
      points: 2,
      source: "Sports Medicine Association of India",
      certificateUrl: "https://example.com/certificates/125",
      createdAt: new Date("2023-02-18")
    };
    this.cpdActivities.set(activity4.id, activity4);
    
    const activity5: CpdActivity = {
      id: this.currentCpdActivityId++,
      userId: 1,
      title: "Mentorship Program for Junior Physiotherapists",
      date: "2023-05-01",
      type: "Other",
      categoryId: 3, // Professional Development
      points: 3,
      source: "National Sports Institute",
      createdAt: new Date("2023-05-01")
    };
    this.cpdActivities.set(activity5.id, activity5);
    
    // Initialize sample credentials
    const credential1 = {
      id: this.currentCredentialId++,
      userId: 1,
      type: "certification",
      name: "Sports Physiotherapy Specialist",
      organization: "Indian Association of Physiotherapists",
      issueDate: "2020-05-15",
      expiryDate: "2024-05-15",
      credentialId: "SPS-2020-1234",
      credentialUrl: "https://iap.org/verify/SPS-2020-1234",
      status: "active",
      createdAt: new Date("2020-05-15"),
      updatedAt: new Date("2020-05-15")
    };
    this.credentials.set(credential1.id, credential1);
    
    const credential2 = {
      id: this.currentCredentialId++,
      userId: 1,
      type: "license",
      name: "Physiotherapy Practice License",
      organization: "Medical Council of India",
      issueDate: "2019-03-10",
      expiryDate: "2025-03-10",
      credentialId: "MCI-PT-19-56789",
      credentialUrl: "https://mci.gov.in/verify/MCI-PT-19-56789",
      status: "active",
      createdAt: new Date("2019-03-10"),
      updatedAt: new Date("2019-03-10")
    };
    this.credentials.set(credential2.id, credential2);
    
    const credential3 = {
      id: this.currentCredentialId++,
      userId: 1,
      type: "course",
      name: "Advanced Rehabilitation for ACL Injuries",
      organization: "International Sports Medicine Federation",
      issueDate: "2022-11-22",
      credentialId: "ISMF-ACL-22-789",
      status: "active",
      createdAt: new Date("2022-11-22"),
      updatedAt: new Date("2022-11-22")
    };
    this.credentials.set(credential3.id, credential3);
    
    // Set default privacy settings for users
    const privacySettings = {
      profilePublic: true,
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      allowMentorship: true,
      showCourses: true,
      showEvents: true,
      showCpd: false
    };
    
    // Update users with privacy settings
    for (const [id, user] of this.users.entries()) {
      this.users.set(id, {
        ...user,
        privacySettings
      });
    }
  }
}

export const storage = new MemStorage();
