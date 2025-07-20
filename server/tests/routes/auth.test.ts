
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../routes';

describe('Authentication Routes', () => {
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

  describe('POST /api/auth/login/user', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login/user')
        .send({
          email: 'user@example.com',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('user@example.com');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login/user')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/login/user')
        .send({
          email: 'test@example.com'
          // missing password
        });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/auth/login/resource-person', () => {
    it('should login resource person with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login/resource-person')
        .send({
          email: 'resource@example.com',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body.user.role).toBe('resource_person');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});
