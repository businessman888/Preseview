import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // User upgrade to creator
  app.post("/api/user/become-creator", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Check if user is already a creator
      if (req.user!.userType === 'creator') {
        return res.status(400).json({ error: "Você já é um criador" });
      }

      const { subscriptionPrice, description, categories } = req.body;
      
      const result = await storage.upgradeToCreator(req.user!.id, {
        subscriptionPrice: subscriptionPrice || 0,
        description: description || null,
        categories: categories || [],
      });

      res.json(result);
    } catch (error: any) {
      console.error("Error upgrading to creator:", error);
      if (error.message === "Usuário não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro ao se tornar criador" });
    }
  });

  // Stories routes
  app.get("/api/stories", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const stories = await storage.getActiveStories(req.user!.id);
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Erro ao buscar stories" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Only creators can create stories
      if (req.user!.userType !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem publicar stories" });
      }

      const { mediaUrl, caption } = req.body;
      if (!mediaUrl) {
        return res.status(400).json({ error: "URL da mídia é obrigatória" });
      }

      // Stories expire in 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const story = await storage.createStory({
        creatorId: req.user!.id,
        mediaUrl,
        caption: caption || null,
        expiresAt,
      });

      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Erro ao criar story" });
    }
  });

  app.post("/api/stories/:id/view", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const storyId = parseInt(req.params.id);
      await storage.viewStory(storyId, req.user!.id);
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error viewing story:", error);
      res.status(500).json({ error: "Erro ao visualizar story" });
    }
  });

  app.get("/api/stories/creator/:creatorId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const creatorId = parseInt(req.params.creatorId);
      const stories = await storage.getCreatorStories(creatorId);
      
      res.json(stories);
    } catch (error) {
      console.error("Error fetching creator stories:", error);
      res.status(500).json({ error: "Erro ao buscar stories do criador" });
    }
  });

  // Posts routes  
  app.get("/api/posts/feed", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const posts = await storage.getFeedPosts(req.user!.id, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching feed posts:", error);
      res.status(500).json({ error: "Erro ao buscar feed" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Only creators can create posts
      if (req.user!.userType !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem publicar posts" });
      }

      const { title, content, mediaUrls, tags, isExclusive } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
      }

      const post = await storage.createPost({
        creatorId: req.user!.id,
        title,
        content,
        mediaUrls: mediaUrls || [],
        tags: tags || [],
        isExclusive: isExclusive || false,
      });

      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Erro ao criar post" });
    }
  });

  app.get("/api/posts/creator/:creatorId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const creatorId = parseInt(req.params.creatorId);
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const posts = await storage.getPostsByCreator(creatorId, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching creator posts:", error);
      res.status(500).json({ error: "Erro ao buscar posts do criador" });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const postId = parseInt(req.params.id);
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ error: "Post não encontrado" });
      }
      
      // Only the creator can edit their own posts
      if (post.creatorId !== req.user!.id) {
        return res.status(403).json({ error: "Você não tem permissão para editar este post" });
      }

      const { title, content, mediaUrls, tags, isExclusive } = req.body;
      
      const updatedPost = await storage.updatePost(postId, {
        title,
        content,
        mediaUrls,
        tags,
        isExclusive,
      });

      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Erro ao atualizar post" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const postId = parseInt(req.params.id);
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ error: "Post não encontrado" });
      }
      
      // Only the creator can delete their own posts
      if (post.creatorId !== req.user!.id) {
        return res.status(403).json({ error: "Você não tem permissão para deletar este post" });
      }

      await storage.deletePost(postId, req.user!.id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Erro ao deletar post" });
    }
  });

  // Creators routes
  app.get("/api/creators", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const creators = await storage.getCreators(limit, offset);
      res.json(creators);
    } catch (error) {
      console.error("Error fetching creators:", error);
      res.status(500).json({ error: "Erro ao buscar criadores" });
    }
  });

  app.get("/api/creators/search", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query de busca é obrigatória" });
      }
      
      const limit = parseInt(req.query.limit as string) || 20;
      const creators = await storage.searchCreators(query, limit);
      
      res.json(creators);
    } catch (error) {
      console.error("Error searching creators:", error);
      res.status(500).json({ error: "Erro ao buscar criadores" });
    }
  });

  // Likes routes
  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const postId = parseInt(req.params.id);
      const isLiked = await storage.isLiked(req.user!.id, postId);
      
      if (isLiked) {
        await storage.deleteLike(req.user!.id, postId);
        await storage.updatePostStats(postId, 'like', false);
      } else {
        await storage.createLike({ userId: req.user!.id, postId });
        await storage.updatePostStats(postId, 'like', true);
      }
      
      res.json({ liked: !isLiked });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ error: "Erro ao curtir post" });
    }
  });

  // Comments routes
  app.post("/api/posts/:id/comments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const postId = parseInt(req.params.id);
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: "Conteúdo do comentário é obrigatório" });
      }
      
      const comment = await storage.createComment({
        userId: req.user!.id,
        postId,
        content,
      });
      
      await storage.updatePostStats(postId, 'comment', true);
      
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Erro ao criar comentário" });
    }
  });

  app.get("/api/posts/:id/comments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const postId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 50;
      
      const comments = await storage.getPostComments(postId, limit);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Erro ao buscar comentários" });
    }
  });

  // Bookmarks routes
  app.post("/api/posts/:id/bookmark", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const postId = parseInt(req.params.id);
      const isBookmarked = await storage.isBookmarked(req.user!.id, postId);
      
      if (isBookmarked) {
        await storage.deleteBookmark(req.user!.id, postId);
      } else {
        await storage.createBookmark({ userId: req.user!.id, postId });
      }
      
      res.json({ bookmarked: !isBookmarked });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      res.status(500).json({ error: "Erro ao salvar post" });
    }
  });

  app.get("/api/bookmarks", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const limit = parseInt(req.query.limit as string) || 50;
      const bookmarks = await storage.getUserBookmarks(req.user!.id, limit);
      
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ error: "Erro ao buscar salvos" });
    }
  });

  // Tips routes
  app.post("/api/tips", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { receiverId, postId, amount, message } = req.body;
      
      if (!receiverId || !amount) {
        return res.status(400).json({ error: "Destinatário e valor são obrigatórios" });
      }
      
      const tip = await storage.createTip({
        senderId: req.user!.id,
        receiverId,
        postId: postId || null,
        amount,
        message: message || null,
      });
      
      res.status(201).json(tip);
    } catch (error) {
      console.error("Error creating tip:", error);
      res.status(500).json({ error: "Erro ao enviar presente" });
    }
  });

  // Subscriptions routes
  app.post("/api/subscriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { creatorId, amount } = req.body;
      
      if (!creatorId || !amount) {
        return res.status(400).json({ error: "Criador e valor são obrigatórios" });
      }
      
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      const subscription = await storage.createSubscription({
        userId: req.user!.id,
        creatorId,
        amount,
        endDate,
      });
      
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Erro ao assinar criador" });
    }
  });

  app.get("/api/subscriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const subscriptions = await storage.getUserSubscriptions(req.user!.id);
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ error: "Erro ao buscar assinaturas" });
    }
  });

  // Follows routes
  app.post("/api/follows", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { followingId } = req.body;
      
      if (!followingId) {
        return res.status(400).json({ error: "Usuário para seguir é obrigatório" });
      }
      
      const isFollowing = await storage.isFollowing(req.user!.id, followingId);
      
      if (isFollowing) {
        await storage.deleteFollow(req.user!.id, followingId);
      } else {
        await storage.createFollow({
          followerId: req.user!.id,
          followingId,
        });
      }
      
      res.json({ following: !isFollowing });
    } catch (error) {
      console.error("Error toggling follow:", error);
      res.status(500).json({ error: "Erro ao seguir usuário" });
    }
  });

  app.get("/api/follows/followers", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const limit = parseInt(req.query.limit as string) || 50;
      const followers = await storage.getFollowers(req.user!.id, limit);
      
      res.json(followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ error: "Erro ao buscar seguidores" });
    }
  });

  app.get("/api/follows/following", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const limit = parseInt(req.query.limit as string) || 50;
      const following = await storage.getFollowing(req.user!.id, limit);
      
      res.json(following);
    } catch (error) {
      console.error("Error fetching following:", error);
      res.status(500).json({ error: "Erro ao buscar seguindo" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const limit = parseInt(req.query.limit as string) || 50;
      const notifications = await storage.getUserNotifications(req.user!.id, limit);
      
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Erro ao buscar notificações" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId, req.user!.id);
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Erro ao marcar notificação" });
    }
  });

  app.put("/api/notifications/read-all", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      await storage.markAllNotificationsAsRead(req.user!.id);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Erro ao marcar todas notificações" });
    }
  });

  app.get("/api/notifications/unread-count", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const count = await storage.getUnreadNotificationCount(req.user!.id);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ error: "Erro ao buscar contagem de não lidas" });
    }
  });

  // Messages routes
  app.get("/api/messages/conversations", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const conversations = await storage.getConversations(req.user!.id);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Erro ao buscar conversas" });
    }
  });

  app.get("/api/messages/:otherUserId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const otherUserId = parseInt(req.params.otherUserId);
      const limit = parseInt(req.query.limit as string) || 100;
      
      const messages = await storage.getConversationMessages(req.user!.id, otherUserId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { receiverId, content, mediaUrl } = req.body;
      
      if (!receiverId || !content) {
        return res.status(400).json({ error: "Destinatário e conteúdo são obrigatórios" });
      }
      
      const message = await storage.createMessage({
        senderId: req.user!.id,
        receiverId,
        content,
        mediaUrl: mediaUrl || null,
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  });

  app.put("/api/messages/:otherUserId/read", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const otherUserId = parseInt(req.params.otherUserId);
      await storage.markMessagesAsRead(req.user!.id, otherUserId);
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ error: "Erro ao marcar mensagens como lidas" });
    }
  });

  // Notification preferences routes
  app.get("/api/notification-preferences", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const preferences = await storage.getNotificationPreferences(req.user!.id);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ error: "Erro ao buscar preferências de notificação" });
    }
  });

  app.put("/api/notification-preferences", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const preferences = await storage.updateNotificationPreferences(req.user!.id, req.body);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ error: "Erro ao atualizar preferências de notificação" });
    }
  });

  // Privacy settings routes
  app.get("/api/privacy-settings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const settings = await storage.getPrivacySettings(req.user!.id);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching privacy settings:", error);
      res.status(500).json({ error: "Erro ao buscar configurações de privacidade" });
    }
  });

  app.put("/api/privacy-settings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const settings = await storage.updatePrivacySettings(req.user!.id, req.body);
      res.json(settings);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      res.status(500).json({ error: "Erro ao atualizar configurações de privacidade" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
