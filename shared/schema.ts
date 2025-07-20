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
  role: text("role").notNull().default("user"), // "user" or "resource_person"
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
  role: true,
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
  };
};

export const generateMockCPDActivity = () => {
  return {
    userId: 1, // Replace with a valid user ID
    title: faker.lorem.sentence(),
    date: faker.date.past().toISOString().split("T")[0],
    type: faker.helpers.arrayElement(["Course", "Event", "Reading"]),
    categoryId: 1, // Replace with a valid category ID
    points: faker.datatype.number({ min: 1, max: 10 }),
    source: faker.company.name(),
    certificateUrl: faker.internet.url(),
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
    forumId: 1, // Replace with a valid forum ID
  };
};

export const generateMockMentorshipOpportunity = () => {
  return {
    userId: 1, // Replace with a valid user ID
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
  };
};

// Zod Schemas for Updates/Validations

export const updateUserSchema = z.object({
  username: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  profession: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  organization: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().optional(),
  contactInfo: z.record(z.any()).optional(),
  socialLinks: z.record(z.any()).optional(),
  privacySettings: z.record(z.any()).optional(),
});

export const updateEventSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  price: z.number().optional(),
  cpdPoints: z.number().optional(),
  accreditationBody: z.string().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  speakers: z.array(z.record(z.any())).optional(),
  schedule: z.array(z.record(z.any())).optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  category: z.string().optional(),
  duration: z.string().optional(),
  modules: z.number().optional(),
  cpdPoints: z.number().optional(),
  difficulty: z.string().optional(),
  accreditedBy: z.string().optional(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  targetAudience: z.array(z.string()).optional(),
  videoHours: z.string().optional(),
  resources: z.string().optional(),
  instructors: z.array(z.record(z.any())).optional(),
  curriculum: z.array(z.record(z.any())).optional(),
  lessons: z.number().optional(),
});

export const updateCpdActivitySchema = z.object({
  title: z.string().optional(),
  date: z.string().optional(),
  type: z.string().optional(),
  categoryId: z.number().optional(),
  points: z.number().optional(),
  source: z.string().optional(),
  certificateUrl: z.string().optional(),
});

export const updateForumCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const updateDiscussionSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  forumId: z.number().optional(),
});

export const updateMentorshipOpportunitySchema = z.object({
  position: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.string().optional(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
});

export const updateCredentialSchema = z.object({
  type: z.string().optional(),
  name: z.string().optional(),
  organization: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
  status: z.string().optional(),
});
// API Route Handlers (Example for Users)
// (Note: These are examples and would need to be adapted to your specific framework - Next.js, Express, etc.)

// Example using Next.js API routes:

// pages/api/users/index.ts (POST - Create a new user)
/*
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db'; // Assuming you have a db connection
import { users, insertUserSchema } from '../../../shared/schema';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const parsedBody = insertUserSchema.parse(req.body); // Validate input
      const newUser = await db.insert(users).values(parsedBody).returning();
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
*/

// pages/api/users/[id].ts (GET - Get user by ID, PUT - Update User)

/*
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { users, updateUserSchema } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string' || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const userId = parseInt(id);


  if (req.method === 'GET') {
    try {
      const user = await db.select().from(users).where(eq(users.id, userId));
      if (user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve user' });
    }
  } else if (req.method === 'PUT') {
    try {
      const parsedBody = updateUserSchema.parse(req.body); // Validate input
      const updatedUser = await db
        .update(users)
        .set(parsedBody)
        .where(eq(users.id, userId))
        .returning();

      if (updatedUser.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }


      res.status(200).json(updatedUser[0]);
    } catch (error) {

       if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Failed to update user' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
*/

// Vitest Test Suite Example (for Users)
// (Assumes you have Vitest set up in your project)

// tests/user.test.ts
/*
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db'; // Adjust the path
import { users, insertUserSchema } from '../shared/schema';
import { generateMockUser } from '../shared/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

describe('User Operations', () => {
  let testUserId: number | undefined;

  beforeAll(async () => {
    // Clean up before running tests (optional, but good practice)
    await db.delete(users);
  });

  it('should insert a valid user', async () => {
    const mockUser = generateMockUser();

    try {
      const insertedUsers = await db.insert(users).values(mockUser).returning();
      expect(insertedUsers).toBeDefined();
      expect(insertedUsers.length).toBe(1);
      expect(insertedUsers[0].username).toBe(mockUser.username);
      testUserId = insertedUsers[0].id; // Store the ID for later tests
    } catch (error) {
      console.error("Insert Error:", error);
      throw error; // Fail the test
    }
  });

  it('should fail to insert a user with invalid data', async () => {
    const invalidUser = {
      username: 123, // Invalid type
      password: '',
      name: '',
      email: '',
      profession: '',
      role: 'user',
    };

    await expect(db.insert(users).values(invalidUser as any).returning()).rejects.toThrowError();
  });

  it('should update an existing user', async () => {
    if (!testUserId) {
      throw new Error("No user ID available.  Insert test likely failed.");
    }

    const updatedData = {
      name: 'Updated Name',
      profession: 'Updated Profession',
    };

    try {
      const updatedUsers = await db
        .update(users)
        .set(updatedData)
        .where(eq(users.id, testUserId))
        .returning();

      expect(updatedUsers).toBeDefined();
      expect(updatedUsers.length).toBe(1);
      expect(updatedUsers[0].name).toBe(updatedData.name);
      expect(updatedUsers[0].profession).toBe(updatedData.profession);
    } catch (error) {
      console.error("Update Error:", error);
      throw error; // Fail the test
    }
  });

  afterAll(async () => {
    // Clean up after running tests (optional, but good practice)
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });
});
*/
// API Route Handlers (Example for Events)
// (Note: These are examples and would need to be adapted to your specific framework - Next.js, Express, etc.)

// pages/api/events/index.ts (POST - Create a new event)
/*
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db'; // Assuming you have a db connection
import { events } from '../../../shared/schema';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Assuming you have a schema for event creation, e.g., insertEventSchema
      //const parsedBody = insertEventSchema.parse(req.body); // Validate input
      const newEvent = await db.insert(events).values(req.body).returning();
      res.status(201).json(newEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create event' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
*/

// pages/api/events/[id].ts (GET - Get event by ID, PUT - Update Event)

/*
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { events, updateEventSchema } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string' || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const eventId = parseInt(id);


  if (req.method === 'GET') {
    try {
      const event = await db.select().from(events).where(eq(events.id, eventId));
      if (event.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(event[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve event' });
    }
  } else if (req.method === 'PUT') {
    try {
      const parsedBody = updateEventSchema.parse(req.body); // Validate input
      const updatedEvent = await db
        .update(events)
        .set(parsedBody)
        .where(eq(events.id, eventId))
        .returning();

      if (updatedEvent.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json(updatedEvent[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update event' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
*/

// Vitest Test Suite Example (for Events)
// (Assumes you have Vitest set up in your project)

// tests/event.test.ts
/*
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db'; // Adjust the path
import { events } from '../shared/schema';
import { generateMockEvent } from '../shared/schema';
import { eq } from 'drizzle-orm';

describe('Event Operations', () => {
  let testEventId: number | undefined;

  beforeAll(async () => {
    // Clean up before running tests (optional, but good practice)
    await db.delete(events);
  });

  it('should insert a valid event', async () => {
    const mockEvent = generateMockEvent();

    try {
      const insertedEvents = await db.insert(events).values(mockEvent).returning();
      expect(insertedEvents).toBeDefined();
      expect(insertedEvents.length).toBe(1);
      expect(insertedEvents[0].title).toBe(mockEvent.title);
      testEventId = insertedEvents[0].id; // Store the ID for later tests
    } catch (error) {
      console.error("Insert Error:", error);
      throw error; // Fail the test
    }
  });

  it('should update an existing event', async () => {
    if (!testEventId) {
      throw new Error("No event ID available.  Insert test likely failed.");
    }

    const updatedData = {
      title: 'Updated Title',
      location: 'Updated Location',
    };

    try {
      const updatedEvents = await db
        .update(events)
        .set(updatedData)
        .where(eq(events.id, testEventId))
        .returning();

      expect(updatedEvents).toBeDefined();
      expect(updatedEvents.length).toBe(1);
      expect(updatedEvents[0].title).toBe(updatedData.title);
      expect(updatedEvents[0].location).toBe(updatedData.location);
    } catch (error) {
      console.error("Update Error:", error);
      throw error; // Fail the test
    }
  });

  afterAll(async () => {
    // Clean up after running tests (optional, but good practice)
    if (testEventId) {
      await db.delete(events).where(eq(events.id, testEventId));
    }
  });
});
*/

// API Route Handlers (Example for Courses)
// (Note: These are examples and would need to be adapted to your specific framework - Next.js, Express, etc.)

// pages/api/courses/index.ts (POST - Create a new course)
/*
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db'; // Assuming you have a db connection
import { courses } from '../../../shared/schema';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Assuming you have a schema for course creation, e.g., insertCourseSchema
      //const parsedBody = insertCourseSchema.parse(req.body); // Validate input
      const newCourse = await db.insert(courses).values(req.body).returning();
      res.status(201).json(newCourse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
*/

// pages/api/courses/[id].ts (GET - Get course by ID, PUT - Update Course)

/*
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { courses, updateCourseSchema } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string' || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const courseId = parseInt(id);


  if (req.method === 'GET') {
    try {
      const course = await db.select().from(courses).where(eq(courses.id, courseId));
      if (course.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve course' });
    }
  } else if (req.method === 'PUT') {
    try {
      const parsedBody = updateCourseSchema.parse(req.body); // Validate input
      const updatedCourse = await db
        .update(courses)
        .set(parsedBody)
        .where(eq(courses.id, courseId))
        .returning();

      if (updatedCourse.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json(updatedCourse[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update course' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
*/

// Vitest Test Suite Example (for Courses)
// (Assumes you have Vitest set up in your project)

// tests/course.test.ts
/*
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db'; // Adjust the path
import { courses } from '../shared/schema';
import { generateMockCourse } from '../shared/schema';
import { eq } from 'drizzle-orm';

describe('Course Operations', () => {
  let testCourseId: number | undefined;

  beforeAll(async () => {
    // Clean up before running tests (optional, but good practice)
    await db.delete(courses);
  });

  it('should insert a valid course', async () => {
    const mockCourse = generateMockCourse();

    try {
      const insertedCourses = await db.insert(courses).values(mockCourse).returning();
      expect(insertedCourses).toBeDefined();
      expect(insertedCourses.length).toBe(1);
      expect(insertedCourses[0].title).toBe(mockCourse.title);
      testCourseId = insertedCourses[0].id; // Store the ID for later tests
    } catch (error) {
      console.error("Insert Error:", error);
      throw error; // Fail the test
    }
  });

  it('should update an existing course', async () => {
    if (!testCourseId) {
      throw new Error("No course ID available.  Insert test likely failed.");
    }

    const updatedData = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    try {
      const updatedCourses = await db
        .update(courses)
        .set(updatedData)
        .where(eq(courses.id, testCourseId))
        .returning();

      expect(updatedCourses).toBeDefined();
      expect(updatedCourses.length).toBe(1);
      expect(updatedCourses[0].title).toBe(updatedData.title);
      expect(updatedCourses[0].description).toBe(updatedData.description);
    } catch (error) {
      console.error("Update Error:", error);
      throw error; // Fail the test
    }
  });

  afterAll(async () => {
    // Clean up after running tests (optional, but good practice)
    if (testCourseId) {
      await db.delete(courses).where(eq(courses.id, testCourseId));
    }
  });
});
*/

// API Route Handlers (Example for Discussions)
// (Note: These are examples and would need to be adapted to your specific framework - Next.js, Express, etc.)

// pages/api/discussions/index.ts (POST - Create a new discussion)
/*
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db'; // Assuming you have a db connection
import { discussions } from '../../../shared/schema';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Assuming you have a schema for discussion creation, e.g., insertDiscussionSchema
      //const parsedBody = insertDiscussionSchema.parse(req.body); // Validate input
      const newDiscussion = await db.insert(discussions).values(req.body).returning();
      res.status(201).json(newDiscussion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create discussion' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
*/

// pages/api/discussions/[id].ts (GET - Get discussion by ID, PUT - Update Discussion)

/*
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { discussions, updateDiscussionSchema } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string' || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const discussionId = parseInt(id);


  if (req.method === 'GET') {
    try {
      const discussion = await db.select().from(discussions).where(eq(discussions.id, discussionId));
      if (discussion.length === 0) {
        return res.status(404).json({ message: 'Discussion not found' });
      }
      res.status(200).json(discussion[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve discussion' });
    }
  } else if (req.method === 'PUT') {
    try {
      const parsedBody = updateDiscussionSchema.parse(req.body); // Validate input
      const updatedDiscussion = await db
        .update(discussions)
        .set(parsedBody)
        .where(eq(discussions.id, discussionId))
        .returning();

      if (updatedDiscussion.length === 0) {
        return res.status(404).json({ message: 'Discussion not found' });
      }

      res.status(200).json(updatedDiscussion[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update discussion' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
*/

// Vitest Test Suite Example (for Discussions)
// (Assumes you have Vitest set up in your project)

// tests/discussion.test.ts
/*
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db'; // Adjust the path
import { discussions } from '../shared/schema';
import { generateMockDiscussion } from '../shared/schema';
import { eq } from 'drizzle-orm';

describe('Discussion Operations', () => {
  let testDiscussionId: number | undefined;

  beforeAll(async () => {
    // Clean up before running tests (optional, but good practice)
    await db.delete(discussions);
  });

  it('should insert a valid discussion', async () => {
    const mockDiscussion = generateMockDiscussion();

    try {
      const insertedDiscussions = await db.insert(discussions).values(mockDiscussion).returning();
      expect(insertedDiscussions).toBeDefined();
      expect(insertedDiscussions.length).toBe(1);
      expect(insertedDiscussions[0].title).toBe(mockDiscussion.title);
      testDiscussionId = insertedDiscussions[0].id; // Store the ID for later tests
    } catch (error) {
      console.error("Insert Error:", error);
      throw error; // Fail the test
    }
  });

  it('should update an existing discussion', async () => {
    if (!testDiscussionId) {
      throw new Error("No discussion ID available.  Insert test likely failed.");
    }

    const updatedData = {
      content: 'Updated Content',
    };

    try {
      const updatedDiscussions = await db
        .update(discussions)
        .set(updatedData)
        .where(eq(discussions.id, testDiscussionId))
        .returning();

      expect(updatedDiscussions).toBeDefined();
      expect(updatedDiscussions.length).toBe(1);
      expect(updatedDiscussions[0].content).toBe(updatedData.content);
    } catch (error) {
      console.error("Update Error:", error);
      throw error; // Fail the test
    }
  });

  afterAll(async () => {
    // Clean up after running tests (optional, but good practice)
    if (testDiscussionId) {
      await db.delete(discussions).where(eq(discussions.id, testDiscussionId));
    }
  });
});
*/