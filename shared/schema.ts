import { pgTable, text, serial, integer, boolean, timestamp, varchar, real, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userTypeEnum = pgEnum('user_type', ['user', 'creator']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'expired', 'cancelled']);
export const notificationTypeEnum = pgEnum('notification_type', ['like', 'comment', 'follow', 'subscription', 'message', 'tip', 'new_post', 'story']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  display_name: text("display_name").notNull(),
  bio: text("bio"),
  profile_image: text("profile_image"),
  cover_image: text("cover_image"),
  user_type: userTypeEnum("user_type").default('user').notNull(),
  is_verified: boolean("is_verified").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Creator profiles (additional info for creators)
export const creatorProfiles = pgTable("creator_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  subscriptionPrice: real("subscription_price").default(0).notNull(),
  description: text("description"),
  categories: text("categories").array(),
  socialLinks: text("social_links").array(),
  isActive: boolean("is_active").default(true),
  totalEarnings: real("total_earnings").default(0),
  subscriberCount: integer("subscriber_count").default(0),
  postCount: integer("post_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(),
  tags: text("tags").array(),
  isExclusive: boolean("is_exclusive").default(false),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  viewsCount: integer("views_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Stories table
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  mediaUrl: text("media_url").notNull(),
  caption: text("caption"),
  viewsCount: integer("views_count").default(0),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  status: subscriptionStatusEnum("status").default('active').notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  amount: real("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Follows table (for free follows without subscription)
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id).notNull(),
  followingId: integer("following_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Likes table
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bookmarks table
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tips/Gifts table
export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => posts.id),
  amount: real("amount").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  triggeredByUserId: integer("triggered_by_user_id").references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: integer("related_id"), // Can reference post, comment, etc.
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Story views table
export const storyViews = pgTable("story_views", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").references(() => stories.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

// Search history table
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  query: text("query").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Trending hashtags table
export const trendingHashtags = pgTable("trending_hashtags", {
  id: serial("id").primaryKey(),
  hashtag: text("hashtag").notNull().unique(),
  count: integer("count").default(1),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment methods table
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'card', 'bank', 'wallet'
  last4: text("last4"),
  brand: text("brand"),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'subscription', 'tip', 'withdrawal'
  amount: real("amount").notNull(),
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  description: text("description"),
  relatedId: integer("related_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notification preferences table
export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  enableMessages: boolean("enable_messages").default(true),
  enableNewPosts: boolean("enable_new_posts").default(true),
  enableLikes: boolean("enable_likes").default(true),
  enableComments: boolean("enable_comments").default(true),
  enableFollows: boolean("enable_follows").default(true),
  enableSubscriptions: boolean("enable_subscriptions").default(true),
  enableTips: boolean("enable_tips").default(true),
  enablePlatform: boolean("enable_platform").default(true),
  muteAll: boolean("mute_all").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Privacy settings table
export const privacySettings = pgTable("privacy_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  profileVisibility: text("profile_visibility").default('public').notNull(), // 'public', 'private', 'followers'
  showOnlineStatus: boolean("show_online_status").default(true),
  allowMessagesFrom: text("allow_messages_from").default('everyone').notNull(), // 'everyone', 'followers', 'none'
  showSubscriptions: boolean("show_subscriptions").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blocked users table
export const blockedUsers = pgTable("blocked_users", {
  id: serial("id").primaryKey(),
  blockerId: integer("blocker_id").references(() => users.id).notNull(),
  blockedId: integer("blocked_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  creatorProfile: one(creatorProfiles, {
    fields: [users.id],
    references: [creatorProfiles.userId],
  }),
  posts: many(posts),
  stories: many(stories),
  subscriptionsAsUser: many(subscriptions, { relationName: "userSubscriptions" }),
  subscriptionsAsCreator: many(subscriptions, { relationName: "creatorSubscriptions" }),
  followsAsFollower: many(follows, { relationName: "followerRelation" }),
  followsAsFollowing: many(follows, { relationName: "followingRelation" }),
  likes: many(likes),
  bookmarks: many(bookmarks),
  comments: many(comments),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  sentTips: many(tips, { relationName: "sentTips" }),
  receivedTips: many(tips, { relationName: "receivedTips" }),
  notifications: many(notifications),
  storyViews: many(storyViews),
  searchHistory: many(searchHistory),
  paymentMethods: many(paymentMethods),
  transactions: many(transactions),
  notificationPreferences: one(notificationPreferences, {
    fields: [users.id],
    references: [notificationPreferences.userId],
  }),
  privacySettings: one(privacySettings, {
    fields: [users.id],
    references: [privacySettings.userId],
  }),
  blockedAsBlocker: many(blockedUsers, { relationName: "blockerRelation" }),
  blockedAsBlocked: many(blockedUsers, { relationName: "blockedRelation" }),
}));

export const creatorProfilesRelations = relations(creatorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [creatorProfiles.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  creator: one(users, {
    fields: [posts.creatorId],
    references: [users.id],
  }),
  likes: many(likes),
  bookmarks: many(bookmarks),
  comments: many(comments),
  tips: many(tips),
}));

export const storiesRelations = relations(stories, ({ one, many }) => ({
  creator: one(users, {
    fields: [stories.creatorId],
    references: [users.id],
  }),
  views: many(storyViews),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
    relationName: "userSubscriptions",
  }),
  creator: one(users, {
    fields: [subscriptions.creatorId],
    references: [users.id],
    relationName: "creatorSubscriptions",
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "followerRelation",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "followingRelation",
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

export const tipsRelations = relations(tips, ({ one }) => ({
  sender: one(users, {
    fields: [tips.senderId],
    references: [users.id],
    relationName: "sentTips",
  }),
  receiver: one(users, {
    fields: [tips.receiverId],
    references: [users.id],
    relationName: "receivedTips",
  }),
  post: one(posts, {
    fields: [tips.postId],
    references: [posts.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  triggeredByUser: one(users, {
    fields: [notifications.triggeredByUserId],
    references: [users.id],
  }),
}));

export const storyViewsRelations = relations(storyViews, ({ one }) => ({
  story: one(stories, {
    fields: [storyViews.storyId],
    references: [stories.id],
  }),
  user: one(users, {
    fields: [storyViews.userId],
    references: [users.id],
  }),
}));

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, {
    fields: [searchHistory.userId],
    references: [users.id],
  }),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id],
  }),
}));

export const privacySettingsRelations = relations(privacySettings, ({ one }) => ({
  user: one(users, {
    fields: [privacySettings.userId],
    references: [users.id],
  }),
}));

export const blockedUsersRelations = relations(blockedUsers, ({ one }) => ({
  blocker: one(users, {
    fields: [blockedUsers.blockerId],
    references: [users.id],
    relationName: "blockerRelation",
  }),
  blocked: one(users, {
    fields: [blockedUsers.blockedId],
    references: [users.id],
    relationName: "blockedRelation",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertCreatorProfileSchema = createInsertSchema(creatorProfiles).omit({
  id: true,
  created_at: true,
  totalEarnings: true,
  subscriberCount: true,
  postCount: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  created_at: true,
  updated_at: true,
  likesCount: true,
  commentsCount: true,
  viewsCount: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  created_at: true,
  viewsCount: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  created_at: true,
  startDate: true,
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  created_at: true,
});

export const insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  created_at: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  created_at: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  created_at: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  created_at: true,
  isRead: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  created_at: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  created_at: true,
  isRead: true,
});

export const insertStoryViewSchema = createInsertSchema(storyViews).omit({
  id: true,
  viewedAt: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  created_at: true,
});

export const insertTrendingHashtagSchema = createInsertSchema(trendingHashtags).omit({
  id: true,
  updated_at: true,
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  created_at: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  created_at: true,
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertPrivacySettingsSchema = createInsertSchema(privacySettings).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertBlockedUserSchema = createInsertSchema(blockedUsers).omit({
  id: true,
  created_at: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CreatorProfile = typeof creatorProfiles.$inferSelect;
export type InsertCreatorProfile = z.infer<typeof insertCreatorProfileSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Tip = typeof tips.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type StoryView = typeof storyViews.$inferSelect;
export type InsertStoryView = z.infer<typeof insertStoryViewSchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type TrendingHashtag = typeof trendingHashtags.$inferSelect;
export type InsertTrendingHashtag = z.infer<typeof insertTrendingHashtagSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;
export type PrivacySettings = typeof privacySettings.$inferSelect;
export type InsertPrivacySettings = z.infer<typeof insertPrivacySettingsSchema>;
export type BlockedUser = typeof blockedUsers.$inferSelect;
export type InsertBlockedUser = z.infer<typeof insertBlockedUserSchema>;

// Creator Dashboard Types
export type CreatorStats = {
  subscriberCount: number;
  postCount: number;
  likesCount: number;
  totalEarnings: number;
};

export type CreatorProgress = {
  current: number;
  goal: number;
  percentage: number;
};

export type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};
