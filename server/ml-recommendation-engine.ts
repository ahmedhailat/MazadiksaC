import { 
  userBehavior, userPreferences, auctionRecommendations, auctions, categories, bids,
  type UserBehavior, type InsertUserBehavior, type UserPreferences, type InsertUserPreferences,
  type AuctionRecommendation, type InsertAuctionRecommendation, type Auction
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, gte, lte, inArray } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RecommendationContext {
  userId: number;
  sessionId?: string;
  currentAuctionId?: number;
  deviceType?: string;
}

interface RecommendationScore {
  auctionId: number;
  score: number;
  reason: string;
  type: 'trending' | 'similar' | 'personalized' | 'category';
}

export class MLRecommendationEngine {
  
  // AI-powered semantic analysis for auction descriptions
  async analyzeAuctionSemantics(auctionTitle: string, description: string): Promise<{
    keywords: string[];
    sentiment: number;
    category_confidence: number;
    appeal_score: number;
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('OpenAI semantic analysis error:', error);
      return {
        keywords: [],
        sentiment: 0.5,
        category_confidence: 0.5,
        appeal_score: 0.5
      };
    }
  }

  // Generate AI-powered personalized reasons for recommendations
  async generatePersonalizedReason(userPreferences: UserPreferences, auction: Auction): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert auction recommendation system. Generate brief, personalized reasons why a user might be interested in an auction based on their preferences. Keep responses under 50 words and engaging."
          },
          {
            role: "user",
            content: `User preferences:
- Preferred categories: ${userPreferences.preferredCategories}
- Bidding style: ${userPreferences.biddingStyle}
- Interest scores: ${userPreferences.interestScore}

Auction:
- Title: ${auction.titleEn}
- Category: ${auction.categoryId}
- Current price: ${auction.currentPrice}

Generate a personalized reason why this user would be interested in this auction.`
          }
        ],
        max_tokens: 60
      });

      return response.choices[0].message.content || 'Recommended based on your activity';
    } catch (error) {
      console.error('OpenAI personalization error:', error);
      return 'Recommended based on your preferences';
    }
  }

  // Track user behavior for ML learning
  async trackUserBehavior(behavior: InsertUserBehavior): Promise<void> {
    await db.insert(userBehavior).values({
      ...behavior,
      metadata: behavior.metadata ? JSON.stringify(behavior.metadata) : null
    });

    // Update user preferences based on behavior
    await this.updateUserPreferences(behavior.userId, behavior);
  }

  // Get or create user preferences
  async getUserPreferences(userId: number): Promise<UserPreferences | null> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    if (!preferences) {
      // Create default preferences
      const [newPreferences] = await db
        .insert(userPreferences)
        .values({
          userId,
          preferredCategories: '[]',
          interestScore: '{}',
          biddingStyle: 'conservative',
          riskTolerance: 'medium'
        })
        .returning();
      return newPreferences;
    }

    return preferences;
  }

  // Update user preferences based on behavior patterns
  private async updateUserPreferences(userId: number, behavior: InsertUserBehavior): Promise<void> {
    const preferences = await this.getUserPreferences(userId);
    if (!preferences) return;

    let preferredCategories: number[] = [];
    let interestScore: Record<string, number> = {};

    try {
      preferredCategories = JSON.parse(preferences.preferredCategories || '[]');
      interestScore = JSON.parse(preferences.interestScore || '{}');
    } catch (e) {
      console.error('Error parsing preferences JSON:', e);
    }

    // Update interest scores based on user actions
    if (behavior.categoryId) {
      const categoryKey = behavior.categoryId.toString();
      const currentScore = interestScore[categoryKey] || 0;
      
      // Weight different actions differently
      const actionWeights = {
        view: 0.1,
        click: 0.3,
        bid: 1.0,
        watch: 0.5,
        search: 0.2
      };

      const weight = actionWeights[behavior.actionType as keyof typeof actionWeights] || 0.1;
      interestScore[categoryKey] = Math.min(currentScore + weight, 5.0); // Cap at 5.0

      // Add to preferred categories if score is high enough
      if (interestScore[categoryKey] > 1.0 && !preferredCategories.includes(behavior.categoryId)) {
        preferredCategories.push(behavior.categoryId);
      }
    }

    // Update bidding style based on bid patterns
    if (behavior.actionType === 'bid') {
      const recentBids = await db
        .select()
        .from(userBehavior)
        .where(
          and(
            eq(userBehavior.userId, userId),
            eq(userBehavior.actionType, 'bid'),
            gte(userBehavior.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
          )
        )
        .limit(10);

      const bidFrequency = recentBids.length;
      let biddingStyle = 'conservative';
      
      if (bidFrequency > 15) biddingStyle = 'aggressive';
      else if (bidFrequency > 7) biddingStyle = 'strategic';

      await db
        .update(userPreferences)
        .set({
          preferredCategories: JSON.stringify(preferredCategories),
          interestScore: JSON.stringify(interestScore),
          biddingStyle,
          updatedAt: new Date()
        })
        .where(eq(userPreferences.userId, userId));
    }
  }

  // Generate personalized recommendations
  async generateRecommendations(context: RecommendationContext, limit: number = 10): Promise<RecommendationScore[]> {
    const recommendations: RecommendationScore[] = [];

    // Get user preferences
    const preferences = await this.getUserPreferences(context.userId);
    
    // 1. Content-based filtering (similar categories)
    const contentBased = await this.getContentBasedRecommendations(context, preferences, Math.ceil(limit * 0.4));
    recommendations.push(...contentBased);

    // 2. Collaborative filtering (users with similar behavior)
    const collaborative = await this.getCollaborativeRecommendations(context, Math.ceil(limit * 0.3));
    recommendations.push(...collaborative);

    // 3. Trending auctions
    const trending = await this.getTrendingRecommendations(context, Math.ceil(limit * 0.2));
    recommendations.push(...trending);

    // 4. Category diversity (explore new categories)
    const diverse = await this.getDiverseRecommendations(context, preferences, Math.ceil(limit * 0.1));
    recommendations.push(...diverse);

    // Remove duplicates and sort by score
    const uniqueRecommendations = this.removeDuplicates(recommendations);
    const sortedRecommendations = uniqueRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Store recommendations in database
    await this.storeRecommendations(context.userId, sortedRecommendations);

    return sortedRecommendations;
  }

  // Content-based filtering using user's category preferences
  private async getContentBasedRecommendations(
    context: RecommendationContext, 
    preferences: UserPreferences | null, 
    limit: number
  ): Promise<RecommendationScore[]> {
    if (!preferences) return [];

    let preferredCategories: number[] = [];
    let interestScore: Record<string, number> = {};

    try {
      preferredCategories = JSON.parse(preferences.preferredCategories || '[]');
      interestScore = JSON.parse(preferences.interestScore || '{}');
    } catch (e) {
      preferredCategories = [];
      interestScore = {};
    }

    if (preferredCategories.length === 0) return [];

    const activeAuctions = await db
      .select()
      .from(auctions)
      .where(
        and(
          inArray(auctions.categoryId, preferredCategories),
          eq(auctions.status, 'active')
        )
      )
      .limit(limit);

    return activeAuctions.map(auction => ({
      auctionId: auction.id,
      score: (interestScore[auction.categoryId.toString()] || 0.5) * 0.8,
      reason: `Based on your interest in ${this.getCategoryName(auction.categoryId)} category`,
      type: 'personalized' as const
    }));
  }

  // Collaborative filtering based on similar users
  private async getCollaborativeRecommendations(
    context: RecommendationContext, 
    limit: number
  ): Promise<RecommendationScore[]> {
    // Find users with similar bidding patterns
    const userCategories = await db
      .select({
        categoryId: userBehavior.categoryId,
        count: sql<number>`count(*)`.as('count')
      })
      .from(userBehavior)
      .where(
        and(
          eq(userBehavior.userId, context.userId),
          eq(userBehavior.actionType, 'bid')
        )
      )
      .groupBy(userBehavior.categoryId)
      .having(sql`count(*) > 0`);

    if (userCategories.length === 0) return [];

    const categoryIds = userCategories.map(c => c.categoryId).filter(Boolean) as number[];

    // Find similar users who bid in same categories
    const similarUsers = await db
      .select({
        userId: userBehavior.userId,
        sharedCategories: sql<number>`count(distinct ${userBehavior.categoryId})`.as('sharedCategories')
      })
      .from(userBehavior)
      .where(
        and(
          inArray(userBehavior.categoryId, categoryIds),
          eq(userBehavior.actionType, 'bid'),
          sql`${userBehavior.userId} != ${context.userId}`
        )
      )
      .groupBy(userBehavior.userId)
      .having(sql`count(distinct ${userBehavior.categoryId}) >= 2`)
      .limit(10);

    if (similarUsers.length === 0) return [];

    const similarUserIds = similarUsers.map(u => u.userId);

    // Get auctions that similar users have bid on
    const recommendedAuctions = await db
      .select({
        auctionId: userBehavior.auctionId,
        bidCount: sql<number>`count(*)`.as('bidCount')
      })
      .from(userBehavior)
      .where(
        and(
          inArray(userBehavior.userId, similarUserIds),
          eq(userBehavior.actionType, 'bid'),
          sql`${userBehavior.auctionId} IS NOT NULL`
        )
      )
      .groupBy(userBehavior.auctionId)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);

    return recommendedAuctions.map(item => ({
      auctionId: item.auctionId!,
      score: Math.min(item.bidCount * 0.15, 0.9),
      reason: 'Users with similar interests also bid on this auction',
      type: 'similar' as const
    }));
  }

  // Get trending auctions based on recent activity
  private async getTrendingRecommendations(
    context: RecommendationContext, 
    limit: number
  ): Promise<RecommendationScore[]> {
    const trendingAuctions = await db
      .select({
        auctionId: userBehavior.auctionId,
        activityScore: sql<number>`count(*) + sum(case when ${userBehavior.actionType} = 'bid' then 3 when ${userBehavior.actionType} = 'view' then 1 else 2 end)`.as('activityScore')
      })
      .from(userBehavior)
      .where(
        and(
          gte(userBehavior.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)), // Last 24 hours
          sql`${userBehavior.auctionId} IS NOT NULL`
        )
      )
      .groupBy(userBehavior.auctionId)
      .orderBy(desc(sql`count(*) + sum(case when ${userBehavior.actionType} = 'bid' then 3 when ${userBehavior.actionType} = 'view' then 1 else 2 end)`))
      .limit(limit);

    return trendingAuctions.map(item => ({
      auctionId: item.auctionId!,
      score: Math.min(item.activityScore * 0.1, 0.8),
      reason: 'Currently trending with high user activity',
      type: 'trending' as const
    }));
  }

  // Get diverse recommendations to help users explore new categories
  private async getDiverseRecommendations(
    context: RecommendationContext, 
    preferences: UserPreferences | null, 
    limit: number
  ): Promise<RecommendationScore[]> {
    let preferredCategories: number[] = [];
    
    try {
      preferredCategories = JSON.parse(preferences?.preferredCategories || '[]');
    } catch (e) {
      preferredCategories = [];
    }

    // Get categories user hasn't explored much
    const allCategories = await db.select().from(categories).where(eq(categories.isActive, true));
    const unexploredCategories = allCategories.filter(cat => !preferredCategories.includes(cat.id));

    if (unexploredCategories.length === 0) return [];

    const diverseAuctions = await db
      .select()
      .from(auctions)
      .where(
        and(
          inArray(auctions.categoryId, unexploredCategories.map(c => c.id)),
          eq(auctions.status, 'active'),
          eq(auctions.featured, true) // Only recommend featured auctions for exploration
        )
      )
      .limit(limit);

    return diverseAuctions.map(auction => ({
      auctionId: auction.id,
      score: 0.6, // Medium score for exploration
      reason: `Explore ${this.getCategoryName(auction.categoryId)} category`,
      type: 'category' as const
    }));
  }

  // Store recommendations in database
  private async storeRecommendations(userId: number, recommendations: RecommendationScore[]): Promise<void> {
    if (recommendations.length === 0) return;

    // Clear old recommendations
    await db
      .delete(auctionRecommendations)
      .where(eq(auctionRecommendations.userId, userId));

    // Insert new recommendations
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
  private removeDuplicates(recommendations: RecommendationScore[]): RecommendationScore[] {
    const seen = new Set<number>();
    return recommendations.filter(rec => {
      if (seen.has(rec.auctionId)) return false;
      seen.add(rec.auctionId);
      return true;
    });
  }

  // Helper method to get category name (placeholder - would integrate with actual categories)
  private getCategoryName(categoryId: number): string {
    const categoryNames: Record<number, string> = {
      1: 'السيارات',
      2: 'الإلكترونيات', 
      3: 'المجوهرات',
      4: 'العقارات',
      5: 'الأثاث'
    };
    return categoryNames[categoryId] || 'فئة أخرى';
  }

  // Get recommendations for a specific user
  async getRecommendationsForUser(userId: number, limit: number = 10): Promise<(AuctionRecommendation & { auction: Auction })[]> {
    const recommendations = await db
      .select({
        recommendation: auctionRecommendations,
        auction: auctions
      })
      .from(auctionRecommendations)
      .innerJoin(auctions, eq(auctionRecommendations.auctionId, auctions.id))
      .where(eq(auctionRecommendations.userId, userId))
      .orderBy(desc(auctionRecommendations.score))
      .limit(limit);

    return recommendations.map(item => ({
      ...item.recommendation,
      auction: item.auction
    }));
  }

  // Mark recommendation as viewed
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

  // Mark recommendation as clicked
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

export const mlRecommendationEngine = new MLRecommendationEngine();