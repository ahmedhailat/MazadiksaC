import { 
  users, categories, auctions, bids, achievements, userAchievements, rewardTransactions, notifications,
  bidDeposits, userVerifications, paymentTransactions, userBehavior, userPreferences, auctionRecommendations,
  type User, type InsertUser, type Category, type InsertCategory, type Auction, type InsertAuction, 
  type Bid, type InsertBid, type Achievement, type InsertAchievement, type UserAchievement, 
  type InsertUserAchievement, type RewardTransaction, type InsertRewardTransaction,
  type Notification, type InsertNotification, type BidDeposit, type InsertBidDeposit,
  type UserVerification, type InsertUserVerification, type PaymentTransaction, type InsertPaymentTransaction,
  type UserBehavior, type InsertUserBehavior, type UserPreferences, type InsertUserPreferences,
  type AuctionRecommendation, type InsertAuctionRecommendation
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Auctions
  getAuctions(filters?: { categoryId?: number; status?: string; featured?: boolean }): Promise<Auction[]>;
  getAuction(id: number): Promise<Auction | undefined>;
  createAuction(auction: InsertAuction): Promise<Auction>;
  updateAuctionPrice(id: number, newPrice: string, totalBids: number): Promise<void>;

  // Bids
  getBidsForAuction(auctionId: number): Promise<Bid[]>;
  getHighestBid(auctionId: number): Promise<Bid | undefined>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateWinningBid(auctionId: number, newWinningBidId: number): Promise<void>;

  // Rewards & Gamification
  getUserRewardPoints(userId: number): Promise<number>;
  addRewardPoints(userId: number, points: number, reason: string, auctionId?: number): Promise<void>;
  updateUserLevel(userId: number): Promise<void>;
  createRewardTransaction(transaction: InsertRewardTransaction): Promise<RewardTransaction>;
  getUserTransactions(userId: number): Promise<RewardTransaction[]>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  checkAndUnlockAchievements(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(notificationId: number): Promise<void>;
  markNotificationEmailSent(notificationId: number): Promise<void>;

  // Bid Deposits & Payment Transactions
  createBidDeposit(deposit: InsertBidDeposit): Promise<BidDeposit>;
  updateBidDepositStatus(paymentIntentId: string, status: string): Promise<void>;
  createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction>;
  updatePaymentTransactionStatus(paymentIntentId: string, status: string): Promise<void>;

  // User Verification
  createUserVerification(verification: InsertUserVerification): Promise<UserVerification>;
  updateUserVerificationStatus(userId: number, status: string): Promise<void>;

  // ML Recommendation System
  trackUserBehavior(behavior: InsertUserBehavior): Promise<UserBehavior>;
  getUserBehavior(userId: number, actionType?: string): Promise<UserBehavior[]>;
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences>): Promise<void>;
  getRecommendationsForUser(userId: number, limit?: number): Promise<AuctionRecommendation[]>;
  createRecommendation(recommendation: InsertAuctionRecommendation): Promise<AuctionRecommendation>;
  markRecommendationViewed(userId: number, auctionId: number): Promise<void>;
  markRecommendationClicked(userId: number, auctionId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    console.log("Seeding data...");

    try {
      // Test database connection first
      await db.execute(sql`SELECT 1`);

      // Check if categories already exist
      const existingCategories = await db.select().from(categories).limit(1);
      if (existingCategories.length > 0) {
        console.log("Data already seeded, skipping...");
        return; // Data already seeded
      }

      // Seed categories
      const categoriesData = [
        { nameAr: "العقار", nameEn: "Real Estate", slug: "real-estate", isActive: true },
        { nameAr: "بيع مباشر", nameEn: "Direct Sale", slug: "direct-sale", isActive: true },
        { nameAr: "مزاد متنوع", nameEn: "Diverse Auction", slug: "diverse-auction", isActive: true },
        { nameAr: "مزاد المعدات", nameEn: "Equipment Auction", slug: "equipment-auction", isActive: true },
        { nameAr: "إيجار", nameEn: "Rental", slug: "rental", isActive: true },
        { nameAr: "مزاد اللوحات والأرقام", nameEn: "Plates & Numbers Auction", slug: "plates-numbers-auction", isActive: true },
      ];

      await db.insert(categories).values(categoriesData);

      // Seed users
      const userData = [
        { username: "ahmed_m", email: "ahmed@example.com", password: "password", fullName: "أحمد محمد", phone: "+966501234567", isVerified: true, rewardPoints: 1250, level: 2 },
        { username: "fatima_s", email: "fatima@example.com", password: "password", fullName: "فاطمة صالح", phone: "+966507654321", isVerified: true, rewardPoints: 850, level: 1 },
        { username: "mohammed_a", email: "mohammed@example.com", password: "password", fullName: "محمد علي", phone: "+966501122334", isVerified: true, rewardPoints: 2100, level: 3 },
      ];

      await db.insert(users).values(userData);

      // Seed auctions
      const now = new Date();
      const auctionsData = [
        {
          titleAr: "ساعة رولكس أصلية",
          titleEn: "Authentic Rolex Watch",
          descriptionAr: "ساعة رولكس دايتونا أصلية بحالة ممتازة مع شهادة الأصالة",
          descriptionEn: "Authentic Rolex Daytona in excellent condition with certificate of authenticity",
          categoryId: 3,
          sellerId: 1,
          startingPrice: "15000.00",
          currentPrice: "15500.00",
          bidIncrement: "250.00",
          startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          model3dUrl: "https://modelviewer.dev/shared-assets/models/reflective-sphere.glb",
          hasArSupport: true,
          status: "active",
          featured: true,
          totalBids: 23,
        },
        {
          titleAr: "سيارة فيراري كلاسيكية",
          titleEn: "Classic Ferrari Car",
          descriptionAr: "فيراري ٢٥٠ جي تي كلاسيكية نادرة بحالة ممتازة",
          descriptionEn: "Rare classic Ferrari 250 GT in excellent condition",
          categoryId: 1,
          sellerId: 2,
          startingPrice: "250000.00",
          currentPrice: "285000.00",
          bidIncrement: "5000.00",
          startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          model3dUrl: "https://modelviewer.dev/shared-assets/models/Horse.glb",
          hasArSupport: true,
          status: "active",
          featured: true,
          totalBids: 89,
        },
        {
          titleAr: "لوحة الموناليزا العربية",
          titleEn: "Arabic Mona Lisa Painting",
          descriptionAr: "لوحة نادرة للفنان محمد راسم من القرن العشرين",
          descriptionEn: "Rare painting by Mohammed Racim from the 20th century",
          categoryId: 7,
          sellerId: 3,
          startingPrice: "50000.00",
          currentPrice: "62000.00",
          bidIncrement: "2000.00",
          startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: true,
          totalBids: 12,
        },
        {
          titleAr: "آيفون ١٤ برو ماكس",
          titleEn: "iPhone 14 Pro Max",
          descriptionAr: "آيفون جديد بالكرتون الأصلي، لم يستخدم",
          descriptionEn: "Brand new iPhone in original packaging, unused",
          categoryId: 2,
          sellerId: 1,
          startingPrice: "3000.00",
          currentPrice: "3250.00",
          bidIncrement: "100.00",
          startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 45,
        },
        {
          titleAr: "شقة فاخرة في الرياض",
          titleEn: "Luxury Apartment in Riyadh",
          descriptionAr: "شقة ٤ غرف في حي العليا مع إطلالة رائعة على المدينة",
          descriptionEn: "4-bedroom apartment in Al-Olaya with stunning city view",
          categoryId: 5,
          sellerId: 2,
          startingPrice: "1200000.00",
          currentPrice: "1350000.00",
          bidIncrement: "25000.00",
          startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"],
          status: "active",
          featured: true,
          totalBids: 67,
        },
        {
          titleAr: "حفار كاتربيلر ٣٢٠",
          titleEn: "Caterpillar 320 Excavator",
          descriptionAr: "حفار كاتربيلر موديل ٢٠٢٠ بحالة ممتازة",
          descriptionEn: "Caterpillar excavator model 2020 in excellent condition",
          categoryId: 6,
          sellerId: 3,
          startingPrice: "450000.00",
          currentPrice: "485000.00",
          bidIncrement: "10000.00",
          startTime: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"],
          status: "active",
          featured: true,
          totalBids: 34,
        },
        {
          titleAr: "مجموعة عملات أثرية",
          titleEn: "Antique Coin Collection",
          descriptionAr: "مجموعة نادرة من العملات العثمانية والإسلامية",
          descriptionEn: "Rare collection of Ottoman and Islamic coins",
          categoryId: 4,
          sellerId: 1,
          startingPrice: "8000.00",
          currentPrice: "9500.00",
          bidIncrement: "300.00",
          startTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 28,
        },
        {
          titleAr: "مولد كهرباء ديزل ١٠٠ كيلو وات",
          titleEn: "100KW Diesel Generator",
          descriptionAr: "مولد كهرباء صناعي جديد للبيع المباشر",
          descriptionEn: "New industrial generator for direct sale",
          categoryId: 8,
          sellerId: 2,
          startingPrice: "85000.00",
          currentPrice: "85000.00",
          bidIncrement: "0.00",
          startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 0,
        },
        {
          titleAr: "حفار صغير للتأجير الشهري",
          titleEn: "Small Excavator for Monthly Rental",
          descriptionAr: "حفار صغير متاح للتأجير الشهري مع عامل",
          descriptionEn: "Small excavator available for monthly rental with operator",
          categoryId: 9,
          sellerId: 3,
          startingPrice: "8000.00",
          currentPrice: "8000.00",
          bidIncrement: "0.00",
          startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 0,
        },
        {
          titleAr: "فيلا سكنية في حي الملقا",
          titleEn: "Residential Villa in Al-Malqa",
          descriptionAr: "فيلا دورين مساحة ٥٠٠ متر مربع في حي الملقا الراقي",
          descriptionEn: "Two-story villa 500 sqm in upscale Al-Malqa neighborhood",
          categoryId: 10,
          sellerId: 1,
          startingPrice: "2500000.00",
          currentPrice: "2750000.00",
          bidIncrement: "50000.00",
          startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: true,
          totalBids: 15,
        },
        {
          titleAr: "أرض في حي العقيق",
          titleEn: "Land in Al-Aqiq District",
          descriptionAr: "أرض سكنية في حي العقيق بموقع ممتاز",
          descriptionEn: "Residential land in Al-Aqiq district with excellent location",
          categoryId: 1,
          sellerId: 2,
          startingPrice: "4500.00",
          currentPrice: "4500.00",
          bidIncrement: "100.00",
          startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 5 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: true,
          totalBids: 0,
        },
        {
          titleAr: "معدات مطعم كاملة",
          titleEn: "Complete Restaurant Equipment",
          descriptionAr: "معدات مطعم كاملة تشمل أفران ومعدات طبخ وثلاجات",
          descriptionEn: "Complete restaurant equipment including ovens, cooking equipment and refrigerators",
          categoryId: 4,
          sellerId: 3,
          startingPrice: "25000.00",
          currentPrice: "28000.00",
          bidIncrement: "500.00",
          startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 18 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 12,
        },
        {
          titleAr: "شقة للإيجار - الخبر",
          titleEn: "Apartment for Rent - Khobar",
          descriptionAr: "شقة ٣ غرف نوم في الخبر للإيجار الشهري",
          descriptionEn: "3-bedroom apartment in Khobar for monthly rent",
          categoryId: 5,
          sellerId: 1,
          startingPrice: "3500.00",
          currentPrice: "3800.00",
          bidIncrement: "100.00",
          startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 8,
        },
        {
          titleAr: "لوحة مميزة أ ب ج ١٢٣",
          titleEn: "Premium Plate ABC 123",
          descriptionAr: "لوحة سيارة مميزة بأرقام وحروف مرغوبة",
          descriptionEn: "Premium car plate with desirable numbers and letters",
          categoryId: 6,
          sellerId: 2,
          startingPrice: "15000.00",
          currentPrice: "18500.00",
          bidIncrement: "500.00",
          startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: true,
          totalBids: 15,
        },
        {
          titleAr: "مجموعة أجهزة متنوعة",
          titleEn: "Diverse Electronics Collection",
          descriptionAr: "مجموعة متنوعة من الأجهزة الإلكترونية والكهربائية",
          descriptionEn: "Diverse collection of electronic and electrical devices",
          categoryId: 3,
          sellerId: 3,
          startingPrice: "2500.00",
          currentPrice: "3200.00",
          bidIncrement: "200.00",
          startTime: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 12 * 60 * 60 * 1000),
          images: ["https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
          status: "active",
          featured: false,
          totalBids: 7,
        },
      ];

      await db.insert(auctions).values(auctionsData);

      // Seed some bids
      const bidsData = [
        { auctionId: 1, bidderId: 1, amount: "15500.00", isWinning: true },
        { auctionId: 1, bidderId: 2, amount: "15250.00", isWinning: false },
        { auctionId: 2, bidderId: 3, amount: "285000.00", isWinning: true },
        { auctionId: 5, bidderId: 1, amount: "42500.00", isWinning: true },
      ];

      await db.insert(bids).values(bidsData);

      // Seed achievements
      const achievementsData = [
        {
          name: "First Bid",
          description: "Place your first bid in any auction",
          icon: "🎯",
          pointsRequired: 1,
          category: "bidding"
        },
        {
          name: "Active Bidder",
          description: "Place 10 bids across different auctions",
          icon: "🔥",
          pointsRequired: 10,
          category: "bidding"
        },
        {
          name: "Auction Master",
          description: "Place 100 bids total",
          icon: "👑",
          pointsRequired: 100,
          category: "bidding"
        },
        {
          name: "Points Collector",
          description: "Earn 100 reward points",
          icon: "💎",
          pointsRequired: 100,
          category: "points"
        },
        {
          name: "Elite Member",
          description: "Reach level 5",
          icon: "⭐",
          pointsRequired: 5,
          category: "level"
        },
        {
          name: "VIP Status",
          description: "Reach level 10",
          icon: "🏆",
          pointsRequired: 10,
          category: "level"
        }
      ];

      await db.insert(achievements).values(achievementsData);

      // Update users with reward points
      await db
        .update(users)
        .set({ 
          rewardPoints: 50,
          totalEarned: 50,
          level: 2,
          emailNotifications: true
        });

    } catch (error) {
      console.error('Error seeding data:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getAuctions(filters?: { categoryId?: number; status?: string; featured?: boolean }): Promise<Auction[]> {
    const conditions = [];

    if (filters?.categoryId) {
      conditions.push(eq(auctions.categoryId, filters.categoryId));
    }

    if (filters?.status) {
      conditions.push(eq(auctions.status, filters.status));
    }

    if (filters?.featured !== undefined) {
      conditions.push(eq(auctions.featured, filters.featured));
    }

    const query = conditions.length > 0 
      ? db.select().from(auctions).where(and(...conditions))
      : db.select().from(auctions);

    const results = await query;
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAuction(id: number): Promise<Auction | undefined> {
    const [auction] = await db.select().from(auctions).where(eq(auctions.id, id));
    return auction || undefined;
  }

  async createAuction(insertAuction: InsertAuction): Promise<Auction> {
    const [auction] = await db
      .insert(auctions)
      .values({
        ...insertAuction,
        currentPrice: insertAuction.startingPrice,
        totalBids: 0,
      })
      .returning();
    return auction;
  }

  async updateAuctionPrice(id: number, newPrice: string, totalBids: number): Promise<void> {
    await db
      .update(auctions)
      .set({ currentPrice: newPrice, totalBids })
      .where(eq(auctions.id, id));
  }

  async getBidsForAuction(auctionId: number): Promise<Bid[]> {
    const results = await db
      .select()
      .from(bids)
      .where(eq(bids.auctionId, auctionId))
      .orderBy(bids.placedAt);

    return results.sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
  }

  async getHighestBid(auctionId: number): Promise<Bid | undefined> {
    const bidList = await this.getBidsForAuction(auctionId);
    return bidList[0]; // Already sorted by highest amount first
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const [bid] = await db
      .insert(bids)
      .values({
        ...insertBid,
        isWinning: false,
      })
      .returning();

    // Update auction current price and total bids
    const auction = await this.getAuction(insertBid.auctionId);
    if (auction) {
      await this.updateAuctionPrice(insertBid.auctionId, insertBid.amount, (auction.totalBids || 0) + 1);

      // Get previous highest bidder to notify them
      const previousHighestBid = await this.getHighestBid(insertBid.auctionId);

      // Award points to the bidder
      await this.addRewardPoints(insertBid.bidderId, 10, "Placed a bid", insertBid.auctionId);

      // Check for achievements
      await this.checkAndUnlockAchievements(insertBid.bidderId);

      // Create notification for the new bidder
      await this.createNotification({
        userId: insertBid.bidderId,
        type: 'bid_placed',
        title: 'Bid Placed Successfully',
        message: `You have successfully placed a bid of ${insertBid.amount} SAR on ${auction.titleEn}`,
        auctionId: insertBid.auctionId
      });

      // Notify previous highest bidder if they were outbid
      if (previousHighestBid && previousHighestBid.bidderId !== insertBid.bidderId) {
        await this.createNotification({
          userId: previousHighestBid.bidderId,
          type: 'bid_outbid',
          title: 'You have been outbid',
          message: `Your bid on ${auction.titleEn} has been outbid. New highest bid: ${insertBid.amount} SAR`,
          auctionId: insertBid.auctionId
        });
      }
    }

    // Update winning bid status
    await this.updateWinningBid(insertBid.auctionId, bid.id);

    return bid;
  }

  async updateWinningBid(auctionId: number, newWinningBidId: number): Promise<void> {
    // Set all bids for this auction to not winning
    await db
      .update(bids)
      .set({ isWinning: false })
      .where(eq(bids.auctionId, auctionId));

    // Set the new winning bid
    await db
      .update(bids)
      .set({ isWinning: true })
      .where(eq(bids.id, newWinningBidId));
  }

  // Rewards & Gamification Methods
  async getUserRewardPoints(userId: number): Promise<number> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user?.rewardPoints || 0;
  }

  async addRewardPoints(userId: number, points: number, reason: string, auctionId?: number): Promise<void> {
    // Update user points
    const currentUser = await this.getUser(userId);
    if (currentUser) {
      const newPoints = (currentUser.rewardPoints || 0) + points;
      await db
        .update(users)
        .set({ 
          rewardPoints: newPoints,
          totalEarned: (currentUser.totalEarned || 0) + (points > 0 ? points : 0)
        })
        .where(eq(users.id, userId));

      // Create transaction record
      await this.createRewardTransaction({
        userId,
        points,
        type: points > 0 ? 'earned' : 'spent',
        reason,
        relatedAuctionId: auctionId
      });

      // Update user level
      await this.updateUserLevel(userId);
    }
  }

  async updateUserLevel(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      const totalEarned = user.totalEarned || 0;
      let newLevel = 1;

      // Level calculation based on total points earned
      if (totalEarned >= 10000) newLevel = 10;
      else if (totalEarned >= 5000) newLevel = 9;
      else if (totalEarned >= 2500) newLevel = 8;
      else if (totalEarned >= 1000) newLevel = 7;
      else if (totalEarned >= 500) newLevel = 6;
      else if (totalEarned >= 250) newLevel = 5;
      else if (totalEarned >= 100) newLevel = 4;
      else if (totalEarned >= 50) newLevel = 3;
      else if (totalEarned >= 20) newLevel = 2;

      if (newLevel > (user.level || 1)) {
        await db
          .update(users)
          .set({ level: newLevel })
          .where(eq(users.id, userId));
      }
    }
  }

  async createRewardTransaction(transaction: InsertRewardTransaction): Promise<RewardTransaction> {
    const [created] = await db
      .insert(rewardTransactions)
      .values(transaction)
      .returning();
    return created;
  }

  async getUserTransactions(userId: number): Promise<RewardTransaction[]> {
    return await db
      .select()
      .from(rewardTransactions)
      .where(eq(rewardTransactions.userId, userId))
      .orderBy(rewardTransactions.createdAt);
  }

  // Achievement Methods
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.isActive, true));
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async checkAndUnlockAchievements(userId: number): Promise<UserAchievement[]> {
    const user = await this.getUser(userId);
    const userAchs = await this.getUserAchievements(userId);
    const allAchs = await this.getAchievements();
    const unlockedAchievements: UserAchievement[] = [];

    if (!user) return unlockedAchievements;

    for (const achievement of allAchs) {
      // Check if user already has this achievement
      const hasAchievement = userAchs.some(ua => ua.achievementId === achievement.id);
      if (hasAchievement) continue;

      let shouldUnlock = false;

      // Check achievement conditions based on category
      switch (achievement.category) {
        case 'bidding':
          // Check total bids placed
          const totalBids = await db.select().from(bids).where(eq(bids.bidderId, userId));
          shouldUnlock = totalBids.length >= achievement.pointsRequired;
          break;
        case 'points':
          shouldUnlock = (user.totalEarned || 0) >= achievement.pointsRequired;
          break;
        case 'level':
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

  async createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const [created] = await db
      .insert(userAchievements)
      .values(userAchievement)
      .returning();
    return created;
  }

  // Notification Methods
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return created;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt);
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));
  }

  async markNotificationEmailSent(notificationId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ emailSent: true })
      .where(eq(notifications.id, notificationId));
  }

  // Bid Deposits & Payment Transactions
  async createBidDeposit(insertBidDeposit: InsertBidDeposit): Promise<BidDeposit> {
    const [deposit] = await db
      .insert(bidDeposits)
      .values(insertBidDeposit)
      .returning();
    return deposit;
  }

  async updateBidDepositStatus(paymentIntentId: string, status: string): Promise<void> {
    // Find deposit by payment intent ID and update status
    const [deposit] = await db.select().from(bidDeposits).where(eq(bidDeposits.stripePaymentIntentId, paymentIntentId));
    if (deposit) {
      await db
        .update(bidDeposits)
        .set({ status, updatedAt: new Date() })
        .where(eq(bidDeposits.id, deposit.id));
    }
  }

  async createPaymentTransaction(insertPaymentTransaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [transaction] = await db
      .insert(paymentTransactions)
      .values(insertPaymentTransaction)
      .returning();
    return transaction;
  }

  async updatePaymentTransactionStatus(paymentIntentId: string, status: string): Promise<void> {
    await db
      .update(paymentTransactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(paymentTransactions.stripePaymentIntentId, paymentIntentId));
  }

  // User Verification
  async createUserVerification(insertUserVerification: InsertUserVerification): Promise<UserVerification> {
    const [verification] = await db
      .insert(userVerifications)
      .values(insertUserVerification)
      .returning();
    return verification;
  }

  async updateUserVerificationStatus(userId: number, status: string): Promise<void> {
    await db
      .update(userVerifications)
      .set({ status, updatedAt: new Date() })
      .where(eq(userVerifications.userId, userId));
  }

  // ML Recommendation System Methods
  async trackUserBehavior(insertBehavior: InsertUserBehavior): Promise<UserBehavior> {
    const [behavior] = await db
      .insert(userBehavior)
      .values(insertBehavior)
      .returning();
    return behavior;
  }

  async getUserBehavior(userId: number, actionType?: string): Promise<UserBehavior[]> {
    const conditions = [eq(userBehavior.userId, userId)];

    if (actionType) {
      conditions.push(eq(userBehavior.actionType, actionType));
    }

    return await db
      .select()
      .from(userBehavior)
      .where(and(...conditions))
      .orderBy(userBehavior.createdAt);
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences || undefined;
  }

  async createUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const [preferences] = await db
      .insert(userPreferences)
      .values(insertPreferences)
      .returning();
    return preferences;
  }

  async updateUserPreferences(userId: number, updates: Partial<InsertUserPreferences>): Promise<void> {
    await db
      .update(userPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId));
  }

  async getRecommendationsForUser(userId: number, limit: number = 10): Promise<AuctionRecommendation[]> {
    return await db
      .select()
      .from(auctionRecommendations)
      .where(eq(auctionRecommendations.userId, userId))
      .orderBy(auctionRecommendations.score)
      .limit(limit);
  }

  async createRecommendation(insertRecommendation: InsertAuctionRecommendation): Promise<AuctionRecommendation> {
    const [recommendation] = await db
      .insert(auctionRecommendations)
      .values(insertRecommendation)
      .returning();
    return recommendation;
  }

  async markRecommendationViewed(userId: number, auctionId: number): Promise<void> {
    await db
      .update(auctionRecommendations)
      .set({ isViewed: true })
      .where(
        and(
          eq(auctionRecommendations.userId, userId),
          eq(auctionRecommendations.auctionId, auctionId)
        )
      );
  }

  async markRecommendationClicked(userId: number, auctionId: number): Promise<void> {
    await db
      .update(auctionRecommendations)
      .set({ isClicked: true })
      .where(
        and(
          eq(auctionRecommendations.userId, userId),
          eq(auctionRecommendations.auctionId, auctionId)
        )
      );
  }
}

export const storage = new DatabaseStorage();