
import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import { storage } from '../storage-factory';

beforeAll(async () => {
  // Initialize test database or mock storage
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  // Cleanup test database
});

beforeEach(async () => {
  // Reset database state before each test
});

// Mock external services
jest.mock('../supabase-storage', () => ({
  SupabaseStorage: jest.fn().mockImplementation(() => ({
    getUpcomingEvents: jest.fn().mockResolvedValue([]),
    getAllEvents: jest.fn().mockResolvedValue([]),
    getUserCourses: jest.fn().mockResolvedValue([]),
    getCpdSummary: jest.fn().mockResolvedValue({}),
  })),
}));
