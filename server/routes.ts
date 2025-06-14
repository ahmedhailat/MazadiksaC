import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { mlRecommendationEngine } from "./ml-recommendation-engine";
import { notificationService } from "./notification-service";
import { setupAuthRoutes, requireAuth } from "./auth";
import { insertBidSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuthRoutes(app);

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Auctions
  app.get("/api/auctions", async (req, res) => {
    try {
      const { categoryId, status, featured } = req.query;
      const filters: any = {};
      
      if (categoryId) filters.categoryId = parseInt(categoryId as string);
      if (status) filters.status = status as string;
      if (featured !== undefined) filters.featured = featured === 'true';

      const auctions = await storage.getAuctions(filters);
      res.json(auctions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch auctions" });
    }
  });

  app.get("/api/auctions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const auction = await storage.getAuction(id);
      
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      res.json(auction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch auction" });
    }
  });

  // Bids
  app.get("/api/auctions/:id/bids", async (req, res) => {
    try {
      const auctionId = parseInt(req.params.id);
      const bids = await storage.getBidsForAuction(auctionId);
      
      // Return bids with bidder info (for display purposes)
      const bidsWithUsers = await Promise.all(
        bids.map(async (bid) => {
          const bidder = await storage.getUser(bid.bidderId);
          return {
            ...bid,
            bidder: bidder ? { 
              id: bidder.id, 
              username: bidder.username,
              fullName: bidder.fullName 
            } : null
          };
        })
      );

      res.json(bidsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bids" });
    }
  });

  app.post("/api/auctions/:id/bids", async (req, res) => {
    try {
      const auctionId = parseInt(req.params.id);
      
      // Validate request body
      const bidData = insertBidSchema.parse({
        ...req.body,
        auctionId
      });

      // Check if auction exists and is active
      const auction = await storage.getAuction(auctionId);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      if (auction.status !== "active") {
        return res.status(400).json({ message: "Auction is not active" });
      }

      if (new Date() > auction.endTime) {
        return res.status(400).json({ message: "Auction has ended" });
      }

      // Check if bid amount is valid
      const currentPrice = parseFloat(auction.currentPrice);
      const bidAmount = parseFloat(bidData.amount);
      const bidIncrement = parseFloat(auction.bidIncrement);

      if (bidAmount <= currentPrice) {
        return res.status(400).json({ 
          message: `Bid must be higher than current price of ${currentPrice} AED` 
        });
      }

      if (bidAmount < currentPrice + bidIncrement) {
        return res.status(400).json({ 
          message: `Minimum bid increment is ${bidIncrement} AED` 
        });
      }

      // Create the bid
      const bid = await storage.createBid(bidData);
      
      // Get updated auction
      const updatedAuction = await storage.getAuction(auctionId);
      
      res.json({ 
        bid, 
        auction: updatedAuction,
        message: "Bid placed successfully" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid bid data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to place bid" });
    }
  });

  // Get auction statistics for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const allAuctions = await storage.getAuctions();
      const activeAuctions = allAuctions.filter(a => a.status === "active");
      const users = await Promise.all([1, 2, 3].map(id => storage.getUser(id))); // Mock user count
      
      res.json({
        activeAuctions: activeAuctions.length,
        totalUsers: users.filter(u => u).length,
        totalAuctions: allAuctions.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Gamification & Rewards Routes
  app.get("/api/users/:id/rewards", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const points = await storage.getUserRewardPoints(userId);
      const transactions = await storage.getUserTransactions(userId);
      const user = await storage.getUser(userId);
      res.json({ 
        points, 
        transactions, 
        level: user?.level || 1,
        totalEarned: user?.totalEarned || 0 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user rewards" });
    }
  });

  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Notifications Routes
  app.get("/api/users/:id/notifications", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Bid deposit payment routes
  app.post("/api/payments/create-bid-deposit", async (req, res) => {
    try {
      const { auctionId, bidAmount, depositAmount } = req.body;
      const userId = 1; // TODO: Get from authenticated user
      
      // Create deposit record
      const deposit = await storage.createBidDeposit({
        userId,
        auctionId,
        amount: depositAmount.toString(),
        depositType: "bid_guarantee",
        status: "pending"
      });

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(depositAmount * 100), // Convert to halalas
        currency: "sar",
        metadata: {
          depositId: deposit.id.toString(),
          auctionId: auctionId.toString(),
          userId: userId.toString(),
          type: "bid_deposit"
        }
      });

      // Create payment transaction record
      await storage.createPaymentTransaction({
        userId,
        auctionId,
        depositId: deposit.id,
        amount: depositAmount.toString(),
        currency: "SAR",
        transactionType: "deposit",
        stripePaymentIntentId: paymentIntent.id,
        status: "pending",
        description: `Bid deposit for auction ${auctionId}`
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        depositInfo: {
          depositId: deposit.id,
          amount: depositAmount,
          auctionId
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating bid deposit: " + error.message });
    }
  });

  app.post("/api/payments/confirm-deposit", async (req, res) => {
    try {
      const { paymentIntentId, auctionId, status } = req.body;
      
      // Update deposit status
      await storage.updateBidDepositStatus(paymentIntentId, status);
      
      // Update payment transaction
      await storage.updatePaymentTransactionStatus(paymentIntentId, "completed");
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming deposit: " + error.message });
    }
  });

  // ML Recommendation Routes
  app.get("/api/users/:id/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Generate personalized recommendations
      const recommendations = await mlRecommendationEngine.generateRecommendations(
        { userId },
        limit
      );
      
      // Get full auction details for recommended auctions
      const recommendationsWithDetails = await mlRecommendationEngine.getRecommendationsForUser(userId, limit);
      
      res.json(recommendationsWithDetails);
    } catch (error: any) {
      console.error('Recommendation error:', error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.post("/api/users/:id/behavior", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { actionType, auctionId, categoryId, sessionId, metadata } = req.body;
      
      // Track user behavior for ML learning
      await mlRecommendationEngine.trackUserBehavior({
        userId,
        actionType,
        auctionId: auctionId || null,
        categoryId: categoryId || null,
        sessionId: sessionId || null,
        metadata: metadata || null
      });
      
      res.json({ success: true });
    } catch (error: any) {
      console.error('Behavior tracking error:', error);
      res.status(500).json({ message: "Failed to track behavior" });
    }
  });

  app.get("/api/users/:id/preferences", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const preferences = await mlRecommendationEngine.getUserPreferences(userId);
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post("/api/recommendations/:userId/:auctionId/viewed", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const auctionId = parseInt(req.params.auctionId);
      
      await mlRecommendationEngine.markRecommendationViewed(userId, auctionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to mark recommendation as viewed" });
    }
  });

  app.post("/api/recommendations/:userId/:auctionId/clicked", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const auctionId = parseInt(req.params.auctionId);
      
      await mlRecommendationEngine.markRecommendationClicked(userId, auctionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to mark recommendation as clicked" });
    }
  });

  // Account registration routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, nationalId, username } = req.body;
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Create new user
      const newUser = await storage.createUser({
        username,
        email,
        password: "temp_password", // TODO: Implement proper password handling
        fullName: `${firstName} ${lastName}`,
        phone,
        isVerified: true, // Auto-verify for demo
      });

      res.json({ 
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating account: " + error.message });
    }
  });

  app.post("/api/auth/register-personal-info", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, nationalId } = req.body;
      
      // Create user verification record
      const verification = await storage.createUserVerification({
        userId: 1, // TODO: Create actual user
        verificationType: "identity",
        documentType: "national_id",
        documentNumber: nationalId,
        phoneNumber: phone,
        verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
        status: "pending"
      });

      res.json({ 
        success: true,
        userId: verification.userId,
        verificationId: verification.id
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error saving personal info: " + error.message });
    }
  });

  app.post("/api/auth/verify-phone", async (req, res) => {
    try {
      const { userId, verificationCode } = req.body;
      
      // Verify the code (simplified for demo)
      const isValid = verificationCode === "123456"; // In real app, check against stored code
      
      if (isValid) {
        await storage.updateUserVerificationStatus(userId, "approved");
        res.json({ success: true });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error verifying phone: " + error.message });
    }
  });

  app.post("/api/payments/create-registration-fee", async (req, res) => {
    try {
      const { userId, amount } = req.body;
      
      // Create Stripe payment intent for registration fee
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to halalas
        currency: "sar",
        metadata: {
          userId: userId.toString(),
          type: "registration_fee"
        }
      });

      // Create payment transaction record
      await storage.createPaymentTransaction({
        userId,
        amount: amount.toString(),
        currency: "SAR",
        transactionType: "fee",
        stripePaymentIntentId: paymentIntent.id,
        status: "pending",
        description: "Account registration fee"
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating registration fee: " + error.message });
    }
  });

  // Stripe Payment Routes for Auction Winners
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, auctionId, description } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "aed", // UAE Dirham for KSA market
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          auctionId: auctionId?.toString() || '',
          description: description || '',
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Get payment status
  app.get("/api/payment/:paymentIntentId", async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.json({
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error retrieving payment: " + error.message 
      });
    }
  });

  // Confirm payment completion and update auction status
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, auctionId, userId } = req.body;
      
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment not completed" });
      }

      // Update auction status to paid
      // Note: This would require adding payment tracking to the schema
      // For now, we'll just confirm the payment was successful
      
      res.json({ 
        success: true,
        paymentStatus: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        message: "Payment confirmed successfully"
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error confirming payment: " + error.message 
      });
    }
  });

  // ML Recommendation System API Endpoints
  app.post("/api/track-behavior", async (req, res) => {
    try {
      const { userId, actionType, auctionId, categoryId, searchQuery, sessionId, deviceType, timeSpent } = req.body;
      
      const behavior = {
        userId,
        actionType,
        auctionId: auctionId || null,
        categoryId: categoryId || null,
        searchQuery: searchQuery || null,
        sessionId: sessionId || null,
        deviceType: deviceType || null,
        timeSpent: timeSpent || null,
        metadata: null
      };

      await mlRecommendationEngine.trackUserBehavior(behavior);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error tracking behavior: " + error.message });
    }
  });

  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Generate fresh recommendations
      const recommendations = await mlRecommendationEngine.generateRecommendations(
        { userId },
        limit
      );

      // Get auction details for recommended items
      const recommendationsWithDetails = await Promise.all(
        recommendations.map(async (rec) => {
          const auction = await storage.getAuction(rec.auctionId);
          return {
            ...rec,
            auction
          };
        })
      );

      res.json(recommendationsWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: "Error getting recommendations: " + error.message });
    }
  });

  app.get("/api/user-preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = await mlRecommendationEngine.getUserPreferences(userId);
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ message: "Error getting preferences: " + error.message });
    }
  });

  app.post("/api/recommendation-viewed", async (req, res) => {
    try {
      const { userId, auctionId } = req.body;
      await mlRecommendationEngine.markRecommendationViewed(userId, auctionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error marking viewed: " + error.message });
    }
  });

  app.post("/api/recommendation-clicked", async (req, res) => {
    try {
      const { userId, auctionId } = req.body;
      await mlRecommendationEngine.markRecommendationClicked(userId, auctionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error marking clicked: " + error.message });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      console.log("Contact form submitted:", { name, email, phone, subject, message });
      
      // Send notification email with contact details
      const emailSent = await notificationService.sendContactFormNotification({
        name,
        email,
        phone: phone || "غير محدد",
        subject,
        message
      });

      // Send welcome notification to user if they provided valid email
      if (emailSent && email) {
        // For demo - in production you'd check if user exists first
        try {
          await notificationService.sendNotification({
            userId: 1, // Demo user
            title: "شكراً لتواصلك معنا",
            message: `شكراً لك ${name} على تواصلك معنا. سيتم الرد عليك خلال 24 ساعة على البريد الإلكتروني أو الهاتف المقدم.`,
            type: 'system',
            config: { email: true, sms: false, whatsapp: false }
          });
        } catch (notifError) {
          console.log("Could not send auto-reply:", notifError);
        }
      }

      res.json({ 
        success: true, 
        message: "تم إرسال رسالتك بنجاح. سيتم التواصل معك قريباً.",
        contactInfo: {
          phone: "00966505930648",
          whatsapp: "00966505930648",
          email: "info@mazadksa.com",
          address: "Al Bandariyah, Saeed Tower, Khobar, Saudi Arabia"
        }
      });
    } catch (error: any) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى." });
    }
  });

  // Get company contact information
  app.get("/api/company-info", async (req, res) => {
    try {
      res.json({
        name: "مزاد السعودية",
        nameEn: "Mazad KSA",
        phone: "00966505930648",
        whatsapp: "00966505930648",
        email: "info@mazadksa.com",
        supportEmail: "support@mazadksa.com",
        address: "Al Bandariyah, Saeed Tower",
        city: "Khobar",
        country: "Saudi Arabia",
        website: "https://mazadksa.com",
        workingHours: {
          ar: "الأحد - الخميس: 9:00 ص - 6:00 م",
          en: "Sunday - Thursday: 9:00 AM - 6:00 PM"
        },
        socialMedia: {
          twitter: "@MazadKSA",
          instagram: "@mazadksa",
          linkedin: "mazad-ksa"
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching company info: " + error.message });
    }
  });

  // Send welcome email when user registers
  app.post("/api/send-welcome-email", async (req, res) => {
    try {
      const { userId } = req.body;
      
      const success = await notificationService.sendWelcomeNotification(userId);
      
      if (success) {
        res.json({ success: true, message: "Welcome email sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send welcome email" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error sending welcome email: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
