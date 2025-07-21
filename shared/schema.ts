import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  decimal,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User types enum for authentication
export const userTypes = ["student", "professional", "resource_person"] as const;
export type UserType = (typeof userTypes)[number];

// Authentication status enum
export const authStatusTypes = ["pending", "approved", "rejected", "under_review"] as const;
export type AuthStatus = (typeof authStatusTypes)[number];

// Users table - Enhanced with authentication system
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  name: text("name").notNull(),
  dateOfBirth: text("date_of_birth"),
  alternativeNames: jsonb("alternative_names").$type<string[]>().default([]),
  password: text("password").notNull(),
  userType: text("user_type").$type<UserType>().notNull(),
  authStatus: text("auth_status").$type<AuthStatus>().notNull().default("pending"),
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

// Student-specific information
export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  degreeProgram: text("degree_program").notNull(),
  currentYear: integer("current_year").notNull(),
  expectedGraduation: text("expected_graduation"),
  university: text("university").notNull(),
  studentId: text("student_id"),
  marksheetUrl: text("marksheet_url").notNull(),
  marksheetVerified: boolean("marksheet_verified").default(false),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Professional-specific information
export const professionalProfiles = pgTable("professional_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  degreeType: text("degree_type").notNull(), // "bachelor", "master", "doctorate", etc.
  degreeName: text("degree_name").notNull(),
  university: text("university").notNull(),
  graduationYear: text("graduation_year").notNull(),
  degreeUrl: text("degree_url").notNull(),
  degreeVerified: boolean("degree_verified").default(false),
  licenseNumber: text("license_number"),
  licenseExpiryDate: text("license_expiry_date"),
  affiliations: jsonb("affiliations").$type<Array<{
    name: string;
    membershipNumber?: string;
    type: string;
    status: string;
  }>>().default([]),
  yearsOfExperience: integer("years_of_experience"),
  currentWorkplace: text("current_workplace"),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resource person-specific information
export const resourcePersonProfiles = pgTable("resource_person_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  degreeType: text("degree_type").notNull(),
  degreeName: text("degree_name").notNull(),
  university: text("university").notNull(),
  graduationYear: text("graduation_year").notNull(),
  degreeUrl: text("degree_url").notNull(),
  degreeVerified: boolean("degree_verified").default(false),
  mandatoryAffiliations: jsonb("mandatory_affiliations").$type<Array<{
    name: string;
    membershipNumber: string;
    type: string;
    status: string;
    verificationStatus: "pending" | "verified" | "rejected";
  }>>().notNull(),
  additionalCertifications: jsonb("additional_certifications").$type<Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    certificateUrl: string;
  }>>().default([]),
  yearsOfExperience: integer("years_of_experience").notNull(),
  expertiseAreas: jsonb("expertise_areas").$type<string[]>().default([]),
  publications: jsonb("publications").$type<Array<{
    title: string;
    journal: string;
    year: string;
    url?: string;
  }>>().default([]),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Document verification logs
export const documentVerifications = pgTable("document_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(), // "marksheet", "degree", "certificate"
  documentUrl: text("document_url").notNull(),
  ocrExtractedText: text("ocr_extracted_text"),
  ocrConfidence: decimal("ocr_confidence", { precision: 5, scale: 2 }),
  nameMatches: jsonb("name_matches").$type<Array<{
    extractedName: string;
    confidence: number;
    matched: boolean;
  }>>(),
  verificationStatus: text("verification_status").$type<AuthStatus>().default("pending"),
  verifiedBy: integer("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  verificationNotes: text("verification_notes"),
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
  price: text("price").notNull(),
  cpdPoints: integer("cpd_points").notNull().default(0),
  duration: text("duration").notNull(),
  level: text("level").notNull(), // "beginner", "intermediate", "advanced"
  instructor: text("instructor").notNull(),
  instructorBio: text("instructor_bio"),
  instructorImage: text("instructor_image"),
  accreditationBody: text("accreditation_body").notNull(),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>(),
  modules: jsonb("modules").$type<Array<{
    id: string;
    title: string;
    duration: string;
    type: "video" | "reading" | "quiz" | "assignment";
  }>>(),
  tags: jsonb("tags").$type<string[]>(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  enrollmentCount: integer("enrollment_count").default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Course enrollments
export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").default(0), // 0-100
  status: text("status").notNull().default("active"), // "active", "completed", "dropped"
  completedModules: jsonb("completed_modules").$type<number[]>().default([]),
  currentLesson: integer("current_lesson").default(1),
  timeSpent: integer("time_spent").default(0), // in minutes
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  certificateIssued: boolean("certificate_issued").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ one }) => ({
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  professionalProfile: one(professionalProfiles, {
    fields: [users.id],
    references: [professionalProfiles.userId],
  }),
  resourcePersonProfile: one(resourcePersonProfiles, {
    fields: [users.id],
    references: [resourcePersonProfiles.userId],
  }),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
}));

export const professionalProfilesRelations = relations(professionalProfiles, ({ one }) => ({
  user: one(users, {
    fields: [professionalProfiles.userId],
    references: [users.id],
  }),
}));

export const resourcePersonProfilesRelations = relations(resourcePersonProfiles, ({ one }) => ({
  user: one(users, {
    fields: [resourcePersonProfiles.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertStudentProfileSchema = createInsertSchema(studentProfiles);
export const selectStudentProfileSchema = createSelectSchema(studentProfiles);
export const insertProfessionalProfileSchema = createInsertSchema(professionalProfiles);
export const selectProfessionalProfileSchema = createSelectSchema(professionalProfiles);
export const insertResourcePersonProfileSchema = createInsertSchema(resourcePersonProfiles);
export const selectResourcePersonProfileSchema = createSelectSchema(resourcePersonProfiles);
export const insertDocumentVerificationSchema = createInsertSchema(documentVerifications);
export const selectDocumentVerificationSchema = createSelectSchema(documentVerifications);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = typeof studentProfiles.$inferInsert;
export type ProfessionalProfile = typeof professionalProfiles.$inferSelect;
export type InsertProfessionalProfile = typeof professionalProfiles.$inferInsert;
export type ResourcePersonProfile = typeof resourcePersonProfiles.$inferSelect;
export type InsertResourcePersonProfile = typeof resourcePersonProfiles.$inferInsert;
export type DocumentVerification = typeof documentVerifications.$inferSelect;
export type InsertDocumentVerification = typeof documentVerifications.$inferInsert;

// Registration schemas for different user types
export const studentRegistrationSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  phone: z.string().min(10),
  name: z.string().min(2),
  dateOfBirth: z.string(),
  alternativeNames: z.array(z.string()).optional().default([]),
  password: z.string().min(6),
  degreeProgram: z.string().min(2),
  currentYear: z.number().min(1).max(10),
  expectedGraduation: z.string().optional(),
  university: z.string().min(2),
  studentId: z.string().optional(),
  marksheet: z.string().url(), // File URL after upload
});

export const professionalRegistrationSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  phone: z.string().min(10),
  name: z.string().min(2),
  dateOfBirth: z.string().optional(),
  alternativeNames: z.array(z.string()).optional().default([]),
  password: z.string().min(6),
  profession: z.string().min(2),
  specialization: z.string().optional(),
  degreeType: z.string().min(2),
  degreeName: z.string().min(2),
  university: z.string().min(2),
  graduationYear: z.string(),
  degree: z.string().url(), // File URL after upload
  licenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  affiliations: z.array(z.object({
    name: z.string(),
    membershipNumber: z.string().optional(),
    type: z.string(),
  })).optional().default([]),
  yearsOfExperience: z.number().min(0).optional(),
  currentWorkplace: z.string().optional(),
});

export const resourcePersonRegistrationSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  phone: z.string().min(10),
  name: z.string().min(2),
  dateOfBirth: z.string().optional(),
  alternativeNames: z.array(z.string()).optional().default([]),
  password: z.string().min(6),
  profession: z.string().min(2),
  specialization: z.string().optional(),
  degreeType: z.string().min(2),
  degreeName: z.string().min(2),
  university: z.string().min(2),
  graduationYear: z.string(),
  degree: z.string().url(), // File URL after upload
  mandatoryAffiliations: z.array(z.object({
    name: z.string().min(2),
    membershipNumber: z.string().min(1),
    type: z.string(),
  })).min(1),
  additionalCertifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    issueDate: z.string(),
    expiryDate: z.string().optional(),
    certificateUrl: z.string().url(),
  })).optional().default([]),
  yearsOfExperience: z.number().min(0),
  expertiseAreas: z.array(z.string()).optional().default([]),
  publications: z.array(z.object({
    title: z.string(),
    journal: z.string(),
    year: z.string(),
    url: z.string().url().optional(),
  })).optional().default([]),
});

export type StudentRegistration = z.infer<typeof studentRegistrationSchema>;
export type ProfessionalRegistration = z.infer<typeof professionalRegistrationSchema>;
export type ResourcePersonRegistration = z.infer<typeof resourcePersonRegistrationSchema>;