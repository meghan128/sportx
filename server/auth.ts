import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import type { User } from "@shared/schema";

const pgStore = connectPg(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

// Middleware to check if user is authenticated
export const requireAuth: RequestHandler = async (req, res, next) => {
  const userId = (req as any).session?.userId;
  
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = await storage.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  (req as any).user = user;
  next();
};

// Middleware to check if user is authenticated and approved
export const requireApprovedAuth: RequestHandler = async (req, res, next) => {
  const userId = (req as any).session?.userId;
  
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = await storage.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (user.authStatus !== "approved") {
    return res.status(403).json({ 
      error: "Account pending verification", 
      authStatus: user.authStatus,
      message: "Your account is still being verified. Please check back later."
    });
  }

  (req as any).user = user;
  next();
};

// Middleware to check specific user types
export const requireUserType = (allowedTypes: string[]) => {
  return async (req: any, res: any, next: any) => {
    await requireAuth(req, res, async () => {
      if (!allowedTypes.includes(req.user.userType)) {
        return res.status(403).json({ 
          error: "Insufficient permissions",
          requiredTypes: allowedTypes,
          currentType: req.user.userType
        });
      }
      next();
    });
  };
};