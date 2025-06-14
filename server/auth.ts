import type { Express, Request, Response } from "express";
import { storage } from "./storage";

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    user?: any;
  }
}

export function setupAuthRoutes(app: Express) {
  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, email, fullName, password } = req.body;
      
      if (!username || !email || !fullName || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create new user
      const user = await storage.createUser({
        username,
        email,
        fullName,
        password,
        phone: "0500000000",
        rewardPoints: 0,
        level: 1,
        isVerified: true
      });

      // Set session
      req.session.userId = user.id;
      req.session.user = user;

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          rewardPoints: user.rewardPoints,
          level: user.level
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      // For demo purposes, allow any user to login
      let user = await storage.getUserByUsername(username);
      
      if (!user) {
        // Create new user for demo
        user = await storage.createUser({
          username,
          email: `${username}@example.com`,
          fullName: username,
          password: password,
          phone: "0500000000",
          rewardPoints: 0,
          level: 1,
          isVerified: true
        });
      }

      // Set session
      req.session.userId = user.id;
      req.session.user = user;

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          rewardPoints: user.rewardPoints,
          level: user.level
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout user
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        rewardPoints: user.rewardPoints,
        level: user.level,
        isVerified: user.isVerified
      });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Authentication check failed" });
    }
  });
}

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}