import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Rate limiting configurations
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: 1, // Trust the first proxy (Replit environment)
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    error: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: 1, // Trust the first proxy (Replit environment)
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 API requests per windowMs
  message: {
    error: 'API rate limit exceeded, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: 1, // Trust the first proxy (Replit environment)
  skip: (req) => {
    // Skip rate limiting for static assets
    return req.url.includes('/assets/') || 
           req.url.includes('/@fs/') || 
           req.url.includes('/src/');
  }
});

// Upload rate limiting for file operations
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit uploads per hour
  message: {
    error: 'Upload limit exceeded, please try again later.',
    retryAfter: Math.round(60 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: 1,
});

// Abuse prevention middleware
export const abusePrevention = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute (aggressive protection)
  message: {
    error: 'Request rate too high, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: 1,
  skip: (req) => {
    // Skip for GET requests to public content
    return req.method === 'GET' && !req.url.startsWith('/api/');
  }
});

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "https://replit.com"],
      connectSrc: ["'self'", "wss:", "https:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  } : false, // Disable CSP in development for Vite
  crossOriginEmbedderPolicy: false, // Allow embedding for Replit
});

// Cookie security middleware
export const secureCookies = (req: Request, res: Response, next: NextFunction) => {
  const originalSetCookie = res.cookie;

  res.cookie = function(name: string, value: any, options: any = {}) {
    const secureOptions = {
      ...options,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: options.maxAge || 24 * 60 * 60 * 1000, // 24 hours default
    };

    return originalSetCookie.call(this, name, value, secureOptions);
  };

  next();
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
};