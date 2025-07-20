
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../routes';

describe('Course Routes', () => {
  let app: express.Application;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe('GET /api/courses', () => {
    it('should fetch all courses', async () => {
      const response = await request(app)
        .get('/api/courses');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter courses by category', async () => {
      const response = await request(app)
        .get('/api/courses')
        .query({ category: 'Sports Medicine' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should fetch course by id', async () => {
      const response = await request(app)
        .get('/api/courses/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 for non-existent course', async () => {
      const response = await request(app)
        .get('/api/courses/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/courses/enroll', () => {
    it('should enroll user in course', async () => {
      const response = await request(app)
        .post('/api/courses/enroll')
        .send({ courseId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should validate courseId', async () => {
      const response = await request(app)
        .post('/api/courses/enroll')
        .send({}); // missing courseId

      expect(response.status).toBe(400);
    });
  });
});
