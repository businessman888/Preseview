import { 
  users, 
  creatorProfiles,
  posts,
  stories,
  subscriptions,
  follows,
  likes,
  bookmarks,
  comments,
  messages,
  tips,
  notifications,
  storyViews,
  searchHistory,
  trendingHashtags,
  paymentMethods,
  transactions,
  notificationPreferences,
  privacySettings,
  blockedUsers,
  type User, 
  type InsertUser,
  type CreatorProfile,
  type InsertCreatorProfile,
  type Post,
  type InsertPost,
  type Story,
  type InsertStory,
  type Subscription,
  type InsertSubscription,
  type Follow,
  type InsertFollow,
  type Like,
  type InsertLike,
  type Bookmark,
  type InsertBookmark,
  type Comment,
  type InsertComment,
  type Message,
  type InsertMessage,
  type Tip,
  type InsertTip,
  type Notification,
  type InsertNotification,
  type StoryView,
  type InsertStoryView,
  type SearchHistory,
  type InsertSearchHistory,
  type TrendingHashtag,
  type InsertTrendingHashtag,
  type PaymentMethod,
  type InsertPaymentMethod,
  type Transaction,
  type InsertTransaction,
  type NotificationPreferences,
  type InsertNotificationPreferences,
  type PrivacySettings,
  type InsertPrivacySettings,
  type BlockedUser,
  type InsertBlockedUser
} from "@shared/schema";
import { supabase } from "./supabaseClient";
import { db } from "./db";
import { eq, desc, asc, and, or, like, sql, gte, lte, count } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

// Public user type without sensitive fields
export type PublicUser = Omit<User, 'password'>;

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserProfile(userId: number, data: { bio?: string; profileImage?: string; coverImage?: string }): Promise<User>;
  upgradeToCreator(userId: number, profileData?: Partial<InsertCreatorProfile>): Promise<{ user: User, profile: CreatorProfile }>;
  
  // Creator Profiles
  getCreatorProfile(userId: number, viewerUserId?: number): Promise<(PublicUser & { creatorProfile?: CreatorProfile, isFollowing: boolean, isSubscribed: boolean }) | undefined>;
  createCreatorProfile(profile: InsertCreatorProfile): Promise<CreatorProfile>;
  updateCreatorProfile(userId: number, profile: Partial<InsertCreatorProfile>): Promise<CreatorProfile | undefined>;
  getCreators(limit?: number, offset?: number): Promise<CreatorProfile[]>;
  searchCreators(query: string, limit?: number): Promise<(CreatorProfile & { user: User })[]>;
  getSuggestedCreators(viewerUserId: number, limit?: number): Promise<(PublicUser & { creatorProfile?: CreatorProfile, isFollowing: boolean })[]>;
  
  // Posts
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getPostById(id: number): Promise<Post | undefined>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  getPostsByCreator(creatorId: number, limit?: number, offset?: number): Promise<Post[]>;
  getFeedPosts(userId: number, limit?: number, offset?: number): Promise<(Post & { creator: User, isLiked: boolean, isBookmarked: boolean })[]>;
  updatePostStats(postId: number, type: 'like' | 'comment' | 'view', increment: boolean): Promise<void>;
  deletePost(id: number, creatorId: number): Promise<boolean>;
  
  // Stories
  createStory(story: InsertStory): Promise<Story>;
  getActiveStories(userId: number): Promise<(Story & { creator: User, isViewed: boolean })[]>;
  viewStory(storyId: number, userId: number): Promise<void>;
  getCreatorStories(creatorId: number): Promise<Story[]>;
  deleteExpiredStories(): Promise<void>;
  
  // Subscriptions
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscription(userId: number, creatorId: number): Promise<Subscription | undefined>;
  getUserSubscriptions(userId: number): Promise<(Subscription & { creator: User })[]>;
  getCreatorSubscriptions(creatorId: number): Promise<(Subscription & { user: User })[]>;
  updateSubscriptionStatus(id: number, status: 'active' | 'expired' | 'cancelled'): Promise<void>;
  
  // Follows
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followingId: number): Promise<boolean>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  getFollowers(userId: number, limit?: number): Promise<(Follow & { follower: User })[]>;
  getFollowing(userId: number, limit?: number): Promise<(Follow & { following: User })[]>;
  
  // Likes
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(userId: number, postId: number): Promise<boolean>;
  isLiked(userId: number, postId: number): Promise<boolean>;
  getPostLikes(postId: number, limit?: number): Promise<(Like & { user: User })[]>;
  
  // Bookmarks
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(userId: number, postId: number): Promise<boolean>;
  isBookmarked(userId: number, postId: number): Promise<boolean>;
  getUserBookmarks(userId: number, limit?: number): Promise<(Bookmark & { post: Post & { creator: User } })[]>;
  
  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: number, limit?: number): Promise<(Comment & { user: User })[]>;
  deleteComment(id: number, userId: number): Promise<boolean>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getConversations(userId: number): Promise<{ 
    otherUser: User, 
    lastMessage: Message, 
    unreadCount: number 
  }[]>;
  getConversationMessages(userId: number, otherUserId: number, limit?: number): Promise<Message[]>;
  markMessagesAsRead(userId: number, otherUserId: number): Promise<void>;
  
  // Tips
  createTip(tip: InsertTip): Promise<Tip>;
  getUserTips(userId: number, type: 'sent' | 'received', limit?: number): Promise<(Tip & { 
    sender: User, 
    receiver: User,
    post?: Post 
  })[]>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number, limit?: number): Promise<(Notification & { 
    triggeredByUser?: User 
  })[]>;
  markNotificationAsRead(id: number, userId: number): Promise<void>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  getUnreadNotificationCount(userId: number): Promise<number>;
  
  // Search
  addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  getUserSearchHistory(userId: number, limit?: number): Promise<SearchHistory[]>;
  updateTrendingHashtag(hashtag: string): Promise<void>;
  getTrendingHashtags(limit?: number): Promise<TrendingHashtag[]>;
  
  // Notification Preferences
  getNotificationPreferences(userId: number): Promise<NotificationPreferences | undefined>;
  updateNotificationPreferences(userId: number, preferences: Partial<InsertNotificationPreferences>): Promise<NotificationPreferences>;
  
  // Privacy Settings
  getPrivacySettings(userId: number): Promise<PrivacySettings | undefined>;
  updatePrivacySettings(userId: number, settings: Partial<InsertPrivacySettings>): Promise<PrivacySettings>;
  
  // Account Management
  updateUserEmail(userId: number, email: string): Promise<User | undefined>;
  updateUserPassword(userId: number, password: string): Promise<void>;
  deleteUser(userId: number): Promise<boolean>;
  
  // Creator Dashboard
  getCreatorStats(creatorId: number): Promise<{ subscriberCount: number; postCount: number; likesCount: number; totalEarnings: number }>;
  getCreatorProgress(creatorId: number): Promise<{ current: number; goal: number; percentage: number }>;
  getCreatorBadges(creatorId: number): Promise<Array<{ id: number; name: string; description: string; icon: string; unlocked: boolean }>>;
  
  // Statistics
  getCreatorEarnings(creatorId: number, period?: string, type?: string): Promise<{
    total: number;
    thisMonth: number;
    topPercentage: number;
    data: Array<{ date: string; amount: number }>;
    period: string;
    type: string;
  }>;
  getTopSpenders(creatorId: number, limit?: number): Promise<Array<{
    userId: number;
    username: string;
    displayName: string;
    avatar: string;
    totalSpent: number;
    lastTransaction: string;
  }>>;
  getRecentTransactions(creatorId: number, limit?: number): Promise<Array<{
    id: number;
    userId: number;
    username: string;
    displayName: string;
    amount: number;
    type: string;
    createdAt: string;
    isLive: boolean;
  }>>;
  getMonthlyEarnings(creatorId: number, year?: number): Promise<Array<{
    month: string;
    monthNumber: number;
    amount: number;
    subscribers: number;
    posts: number;
  }>>;
  getSubscribersStats(creatorId: number, period?: string): Promise<{
    total: number;
    active: number;
    new: number;
    churned: number;
    data: Array<{ date: string; count: number; new: number; churned: number }>;
  }>;
  getContentStats(creatorId: number, period?: string): Promise<{
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    averageViews: number;
    data: Array<{ date: string; posts: number; views: number; likes: number; comments: number }>;
  }>;
  getSubscribersList(creatorId: number, page?: number, limit?: number): Promise<{
    subscribers: Array<{
      id: number;
      userId: number;
      username: string;
      displayName: string;
      avatar: string;
      subscriptionDate: string;
      amount: number;
      status: 'active' | 'cancelled';
    }>;
    total: number;
    page: number;
    totalPages: number;
  }>;
  
  // Vault functions
  getCreatorVaultContent(creatorId: number, filters?: {
    type?: 'all' | 'images' | 'videos' | 'audios',
    folderId?: number | null,
    search?: string,
    page?: number,
    limit?: number
  }): Promise<{
    content: Array<{
      id: number,
      title: string,
      mediaUrl: string,
      mediaType: 'image' | 'video' | 'audio',
      thumbnail: string,
      views: number,
      likes: number,
      comments: number,
      gifts: number,
      createdAt: string,
      folderId: number | null
    }>,
    total: number,
    page: number,
    totalPages: number
  }>;
  getCreatorFolders(creatorId: number): Promise<Array<{
    id: number,
    name: string,
    contentCount: number,
    createdAt: string
  }>>;
  createFolder(creatorId: number, name: string): Promise<any>;
  moveContentToFolder(contentId: number, folderId: number | null): Promise<void>;
  deleteContent(contentId: number, creatorId: number): Promise<boolean>;
  
  // Payment Methods
  getPaymentMethods(userId: number): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  deletePaymentMethod(id: number, userId: number): Promise<boolean>;
  setDefaultPaymentMethod(id: number, userId: number): Promise<void>;
  
  // Transactions
  getUserTransactions(userId: number, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Blocked Users
  getBlockedUsers(userId: number): Promise<(BlockedUser & { blocked: User })[]>;
  blockUser(blockerId: number, blockedId: number): Promise<BlockedUser>;
  unblockUser(blockerId: number, blockedId: number): Promise<boolean>;
  isBlocked(blockerId: number, blockedId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // ⚠️ Desativando session store local (pool) temporariamente
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL || "",
      createTableIfMissing: true,
    });
  }
  

  // Users
  async getUser(id: number): Promise<User | undefined> {
    try {
      // Migrado para Supabase para evitar dependência de "db" no deserialize do passport
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error in getUser:', error);
        return undefined;
      }

      return (data as unknown) as User;
    } catch (error) {
      console.error('Error in getUser:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      if (error) return undefined;
      return (data as unknown) as User;
    } catch (error) {
      console.error("Error in getUserByUsername:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      if (error) return undefined;
      return (data as unknown) as User;
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      return undefined;
    }
  }
  // 📌 Função para listar todos os usuários
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await db.select().from(users);
      return result;
    } catch (error) {
      console.error("❌ Erro ao buscar todos os usuários:", error);
      throw new Error("Erro ao buscar usuários");
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const payload: any = {
      ...insertUser,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('users')
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.error('❌ Erro ao criar usuário no Supabase:', error);
      throw error;
    }
    return (data as unknown) as User;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserProfile(userId: number, data: { bio?: string; profileImage?: string; coverImage?: string }): Promise<User> {
    const updateData: any = { updatedAt: new Date() };
    
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  async getCreatorInsights(creatorId: number) {
    // Get all posts by creator
    const creatorPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, creatorId));

    // Count subscribers
    const subscriptions = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.creatorId, creatorId));

    // Count likes
    const likes = await db
      .select()
      .from(postLikes)
      .innerJoin(posts, eq(posts.id, postLikes.postId))
      .where(eq(posts.userId, creatorId));

    // Get creator profile for subscription price
    const [creatorProfile] = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, creatorId));

    const totalPosts = creatorPosts.length;
    const totalImages = creatorPosts.filter(p => p.mediaType === 'image').length;
    const totalVideos = creatorPosts.filter(p => p.mediaType === 'video').length;
    const totalLikes = likes.length;
    const totalSubscribers = subscriptions.filter(s => s.status === 'active').length;

    // Calculate subscribers growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSubscribers = subscriptions.filter(
      s => s.status === 'active' && new Date(s.createdAt) >= thirtyDaysAgo
    ).length;

    // Calculate monthly revenue
    const monthlyRevenue = totalSubscribers * (creatorProfile?.subscriptionPrice || 0);

    return {
      totalSubscribers,
      totalPosts,
      totalLikes,
      totalImages,
      totalVideos,
      avgLikesPerPost: totalPosts > 0 ? totalLikes / totalPosts : 0,
      subscribersGrowth: recentSubscribers,
      monthlyRevenue,
    };
  }

  async getCreatorProfile(userId: number): Promise<CreatorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, userId));
    return profile || undefined;
  }

  async updateSubscriptionPrice(userId: number, subscriptionPrice: number): Promise<CreatorProfile> {
    const [profile] = await db
      .update(creatorProfiles)
      .set({ 
        subscriptionPrice,
        updatedAt: new Date(),
      })
      .where(eq(creatorProfiles.userId, userId))
      .returning();
    
    if (!profile) throw new Error("Perfil de criador não encontrado");
    return profile;
  }

  async upgradeToCreator(userId: number, profileData?: Partial<InsertCreatorProfile>): Promise<{ user: User, profile: CreatorProfile }> {
    // Update user type to creator using Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .update({ 
        user_type: 'creator',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (userError || !user) {
      console.error('Error updating user to creator:', userError);
      throw new Error("Usuário não encontrado");
    }

    // Create creator profile using Supabase
    const { data: profile, error: profileError } = await supabase
      .from('creator_profiles')
      .insert({
        user_id: userId,
        subscription_price: profileData?.subscriptionPrice || 0,
        description: profileData?.description || null,
        categories: profileData?.categories || [],
        social_links: profileData?.socialLinks || [],
        is_active: profileData?.isActive ?? true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError || !profile) {
      console.error('Error creating creator profile:', profileError);
      throw new Error("Erro ao criar perfil de criador");
    }

    return { user, profile };
  }

  // Creator Profiles
  async getCreatorProfile(userId: number, viewerUserId?: number): Promise<(PublicUser & { creatorProfile?: CreatorProfile, isFollowing: boolean, isSubscribed: boolean }) | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return undefined;

    const [profile] = await db.select().from(creatorProfiles).where(eq(creatorProfiles.userId, userId));
    
    let isFollowing = false;
    let isSubscribed = false;

    if (viewerUserId && viewerUserId !== userId) {
      isFollowing = await this.isFollowing(viewerUserId, userId);
      
      const subscription = await this.getSubscription(viewerUserId, userId);
      isSubscribed = subscription?.status === 'active' || false;
    }

    // Return sanitized user object without sensitive fields
    const { password, ...safeUserData } = user;
    
    return {
      ...safeUserData,
      creatorProfile: profile || undefined,
      isFollowing,
      isSubscribed,
    };
  }

  async createCreatorProfile(profile: InsertCreatorProfile): Promise<CreatorProfile> {
    const [creatorProfile] = await db
      .insert(creatorProfiles)
      .values(profile)
      .returning();
    
    // Update user type to creator
    await db
      .update(users)
      .set({ userType: 'creator' })
      .where(eq(users.id, profile.userId));
    
    return creatorProfile;
  }

  async updateCreatorProfile(userId: number, profileData: Partial<InsertCreatorProfile>): Promise<CreatorProfile | undefined> {
    const [profile] = await db
      .update(creatorProfiles)
      .set(profileData)
      .where(eq(creatorProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async getCreators(limit = 20, offset = 0): Promise<CreatorProfile[]> {
    return await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.isActive, true))
      .orderBy(desc(creatorProfiles.subscriberCount))
      .limit(limit)
      .offset(offset);
  }

  async searchCreators(query: string, limit = 20): 
  Promise<(CreatorProfile & { user: User })[]> { 
    const results = await db 
    .select() 
    .from(creatorProfiles) 
    .innerJoin(users, eq(creatorProfiles.userId, users.id)) 
    .where( 
      and( 
        eq(creatorProfiles.isActive, true), 
        or( like(users.display_name, `%${query}%`),
        like(users.username, `%${query}%`),
        like(creatorProfiles.description, `%${query}%`)        
         ) 
        ) 
      ) 
      .limit(limit);

    return results.map(row => ({
      ...row.creator_profiles,
      user: row.users,
    }));
  }

  async getSuggestedCreators(viewerUserId: number, limit = 6): Promise<(PublicUser & { creatorProfile?: CreatorProfile, isFollowing: boolean })[]> {
    // Get creators that the viewer is not already following
    const results = await db
      .select()
      .from(users)
      .leftJoin(creatorProfiles, eq(users.id, creatorProfiles.userId))
      .where(
        and(
          eq(users.user_type, 'creator'),
          sql`${users.id} NOT IN (
            SELECT ${follows.followingId} 
            FROM ${follows} 
            WHERE ${follows.followerId} = ${viewerUserId}
          )`,
          sql`${users.id} != ${viewerUserId}`
        )
      )
      .orderBy(desc(creatorProfiles.subscriberCount))
      .limit(limit);

    return Promise.all(results.map(async (row) => {
      const isFollowing = await this.isFollowing(viewerUserId, row.users.id);
      // Return sanitized user object without sensitive fields
      const { password, ...safeUserData } = row.users;
      return {
        ...safeUserData,
        creatorProfile: row.creator_profiles || undefined,
        isFollowing,
      };
    }));
  }

  // Posts
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values({
        ...post,
        updatedAt: new Date(),
      })
      .returning();
    
    // Update creator post count
    await db
      .update(creatorProfiles)
      .set({ 
        postCount: sql`${creatorProfiles.postCount} + 1`
      })
      .where(eq(creatorProfiles.userId, post.creatorId));
    
    return newPost;
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const [updatedPost] = await db
      .update(posts)
      .set({
        ...post,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    
    return updatedPost || undefined;
  }

  async getPostsByCreator(creatorId: any, limit = 20, offset = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) {
      console.error('Error fetching posts by creator:', error);
      return [];
    }
    return (data as unknown) as Post[];
  }

  async getFeedPosts(userId: number, limit = 20, offset = 0): Promise<(Post & { creator: User, isLiked: boolean, isBookmarked: boolean })[]> {
    // Get posts from followed creators and subscribed creators
    const feedPosts = await db
      .select({
        post: posts,
        creator: users,
        isLiked: sql<boolean>`CASE WHEN ${likes.id} IS NOT NULL THEN true ELSE false END`,
        isBookmarked: sql<boolean>`CASE WHEN ${bookmarks.id} IS NOT NULL THEN true ELSE false END`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.creatorId, users.id))
      .leftJoin(follows, and(eq(follows.followingId, posts.creatorId), eq(follows.followerId, userId)))
      .leftJoin(subscriptions, and(eq(subscriptions.creatorId, posts.creatorId), eq(subscriptions.userId, userId)))
      .leftJoin(likes, and(eq(likes.postId, posts.id), eq(likes.userId, userId)))
      .leftJoin(bookmarks, and(eq(bookmarks.postId, posts.id), eq(bookmarks.userId, userId)))
      .where(
        or(
          sql`${follows.id} IS NOT NULL`,
          and(eq(subscriptions.userId, userId), eq(subscriptions.status, 'active'))
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return feedPosts.map(row => ({
      ...row.post,
      creator: row.creator,
      isLiked: row.isLiked,
      isBookmarked: row.isBookmarked,
    }));
  }

  async updatePostStats(postId: number, type: 'like' | 'comment' | 'view', increment: boolean): Promise<void> {
    const delta = increment ? 1 : -1;
    
    switch (type) {
      case 'like':
        await db
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} + ${delta}` })
          .where(eq(posts.id, postId));
        break;
      case 'comment':
        await db
          .update(posts)
          .set({ commentsCount: sql`${posts.commentsCount} + ${delta}` })
          .where(eq(posts.id, postId));
        break;
      case 'view':
        if (increment) {
          await db
            .update(posts)
            .set({ viewsCount: sql`${posts.viewsCount} + 1` })
            .where(eq(posts.id, postId));
        }
        break;
    }
  }

  async deletePost(id: number, creatorId: number): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(and(eq(posts.id, id), eq(posts.creatorId, creatorId)))
      .returning();
    
    if (result.length > 0) {
      // Update creator post count
      await db
        .update(creatorProfiles)
        .set({ 
          postCount: sql`${creatorProfiles.postCount} - 1`
        })
        .where(eq(creatorProfiles.userId, creatorId));
      return true;
    }
    return false;
  }

  // Stories
  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db
      .insert(stories)
      .values(story)
      .returning();
    return newStory;
  }

  async getActiveStories(userId: number): Promise<(Story & { creator: User, isViewed: boolean })[]> {
    const activeStories = await db
      .select({
        story: stories,
        creator: users,
        isViewed: sql<boolean>`CASE WHEN ${storyViews.id} IS NOT NULL THEN true ELSE false END`,
      })
      .from(stories)
      .innerJoin(users, eq(stories.creatorId, users.id))
      .leftJoin(follows, and(eq(follows.followingId, stories.creatorId), eq(follows.followerId, userId)))
      .leftJoin(subscriptions, and(eq(subscriptions.creatorId, stories.creatorId), eq(subscriptions.userId, userId)))
      .leftJoin(storyViews, and(eq(storyViews.storyId, stories.id), eq(storyViews.userId, userId)))
      .where(
        and(
          gte(stories.expiresAt, new Date()),
          or(
            eq(follows.followerId, userId),
            and(eq(subscriptions.userId, userId), eq(subscriptions.status, 'active'))
          )
        )
      )
      .orderBy(desc(stories.createdAt));

    return activeStories.map(row => ({
      ...row.story,
      creator: row.creator,
      isViewed: row.isViewed,
    }));
  }

  async viewStory(storyId: number, userId: number): Promise<void> {
    // Insert story view
    await db
      .insert(storyViews)
      .values({ storyId, userId })
      .onConflictDoNothing();
    
    // Update story views count
    await db
      .update(stories)
      .set({ viewsCount: sql`${stories.viewsCount} + 1` })
      .where(eq(stories.id, storyId));
  }

  async getCreatorStories(creatorId: number): Promise<Story[]> {
    return await db
      .select()
      .from(stories)
      .where(and(eq(stories.creatorId, creatorId), gte(stories.expiresAt, new Date())))
      .orderBy(desc(stories.createdAt));
  }

  async deleteExpiredStories(): Promise<void> {
    await db
      .delete(stories)
      .where(lte(stories.expiresAt, new Date()));
  }

  // Subscriptions
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    
    // Update creator subscriber count
    await db
      .update(creatorProfiles)
      .set({ 
        subscriberCount: sql`${creatorProfiles.subscriberCount} + 1`
      })
      .where(eq(creatorProfiles.userId, subscription.creatorId));
    
    return newSubscription;
  }

  async getSubscription(userId: number, creatorId: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.userId, userId), eq(subscriptions.creatorId, creatorId)))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);
    return subscription || undefined;
  }

  async getUserSubscriptions(userId: number): Promise<(Subscription & { creator: User })[]> {
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.creatorId, users.id))
      .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, 'active')))
      .orderBy(desc(subscriptions.startDate));

    return userSubscriptions.map(row => ({
      ...row.subscriptions,
      creator: row.users,
    }));
  }

  async getCreatorSubscriptions(creatorId: number): Promise<(Subscription & { user: User })[]> {
    const creatorSubscriptions = await db
      .select()
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.userId, users.id))
      .where(and(eq(subscriptions.creatorId, creatorId), eq(subscriptions.status, 'active')))
      .orderBy(desc(subscriptions.startDate));

    return creatorSubscriptions.map(row => ({
      ...row.subscriptions,
      user: row.users,
    }));
  }

  async updateSubscriptionStatus(id: number, status: 'active' | 'expired' | 'cancelled'): Promise<void> {
    await db
      .update(subscriptions)
      .set({ status })
      .where(eq(subscriptions.id, id));
  }

  // Follows
  async createFollow(follow: InsertFollow): Promise<Follow> {
    const [newFollow] = await db
      .insert(follows)
      .values(follow)
      .returning();
    return newFollow;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<boolean> {
    const result = await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .returning();
    return result.length > 0;
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const [follow] = await db
      .select({ id: follows.id })
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .limit(1);
    return !!follow;
  }

  async getFollowers(userId: number, limit = 20): Promise<(Follow & { follower: User })[]> {
    const followers = await db
      .select()
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId))
      .orderBy(desc(follows.createdAt))
      .limit(limit);

    return followers.map(row => ({
      ...row.follows,
      follower: row.users,
    }));
  }

  async getFollowing(userId: number, limit = 20): Promise<(Follow & { following: User })[]> {
    const following = await db
      .select()
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId))
      .orderBy(desc(follows.createdAt))
      .limit(limit);

    return following.map(row => ({
      ...row.follows,
      following: row.users,
    }));
  }

  // Likes
  async createLike(like: InsertLike): Promise<Like> {
    const [newLike] = await db
      .insert(likes)
      .values(like)
      .returning();
    
    // Update post likes count
    await this.updatePostStats(like.postId, 'like', true);
    
    return newLike;
  }

  async deleteLike(userId: number, postId: number): Promise<boolean> {
    const result = await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
      .returning();
    
    if (result.length > 0) {
      // Update post likes count
      await this.updatePostStats(postId, 'like', false);
      return true;
    }
    return false;
  }

  async isLiked(userId: number, postId: number): Promise<boolean> {
    const [like] = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
      .limit(1);
    return !!like;
  }

  async getPostLikes(postId: number, limit = 20): Promise<(Like & { user: User })[]> {
    const postLikes = await db
      .select()
      .from(likes)
      .innerJoin(users, eq(likes.userId, users.id))
      .where(eq(likes.postId, postId))
      .orderBy(desc(likes.createdAt))
      .limit(limit);

    return postLikes.map(row => ({
      ...row.likes,
      user: row.users,
    }));
  }

  // Bookmarks
  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const [newBookmark] = await db
      .insert(bookmarks)
      .values(bookmark)
      .returning();
    return newBookmark;
  }

  async deleteBookmark(userId: number, postId: number): Promise<boolean> {
    const result = await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)))
      .returning();
    return result.length > 0;
  }

  async isBookmarked(userId: number, postId: number): Promise<boolean> {
    const [bookmark] = await db
      .select({ id: bookmarks.id })
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)))
      .limit(1);
    return !!bookmark;
  }

  async getUserBookmarks(userId: number, limit = 20): Promise<(Bookmark & { post: Post & { creator: User } })[]> {
    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .innerJoin(posts, eq(bookmarks.postId, posts.id))
      .innerJoin(users, eq(posts.creatorId, users.id))
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt))
      .limit(limit);

    return userBookmarks.map(row => ({
      ...row.bookmarks,
      post: {
        ...row.posts,
        creator: row.users,
      },
    }));
  }

  // Comments
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    
    // Update post comments count
    await this.updatePostStats(comment.postId, 'comment', true);
    
    return newComment;
  }

  async getPostComments(postId: number, limit = 20): Promise<(Comment & { user: User })[]> {
    const postComments = await db
      .select()
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt))
      .limit(limit);

    return postComments.map(row => ({
      ...row.comments,
      user: row.users,
    }));
  }

  async deleteComment(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.userId, userId)))
      .returning();
    
    if (result.length > 0) {
      // Update post comments count
      const comment = result[0];
      await this.updatePostStats(comment.postId, 'comment', false);
      return true;
    }
    return false;
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getConversations(userId: number): Promise<{ 
    otherUser: User, 
    lastMessage: Message, 
    unreadCount: number 
  }[]> {
    const conversations = await db
      .select({
        otherUser: users,
        lastMessage: messages,
        unreadCount: sql<number>`COUNT(CASE WHEN ${messages.isRead} = false AND ${messages.receiverId} = ${userId} THEN 1 END)`,
      })
      .from(messages)
      .innerJoin(users, 
        sql`${users.id} = CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId}
          ELSE ${messages.senderId}
        END`
      )
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .groupBy(users.id, messages.id)
      .orderBy(desc(messages.createdAt));

    return conversations;
  }

  async getConversationMessages(userId: number, otherUserId: number, limit = 50): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async markMessagesAsRead(userId: number, otherUserId: number): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.senderId, otherUserId),
          eq(messages.receiverId, userId),
          eq(messages.isRead, false)
        )
      );
  }

  // Tips
  async createTip(tip: InsertTip): Promise<Tip> {
    const [newTip] = await db
      .insert(tips)
      .values(tip)
      .returning();
    
    // Update creator earnings
    await db
      .update(creatorProfiles)
      .set({ 
        totalEarnings: sql`${creatorProfiles.totalEarnings} + ${tip.amount}`
      })
      .where(eq(creatorProfiles.userId, tip.receiverId));
    
    return newTip;
  }

  async getUserTips(userId: number, type: 'sent' | 'received', limit = 20): Promise<(Tip & { 
    sender: User, 
    receiver: User,
    post?: Post 
  })[]> {
    const userTips = await db
      .select()
      .from(tips)
      .innerJoin(users, type === 'sent' ? eq(tips.receiverId, users.id) : eq(tips.senderId, users.id))
      .leftJoin(posts, eq(tips.postId, posts.id))
      .where(type === 'sent' ? eq(tips.senderId, userId) : eq(tips.receiverId, userId))
      .orderBy(desc(tips.createdAt))
      .limit(limit);

    return userTips.map(row => ({
      ...row.tips,
      sender: type === 'sent' ? { id: userId } as User : row.users,
      receiver: type === 'received' ? { id: userId } as User : row.users,
      post: row.posts || undefined,
    }));
  }

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: number, limit = 50): Promise<(Notification & { 
    triggeredByUser?: User 
  })[]> {
    const userNotifications = await db
      .select()
      .from(notifications)
      .leftJoin(users, eq(notifications.triggeredByUserId, users.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    return userNotifications.map(row => ({
      ...row.notifications,
      triggeredByUser: row.users || undefined,
    }));
  }

  async markNotificationAsRead(id: number, userId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }

  async getUnreadNotificationCount(userId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result?.count || 0;
  }

  // Search
  async addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory> {
    const [newSearch] = await db
      .insert(searchHistory)
      .values(search)
      .returning();
    return newSearch;
  }

  async getUserSearchHistory(userId: number, limit = 10): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);
  }

  async updateTrendingHashtag(hashtag: string): Promise<void> {
    await db
      .insert(trendingHashtags)
      .values({ hashtag, count: 1 })
      .onConflictDoUpdate({
        target: trendingHashtags.hashtag,
        set: { 
          count: sql`${trendingHashtags.count} + 1`,
          updatedAt: new Date()
        }
      });
  }

  async getTrendingHashtags(limit = 10): Promise<TrendingHashtag[]> {
    return await db
      .select()
      .from(trendingHashtags)
      .orderBy(desc(trendingHashtags.count))
      .limit(limit);
  }

  // Notification Preferences
  async getNotificationPreferences(userId: number): Promise<NotificationPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));
    
    if (!preferences) {
      const [newPreferences] = await db
        .insert(notificationPreferences)
        .values({ userId })
        .returning();
      return newPreferences;
    }
    
    return preferences;
  }

  async updateNotificationPreferences(userId: number, preferencesData: Partial<InsertNotificationPreferences>): Promise<NotificationPreferences> {
    await this.getNotificationPreferences(userId);
    
    const [updated] = await db
      .update(notificationPreferences)
      .set({ ...preferencesData, updatedAt: new Date() })
      .where(eq(notificationPreferences.userId, userId))
      .returning();
    
    return updated;
  }

  // Privacy Settings
  async getPrivacySettings(userId: number): Promise<PrivacySettings | undefined> {
    const [settings] = await db
      .select()
      .from(privacySettings)
      .where(eq(privacySettings.userId, userId));
    
    if (!settings) {
      const [newSettings] = await db
        .insert(privacySettings)
        .values({ userId })
        .returning();
      return newSettings;
    }
    
    return settings;
  }

  async updatePrivacySettings(userId: number, settingsData: Partial<InsertPrivacySettings>): Promise<PrivacySettings> {
    await this.getPrivacySettings(userId);
    
    const [updated] = await db
      .update(privacySettings)
      .set({ ...settingsData, updatedAt: new Date() })
      .where(eq(privacySettings.userId, userId))
      .returning();
    
    return updated;
  }

  // Account Management
  async updateUserEmail(userId: number, email: string): Promise<User | undefined> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      throw new Error("Este email já está em uso");
    }

    const [user] = await db
      .update(users)
      .set({ email, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    return user || undefined;
  }

  async updateUserPassword(userId: number, password: string): Promise<void> {
    await db
      .update(users)
      .set({ password, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Creator Dashboard
  async getCreatorStats(creatorId: any): Promise<{ subscriberCount: number; postCount: number; likesCount: number; totalEarnings: number }> {
    const { data: profile, error: profileError } = await supabase
      .from('creator_profiles')
      .select('subscriber_count, post_count, total_earnings')
      .eq('user_id', creatorId)
      .single();

    if (profileError || !profile) {
      return { subscriberCount: 0, postCount: 0, likesCount: 0, totalEarnings: 0 };
    }

    const { data: postsData } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('creator_id', creatorId);

    const totalLikes = (postsData || []).reduce((sum: number, p: any) => sum + (p.likes_count ?? p.likesCount ?? 0), 0);

    return {
      subscriberCount: (profile as any).subscriber_count || 0,
      postCount: (profile as any).post_count || 0,
      likesCount: totalLikes,
      totalEarnings: Number((profile as any).total_earnings || 0),
    };
  }

  async getCreatorProgress(creatorId: any): Promise<{ current: number; goal: number; percentage: number }> {
    const { data: profile } = await supabase
      .from('creator_profiles')
      .select('total_earnings')
      .eq('user_id', creatorId)
      .single();

    const current = Number((profile as any)?.total_earnings || 0);
    const goal = 100;
    const percentage = Math.min((current / goal) * 100, 100);

    return { current, goal, percentage };
  }

  async getCreatorBadges(creatorId: any): Promise<Array<{ id: number; name: string; description: string; icon: string; unlocked: boolean }>> {
    const { data: profile } = await supabase
      .from('creator_profiles')
      .select('subscriber_count, post_count, total_earnings')
      .eq('user_id', creatorId)
      .single();

    const p: any = profile || {};
    const badges = [
      {
        id: 1,
        name: "Estrela em Ascensão",
        description: "Alcance 100 assinantes",
        icon: "⭐",
        unlocked: (p.subscriber_count || 0) >= 100,
      },
      {
        id: 2,
        name: "Criador Ativo",
        description: "Publique 10 posts",
        icon: "📝",
        unlocked: (p.post_count || 0) >= 10,
      },
      {
        id: 3,
        name: "Primeiro Ganho",
        description: "Ganhe seus primeiros $100",
        icon: "💰",
        unlocked: Number(p.total_earnings || 0) >= 100,
      },
    ];

    return badges;
  }

  // Statistics endpoints
  async getCreatorEarnings(creatorId: any, period: string = 'all', type: string = 'net'): Promise<{
    total: number;
    thisMonth: number;
    topPercentage: number;
    data: Array<{ date: string; amount: number }>;
    period: string;
    type: string;
  }> {
    // Mock data for development - in production, replace with real queries
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Generate mock data based on period
    const daysInPeriod = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = daysInPeriod - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const amount = i === 0 ? 9.90 : 0; // Only last day has earnings
      data.push({
        date: date.toISOString().split('T')[0],
        amount
      });
    }

    return {
      total: 9.90,
      thisMonth: currentMonth === 9 ? 9.90 : 0, // October 2025
      topPercentage: 99.49,
      data,
      period,
      type
    };
  }

  async getTopSpenders(creatorId: any, limit: number = 10): Promise<Array<{
    userId: number;
    username: string;
    displayName: string;
    avatar: string;
    totalSpent: number;
    lastTransaction: string;
  }>> {
    // Mock data - replace with real query
    return [
      {
        userId: 1,
        username: 'mature_catfish',
        displayName: 'Mature Catfish',
        avatar: '',
        totalSpent: 9.90,
        lastTransaction: '2025-10-10T15:30:00Z'
      }
    ];
  }

  async getRecentTransactions(creatorId: any, limit: number = 20): Promise<Array<{
    id: number;
    userId: number;
    username: string;
    displayName: string;
    amount: number;
    type: string;
    createdAt: string;
    isLive: boolean;
  }>> {
    // Mock data - replace with real query
    return [
      {
        id: 1,
        userId: 1,
        username: 'mature_catfish',
        displayName: 'Mature Catfish',
        amount: 9.90,
        type: 'subscription',
        createdAt: '2025-10-10T15:30:00Z',
        isLive: true
      }
    ];
  }

  async getMonthlyEarnings(creatorId: any, year: number = 2025): Promise<Array<{
    month: string;
    monthNumber: number;
    amount: number;
    subscribers: number;
    posts: number;
  }>> {
    // Mock data for 2025
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((month, index) => ({
      month,
      monthNumber: index + 1,
      amount: index === 9 ? 9.90 : 0, // Only October has earnings
      subscribers: index === 9 ? 1 : 0,
      posts: index === 9 ? 1 : 0
    }));
  }

  async getSubscribersStats(creatorId: any, period: string = 'all'): Promise<{
    total: number;
    active: number;
    new: number;
    churned: number;
    data: Array<{ date: string; count: number; new: number; churned: number }>;
  }> {
    // Mock data
    const daysInPeriod = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = daysInPeriod - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const count = i === 0 ? 1 : 0; // Only today has subscribers
      data.push({
        date: date.toISOString().split('T')[0],
        count,
        new: count,
        churned: 0
      });
    }

    return {
      total: 1,
      active: 1,
      new: 1,
      churned: 0,
      data
    };
  }

  async getContentStats(creatorId: any, period: string = 'all'): Promise<{
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    averageViews: number;
    data: Array<{ date: string; posts: number; views: number; likes: number; comments: number }>;
  }> {
    // Mock data
    const daysInPeriod = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = daysInPeriod - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const posts = i === 0 ? 1 : 0; // Only today has posts
      data.push({
        date: date.toISOString().split('T')[0],
        posts,
        views: posts * 1250, // Mock views per post
        likes: posts * 234, // Mock likes per post
        comments: posts * 18 // Mock comments per post
      });
    }

    return {
      totalPosts: 1,
      totalViews: 1250,
      totalLikes: 234,
      totalComments: 18,
      averageViews: 1250,
      data
    };
  }

  async getSubscribersList(creatorId: any, page: number = 1, limit: number = 20): Promise<{
    subscribers: Array<{
      id: number;
      userId: number;
      username: string;
      displayName: string;
      avatar: string;
      subscriptionDate: string;
      amount: number;
      status: 'active' | 'cancelled';
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Mock data - replace with real query
    const mockSubscribers = [
      {
        id: 1,
        userId: 2,
        username: 'mature_catfish',
        displayName: 'Mature Catfish',
        avatar: '',
        subscriptionDate: '2025-10-01T00:00:00Z',
        amount: 9.90,
        status: 'active' as const
      },
      {
        id: 2,
        userId: 3,
        username: 'fitness_fan',
        displayName: 'Fitness Fan',
        avatar: '',
        subscriptionDate: '2025-09-15T00:00:00Z',
        amount: 9.90,
        status: 'active' as const
      },
      {
        id: 3,
        userId: 4,
        username: 'photo_lover',
        displayName: 'Photo Lover',
        avatar: '',
        subscriptionDate: '2025-08-20T00:00:00Z',
        amount: 9.90,
        status: 'cancelled' as const
      }
    ];

    const total = mockSubscribers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSubscribers = mockSubscribers.slice(startIndex, endIndex);

    return {
      subscribers: paginatedSubscribers,
      total,
      page,
      totalPages
    };
  }

  // Vault functions
  async getCreatorVaultContent(creatorId: any, filters: {
    type?: 'all' | 'images' | 'videos' | 'audios',
    folderId?: number | null,
    search?: string,
    page?: number,
    limit?: number
  }): Promise<{
    content: Array<{
      id: number,
      title: string,
      mediaUrl: string,
      mediaType: 'image' | 'video' | 'audio',
      thumbnail: string,
      views: number,
      likes: number,
      comments: number,
      gifts: number,
      createdAt: string,
      folderId: number | null
    }>,
    total: number,
    page: number,
    totalPages: number
  }> {
    // Mock data - replace with real query
    const mockContent = [
      {
        id: 1,
        title: "Meu treino de hoje",
        mediaUrl: "https://example.com/video1.mp4",
        mediaType: "video" as const,
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
        views: 1250,
        likes: 234,
        comments: 18,
        gifts: 5,
        createdAt: "2025-10-10T10:30:00Z",
        folderId: null
      },
      {
        id: 2,
        title: "Sessão de fotos na praia",
        mediaUrl: "https://example.com/image1.jpg",
        mediaType: "image" as const,
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
        views: 890,
        likes: 156,
        comments: 12,
        gifts: 3,
        createdAt: "2025-10-09T15:45:00Z",
        folderId: 1
      },
      {
        id: 3,
        title: "Workout intenso",
        mediaUrl: "https://example.com/video2.mp4",
        mediaType: "video" as const,
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=225&fit=crop",
        views: 2100,
        likes: 445,
        comments: 32,
        gifts: 12,
        createdAt: "2025-10-08T08:20:00Z",
        folderId: null
      },
      {
        id: 4,
        title: "Receita saudável",
        mediaUrl: "https://example.com/image2.jpg",
        mediaType: "image" as const,
        thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
        views: 675,
        likes: 98,
        comments: 8,
        gifts: 2,
        createdAt: "2025-10-07T12:15:00Z",
        folderId: 2
      }
    ];

    // Apply filters
    let filteredContent = mockContent;

    if (filters.type && filters.type !== 'all') {
      filteredContent = filteredContent.filter(item => {
        if (filters.type === 'images') return item.mediaType === 'image';
        if (filters.type === 'videos') return item.mediaType === 'video';
        if (filters.type === 'audios') return item.mediaType === 'audio';
        return true;
      });
    }

    if (filters.folderId !== undefined) {
      filteredContent = filteredContent.filter(item => item.folderId === filters.folderId);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredContent = filteredContent.filter(item => 
        item.title.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredContent.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContent = filteredContent.slice(startIndex, endIndex);

    return {
      content: paginatedContent,
      total,
      page,
      totalPages
    };
  }

  async getCreatorFolders(creatorId: any): Promise<Array<{
    id: number,
    name: string,
    contentCount: number,
    createdAt: string
  }>> {
    // Mock data - replace with real query
    return [
      {
        id: 1,
        name: "Fotos da Praia",
        contentCount: 1,
        createdAt: "2025-10-01T00:00:00Z"
      },
      {
        id: 2,
        name: "Receitas",
        contentCount: 1,
        createdAt: "2025-10-02T00:00:00Z"
      }
    ];
  }

  async createFolder(creatorId: any, name: string): Promise<any> {
    // Mock data - replace with real insert
    return {
      id: Date.now(),
      creatorId,
      name,
      createdAt: new Date().toISOString()
    };
  }

  async moveContentToFolder(contentId: number, folderId: number | null): Promise<void> {
    // Mock implementation - replace with real update
    console.log(`Moving content ${contentId} to folder ${folderId}`);
  }

  async deleteContent(contentId: number, creatorId: number): Promise<boolean> {
    // Mock implementation - replace with real delete
    console.log(`Deleting content ${contentId} for creator ${creatorId}`);
    return true;
  }

  // Payment Methods
  async getPaymentMethods(userId: number): Promise<PaymentMethod[]> {
    return await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId))
      .orderBy(desc(paymentMethods.isDefault), desc(paymentMethods.createdAt));
  }

  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const [newMethod] = await db
      .insert(paymentMethods)
      .values(method)
      .returning();
    return newMethod;
  }

  async deletePaymentMethod(id: number, userId: number): Promise<boolean> {
    try {
      await db
        .delete(paymentMethods)
        .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)));
      return true;
    } catch (error) {
      console.error("Error deleting payment method:", error);
      return false;
    }
  }

  async setDefaultPaymentMethod(id: number, userId: number): Promise<void> {
    await db
      .update(paymentMethods)
      .set({ isDefault: false })
      .where(eq(paymentMethods.userId, userId));

    await db
      .update(paymentMethods)
      .set({ isDefault: true })
      .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)));
  }

  // Transactions
  async getUserTransactions(userId: number, limit = 50): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  // Blocked Users
  async getBlockedUsers(userId: number): Promise<(BlockedUser & { blocked: User })[]> {
    const results = await db
      .select()
      .from(blockedUsers)
      .leftJoin(users, eq(blockedUsers.blockedId, users.id))
      .where(eq(blockedUsers.blockerId, userId))
      .orderBy(desc(blockedUsers.createdAt));

    return results.map(row => ({
      ...row.blocked_users,
      blocked: row.users!
    }));
  }

  async blockUser(blockerId: number, blockedId: number): Promise<BlockedUser> {
    const [blocked] = await db
      .insert(blockedUsers)
      .values({ blockerId, blockedId })
      .returning();
    return blocked;
  }

  async unblockUser(blockerId: number, blockedId: number): Promise<boolean> {
    try {
      await db
        .delete(blockedUsers)
        .where(and(
          eq(blockedUsers.blockerId, blockerId),
          eq(blockedUsers.blockedId, blockedId)
        ));
      return true;
    } catch (error) {
      console.error("Error unblocking user:", error);
      return false;
    }
  }

  async isBlocked(blockerId: number, blockedId: number): Promise<boolean> {
    const [result] = await db
      .select()
      .from(blockedUsers)
      .where(and(
        eq(blockedUsers.blockerId, blockerId),
        eq(blockedUsers.blockedId, blockedId)
      ));
    return !!result;
  }
}
// ⚡ Override temporário dos métodos de usuário para usar Supabase direto
DatabaseStorage.prototype.getAllUsers = async function () {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('❌ Erro ao buscar usuários no Supabase:', error);
    throw error;
  }
  return data;
};

DatabaseStorage.prototype.getUserByUsername = async function (username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  if (error) return undefined;
  return data;
};

DatabaseStorage.prototype.getUserByEmail = async function (email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) return undefined;
  return data;
};

DatabaseStorage.prototype.createUser = async function (userData: any) {
  const userDataWithTimestamp = {
    ...userData,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('users')
    .insert(userDataWithTimestamp)
    .select()
    .single();
  if (error) {
    console.error('❌ Erro ao criar usuário no Supabase:', error);
    throw error;
  }
  return data;
};

export const storage = new DatabaseStorage();