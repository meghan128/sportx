import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - Enhanced with real-time features
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"), // "user" or "resource_person"
  profession: text("profession"),
  specialization: text("specialization"),
  bio: text("bio"),
  organization: text("organization"),
  location: text("location"),
  profileImage: text("profile_image"),
  contactInfo: jsonb("contact_info").$type<{
    phone?: string;
    website?: string;
    linkedin?: string;
  }>(),
  socialLinks: jsonb("social_links").$type<{
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  }>(),
  privacySettings: jsonb("privacy_settings").$type<{
    profilePublic?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    allowMessages?: boolean;
    allowMentorship?: boolean;
    showCourses?: boolean;
    showEvents?: boolean;
    showCpd?: boolean;
  }>().default({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowMentorship: true,
    showCourses: true,
    showEvents: true,
    showCpd: false
  }),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Events table - Enhanced with real-time updates
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  type: text("type").notNull(), // "In-person", "Virtual", "Hybrid"
  category: text("category").notNull(),
  location: text("location"),
  image: text("image").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  cpdPoints: integer("cpd_points").notNull().default(0),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  accreditationBody: text("accreditation_body").notNull(),
  status: text("status").notNull().default("upcoming"), // "upcoming", "ongoing", "completed", "cancelled"
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>(),
  speakers: jsonb("speakers").$type<Array<{
    id: string;
    name: string;
    bio: string;
    image?: string;
    expertise: string[];
  }>>(),
  schedule: jsonb("schedule").$type<Array<{
    time: string;
    activity: string;
    speaker?: string;
    duration?: string;
  }>>(),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ticket types for events
export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  maxQuantity: integer("max_quantity"),
  availableQuantity: integer("available_quantity"),
  availableUntil: timestamp("available_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Event registrations
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  ticketTypeId: integer("ticket_type_id").notNull().references(() => ticketTypes.id),
  quantity: integer("quantity").notNull().default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("confirmed"), // "pending", "confirmed", "cancelled"
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending", "completed", "failed"
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Courses table - Enhanced with progress tracking
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  category: text("category").notNull(),
  duration: text("duration").notNull(),
  modules: integer("modules").notNull(),
  lessons: integer("lessons").notNull(),
  cpdPoints: integer("cpd_points").notNull(),
  difficulty: text("difficulty").notNull(), // "Beginner", "Intermediate", "Advanced"
  accreditedBy: text("accredited_by").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviews: integer("reviews").default(0),
  enrollmentCount: integer("enrollment_count").default(0),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>(),
  targetAudience: jsonb("target_audience").$type<string[]>(),
  prerequisites: jsonb("prerequisites").$type<string[]>(),
  videoHours: text("video_hours"),
  resources: text("resources"),
  instructors: jsonb("instructors").$type<Array<{
    id: string;
    name: string;
    bio: string;
    image?: string;
    expertise: string[];
  }>>(),
  curriculum: jsonb("curriculum").$type<Array<{
    module: number;
    title: string;
    description: string;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      type: "video" | "reading" | "quiz" | "assignment";
    }>;
  }>>(),
  tags: jsonb("tags").$type<string[]>(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Course enrollments with detailed progress tracking
export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").notNull().default(0), // 0-100
  status: text("status").notNull().default("in_progress"), // "enrolled", "in_progress", "completed", "dropped"
  completedLessons: jsonb("completed_lessons").$type<string[]>().default([]),
  completedModules: jsonb("completed_modules").$type<number[]>().default([]),
  currentLesson: text("current_lesson"),
  timeSpent: integer("time_spent").default(0), // in minutes
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  certificateIssued: boolean("certificate_issued").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// CPD Categories
export const cpdCategories = pgTable("cpd_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  requiredPoints: integer("required_points").notNull(),
  color: text("color").default("#3B82F6"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CPD Activities with enhanced tracking
export const cpdActivities = pgTable("cpd_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  type: text("type").notNull(), // "Event", "Course", "Workshop", "Conference", "Webinar", "Publication", "Research", "Other"
  category: text("category").notNull(),
  categoryId: integer("category_id").references(() => cpdCategories.id),
  points: integer("points").notNull(),
  hours: decimal("hours", { precision: 5, scale: 2 }),
  source: text("source").notNull(),
  certificateUrl: text("certificate_url"),
  verificationStatus: text("verification_status").notNull().default("pending"), // "pending", "verified", "rejected"
  verifiedBy: integer("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  evidenceUrls: jsonb("evidence_urls").$type<string[]>(),
  reflectionNotes: text("reflection_notes"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Forum Categories
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon"),
  color: text("color").default("#3B82F6"),
  topics: integer("topics").default(0),
  posts: integer("posts").default(0),
  lastActivity: timestamp("last_activity"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Discussions/Topics
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => forumCategories.id),
  comments: integer("comments").default(0),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  tags: jsonb("tags").$type<string[]>(),
  isPinned: boolean("is_pinned").default(false),
  isClosed: boolean("is_closed").default(false),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyBy: integer("last_reply_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Discussion replies/comments
export const discussionReplies = pgTable("discussion_replies", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").notNull().references(() => discussions.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  parentId: integer("parent_id").references(() => discussionReplies.id), // For nested replies
  likes: integer("likes").default(0),
  isAcceptedAnswer: boolean("is_accepted_answer").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Mentorship opportunities
export const mentorshipOpportunities = pgTable("mentorship_opportunities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  position: text("position").notNull(),
  specialties: jsonb("specialties").$type<string[]>().notNull(),
  availability: text("availability"),
  maxMentees: integer("max_mentees").default(5),
  currentMentees: integer("current_mentees").default(0),
  preferredExperience: text("preferred_experience"),
  meetingFormat: text("meeting_format"), // "Virtual", "In-person", "Both"
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviews: integer("reviews").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Mentorship connections
export const mentorshipConnections = pgTable("mentorship_connections", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull().references(() => users.id),
  menteeId: integer("mentee_id").notNull().references(() => users.id),
  opportunityId: integer("opportunity_id").references(() => mentorshipOpportunities.id),
  status: text("status").notNull().default("pending"), // "pending", "active", "completed", "cancelled"
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  goals: text("goals"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Professional Credentials
export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "certification", "license", "degree", "course", "award"
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  issueDate: text("issue_date").notNull(),
  expiryDate: text("expiry_date"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  verificationUrl: text("verification_url"),
  status: text("status").notNull().default("active"), // "active", "expired", "pending", "revoked"
  isPublic: boolean("is_public").default(true),
  attachments: jsonb("attachments").$type<string[]>(),
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages for direct communication
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  subject: text("subject"),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("direct"), // "direct", "system", "notification"
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  parentId: integer("parent_id").references(() => messages.id), // For reply chains
  attachments: jsonb("attachments").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "info", "success", "warning", "error", "course", "event", "cpd", "community"
  actionUrl: text("action_url"),
  actionText: text("action_text"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create schema definitions for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  profession: true,
  role: true,
});

export const selectUserSchema = createSelectSchema(users);

export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);

export const insertCourseSchema = createInsertSchema(courses);
export const selectCourseSchema = createSelectSchema(courses);

export const insertCpdActivitySchema = createInsertSchema(cpdActivities);
export const selectCpdActivitySchema = createSelectSchema(cpdActivities);

export const insertDiscussionSchema = createInsertSchema(discussions);
export const selectDiscussionSchema = createSelectSchema(discussions);

export const insertCredentialSchema = createInsertSchema(credentials);
export const selectCredentialSchema = createSelectSchema(credentials);

// Update schemas for API validation
export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  profession: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  organization: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().url().optional(),
  contactInfo: z.record(z.any()).optional(),
  socialLinks: z.record(z.any()).optional(),
  privacySettings: z.record(z.any()).optional(),
});

export const updateEventSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  type: z.enum(["In-person", "Virtual", "Hybrid"]).optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  image: z.string().url().optional(),
  price: z.number().min(0).optional(),
  cpdPoints: z.number().min(0).optional(),
  maxAttendees: z.number().min(1).optional(),
  accreditationBody: z.string().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  speakers: z.array(z.record(z.any())).optional(),
  schedule: z.array(z.record(z.any())).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  thumbnail: z.string().url().optional(),
  category: z.string().optional(),
  duration: z.string().optional(),
  modules: z.number().min(1).optional(),
  lessons: z.number().min(1).optional(),
  cpdPoints: z.number().min(0).optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  accreditedBy: z.string().optional(),
  price: z.number().min(0).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  targetAudience: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  videoHours: z.string().optional(),
  resources: z.string().optional(),
  instructors: z.array(z.record(z.any())).optional(),
  curriculum: z.array(z.record(z.any())).optional(),
  tags: z.array(z.string()).optional(),
});

// Export types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SelectUser = z.infer<typeof selectUserSchema>;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type SelectEvent = z.infer<typeof selectEventSchema>;

export type TicketType = typeof ticketTypes.$inferSelect;
export type EventRegistration = typeof eventRegistrations.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type SelectCourse = z.infer<typeof selectCourseSchema>;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;

export type CpdCategory = typeof cpdCategories.$inferSelect;
export type InsertCpdActivity = z.infer<typeof insertCpdActivitySchema>;
export type CpdActivity = typeof cpdActivities.$inferSelect;
export type SelectCpdActivity = z.infer<typeof selectCpdActivitySchema>;

export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Discussion = typeof discussions.$inferSelect;
export type SelectDiscussion = z.infer<typeof selectDiscussionSchema>;
export type DiscussionReply = typeof discussionReplies.$inferSelect;

export type MentorshipOpportunity = typeof mentorshipOpportunities.$inferSelect;
export type MentorshipConnection = typeof mentorshipConnections.$inferSelect;

export type InsertCredential = z.infer<typeof insertCredentialSchema>;
export type Credential = typeof credentials.$inferSelect;
export type SelectCredential = z.infer<typeof selectCredentialSchema>;

export type Message = typeof messages.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

// API Response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
  status: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Real-time event types
export type RealtimeEvent = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: any;
  old_record?: any;
};
import { faker } from "@faker-js/faker";
import { InsertUserSchema } from "./zod";

// Mock Data Generation Functions
export const generateMockUser = (): InsertUserSchema => {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    profession: faker.name.jobTitle(),
    role: "user",
  };
};

export const generateMockEvent = () => {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    date: faker.date.future().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
    type: faker.helpers.arrayElement(["Conference", "Workshop", "Webinar"]),
    category: faker.helpers.arrayElement(["Technology", "Health", "Finance"]),
    location: faker.address.city(),
    image: faker.image.imageUrl(),
    price: faker.datatype.number({ min: 0, max: 500 }),
    cpdPoints: faker.datatype.number({ min: 1, max: 20 }),
    accreditationBody: faker.company.name(),
    learningOutcomes: [faker.lorem.sentence(), faker.lorem.sentence()],
    speakers: [{ name: faker.name.fullName(), bio: faker.lorem.sentence() }],
    schedule: [{ time: "09:00", activity: "Registration" }],
    tags:[]
  };
};

export const generateMockCourse = () => {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    thumbnail: faker.image.imageUrl(),
    category: faker.helpers.arrayElement(["Technology", "Health", "Finance"]),
    duration: "4 weeks",
    modules: faker.datatype.number({ min: 3, max: 10 }),
    cpdPoints: faker.datatype.number({ min: 5, max: 30 }),
    difficulty: faker.helpers.arrayElement(["Beginner", "Intermediate", "Advanced"]),
    accreditedBy: faker.company.name(),
    learningOutcomes: [faker.lorem.sentence(), faker.lorem.sentence()],
    targetAudience: [faker.lorem.sentence(), faker.lorem.sentence()],
    videoHours: "10 hours",
    resources: faker.internet.url(),
    instructors: [{ name: faker.name.fullName(), bio: faker.lorem.sentence() }],
    curriculum: [{ week: 1, topic: faker.lorem.sentence() }],
    lessons: faker.datatype.number({ min: 10, max: 50 }),
    tags: []
  };
};

export const generateMockCPDActivity = () => {
  return {
    userId: 1, // Replace with a valid user ID
    title: faker.lorem.sentence(),
    date: faker.date.past().toISOString().split("T")[0],
    type: faker.helpers.arrayElement(["Course", "Event", "Reading"]),
    category: faker.helpers.arrayElement(["Course", "Event", "Reading"]),
    categoryId: 1, // Replace with a valid category ID
    points: faker.datatype.number({ min: 1, max: 10 }),
    hours: 1,
    source: faker.company.name(),
    certificateUrl: faker.internet.url(),
    evidenceUrls: [],
    reflectionNotes: faker.lorem.sentence()
  };
};

export const generateMockForumCategory = () => {
  return {
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
    icon: faker.image.imageUrl(),
  };
};

export const generateMockDiscussion = () => {
  return {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    authorId: 1, // Replace with a valid user ID
    categoryId: 1, // Replace with a valid forum ID
    tags: []
  };
};

export const generateMockMentorshipOpportunity = () => {
  return {
    userId: 1, // Replace with a valid user ID
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    position: faker.name.jobTitle(),
    specialties: [faker.lorem.word(), faker.lorem.word()],
    availability: "Evenings and weekends",
  };
};

export const generateMockCredential = () => {
  return {
    userId: 1,
    type: faker.helpers.arrayElement(["certification", "license", "degree", "course"]),
    name: faker.lorem.sentence(),
    organization: faker.company.name(),
    issueDate: faker.date.past().toISOString().split("T")[0],
    expiryDate: faker.date.future().toISOString().split("T")[0],
    credentialId: faker.random.alphaNumeric(10),
    credentialUrl: faker.internet.url(),
    verificationUrl: faker.internet.url(),
    attachments: []
  };
};

// Zod Schemas for Updates/Validations