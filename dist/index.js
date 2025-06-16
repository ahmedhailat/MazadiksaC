var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";
import Stripe from "stripe";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievements: () => achievements,
  auctionRecommendations: () => auctionRecommendations,
  auctions: () => auctions,
  bidDeposits: () => bidDeposits,
  bids: () => bids,
  categories: () => categories,
  companyInfo: () => companyInfo,
  insertAchievementSchema: () => insertAchievementSchema,
  insertAuctionRecommendationSchema: () => insertAuctionRecommendationSchema,
  insertAuctionSchema: () => insertAuctionSchema,
  insertBidDepositSchema: () => insertBidDepositSchema,
  insertBidSchema: () => insertBidSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertMlModelSchema: () => insertMlModelSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertPaymentTransactionSchema: () => insertPaymentTransactionSchema,
  insertRewardTransactionSchema: () => insertRewardTransactionSchema,
  insertUserAchievementSchema: () => insertUserAchievementSchema,
  insertUserBehaviorSchema: () => insertUserBehaviorSchema,
  insertUserPreferencesSchema: () => insertUserPreferencesSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserVerificationSchema: () => insertUserVerificationSchema,
  mlModels: () => mlModels,
  notifications: () => notifications,
  paymentTransactions: () => paymentTransactions,
  rewardTransactions: () => rewardTransactions,
  userAchievements: () => userAchievements,
  userBehavior: () => userBehavior,
  userPreferences: () => userPreferences,
  userVerifications: () => userVerifications,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  whatsappNumber: text("whatsapp_number"),
  address: text("address"),
  city: text("city"),
  country: text("country").default("Saudi Arabia"),
  isVerified: boolean("is_verified").default(false),
  rewardPoints: integer("reward_points").default(0),
  totalEarned: integer("total_earned").default(0),
  level: integer("level").default(1),
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(true),
  whatsappNotifications: boolean("whatsapp_notifications").default(true),
  preferredLanguage: text("preferred_language").default("ar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var companyInfo = pgTable("company_info", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull().default("\u0645\u0632\u0627\u062F \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629"),
  email: text("email").notNull().default("info@mazadksa.com"),
  phone: text("phone").notNull().default("00966505930648"),
  whatsapp: text("whatsapp").notNull().default("00966505930648"),
  address: text("address").notNull().default("Al Bandariyah, Saeed Tower"),
  city: text("city").notNull().default("Khobar"),
  country: text("country").notNull().default("Saudi Arabia"),
  website: text("website").default("https://mazadksa.com"),
  supportEmail: text("support_email").default("support@mazadksa.com"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  isActive: boolean("is_active").default(true)
});
var auctions = pgTable("auctions", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  categoryId: integer("category_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  startingPrice: decimal("starting_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  bidIncrement: decimal("bid_increment", { precision: 10, scale: 2 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  images: text("images").array().notNull(),
  model3dUrl: text("model_3d_url"),
  // URL to 3D model file (.glb, .gltf)
  hasArSupport: boolean("has_ar_support").default(false),
  status: text("status").notNull().default("active"),
  // active, ended, cancelled
  featured: boolean("featured").default(false),
  totalBids: integer("total_bids").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  auctionId: integer("auction_id").notNull(),
  bidderId: integer("bidder_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  isWinning: boolean("is_winning").default(false),
  placedAt: timestamp("placed_at").defaultNow().notNull()
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  pointsRequired: integer("points_required").notNull(),
  category: text("category").notNull(),
  // 'bidding', 'winning', 'participation', 'streak'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull()
});
var rewardTransactions = pgTable("reward_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  points: integer("points").notNull(),
  type: text("type").notNull(),
  // 'earned', 'spent', 'bonus'
  reason: text("reason").notNull(),
  relatedAuctionId: integer("related_auction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  // 'bid_placed', 'bid_outbid', 'auction_won', 'auction_ending'
  title: text("title").notNull(),
  message: text("message").notNull(),
  auctionId: integer("auction_id"),
  isRead: boolean("is_read").default(false),
  emailSent: boolean("email_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var bidDeposits = pgTable("bid_deposits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  auctionId: integer("auction_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull().default("pending"),
  // pending, paid, refunded, forfeited
  depositType: text("deposit_type").notNull().default("bid_guarantee"),
  // bid_guarantee, registration_fee
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var userVerifications = pgTable("user_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  verificationType: text("verification_type").notNull(),
  // identity, payment, phone
  documentType: text("document_type"),
  // national_id, passport, driving_license
  documentNumber: text("document_number"),
  documentImages: text("document_images").array(),
  phoneNumber: text("phone_number"),
  verificationCode: text("verification_code"),
  status: text("status").notNull().default("pending"),
  // pending, approved, rejected
  verifiedAt: timestamp("verified_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  auctionId: integer("auction_id"),
  depositId: integer("deposit_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("SAR"),
  transactionType: text("transaction_type").notNull(),
  // deposit, refund, fee, payment
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeChargeId: text("stripe_charge_id"),
  status: text("status").notNull().default("pending"),
  // pending, completed, failed, refunded
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var userBehavior = pgTable("user_behavior", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  actionType: text("action_type").notNull(),
  // view, bid, watch, click, search
  auctionId: integer("auction_id"),
  categoryId: integer("category_id"),
  searchQuery: text("search_query"),
  sessionId: text("session_id"),
  deviceType: text("device_type"),
  // mobile, desktop, tablet
  timeSpent: integer("time_spent"),
  // seconds
  metadata: text("metadata"),
  // JSON string for additional context data
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  preferredCategories: text("preferred_categories").default("[]"),
  // JSON string array of category IDs
  priceRangeMin: decimal("price_range_min", { precision: 10, scale: 2 }),
  priceRangeMax: decimal("price_range_max", { precision: 10, scale: 2 }),
  biddingStyle: text("bidding_style"),
  // aggressive, conservative, strategic
  preferredTime: text("preferred_time"),
  // morning, afternoon, evening, night
  riskTolerance: text("risk_tolerance"),
  // low, medium, high
  interestScore: text("interest_score").default("{}"),
  // JSON string - category_id: score mapping
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var auctionRecommendations = pgTable("auction_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  auctionId: integer("auction_id").notNull(),
  score: decimal("score", { precision: 5, scale: 4 }).notNull(),
  // 0.0000 to 1.0000
  reason: text("reason"),
  // why this auction was recommended
  recommendationType: text("recommendation_type").notNull(),
  // trending, similar, personalized, category
  isViewed: boolean("is_viewed").default(false),
  isClicked: boolean("is_clicked").default(false),
  position: integer("position"),
  // position in recommendation list
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var mlModels = pgTable("ml_models", {
  id: serial("id").primaryKey(),
  modelName: text("model_name").notNull().unique(),
  modelType: text("model_type").notNull(),
  // collaborative_filtering, content_based, hybrid
  version: text("version").notNull(),
  parameters: text("parameters"),
  // JSON string for model hyperparameters
  metrics: text("metrics"),
  // JSON string for accuracy, precision, recall, etc.
  isActive: boolean("is_active").default(false),
  trainingData: text("training_data"),
  // JSON string for metadata about training data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});
var insertAuctionSchema = createInsertSchema(auctions).omit({
  id: true,
  currentPrice: true,
  totalBids: true,
  createdAt: true
});
var insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  isWinning: true,
  placedAt: true
});
var insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true
});
var insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true
});
var insertRewardTransactionSchema = createInsertSchema(rewardTransactions).omit({
  id: true,
  createdAt: true
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});
var insertBidDepositSchema = createInsertSchema(bidDeposits).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserVerificationSchema = createInsertSchema(userVerifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserBehaviorSchema = createInsertSchema(userBehavior).omit({
  id: true,
  createdAt: true
});
var insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAuctionRecommendationSchema = createInsertSchema(auctionRecommendations).omit({
  id: true,
  createdAt: true
});
var insertMlModelSchema = createInsertSchema(mlModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  console.error("\u274C DATABASE_URL environment variable is not set!");
  console.error("Please set up your database connection:");
  console.error("1. Create a Neon database at https://neon.tech");
  console.error("2. Copy the connection string to your .env file");
  console.error("3. Run 'npm run db:push' to create tables");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 15e3
});
var db = drizzle({ client: pool, schema: schema_exports });
pool.on("error", (err) => {
  console.error("\u274C Database pool error:", err);
});
pool.connect().then((client) => {
  console.log("\u2705 Database connected successfully");
  client.release();
}).catch((err) => {
  console.error("\u274C Failed to connect to database:", err.message);
  console.error("Please check your DATABASE_URL in .env file");
});
process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

// server/storage.ts
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
var DatabaseStorage = class {
  constructor() {
    this.seedData();
  }
  async seedData() {
    console.log("Seeding data...");
    try {
      await db.execute(sql`SELECT 1`);
      const existingCategories = await db.select().from(categories).limit(1);
      if (existingCategories.length > 0) {
        console.log("Data already seeded, skipping...");
        return;
      }
      const categoriesData = [
        { nameAr: "\u0627\u0644\u0639\u0642\u0627\u0631", nameEn: "Real Estate", slug: "real-estate", isActive: true },
        { nameAr: "\u0628\u064A\u0639 \u0645\u0628\u0627\u0634\u0631", nameEn: "Direct Sale", slug: "direct-sale", isActive: true },
        { nameAr: "\u0645\u0632\u0627\u062F \u0645\u062A\u0646\u0648\u0639", nameEn: "Diverse Auction", slug: "diverse-auction", isActive: true },
        { nameAr: "\u0645\u0632\u0627\u062F \u0627\u0644\u0645\u0639\u062F\u0627\u062A", nameEn: "Equipment Auction", slug: "equipment-auction", isActive: true },
        { nameAr: "\u0625\u064A\u062C\u0627\u0631", nameEn: "Rental", slug: "rental", isActive: true },
        { nameAr: "\u0645\u0632\u0627\u062F \u0627\u0644\u0644\u0648\u062D\u0627\u062A \u0648\u0627\u0644\u0623\u0631\u0642\u0627\u0645", nameEn: "Plates & Numbers Auction", slug: "plates-numbers-auction", isActive: true }
      ];
      await db.insert(categories).values(categoriesData);
      const userData = [
        { username: "ahmed_m", email: "ahmed@example.com", password: "password", fullName: "\u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F", phone: "+966501234567", isVerified: true, rewardPoints: 1250, level: 2 },
        { username: "fatima_s", email: "fatima@example.com", password: "password", fullName: "\u0641\u0627\u0637\u0645\u0629 \u0635\u0627\u0644\u062D", phone: "+966507654321", isVerified: true, rewardPoints: 850, level: 1 },
        { username: "mohammed_a", email: "mohammed@example.com", password: "password", fullName: "\u0645\u062D\u0645\u062F \u0639\u0644\u064A", phone: "+966501122334", isVerified: true, rewardPoints: 2100, level: 3 }
      ];
      await db.insert(users).values(userData);
      const now = /* @__PURE__ */ new Date();
      const auctionsData = [
        {
          titleAr: "\u0633\u0627\u0639\u0629 \u0631\u0648\u0644\u0643\u0633 \u0623\u0635\u0644\u064A\u0629",
          titleEn: "Authentic Rolex Watch",
          descriptionAr: "\u0633\u0627\u0639\u0629 \u0631\u0648\u0644\u0643\u0633 \u062F\u0627\u064A\u062A\u0648\u0646\u0627 \u0623\u0635\u0644\u064A\u0629 \u0628\u062D\u0627\u0644\u0629 \u0645\u0645\u062A\u0627\u0632\u0629 \u0645\u0639 \u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0623\u0635\u0627\u0644\u0629",
          descriptionEn: "Authentic Rolex Daytona in excellent condition with certificate of authenticity",
          categoryId: 3,
          sellerId: 1,
          startingPrice: "15000.00",
          currentPrice: "15500.00",
          bidIncrement: "250.00",
          startTime: new Date(now.getTime() - 24 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 2 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          model3dUrl: "https://modelviewer.dev/shared-assets/models/reflective-sphere.glb",
          hasArSupport: true,
          status: "active",
          featured: true,
          totalBids: 23
        },
        {
          titleAr: "\u0633\u064A\u0627\u0631\u0629 \u0641\u064A\u0631\u0627\u0631\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A\u0629",
          titleEn: "Classic Ferrari Car",
          descriptionAr: "\u0641\u064A\u0631\u0627\u0631\u064A \u0662\u0665\u0660 \u062C\u064A \u062A\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A\u0629 \u0646\u0627\u062F\u0631\u0629 \u0628\u062D\u0627\u0644\u0629 \u0645\u0645\u062A\u0627\u0632\u0629",
          descriptionEn: "Rare classic Ferrari 250 GT in excellent condition",
          categoryId: 1,
          sellerId: 2,
          startingPrice: "250000.00",
          currentPrice: "285000.00",
          bidIncrement: "5000.00",
          startTime: new Date(now.getTime() - 12 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          model3dUrl: "https://modelviewer.dev/shared-assets/models/Horse.glb",
          hasArSupport: true,
          status: "active",
          featured: true,
          totalBids: 89
        },
        {
          titleAr: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0648\u0646\u0627\u0644\u064A\u0632\u0627 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          titleEn: "Arabic Mona Lisa Painting",
          descriptionAr: "\u0644\u0648\u062D\u0629 \u0646\u0627\u062F\u0631\u0629 \u0644\u0644\u0641\u0646\u0627\u0646 \u0645\u062D\u0645\u062F \u0631\u0627\u0633\u0645 \u0645\u0646 \u0627\u0644\u0642\u0631\u0646 \u0627\u0644\u0639\u0634\u0631\u064A\u0646",
          descriptionEn: "Rare painting by Mohammed Racim from the 20th century",
          categoryId: 7,
          sellerId: 3,
          startingPrice: "50000.00",
          currentPrice: "62000.00",
          bidIncrement: "2000.00",
          startTime: new Date(now.getTime() - 6 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: true,
          totalBids: 12
        },
        {
          titleAr: "\u0622\u064A\u0641\u0648\u0646 \u0661\u0664 \u0628\u0631\u0648 \u0645\u0627\u0643\u0633",
          titleEn: "iPhone 14 Pro Max",
          descriptionAr: "\u0622\u064A\u0641\u0648\u0646 \u062C\u062F\u064A\u062F \u0628\u0627\u0644\u0643\u0631\u062A\u0648\u0646 \u0627\u0644\u0623\u0635\u0644\u064A\u060C \u0644\u0645 \u064A\u0633\u062A\u062E\u062F\u0645",
          descriptionEn: "Brand new iPhone in original packaging, unused",
          categoryId: 2,
          sellerId: 1,
          startingPrice: "3000.00",
          currentPrice: "3250.00",
          bidIncrement: "100.00",
          startTime: new Date(now.getTime() - 3 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 45
        },
        {
          titleAr: "\u0634\u0642\u0629 \u0641\u0627\u062E\u0631\u0629 \u0641\u064A \u0627\u0644\u0631\u064A\u0627\u0636",
          titleEn: "Luxury Apartment in Riyadh",
          descriptionAr: "\u0634\u0642\u0629 \u0664 \u063A\u0631\u0641 \u0641\u064A \u062D\u064A \u0627\u0644\u0639\u0644\u064A\u0627 \u0645\u0639 \u0625\u0637\u0644\u0627\u0644\u0629 \u0631\u0627\u0626\u0639\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u062F\u064A\u0646\u0629",
          descriptionEn: "4-bedroom apartment in Al-Olaya with stunning city view",
          categoryId: 5,
          sellerId: 2,
          startingPrice: "1200000.00",
          currentPrice: "1350000.00",
          bidIncrement: "25000.00",
          startTime: new Date(now.getTime() - 1 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"],
          status: "active",
          featured: true,
          totalBids: 67
        },
        {
          titleAr: "\u062D\u0641\u0627\u0631 \u0643\u0627\u062A\u0631\u0628\u064A\u0644\u0631 \u0663\u0662\u0660",
          titleEn: "Caterpillar 320 Excavator",
          descriptionAr: "\u062D\u0641\u0627\u0631 \u0643\u0627\u062A\u0631\u0628\u064A\u0644\u0631 \u0645\u0648\u062F\u064A\u0644 \u0662\u0660\u0662\u0660 \u0628\u062D\u0627\u0644\u0629 \u0645\u0645\u062A\u0627\u0632\u0629",
          descriptionEn: "Caterpillar excavator model 2020 in excellent condition",
          categoryId: 6,
          sellerId: 3,
          startingPrice: "450000.00",
          currentPrice: "485000.00",
          bidIncrement: "10000.00",
          startTime: new Date(now.getTime() - 8 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"],
          status: "active",
          featured: true,
          totalBids: 34
        },
        {
          titleAr: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0639\u0645\u0644\u0627\u062A \u0623\u062B\u0631\u064A\u0629",
          titleEn: "Antique Coin Collection",
          descriptionAr: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0646\u0627\u062F\u0631\u0629 \u0645\u0646 \u0627\u0644\u0639\u0645\u0644\u0627\u062A \u0627\u0644\u0639\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
          descriptionEn: "Rare collection of Ottoman and Islamic coins",
          categoryId: 4,
          sellerId: 1,
          startingPrice: "8000.00",
          currentPrice: "9500.00",
          bidIncrement: "300.00",
          startTime: new Date(now.getTime() - 5 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 28
        },
        {
          titleAr: "\u0645\u0648\u0644\u062F \u0643\u0647\u0631\u0628\u0627\u0621 \u062F\u064A\u0632\u0644 \u0661\u0660\u0660 \u0643\u064A\u0644\u0648 \u0648\u0627\u062A",
          titleEn: "100KW Diesel Generator",
          descriptionAr: "\u0645\u0648\u0644\u062F \u0643\u0647\u0631\u0628\u0627\u0621 \u0635\u0646\u0627\u0639\u064A \u062C\u062F\u064A\u062F \u0644\u0644\u0628\u064A\u0639 \u0627\u0644\u0645\u0628\u0627\u0634\u0631",
          descriptionEn: "New industrial generator for direct sale",
          categoryId: 8,
          sellerId: 2,
          startingPrice: "85000.00",
          currentPrice: "85000.00",
          bidIncrement: "0.00",
          startTime: new Date(now.getTime() - 2 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 0
        },
        {
          titleAr: "\u062D\u0641\u0627\u0631 \u0635\u063A\u064A\u0631 \u0644\u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0634\u0647\u0631\u064A",
          titleEn: "Small Excavator for Monthly Rental",
          descriptionAr: "\u062D\u0641\u0627\u0631 \u0635\u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u0644\u0644\u062A\u0623\u062C\u064A\u0631 \u0627\u0644\u0634\u0647\u0631\u064A \u0645\u0639 \u0639\u0627\u0645\u0644",
          descriptionEn: "Small excavator available for monthly rental with operator",
          categoryId: 9,
          sellerId: 3,
          startingPrice: "8000.00",
          currentPrice: "8000.00",
          bidIncrement: "0.00",
          startTime: new Date(now.getTime() - 1 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 0
        },
        {
          titleAr: "\u0641\u064A\u0644\u0627 \u0633\u0643\u0646\u064A\u0629 \u0641\u064A \u062D\u064A \u0627\u0644\u0645\u0644\u0642\u0627",
          titleEn: "Residential Villa in Al-Malqa",
          descriptionAr: "\u0641\u064A\u0644\u0627 \u062F\u0648\u0631\u064A\u0646 \u0645\u0633\u0627\u062D\u0629 \u0665\u0660\u0660 \u0645\u062A\u0631 \u0645\u0631\u0628\u0639 \u0641\u064A \u062D\u064A \u0627\u0644\u0645\u0644\u0642\u0627 \u0627\u0644\u0631\u0627\u0642\u064A",
          descriptionEn: "Two-story villa 500 sqm in upscale Al-Malqa neighborhood",
          categoryId: 10,
          sellerId: 1,
          startingPrice: "2500000.00",
          currentPrice: "2750000.00",
          bidIncrement: "50000.00",
          startTime: new Date(now.getTime() - 3 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: true,
          totalBids: 15
        },
        {
          titleAr: "\u0623\u0631\u0636 \u0641\u064A \u062D\u064A \u0627\u0644\u0639\u0642\u064A\u0642",
          titleEn: "Land in Al-Aqiq District",
          descriptionAr: "\u0623\u0631\u0636 \u0633\u0643\u0646\u064A\u0629 \u0641\u064A \u062D\u064A \u0627\u0644\u0639\u0642\u064A\u0642 \u0628\u0645\u0648\u0642\u0639 \u0645\u0645\u062A\u0627\u0632",
          descriptionEn: "Residential land in Al-Aqiq district with excellent location",
          categoryId: 1,
          sellerId: 2,
          startingPrice: "4500.00",
          currentPrice: "4500.00",
          bidIncrement: "100.00",
          startTime: new Date(now.getTime() - 12 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 5 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: true,
          totalBids: 0
        },
        {
          titleAr: "\u0645\u0639\u062F\u0627\u062A \u0645\u0637\u0639\u0645 \u0643\u0627\u0645\u0644\u0629",
          titleEn: "Complete Restaurant Equipment",
          descriptionAr: "\u0645\u0639\u062F\u0627\u062A \u0645\u0637\u0639\u0645 \u0643\u0627\u0645\u0644\u0629 \u062A\u0634\u0645\u0644 \u0623\u0641\u0631\u0627\u0646 \u0648\u0645\u0639\u062F\u0627\u062A \u0637\u0628\u062E \u0648\u062B\u0644\u0627\u062C\u0627\u062A",
          descriptionEn: "Complete restaurant equipment including ovens, cooking equipment and refrigerators",
          categoryId: 4,
          sellerId: 3,
          startingPrice: "25000.00",
          currentPrice: "28000.00",
          bidIncrement: "500.00",
          startTime: new Date(now.getTime() - 6 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 18 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 12
        },
        {
          titleAr: "\u0634\u0642\u0629 \u0644\u0644\u0625\u064A\u062C\u0627\u0631 - \u0627\u0644\u062E\u0628\u0631",
          titleEn: "Apartment for Rent - Khobar",
          descriptionAr: "\u0634\u0642\u0629 \u0663 \u063A\u0631\u0641 \u0646\u0648\u0645 \u0641\u064A \u0627\u0644\u062E\u0628\u0631 \u0644\u0644\u0625\u064A\u062C\u0627\u0631 \u0627\u0644\u0634\u0647\u0631\u064A",
          descriptionEn: "3-bedroom apartment in Khobar for monthly rent",
          categoryId: 5,
          sellerId: 1,
          startingPrice: "3500.00",
          currentPrice: "3800.00",
          bidIncrement: "100.00",
          startTime: new Date(now.getTime() - 3 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 24 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 8
        },
        {
          titleAr: "\u0644\u0648\u062D\u0629 \u0645\u0645\u064A\u0632\u0629 \u0623 \u0628 \u062C \u0661\u0662\u0663",
          titleEn: "Premium Plate ABC 123",
          descriptionAr: "\u0644\u0648\u062D\u0629 \u0633\u064A\u0627\u0631\u0629 \u0645\u0645\u064A\u0632\u0629 \u0628\u0623\u0631\u0642\u0627\u0645 \u0648\u062D\u0631\u0648\u0641 \u0645\u0631\u063A\u0648\u0628\u0629",
          descriptionEn: "Premium car plate with desirable numbers and letters",
          categoryId: 6,
          sellerId: 2,
          startingPrice: "15000.00",
          currentPrice: "18500.00",
          bidIncrement: "500.00",
          startTime: new Date(now.getTime() - 1 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 4 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: true,
          totalBids: 15
        },
        {
          titleAr: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0623\u062C\u0647\u0632\u0629 \u0645\u062A\u0646\u0648\u0639\u0629",
          titleEn: "Diverse Electronics Collection",
          descriptionAr: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0645\u062A\u0646\u0648\u0639\u0629 \u0645\u0646 \u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0648\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629",
          descriptionEn: "Diverse collection of electronic and electrical devices",
          categoryId: 3,
          sellerId: 3,
          startingPrice: "2500.00",
          currentPrice: "3200.00",
          bidIncrement: "200.00",
          startTime: new Date(now.getTime() - 8 * 60 * 60 * 1e3),
          endTime: new Date(now.getTime() + 12 * 60 * 60 * 1e3),
          images: ["https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 7
        }
      ];
      await db.insert(auctions).values(auctionsData);
      const bidsData = [
        { auctionId: 1, bidderId: 1, amount: "15500.00", isWinning: true },
        { auctionId: 1, bidderId: 2, amount: "15250.00", isWinning: false },
        { auctionId: 2, bidderId: 3, amount: "285000.00", isWinning: true },
        { auctionId: 5, bidderId: 1, amount: "42500.00", isWinning: true }
      ];
      await db.insert(bids).values(bidsData);
      const achievementsData = [
        {
          name: "First Bid",
          description: "Place your first bid in any auction",
          icon: "\u{1F3AF}",
          pointsRequired: 1,
          category: "bidding"
        },
        {
          name: "Active Bidder",
          description: "Place 10 bids across different auctions",
          icon: "\u{1F525}",
          pointsRequired: 10,
          category: "bidding"
        },
        {
          name: "Auction Master",
          description: "Place 100 bids total",
          icon: "\u{1F451}",
          pointsRequired: 100,
          category: "bidding"
        },
        {
          name: "Points Collector",
          description: "Earn 100 reward points",
          icon: "\u{1F48E}",
          pointsRequired: 100,
          category: "points"
        },
        {
          name: "Elite Member",
          description: "Reach level 5",
          icon: "\u2B50",
          pointsRequired: 5,
          category: "level"
        },
        {
          name: "VIP Status",
          description: "Reach level 10",
          icon: "\u{1F3C6}",
          pointsRequired: 10,
          category: "level"
        }
      ];
      await db.insert(achievements).values(achievementsData);
      await db.update(users).set({
        rewardPoints: 50,
        totalEarned: 50,
        level: 2,
        emailNotifications: true
      });
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getCategories() {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }
  async getCategory(id) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || void 0;
  }
  async createCategory(insertCategory) {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }
  async getAuctions(filters) {
    const conditions = [];
    if (filters?.categoryId) {
      conditions.push(eq(auctions.categoryId, filters.categoryId));
    }
    if (filters?.status) {
      conditions.push(eq(auctions.status, filters.status));
    }
    if (filters?.featured !== void 0) {
      conditions.push(eq(auctions.featured, filters.featured));
    }
    const query = conditions.length > 0 ? db.select().from(auctions).where(and(...conditions)) : db.select().from(auctions);
    const results = await query;
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getAuction(id) {
    const [auction] = await db.select().from(auctions).where(eq(auctions.id, id));
    return auction || void 0;
  }
  async createAuction(insertAuction) {
    const [auction] = await db.insert(auctions).values({
      ...insertAuction,
      currentPrice: insertAuction.startingPrice,
      totalBids: 0
    }).returning();
    return auction;
  }
  async updateAuctionPrice(id, newPrice, totalBids) {
    await db.update(auctions).set({ currentPrice: newPrice, totalBids }).where(eq(auctions.id, id));
  }
  async getBidsForAuction(auctionId) {
    const results = await db.select().from(bids).where(eq(bids.auctionId, auctionId)).orderBy(bids.placedAt);
    return results.sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
  }
  async getHighestBid(auctionId) {
    const bidList = await this.getBidsForAuction(auctionId);
    return bidList[0];
  }
  async createBid(insertBid) {
    const [bid] = await db.insert(bids).values({
      ...insertBid,
      isWinning: false
    }).returning();
    const auction = await this.getAuction(insertBid.auctionId);
    if (auction) {
      await this.updateAuctionPrice(insertBid.auctionId, insertBid.amount, (auction.totalBids || 0) + 1);
      const previousHighestBid = await this.getHighestBid(insertBid.auctionId);
      await this.addRewardPoints(insertBid.bidderId, 10, "Placed a bid", insertBid.auctionId);
      await this.checkAndUnlockAchievements(insertBid.bidderId);
      await this.createNotification({
        userId: insertBid.bidderId,
        type: "bid_placed",
        title: "Bid Placed Successfully",
        message: `You have successfully placed a bid of ${insertBid.amount} SAR on ${auction.titleEn}`,
        auctionId: insertBid.auctionId
      });
      if (previousHighestBid && previousHighestBid.bidderId !== insertBid.bidderId) {
        await this.createNotification({
          userId: previousHighestBid.bidderId,
          type: "bid_outbid",
          title: "You have been outbid",
          message: `Your bid on ${auction.titleEn} has been outbid. New highest bid: ${insertBid.amount} SAR`,
          auctionId: insertBid.auctionId
        });
      }
    }
    await this.updateWinningBid(insertBid.auctionId, bid.id);
    return bid;
  }
  async updateWinningBid(auctionId, newWinningBidId) {
    await db.update(bids).set({ isWinning: false }).where(eq(bids.auctionId, auctionId));
    await db.update(bids).set({ isWinning: true }).where(eq(bids.id, newWinningBidId));
  }
  // Rewards & Gamification Methods
  async getUserRewardPoints(userId) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user?.rewardPoints || 0;
  }
  async addRewardPoints(userId, points, reason, auctionId) {
    const currentUser = await this.getUser(userId);
    if (currentUser) {
      const newPoints = (currentUser.rewardPoints || 0) + points;
      await db.update(users).set({
        rewardPoints: newPoints,
        totalEarned: (currentUser.totalEarned || 0) + (points > 0 ? points : 0)
      }).where(eq(users.id, userId));
      await this.createRewardTransaction({
        userId,
        points,
        type: points > 0 ? "earned" : "spent",
        reason,
        relatedAuctionId: auctionId
      });
      await this.updateUserLevel(userId);
    }
  }
  async updateUserLevel(userId) {
    const user = await this.getUser(userId);
    if (user) {
      const totalEarned = user.totalEarned || 0;
      let newLevel = 1;
      if (totalEarned >= 1e4) newLevel = 10;
      else if (totalEarned >= 5e3) newLevel = 9;
      else if (totalEarned >= 2500) newLevel = 8;
      else if (totalEarned >= 1e3) newLevel = 7;
      else if (totalEarned >= 500) newLevel = 6;
      else if (totalEarned >= 250) newLevel = 5;
      else if (totalEarned >= 100) newLevel = 4;
      else if (totalEarned >= 50) newLevel = 3;
      else if (totalEarned >= 20) newLevel = 2;
      if (newLevel > (user.level || 1)) {
        await db.update(users).set({ level: newLevel }).where(eq(users.id, userId));
      }
    }
  }
  async createRewardTransaction(transaction) {
    const [created] = await db.insert(rewardTransactions).values(transaction).returning();
    return created;
  }
  async getUserTransactions(userId) {
    return await db.select().from(rewardTransactions).where(eq(rewardTransactions.userId, userId)).orderBy(rewardTransactions.createdAt);
  }
  // Achievement Methods
  async getAchievements() {
    return await db.select().from(achievements).where(eq(achievements.isActive, true));
  }
  async getUserAchievements(userId) {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }
  async checkAndUnlockAchievements(userId) {
    const user = await this.getUser(userId);
    const userAchs = await this.getUserAchievements(userId);
    const allAchs = await this.getAchievements();
    const unlockedAchievements = [];
    if (!user) return unlockedAchievements;
    for (const achievement of allAchs) {
      const hasAchievement = userAchs.some((ua) => ua.achievementId === achievement.id);
      if (hasAchievement) continue;
      let shouldUnlock = false;
      switch (achievement.category) {
        case "bidding":
          const totalBids = await db.select().from(bids).where(eq(bids.bidderId, userId));
          shouldUnlock = totalBids.length >= achievement.pointsRequired;
          break;
        case "points":
          shouldUnlock = (user.totalEarned || 0) >= achievement.pointsRequired;
          break;
        case "level":
          shouldUnlock = (user.level || 1) >= achievement.pointsRequired;
          break;
      }
      if (shouldUnlock) {
        const newAchievement = await this.createUserAchievement({
          userId,
          achievementId: achievement.id
        });
        unlockedAchievements.push(newAchievement);
      }
    }
    return unlockedAchievements;
  }
  async createUserAchievement(userAchievement) {
    const [created] = await db.insert(userAchievements).values(userAchievement).returning();
    return created;
  }
  // Notification Methods
  async createNotification(notification) {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }
  async getUserNotifications(userId) {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(notifications.createdAt);
  }
  async markNotificationAsRead(notificationId) {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
  }
  async markNotificationEmailSent(notificationId) {
    await db.update(notifications).set({ emailSent: true }).where(eq(notifications.id, notificationId));
  }
  // Bid Deposits & Payment Transactions
  async createBidDeposit(insertBidDeposit) {
    const [deposit] = await db.insert(bidDeposits).values(insertBidDeposit).returning();
    return deposit;
  }
  async updateBidDepositStatus(paymentIntentId, status) {
    const [deposit] = await db.select().from(bidDeposits).where(eq(bidDeposits.stripePaymentIntentId, paymentIntentId));
    if (deposit) {
      await db.update(bidDeposits).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(bidDeposits.id, deposit.id));
    }
  }
  async createPaymentTransaction(insertPaymentTransaction) {
    const [transaction] = await db.insert(paymentTransactions).values(insertPaymentTransaction).returning();
    return transaction;
  }
  async updatePaymentTransactionStatus(paymentIntentId, status) {
    await db.update(paymentTransactions).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(paymentTransactions.stripePaymentIntentId, paymentIntentId));
  }
  // User Verification
  async createUserVerification(insertUserVerification) {
    const [verification] = await db.insert(userVerifications).values(insertUserVerification).returning();
    return verification;
  }
  async updateUserVerificationStatus(userId, status) {
    await db.update(userVerifications).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userVerifications.userId, userId));
  }
  // ML Recommendation System Methods
  async trackUserBehavior(insertBehavior) {
    const [behavior] = await db.insert(userBehavior).values(insertBehavior).returning();
    return behavior;
  }
  async getUserBehavior(userId, actionType) {
    const conditions = [eq(userBehavior.userId, userId)];
    if (actionType) {
      conditions.push(eq(userBehavior.actionType, actionType));
    }
    return await db.select().from(userBehavior).where(and(...conditions)).orderBy(userBehavior.createdAt);
  }
  async getUserPreferences(userId) {
    const [preferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences || void 0;
  }
  async createUserPreferences(insertPreferences) {
    const [preferences] = await db.insert(userPreferences).values(insertPreferences).returning();
    return preferences;
  }
  async updateUserPreferences(userId, updates) {
    await db.update(userPreferences).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userPreferences.userId, userId));
  }
  async getRecommendationsForUser(userId, limit = 10) {
    return await db.select().from(auctionRecommendations).where(eq(auctionRecommendations.userId, userId)).orderBy(auctionRecommendations.score).limit(limit);
  }
  async createRecommendation(insertRecommendation) {
    const [recommendation] = await db.insert(auctionRecommendations).values(insertRecommendation).returning();
    return recommendation;
  }
  async markRecommendationViewed(userId, auctionId) {
    await db.update(auctionRecommendations).set({ isViewed: true }).where(
      and(
        eq(auctionRecommendations.userId, userId),
        eq(auctionRecommendations.auctionId, auctionId)
      )
    );
  }
  async markRecommendationClicked(userId, auctionId) {
    await db.update(auctionRecommendations).set({ isClicked: true }).where(
      and(
        eq(auctionRecommendations.userId, userId),
        eq(auctionRecommendations.auctionId, auctionId)
      )
    );
  }
};
var storage = new DatabaseStorage();

// server/ml-recommendation-engine.ts
import { eq as eq2, and as and2, desc, sql as sql2, gte, inArray } from "drizzle-orm";
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
var MLRecommendationEngine = class {
  // AI-powered semantic analysis for auction descriptions
  async analyzeAuctionSemantics(auctionTitle, description) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert auction analyst. Analyze auction titles and descriptions to extract semantic insights for recommendation systems. Respond with JSON only."
          },
          {
            role: "user",
            content: `Analyze this auction:
Title: ${auctionTitle}
Description: ${description}

Return JSON with:
- keywords: array of 5-10 relevant keywords
- sentiment: number from 0-1 (0=negative, 1=positive)
- category_confidence: number from 0-1 indicating how well the item fits its category
- appeal_score: number from 0-1 indicating general market appeal`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300
      });
      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("OpenAI semantic analysis error:", error);
      return {
        keywords: [],
        sentiment: 0.5,
        category_confidence: 0.5,
        appeal_score: 0.5
      };
    }
  }
  // Generate AI-powered personalized reasons for recommendations
  async generatePersonalizedReason(userPreferences2, auction) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert auction recommendation system. Generate brief, personalized reasons why a user might be interested in an auction based on their preferences. Keep responses under 50 words and engaging."
          },
          {
            role: "user",
            content: `User preferences:
- Preferred categories: ${userPreferences2.preferredCategories}
- Bidding style: ${userPreferences2.biddingStyle}
- Interest scores: ${userPreferences2.interestScore}

Auction:
- Title: ${auction.titleEn}
- Category: ${auction.categoryId}
- Current price: ${auction.currentPrice}

Generate a personalized reason why this user would be interested in this auction.`
          }
        ],
        max_tokens: 60
      });
      return response.choices[0].message.content || "Recommended based on your activity";
    } catch (error) {
      console.error("OpenAI personalization error:", error);
      return "Recommended based on your preferences";
    }
  }
  // Track user behavior for ML learning
  async trackUserBehavior(behavior) {
    await db.insert(userBehavior).values({
      ...behavior,
      metadata: behavior.metadata ? JSON.stringify(behavior.metadata) : null
    });
    await this.updateUserPreferences(behavior.userId, behavior);
  }
  // Get or create user preferences
  async getUserPreferences(userId) {
    const [preferences] = await db.select().from(userPreferences).where(eq2(userPreferences.userId, userId));
    if (!preferences) {
      const [newPreferences] = await db.insert(userPreferences).values({
        userId,
        preferredCategories: "[]",
        interestScore: "{}",
        biddingStyle: "conservative",
        riskTolerance: "medium"
      }).returning();
      return newPreferences;
    }
    return preferences;
  }
  // Update user preferences based on behavior patterns
  async updateUserPreferences(userId, behavior) {
    const preferences = await this.getUserPreferences(userId);
    if (!preferences) return;
    let preferredCategories = [];
    let interestScore = {};
    try {
      preferredCategories = JSON.parse(preferences.preferredCategories || "[]");
      interestScore = JSON.parse(preferences.interestScore || "{}");
    } catch (e) {
      console.error("Error parsing preferences JSON:", e);
    }
    if (behavior.categoryId) {
      const categoryKey = behavior.categoryId.toString();
      const currentScore = interestScore[categoryKey] || 0;
      const actionWeights = {
        view: 0.1,
        click: 0.3,
        bid: 1,
        watch: 0.5,
        search: 0.2
      };
      const weight = actionWeights[behavior.actionType] || 0.1;
      interestScore[categoryKey] = Math.min(currentScore + weight, 5);
      if (interestScore[categoryKey] > 1 && !preferredCategories.includes(behavior.categoryId)) {
        preferredCategories.push(behavior.categoryId);
      }
    }
    if (behavior.actionType === "bid") {
      const recentBids = await db.select().from(userBehavior).where(
        and2(
          eq2(userBehavior.userId, userId),
          eq2(userBehavior.actionType, "bid"),
          gte(userBehavior.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3))
          // Last 7 days
        )
      ).limit(10);
      const bidFrequency = recentBids.length;
      let biddingStyle = "conservative";
      if (bidFrequency > 15) biddingStyle = "aggressive";
      else if (bidFrequency > 7) biddingStyle = "strategic";
      await db.update(userPreferences).set({
        preferredCategories: JSON.stringify(preferredCategories),
        interestScore: JSON.stringify(interestScore),
        biddingStyle,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(userPreferences.userId, userId));
    }
  }
  // Generate personalized recommendations
  async generateRecommendations(context, limit = 10) {
    const recommendations = [];
    const preferences = await this.getUserPreferences(context.userId);
    const contentBased = await this.getContentBasedRecommendations(context, preferences, Math.ceil(limit * 0.4));
    recommendations.push(...contentBased);
    const collaborative = await this.getCollaborativeRecommendations(context, Math.ceil(limit * 0.3));
    recommendations.push(...collaborative);
    const trending = await this.getTrendingRecommendations(context, Math.ceil(limit * 0.2));
    recommendations.push(...trending);
    const diverse = await this.getDiverseRecommendations(context, preferences, Math.ceil(limit * 0.1));
    recommendations.push(...diverse);
    const uniqueRecommendations = this.removeDuplicates(recommendations);
    const sortedRecommendations = uniqueRecommendations.sort((a, b) => b.score - a.score).slice(0, limit);
    await this.storeRecommendations(context.userId, sortedRecommendations);
    return sortedRecommendations;
  }
  // Content-based filtering using user's category preferences
  async getContentBasedRecommendations(context, preferences, limit) {
    if (!preferences) return [];
    let preferredCategories = [];
    let interestScore = {};
    try {
      preferredCategories = JSON.parse(preferences.preferredCategories || "[]");
      interestScore = JSON.parse(preferences.interestScore || "{}");
    } catch (e) {
      preferredCategories = [];
      interestScore = {};
    }
    if (preferredCategories.length === 0) return [];
    const activeAuctions = await db.select().from(auctions).where(
      and2(
        inArray(auctions.categoryId, preferredCategories),
        eq2(auctions.status, "active")
      )
    ).limit(limit);
    return activeAuctions.map((auction) => ({
      auctionId: auction.id,
      score: (interestScore[auction.categoryId.toString()] || 0.5) * 0.8,
      reason: `Based on your interest in ${this.getCategoryName(auction.categoryId)} category`,
      type: "personalized"
    }));
  }
  // Collaborative filtering based on similar users
  async getCollaborativeRecommendations(context, limit) {
    const userCategories = await db.select({
      categoryId: userBehavior.categoryId,
      count: sql2`count(*)`.as("count")
    }).from(userBehavior).where(
      and2(
        eq2(userBehavior.userId, context.userId),
        eq2(userBehavior.actionType, "bid")
      )
    ).groupBy(userBehavior.categoryId).having(sql2`count(*) > 0`);
    if (userCategories.length === 0) return [];
    const categoryIds = userCategories.map((c) => c.categoryId).filter(Boolean);
    const similarUsers = await db.select({
      userId: userBehavior.userId,
      sharedCategories: sql2`count(distinct ${userBehavior.categoryId})`.as("sharedCategories")
    }).from(userBehavior).where(
      and2(
        inArray(userBehavior.categoryId, categoryIds),
        eq2(userBehavior.actionType, "bid"),
        sql2`${userBehavior.userId} != ${context.userId}`
      )
    ).groupBy(userBehavior.userId).having(sql2`count(distinct ${userBehavior.categoryId}) >= 2`).limit(10);
    if (similarUsers.length === 0) return [];
    const similarUserIds = similarUsers.map((u) => u.userId);
    const recommendedAuctions = await db.select({
      auctionId: userBehavior.auctionId,
      bidCount: sql2`count(*)`.as("bidCount")
    }).from(userBehavior).where(
      and2(
        inArray(userBehavior.userId, similarUserIds),
        eq2(userBehavior.actionType, "bid"),
        sql2`${userBehavior.auctionId} IS NOT NULL`
      )
    ).groupBy(userBehavior.auctionId).orderBy(desc(sql2`count(*)`)).limit(limit);
    return recommendedAuctions.map((item) => ({
      auctionId: item.auctionId,
      score: Math.min(item.bidCount * 0.15, 0.9),
      reason: "Users with similar interests also bid on this auction",
      type: "similar"
    }));
  }
  // Get trending auctions based on recent activity
  async getTrendingRecommendations(context, limit) {
    const trendingAuctions = await db.select({
      auctionId: userBehavior.auctionId,
      activityScore: sql2`count(*) + sum(case when ${userBehavior.actionType} = 'bid' then 3 when ${userBehavior.actionType} = 'view' then 1 else 2 end)`.as("activityScore")
    }).from(userBehavior).where(
      and2(
        gte(userBehavior.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1e3)),
        // Last 24 hours
        sql2`${userBehavior.auctionId} IS NOT NULL`
      )
    ).groupBy(userBehavior.auctionId).orderBy(desc(sql2`count(*) + sum(case when ${userBehavior.actionType} = 'bid' then 3 when ${userBehavior.actionType} = 'view' then 1 else 2 end)`)).limit(limit);
    return trendingAuctions.map((item) => ({
      auctionId: item.auctionId,
      score: Math.min(item.activityScore * 0.1, 0.8),
      reason: "Currently trending with high user activity",
      type: "trending"
    }));
  }
  // Get diverse recommendations to help users explore new categories
  async getDiverseRecommendations(context, preferences, limit) {
    let preferredCategories = [];
    try {
      preferredCategories = JSON.parse(preferences?.preferredCategories || "[]");
    } catch (e) {
      preferredCategories = [];
    }
    const allCategories = await db.select().from(categories).where(eq2(categories.isActive, true));
    const unexploredCategories = allCategories.filter((cat) => !preferredCategories.includes(cat.id));
    if (unexploredCategories.length === 0) return [];
    const diverseAuctions = await db.select().from(auctions).where(
      and2(
        inArray(auctions.categoryId, unexploredCategories.map((c) => c.id)),
        eq2(auctions.status, "active"),
        eq2(auctions.featured, true)
        // Only recommend featured auctions for exploration
      )
    ).limit(limit);
    return diverseAuctions.map((auction) => ({
      auctionId: auction.id,
      score: 0.6,
      // Medium score for exploration
      reason: `Explore ${this.getCategoryName(auction.categoryId)} category`,
      type: "category"
    }));
  }
  // Store recommendations in database
  async storeRecommendations(userId, recommendations) {
    if (recommendations.length === 0) return;
    await db.delete(auctionRecommendations).where(eq2(auctionRecommendations.userId, userId));
    const recommendationData = recommendations.map((rec, index) => ({
      userId,
      auctionId: rec.auctionId,
      score: rec.score.toString(),
      reason: rec.reason,
      recommendationType: rec.type,
      position: index + 1
    }));
    await db.insert(auctionRecommendations).values(recommendationData);
  }
  // Helper method to remove duplicate recommendations
  removeDuplicates(recommendations) {
    const seen = /* @__PURE__ */ new Set();
    return recommendations.filter((rec) => {
      if (seen.has(rec.auctionId)) return false;
      seen.add(rec.auctionId);
      return true;
    });
  }
  // Helper method to get category name (placeholder - would integrate with actual categories)
  getCategoryName(categoryId) {
    const categoryNames = {
      1: "\u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A",
      2: "\u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A",
      3: "\u0627\u0644\u0645\u062C\u0648\u0647\u0631\u0627\u062A",
      4: "\u0627\u0644\u0639\u0642\u0627\u0631\u0627\u062A",
      5: "\u0627\u0644\u0623\u062B\u0627\u062B"
    };
    return categoryNames[categoryId] || "\u0641\u0626\u0629 \u0623\u062E\u0631\u0649";
  }
  // Get recommendations for a specific user
  async getRecommendationsForUser(userId, limit = 10) {
    const recommendations = await db.select({
      recommendation: auctionRecommendations,
      auction: auctions
    }).from(auctionRecommendations).innerJoin(auctions, eq2(auctionRecommendations.auctionId, auctions.id)).where(eq2(auctionRecommendations.userId, userId)).orderBy(desc(auctionRecommendations.score)).limit(limit);
    return recommendations.map((item) => ({
      ...item.recommendation,
      auction: item.auction
    }));
  }
  // Mark recommendation as viewed
  async markRecommendationViewed(userId, auctionId) {
    await db.update(auctionRecommendations).set({ isViewed: true }).where(
      and2(
        eq2(auctionRecommendations.userId, userId),
        eq2(auctionRecommendations.auctionId, auctionId)
      )
    );
  }
  // Mark recommendation as clicked
  async markRecommendationClicked(userId, auctionId) {
    await db.update(auctionRecommendations).set({ isClicked: true }).where(
      and2(
        eq2(auctionRecommendations.userId, userId),
        eq2(auctionRecommendations.auctionId, auctionId)
      )
    );
  }
};
var mlRecommendationEngine = new MLRecommendationEngine();

// server/notification-service.ts
import { MailService } from "@sendgrid/mail";
import { eq as eq3 } from "drizzle-orm";
var NotificationService = class {
  mailService;
  companyInfo = {
    name: "\u0645\u0632\u0627\u062F \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    phone: "00966505930648",
    whatsapp: "00966505930648",
    email: "info@mazadksa.com",
    address: "Al Bandariyah, Saeed Tower, Khobar, Saudi Arabia",
    website: "https://mazadksa.com"
  };
  constructor() {
    this.mailService = new MailService();
    if (process.env.SENDGRID_API_KEY) {
      this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }
  async sendNotification(data) {
    try {
      const [user] = await db.select().from(users).where(eq3(users.id, data.userId));
      if (!user) {
        console.error("User not found:", data.userId);
        return false;
      }
      await this.storeNotification(data);
      const results = await Promise.allSettled([
        this.sendEmailNotification(user, data),
        this.sendSMSNotification(user, data),
        this.sendWhatsAppNotification(user, data)
      ]);
      return results.some((result) => result.status === "fulfilled" && result.value === true);
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }
  async storeNotification(data) {
    await db.insert(notifications).values({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      auctionId: data.auctionId || null,
      isRead: false,
      emailSent: false
    });
  }
  async sendEmailNotification(user, data) {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("SendGrid API key not configured, skipping email");
      return false;
    }
    if (!user.emailNotifications || data.config && !data.config.email) {
      return false;
    }
    try {
      const template = this.getEmailTemplate(data);
      const msg = {
        to: user.email,
        from: {
          email: this.companyInfo.email,
          name: this.companyInfo.name
        },
        subject: template.subject,
        text: template.text,
        html: template.html
      };
      await this.mailService.send(msg);
      console.log("Email sent successfully to:", user.email);
      await this.markEmailSent(data.userId, data.type);
      return true;
    } catch (error) {
      console.error("SendGrid email error:", error);
      return false;
    }
  }
  async sendSMSNotification(user, data) {
    if (!user.smsNotifications || data.config && !data.config.sms || !user.phone) {
      return false;
    }
    console.log(`SMS would be sent to ${user.phone}: ${data.message}`);
    return true;
  }
  async sendWhatsAppNotification(user, data) {
    if (!user.whatsappNotifications || data.config && !data.config.whatsapp || !user.whatsappNumber && !user.phone) {
      return false;
    }
    const whatsappNumber = user.whatsappNumber || user.phone;
    console.log(`WhatsApp would be sent to ${whatsappNumber}: ${data.message}`);
    return true;
  }
  async markEmailSent(userId, type) {
    await db.update(notifications).set({ emailSent: true }).where(eq3(notifications.userId, userId));
  }
  getEmailTemplate(data) {
    const baseStyle = `
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .rtl { direction: rtl; text-align: right; }
      </style>
    `;
    switch (data.type) {
      case "welcome":
        return {
          subject: `\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>${this.companyInfo.name}</h1>
                <h2>\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0645\u0646\u0635\u0629 \u0627\u0644\u0645\u0632\u0627\u062F\u0627\u062A \u0627\u0644\u0631\u0627\u0626\u062F\u0629</h2>
              </div>
              <div class="content">
                <h3>\u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B!</h3>
                <p>\u0646\u062D\u0646 \u0633\u0639\u062F\u0627\u0621 \u0644\u0627\u0646\u0636\u0645\u0627\u0645\u0643 \u0625\u0644\u0649 \u0645\u0646\u0635\u0629 ${this.companyInfo.name}\u060C \u0627\u0644\u0645\u0646\u0635\u0629 \u0627\u0644\u0631\u0627\u0626\u062F\u0629 \u0644\u0644\u0645\u0632\u0627\u062F\u0627\u062A \u0641\u064A \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629.</p>
                <p><strong>\u0645\u0627 \u064A\u0645\u0643\u0646\u0643 \u0641\u0639\u0644\u0647 \u0627\u0644\u0622\u0646:</strong></p>
                <ul>
                  <li>\u062A\u0635\u0641\u062D \u0627\u0644\u0645\u0632\u0627\u062F\u0627\u062A \u0627\u0644\u0646\u0634\u0637\u0629</li>
                  <li>\u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629 \u0641\u064A \u0627\u0644\u0645\u0632\u0627\u064A\u062F\u0629</li>
                  <li>\u062A\u062A\u0628\u0639 \u0645\u0632\u0627\u062F\u0627\u062A\u0643 \u0627\u0644\u0645\u0641\u0636\u0644\u0629</li>
                  <li>\u0643\u0633\u0628 \u0646\u0642\u0627\u0637 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A</li>
                </ul>
                <a href="${this.companyInfo.website}" class="button">\u0627\u0628\u062F\u0623 \u0627\u0644\u062A\u0635\u0641\u062D \u0627\u0644\u0622\u0646</a>
              </div>
              <div class="footer">
                <p><strong>\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627:</strong></p>
                <p>\u{1F4DE} ${this.companyInfo.phone} | \u{1F4E7} ${this.companyInfo.email}</p>
                <p>\u{1F4CD} ${this.companyInfo.address}</p>
              </div>
            </div>
          `,
          text: `\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A ${this.companyInfo.name}!

\u0646\u062D\u0646 \u0633\u0639\u062F\u0627\u0621 \u0644\u0627\u0646\u0636\u0645\u0627\u0645\u0643 \u0625\u0644\u0649 \u0645\u0646\u0635\u062A\u0646\u0627.

\u0644\u0644\u062A\u0648\u0627\u0635\u0644: ${this.companyInfo.phone}
\u0627\u0644\u0645\u0648\u0642\u0639: ${this.companyInfo.website}`
        };
      case "bid_notification":
        return {
          subject: `\u0645\u0632\u0627\u064A\u062F\u0629 \u062C\u062F\u064A\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u0632\u0627\u062F - ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>\u0645\u0632\u0627\u064A\u062F\u0629 \u062C\u062F\u064A\u062F\u0629!</h1>
              </div>
              <div class="content">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
                <p>\u0644\u0627 \u062A\u0641\u0648\u062A \u0627\u0644\u0641\u0631\u0635\u0629 \u0648\u062A\u0627\u0628\u0639 \u0627\u0644\u0645\u0632\u0627\u062F \u0627\u0644\u0622\u0646!</p>
                <a href="${this.companyInfo.website}" class="button">\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u0627\u062F</a>
              </div>
              <div class="footer">
                <p>\u{1F4DE} ${this.companyInfo.phone} | \u{1F4E7} ${this.companyInfo.email}</p>
              </div>
            </div>
          `,
          text: `${data.title}

${data.message}

\u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629: ${this.companyInfo.website}`
        };
      case "auction_end":
        return {
          subject: `\u0627\u0646\u062A\u0647\u0649 \u0627\u0644\u0645\u0632\u0627\u062F - ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>\u0627\u0646\u062A\u0647\u0649 \u0627\u0644\u0645\u0632\u0627\u062F</h1>
              </div>
              <div class="content">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
                <a href="${this.companyInfo.website}" class="button">\u0639\u0631\u0636 \u0627\u0644\u0646\u062A\u0627\u0626\u062C</a>
              </div>
              <div class="footer">
                <p>\u{1F4DE} ${this.companyInfo.phone} | \u{1F4E7} ${this.companyInfo.email}</p>
              </div>
            </div>
          `,
          text: `${data.title}

${data.message}`
        };
      case "win_notification":
        return {
          subject: `\u{1F389} \u0645\u0628\u0631\u0648\u0643! \u0641\u0632\u062A \u0628\u0627\u0644\u0645\u0632\u0627\u062F - ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>\u{1F389} \u0645\u0628\u0631\u0648\u0643!</h1>
                <h2>\u0644\u0642\u062F \u0641\u0632\u062A \u0628\u0627\u0644\u0645\u0632\u0627\u062F</h2>
              </div>
              <div class="content">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
                <p><strong>\u0627\u0644\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u062A\u0627\u0644\u064A\u0629:</strong></p>
                <ul>
                  <li>\u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u062E\u0644\u0627\u0644 24 \u0633\u0627\u0639\u0629</li>
                  <li>\u062A\u062C\u0647\u064A\u0632 \u0648\u0633\u0627\u0626\u0644 \u0627\u0644\u062F\u0641\u0639</li>
                  <li>\u062A\u0631\u062A\u064A\u0628 \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0645\u0646\u062A\u062C</li>
                </ul>
                <a href="${this.companyInfo.website}" class="button">\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0641\u0648\u0632</a>
              </div>
              <div class="footer">
                <p><strong>\u0644\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A:</strong></p>
                <p>\u{1F4DE} ${this.companyInfo.phone} | \u{1F4E7} ${this.companyInfo.email}</p>
                <p>\u{1F4CD} ${this.companyInfo.address}</p>
              </div>
            </div>
          `,
          text: `\u{1F389} \u0645\u0628\u0631\u0648\u0643! \u0641\u0632\u062A \u0628\u0627\u0644\u0645\u0632\u0627\u062F

${data.title}

${data.message}

\u0644\u0644\u062A\u0648\u0627\u0635\u0644: ${this.companyInfo.phone}`
        };
      default:
        return {
          subject: `\u0625\u0634\u0639\u0627\u0631 \u0645\u0646 ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>${this.companyInfo.name}</h1>
              </div>
              <div class="content">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
              </div>
              <div class="footer">
                <p>\u{1F4DE} ${this.companyInfo.phone} | \u{1F4E7} ${this.companyInfo.email}</p>
              </div>
            </div>
          `,
          text: `${data.title}

${data.message}`
        };
    }
  }
  // Public methods for different notification types
  async sendWelcomeNotification(userId) {
    return this.sendNotification({
      userId,
      title: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0645\u0632\u0627\u062F \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
      message: "\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628\u0643 \u0628\u0646\u062C\u0627\u062D. \u0627\u0628\u062F\u0623 \u0627\u0644\u0622\u0646 \u0628\u062A\u0635\u0641\u062D \u0627\u0644\u0645\u0632\u0627\u062F\u0627\u062A \u0648\u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629 \u0641\u064A \u0627\u0644\u0645\u0632\u0627\u064A\u062F\u0629!",
      type: "welcome"
    });
  }
  async sendBidNotification(userId, auctionTitle, newBidAmount) {
    return this.sendNotification({
      userId,
      title: "\u0645\u0632\u0627\u064A\u062F\u0629 \u062C\u062F\u064A\u062F\u0629",
      message: `\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0645\u0632\u0627\u064A\u062F\u0629 \u062C\u062F\u064A\u062F\u0629 \u0639\u0644\u0649 "${auctionTitle}" \u0628\u0645\u0628\u0644\u063A ${newBidAmount} \u0631\u064A\u0627\u0644 \u0633\u0639\u0648\u062F\u064A.`,
      type: "bid_notification"
    });
  }
  async sendWinNotification(userId, auctionTitle, finalAmount) {
    return this.sendNotification({
      userId,
      title: "\u0645\u0628\u0631\u0648\u0643! \u0644\u0642\u062F \u0641\u0632\u062A \u0628\u0627\u0644\u0645\u0632\u0627\u062F",
      message: `\u062A\u0647\u0627\u0646\u064A\u0646\u0627! \u0644\u0642\u062F \u0641\u0632\u062A \u0628\u0645\u0632\u0627\u062F "${auctionTitle}" \u0628\u0645\u0628\u0644\u063A ${finalAmount} \u0631\u064A\u0627\u0644 \u0633\u0639\u0648\u062F\u064A. \u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0642\u0631\u064A\u0628\u0627\u064B \u0644\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0648\u0627\u0644\u062F\u0641\u0639.`,
      type: "win_notification"
    });
  }
  async sendContactFormNotification(formData) {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("SendGrid API key not configured for contact form");
      return false;
    }
    try {
      const msg = {
        to: this.companyInfo.email,
        from: {
          email: "noreply@mazadksa.com",
          name: this.companyInfo.name
        },
        subject: `\u0631\u0633\u0627\u0644\u0629 \u062C\u062F\u064A\u062F\u0629 \u0645\u0646 \u0627\u0644\u0646\u0645\u0648\u0630\u062C: ${formData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>\u0631\u0633\u0627\u0644\u0629 \u062C\u062F\u064A\u062F\u0629 \u0645\u0646 \u0645\u0648\u0642\u0639 ${this.companyInfo.name}</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>\u0627\u0644\u0627\u0633\u0645:</strong> ${formData.name}</p>
              <p><strong>\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A:</strong> ${formData.email}</p>
              <p><strong>\u0627\u0644\u0647\u0627\u062A\u0641:</strong> ${formData.phone}</p>
              <p><strong>\u0627\u0644\u0645\u0648\u0636\u0648\u0639:</strong> ${formData.subject}</p>
              <p><strong>\u0627\u0644\u0631\u0633\u0627\u0644\u0629:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 5px;">${formData.message}</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              \u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0647\u0630\u0647 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0645\u0646 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0641\u064A \u0645\u0648\u0642\u0639 ${this.companyInfo.name}
            </p>
          </div>
        `,
        text: `\u0631\u0633\u0627\u0644\u0629 \u062C\u062F\u064A\u062F\u0629 \u0645\u0646 ${formData.name}
\u0627\u0644\u0628\u0631\u064A\u062F: ${formData.email}
\u0627\u0644\u0647\u0627\u062A\u0641: ${formData.phone}
\u0627\u0644\u0645\u0648\u0636\u0648\u0639: ${formData.subject}
\u0627\u0644\u0631\u0633\u0627\u0644\u0629: ${formData.message}`
      };
      await this.mailService.send(msg);
      console.log("Contact form email sent successfully");
      return true;
    } catch (error) {
      console.error("Error sending contact form email:", error);
      return false;
    }
  }
};
var notificationService = new NotificationService();

// server/auth.ts
function setupAuthRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, fullName, password } = req.body;
      if (!username || !email || !fullName || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
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
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.createUser({
          username,
          email: `${username}@example.com`,
          fullName: username,
          password,
          phone: "0500000000",
          rewardPoints: 0,
          level: 1,
          isVerified: true
        });
      }
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
  app2.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/user", async (req, res) => {
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

// server/routes.ts
import { z } from "zod";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function registerRoutes(app2) {
  setupAuthRoutes(app2);
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/auctions", async (req, res) => {
    try {
      const { categoryId, status, featured } = req.query;
      const filters = {};
      if (categoryId) filters.categoryId = parseInt(categoryId);
      if (status) filters.status = status;
      if (featured !== void 0) filters.featured = featured === "true";
      const auctions2 = await storage.getAuctions(filters);
      res.json(auctions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch auctions" });
    }
  });
  app2.get("/api/auctions/:id", async (req, res) => {
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
  app2.get("/api/auctions/:id/bids", async (req, res) => {
    try {
      const auctionId = parseInt(req.params.id);
      const bids3 = await storage.getBidsForAuction(auctionId);
      const bidsWithUsers = await Promise.all(
        bids3.map(async (bid) => {
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
  app2.post("/api/auctions/:id/bids", async (req, res) => {
    try {
      const auctionId = parseInt(req.params.id);
      const bidData = insertBidSchema.parse({
        ...req.body,
        auctionId
      });
      const auction = await storage.getAuction(auctionId);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }
      if (auction.status !== "active") {
        return res.status(400).json({ message: "Auction is not active" });
      }
      if (/* @__PURE__ */ new Date() > auction.endTime) {
        return res.status(400).json({ message: "Auction has ended" });
      }
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
      const bid = await storage.createBid(bidData);
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
  app2.get("/api/stats", async (req, res) => {
    try {
      const allAuctions = await storage.getAuctions();
      const activeAuctions = allAuctions.filter((a) => a.status === "active");
      const users2 = await Promise.all([1, 2, 3].map((id) => storage.getUser(id)));
      res.json({
        activeAuctions: activeAuctions.length,
        totalUsers: users2.filter((u) => u).length,
        totalAuctions: allAuctions.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/users/:id/rewards", async (req, res) => {
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
  app2.get("/api/achievements", async (req, res) => {
    try {
      const achievements2 = await storage.getAchievements();
      res.json(achievements2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });
  app2.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userAchievements2 = await storage.getUserAchievements(userId);
      res.json(userAchievements2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });
  app2.get("/api/users/:id/notifications", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const notifications2 = await storage.getUserNotifications(userId);
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app2.post("/api/payments/create-bid-deposit", async (req, res) => {
    try {
      const { auctionId, bidAmount, depositAmount } = req.body;
      const userId = 1;
      const deposit = await storage.createBidDeposit({
        userId,
        auctionId,
        amount: depositAmount.toString(),
        depositType: "bid_guarantee",
        status: "pending"
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(depositAmount * 100),
        // Convert to halalas
        currency: "sar",
        metadata: {
          depositId: deposit.id.toString(),
          auctionId: auctionId.toString(),
          userId: userId.toString(),
          type: "bid_deposit"
        }
      });
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
    } catch (error) {
      res.status(500).json({ message: "Error creating bid deposit: " + error.message });
    }
  });
  app2.post("/api/payments/confirm-deposit", async (req, res) => {
    try {
      const { paymentIntentId, auctionId, status } = req.body;
      await storage.updateBidDepositStatus(paymentIntentId, status);
      await storage.updatePaymentTransactionStatus(paymentIntentId, "completed");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error confirming deposit: " + error.message });
    }
  });
  app2.get("/api/users/:id/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit) || 10;
      const recommendations = await mlRecommendationEngine.generateRecommendations(
        { userId },
        limit
      );
      const recommendationsWithDetails = await mlRecommendationEngine.getRecommendationsForUser(userId, limit);
      res.json(recommendationsWithDetails);
    } catch (error) {
      console.error("Recommendation error:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });
  app2.post("/api/users/:id/behavior", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { actionType, auctionId, categoryId, sessionId, metadata } = req.body;
      await mlRecommendationEngine.trackUserBehavior({
        userId,
        actionType,
        auctionId: auctionId || null,
        categoryId: categoryId || null,
        sessionId: sessionId || null,
        metadata: metadata || null
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Behavior tracking error:", error);
      res.status(500).json({ message: "Failed to track behavior" });
    }
  });
  app2.get("/api/users/:id/preferences", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const preferences = await mlRecommendationEngine.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });
  app2.post("/api/recommendations/:userId/:auctionId/viewed", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const auctionId = parseInt(req.params.auctionId);
      await mlRecommendationEngine.markRecommendationViewed(userId, auctionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark recommendation as viewed" });
    }
  });
  app2.post("/api/recommendations/:userId/:auctionId/clicked", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const auctionId = parseInt(req.params.auctionId);
      await mlRecommendationEngine.markRecommendationClicked(userId, auctionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark recommendation as clicked" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, nationalId, username } = req.body;
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      const newUser = await storage.createUser({
        username,
        email,
        password: "temp_password",
        // TODO: Implement proper password handling
        fullName: `${firstName} ${lastName}`,
        phone,
        isVerified: true
        // Auto-verify for demo
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
    } catch (error) {
      res.status(500).json({ message: "Error creating account: " + error.message });
    }
  });
  app2.post("/api/auth/register-personal-info", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, nationalId } = req.body;
      const verification = await storage.createUserVerification({
        userId: 1,
        // TODO: Create actual user
        verificationType: "identity",
        documentType: "national_id",
        documentNumber: nationalId,
        phoneNumber: phone,
        verificationCode: Math.floor(1e5 + Math.random() * 9e5).toString(),
        status: "pending"
      });
      res.json({
        success: true,
        userId: verification.userId,
        verificationId: verification.id
      });
    } catch (error) {
      res.status(500).json({ message: "Error saving personal info: " + error.message });
    }
  });
  app2.post("/api/auth/verify-phone", async (req, res) => {
    try {
      const { userId, verificationCode } = req.body;
      const isValid = verificationCode === "123456";
      if (isValid) {
        await storage.updateUserVerificationStatus(userId, "approved");
        res.json({ success: true });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error verifying phone: " + error.message });
    }
  });
  app2.post("/api/payments/create-registration-fee", async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to halalas
        currency: "sar",
        metadata: {
          userId: userId.toString(),
          type: "registration_fee"
        }
      });
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
    } catch (error) {
      res.status(500).json({ message: "Error creating registration fee: " + error.message });
    }
  });
  app2.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, auctionId, description } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to cents
        currency: "aed",
        // UAE Dirham for KSA market
        automatic_payment_methods: {
          enabled: true
        },
        metadata: {
          auctionId: auctionId?.toString() || "",
          description: description || ""
        }
      });
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating payment intent: " + error.message
      });
    }
  });
  app2.get("/api/payment/:paymentIntentId", async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      res.json({
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving payment: " + error.message
      });
    }
  });
  app2.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, auctionId, userId } = req.body;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment not completed" });
      }
      res.json({
        success: true,
        paymentStatus: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        message: "Payment confirmed successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error confirming payment: " + error.message
      });
    }
  });
  app2.post("/api/track-behavior", async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ message: "Error tracking behavior: " + error.message });
    }
  });
  app2.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit) || 10;
      const recommendations = await mlRecommendationEngine.generateRecommendations(
        { userId },
        limit
      );
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
    } catch (error) {
      res.status(500).json({ message: "Error getting recommendations: " + error.message });
    }
  });
  app2.get("/api/user-preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = await mlRecommendationEngine.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Error getting preferences: " + error.message });
    }
  });
  app2.post("/api/recommendation-viewed", async (req, res) => {
    try {
      const { userId, auctionId } = req.body;
      await mlRecommendationEngine.markRecommendationViewed(userId, auctionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error marking viewed: " + error.message });
    }
  });
  app2.post("/api/recommendation-clicked", async (req, res) => {
    try {
      const { userId, auctionId } = req.body;
      await mlRecommendationEngine.markRecommendationClicked(userId, auctionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error marking clicked: " + error.message });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
      console.log("Contact form submitted:", { name, email, phone, subject, message });
      const emailSent = await notificationService.sendContactFormNotification({
        name,
        email,
        phone: phone || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F",
        subject,
        message
      });
      if (emailSent && email) {
        try {
          await notificationService.sendNotification({
            userId: 1,
            // Demo user
            title: "\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0648\u0627\u0635\u0644\u0643 \u0645\u0639\u0646\u0627",
            message: `\u0634\u0643\u0631\u0627\u064B \u0644\u0643 ${name} \u0639\u0644\u0649 \u062A\u0648\u0627\u0635\u0644\u0643 \u0645\u0639\u0646\u0627. \u0633\u064A\u062A\u0645 \u0627\u0644\u0631\u062F \u0639\u0644\u064A\u0643 \u062E\u0644\u0627\u0644 24 \u0633\u0627\u0639\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0623\u0648 \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u0642\u062F\u0645.`,
            type: "system",
            config: { email: true, sms: false, whatsapp: false }
          });
        } catch (notifError) {
          console.log("Could not send auto-reply:", notifError);
        }
      }
      res.json({
        success: true,
        message: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u062A\u0643 \u0628\u0646\u062C\u0627\u062D. \u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0642\u0631\u064A\u0628\u0627\u064B.",
        contactInfo: {
          phone: "00966505930648",
          whatsapp: "00966505930648",
          email: "info@mazadksa.com",
          address: "Al Bandariyah, Saeed Tower, Khobar, Saudi Arabia"
        }
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629. \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649." });
    }
  });
  app2.get("/api/company-info", async (req, res) => {
    try {
      res.json({
        name: "\u0645\u0632\u0627\u062F \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
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
          ar: "\u0627\u0644\u0623\u062D\u062F - \u0627\u0644\u062E\u0645\u064A\u0633: 9:00 \u0635 - 6:00 \u0645",
          en: "Sunday - Thursday: 9:00 AM - 6:00 PM"
        },
        socialMedia: {
          twitter: "@MazadKSA",
          instagram: "@mazadksa",
          linkedin: "mazad-ksa"
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching company info: " + error.message });
    }
  });
  app2.post("/api/send-welcome-email", async (req, res) => {
    try {
      const { userId } = req.body;
      const success = await notificationService.sendWelcomeNotification(userId);
      if (success) {
        res.json({ success: true, message: "Welcome email sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send welcome email" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error sending welcome email: " + error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
