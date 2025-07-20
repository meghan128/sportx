
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const handlers = [
  // Mock auth endpoints
  rest.post('/api/auth/login/user', (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
        token: 'mock-token',
      })
    );
  }),

  // Mock user profile endpoint
  rest.get('/api/users/current', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      })
    );
  }),

  // Mock courses endpoint
  rest.get('/api/courses/in-progress', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          title: 'Test Course',
          progress: 50,
          thumbnail: 'test-image.jpg',
        },
      ])
    );
  }),
];

export const server = setupServer(...handlers);
