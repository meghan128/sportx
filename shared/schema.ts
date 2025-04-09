import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profession: text("profession"),
  specialization: text("specialization"),
  bio: text("bio"),
  organization: text("organization"),
  location: text("location"),
  profileImage: text("profile_image"),
  contactInfo: jsonb("contact_info"),
  socialLinks: jsonb("social_links"),
  privacySettings: jsonb("privacy_settings").$type<{
    profilePublic?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    allowMessages?: boolean;
    allowMentorship?: boolean;
    showCourses?: boolean;
    showEvents?: boolean;
    showCpd?: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  profession: true,
});

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  type: text("type").notNull(),
  category: text("category"),
  location: text("location"),
  image: text("image").notNull(),
  price: integer("price").notNull(),
  cpdPoints: integer("cpd_points").notNull(),
  attendees: integer("attendees").default(0),
  accreditationBody: text("accreditation_body").notNull(),
  learningOutcomes: jsonb("learning_outcomes"),
  speakers: jsonb("speakers"),
  schedule: jsonb("schedule"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  availableUntil: timestamp("available_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  ticketTypeId: integer("ticket_type_id").notNull().references(() => ticketTypes.id),
  quantity: integer("quantity").notNull().default(1),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  category: text("category").notNull(),
  duration: text("duration").notNull(),
  modules: integer("modules").notNull(),
  cpdPoints: integer("cpd_points").notNull(),
  difficulty: text("difficulty").notNull(),
  accreditedBy: text("accredited_by").notNull(),
  rating: integer("rating"),
  reviews: integer("reviews").default(0),
  learningOutcomes: jsonb("learning_outcomes"),
  targetAudience: jsonb("target_audience"),
  videoHours: text("video_hours"),
  resources: text("resources"),
  instructors: jsonb("instructors"),
  curriculum: jsonb("curriculum"),
  lessons: integer("lessons"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull().default("in_progress"),
  completedLessons: jsonb("completed_lessons"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// CPD Credits
export const cpdCategories = pgTable("cpd_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  requiredPoints: integer("required_points").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cpdActivities = pgTable("cpd_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(),
  categoryId: integer("category_id").references(() => cpdCategories.id),
  points: integer("points").notNull(),
  source: text("source").notNull(),
  certificateUrl: text("certificate_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  topics: integer("topics").default(0),
  posts: integer("posts").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  forumId: integer("forum_id").notNull().references(() => forumCategories.id),
  comments: integer("comments").default(0),
  likes: integer("likes").default(0),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mentorshipOpportunities = pgTable("mentorship_opportunities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  position: text("position").notNull(),
  specialties: jsonb("specialties").notNull(),
  availability: text("availability"),
  rating: integer("rating"),
  reviews: integer("reviews").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Professional Credentials
export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // certification, license, degree, or course
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  issueDate: text("issue_date").notNull(),
  expiryDate: text("expiry_date"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  status: text("status").notNull().default("active"), // active, expired, pending
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type TicketType = typeof ticketTypes.$inferSelect;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type CpdCategory = typeof cpdCategories.$inferSelect;
export type CpdActivity = typeof cpdActivities.$inferSelect;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type Discussion = typeof discussions.$inferSelect;
export type MentorshipOpportunity = typeof mentorshipOpportunities.$inferSelect;
export type Credential = typeof credentials.$inferSelect;
