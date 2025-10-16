import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);
// ✅ Rota para listar todos os usuários cadastrados
app.get("/api/users", async (req, res) => {
  try {
    // Opcional: proteger a rota com autenticação
    // if (!req.isAuthenticated()) return res.sendStatus(401);

    const users = await storage.getAllUsers();  // você criará esta função no storage
    res.json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

  // Update user profile
  app.patch("/api/user/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { bio, profileImage, coverImage } = req.body;
      
      const updatedUser = await storage.updateUserProfile(req.user!.id, {
        bio: bio !== undefined ? bio : undefined,
        profileImage: profileImage !== undefined ? profileImage : undefined,
        coverImage: coverImage !== undefined ? coverImage : undefined,
      });

      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
  });

  // User upgrade to creator
  app.post("/api/user/become-creator", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Check if user is already a creator
      if (req.user!.user_type === 'creator') {
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

  // Creator insights
  app.get("/api/creator/insights", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar insights" });
      }

      const insights = await storage.getCreatorInsights(req.user!.id);
      res.json(insights);
    } catch (error: any) {
      console.error("Error fetching creator insights:", error);
      res.status(500).json({ error: "Erro ao buscar insights" });
    }
  });

  // Get creator profile
  app.get("/api/creator/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar este recurso" });
      }

      const profile = await storage.getCreatorProfile(req.user!.id);
      res.json(profile);
    } catch (error: any) {
      console.error("Error fetching creator profile:", error);
      res.status(500).json({ error: "Erro ao buscar perfil do criador" });
    }
  });

  // Update subscription price
  app.patch("/api/creator/subscription-price", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem atualizar preços" });
      }

      const { subscriptionPrice } = req.body;
      
      if (subscriptionPrice === undefined || subscriptionPrice < 0) {
        return res.status(400).json({ error: "Preço inválido" });
      }

      const profile = await storage.updateSubscriptionPrice(req.user!.id, subscriptionPrice);
      res.json(profile);
    } catch (error: any) {
      console.error("Error updating subscription price:", error);
      res.status(500).json({ error: "Erro ao atualizar preço" });
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
      // Temporário: evitar quebrar a home
      res.json([]);
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Only creators can create stories
      if (req.user!.user_type !== 'creator') {
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
      // Temporário: evitar quebrar a home
      res.json([]);
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Only creators can create posts
      if (req.user!.user_type !== 'creator') {
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
      
      // creatorId pode ser UUID no Supabase; não faça parseInt
      const creatorId = req.params.creatorId;
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

  app.get("/api/creators/suggested", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const limit = parseInt(req.query.limit as string) || 6;
      const creators = await storage.getSuggestedCreators(req.user!.id, limit);
      
      res.json(creators);
    } catch (error) {
      console.error("Error fetching suggested creators:", error);
      // Temporário: evitar quebrar a home
      res.json([]);
    }
  });

  app.get("/api/creators/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const creatorId = parseInt(req.params.id);
      const creator = await storage.getCreatorProfile(creatorId, req.user!.id);
      
      if (!creator) {
        return res.status(404).json({ error: "Criador não encontrado" });
      }
      
      res.json(creator);
    } catch (error) {
      console.error("Error fetching creator profile:", error);
      res.status(500).json({ error: "Erro ao buscar perfil do criador" });
    }
  });

  app.get("/api/creators/:id/posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const creatorId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const posts = await storage.getPostsByCreator(creatorId, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching creator posts:", error);
      res.status(500).json({ error: "Erro ao buscar posts do criador" });
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

  // Blocked users routes
  app.get("/api/blocked-users", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const blockedUsers = await storage.getBlockedUsers(req.user!.id);
      res.json(blockedUsers);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      res.status(500).json({ error: "Erro ao buscar usuários bloqueados" });
    }
  });

  app.post("/api/blocked-users/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const blockedId = parseInt(req.params.userId);
      const blocked = await storage.blockUser(req.user!.id, blockedId);
      res.status(201).json(blocked);
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ error: "Erro ao bloquear usuário" });
    }
  });

  app.delete("/api/blocked-users/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const blockedId = parseInt(req.params.userId);
      const success = await storage.unblockUser(req.user!.id, blockedId);
      
      if (success) {
        res.sendStatus(200);
      } else {
        res.status(500).json({ error: "Erro ao desbloquear usuário" });
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      res.status(500).json({ error: "Erro ao desbloquear usuário" });
    }
  });

  // Account management routes
  app.put("/api/user/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { displayName, bio } = req.body;
      if (!displayName) {
        return res.status(400).json({ error: "Nome de exibição é obrigatório" });
      }

      const user = await storage.updateUser(req.user!.id, {
        display_name: displayName,
        bio: bio || null,
      });
      
      res.json(user);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: error.message || "Erro ao atualizar perfil" });
    }
  });

  app.put("/api/user/email", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email é obrigatório" });
      }

      const user = await storage.updateUserEmail(req.user!.id, email);
      res.json(user);
    } catch (error: any) {
      console.error("Error updating email:", error);
      res.status(500).json({ error: error.message || "Erro ao atualizar email" });
    }
  });

  app.put("/api/user/password", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Senha atual e nova senha são obrigatórias" });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const bcrypt = require("bcryptjs");
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUserPassword(req.user!.id, hashedPassword);
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Erro ao atualizar senha" });
    }
  });

  app.delete("/api/user", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const success = await storage.deleteUser(req.user!.id);
      if (success) {
        req.logout(() => {
          res.sendStatus(200);
        });
      } else {
        res.status(500).json({ error: "Erro ao deletar conta" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Erro ao deletar conta" });
    }
  });

  // Subscription management routes
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

  app.post("/api/subscriptions/:id/cancel", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const subscriptionId = parseInt(req.params.id);
      await storage.updateSubscriptionStatus(subscriptionId, 'cancelled');
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ error: "Erro ao cancelar assinatura" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await storage.getUserTransactions(req.user!.id, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Erro ao buscar transações" });
    }
  });

  // Payment methods routes
  app.get("/api/payment-methods", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const methods = await storage.getPaymentMethods(req.user!.id);
      res.json(methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ error: "Erro ao buscar métodos de pagamento" });
    }
  });

  app.post("/api/payment-methods", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { type, last4, brand, expiryMonth, expiryYear } = req.body;
      if (!type || !last4 || !brand || !expiryMonth || !expiryYear) {
        return res.status(400).json({ error: "Dados do método de pagamento incompletos" });
      }

      const method = await storage.createPaymentMethod({
        userId: req.user!.id,
        type,
        last4,
        brand,
        expiryMonth,
        expiryYear,
        isDefault: false,
      });
      
      res.status(201).json(method);
    } catch (error) {
      console.error("Error creating payment method:", error);
      res.status(500).json({ error: "Erro ao adicionar método de pagamento" });
    }
  });

  app.delete("/api/payment-methods/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const id = parseInt(req.params.id);
      const success = await storage.deletePaymentMethod(id, req.user!.id);
      
      if (success) {
        res.sendStatus(200);
      } else {
        res.status(500).json({ error: "Erro ao remover método de pagamento" });
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      res.status(500).json({ error: "Erro ao remover método de pagamento" });
    }
  });

  app.put("/api/payment-methods/:id/default", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const id = parseInt(req.params.id);
      await storage.setDefaultPaymentMethod(id, req.user!.id);
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error setting default payment method:", error);
      res.status(500).json({ error: "Erro ao definir método padrão" });
    }
  });

  // Creator Dashboard Endpoints
  app.get("/api/creator/stats", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar estatísticas" });
      }

      const stats = await storage.getCreatorStats(req.user!.id);
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching creator stats:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar estatísticas" });
    }
  });

  app.get("/api/creator/progress", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar progresso" });
      }

      const progress = await storage.getCreatorProgress(req.user!.id);
      res.json(progress);
    } catch (error: any) {
      console.error("Error fetching creator progress:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar progresso" });
    }
  });

  app.get("/api/creator/badges", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar badges" });
      }

      const badges = await storage.getCreatorBadges(req.user!.id);
      res.json(badges);
    } catch (error: any) {
      console.error("Error fetching creator badges:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar badges" });
    }
  });

  // Statistics endpoints
  app.get("/api/creator/earnings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar earnings" });
      }

      const period = req.query.period as string || 'all';
      const type = req.query.type as string || 'net';
      const earnings = await storage.getCreatorEarnings(req.user!.id, period, type);
      res.json(earnings);
    } catch (error: any) {
      console.error("Error fetching creator earnings:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar earnings" });
    }
  });

  app.get("/api/creator/top-spenders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar top spenders" });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const topSpenders = await storage.getTopSpenders(req.user!.id, limit);
      res.json(topSpenders);
    } catch (error: any) {
      console.error("Error fetching top spenders:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar top spenders" });
    }
  });

  app.get("/api/creator/transactions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar transações" });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const transactions = await storage.getRecentTransactions(req.user!.id, limit);
      res.json(transactions);
    } catch (error: any) {
      console.error("Error fetching recent transactions:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar transações" });
    }
  });

  app.get("/api/creator/monthly-earnings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar ganhos mensais" });
      }

      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const monthlyEarnings = await storage.getMonthlyEarnings(req.user!.id, year);
      res.json(monthlyEarnings);
    } catch (error: any) {
      console.error("Error fetching monthly earnings:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar ganhos mensais" });
    }
  });

  app.get("/api/creator/subscribers-stats", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar estatísticas de assinantes" });
      }

      const period = req.query.period as string || 'all';
      const subscribersStats = await storage.getSubscribersStats(req.user!.id, period);
      res.json(subscribersStats);
    } catch (error: any) {
      console.error("Error fetching subscribers stats:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar estatísticas de assinantes" });
    }
  });

  app.get("/api/creator/content-stats", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar estatísticas de conteúdo" });
      }

      const period = req.query.period as string || 'all';
      const contentStats = await storage.getContentStats(req.user!.id, period);
      res.json(contentStats);
    } catch (error: any) {
      console.error("Error fetching content stats:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar estatísticas de conteúdo" });
    }
  });

  app.get("/api/creator/subscribers-list", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar lista de assinantes" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const subscribersList = await storage.getSubscribersList(req.user!.id, page, limit);
      res.json(subscribersList);
    } catch (error: any) {
      console.error("Error fetching subscribers list:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar lista de assinantes" });
    }
  });

  // Vault endpoints
  app.get("/api/creator/vault/content", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar cofre" });
      }

      const filters = {
        type: (req.query.type as 'all' | 'images' | 'videos' | 'audios') || 'all',
        folderId: req.query.folderId ? parseInt(req.query.folderId as string) : null,
        search: req.query.search as string || '',
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const vaultContent = await storage.getCreatorVaultContent(req.user!.id, filters);
      res.json(vaultContent);
    } catch (error: any) {
      console.error("Error fetching vault content:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar conteúdo do cofre" });
    }
  });

  app.get("/api/creator/vault/folders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem acessar pastas do cofre" });
      }

      const folders = await storage.getCreatorFolders(req.user!.id);
      res.json(folders);
    } catch (error: any) {
      console.error("Error fetching vault folders:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar pastas do cofre" });
    }
  });

  app.post("/api/creator/vault/folders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem criar pastas" });
      }

      const { name } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "Nome da pasta é obrigatório" });
      }

      const newFolder = await storage.createFolder(req.user!.id, name.trim());
      res.status(201).json(newFolder);
    } catch (error: any) {
      console.error("Error creating vault folder:", error);
      res.status(500).json({ error: error.message || "Erro ao criar pasta" });
    }
  });

  app.patch("/api/creator/vault/content/:id/move", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem mover conteúdo" });
      }

      const contentId = parseInt(req.params.id);
      const { folderId } = req.body;

      if (isNaN(contentId)) {
        return res.status(400).json({ error: "ID do conteúdo inválido" });
      }

      await storage.moveContentToFolder(contentId, folderId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error moving content:", error);
      res.status(500).json({ error: error.message || "Erro ao mover conteúdo" });
    }
  });

  app.delete("/api/creator/vault/content/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') {
        return res.status(403).json({ error: "Apenas criadores podem excluir conteúdo" });
      }

      const contentId = parseInt(req.params.id);

      if (isNaN(contentId)) {
        return res.status(400).json({ error: "ID do conteúdo inválido" });
      }

      const success = await storage.deleteContent(contentId, req.user!.id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Conteúdo não encontrado" });
      }
    } catch (error: any) {
      console.error("Error deleting content:", error);
      res.status(500).json({ error: error.message || "Erro ao excluir conteúdo" });
    }
  });

  // Queue/Calendar routes
  app.get("/api/creator/calendar", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

      const calendarData = await storage.getCalendarData(req.user!.id, year, month);
      res.json(calendarData);
    } catch (error: any) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({ error: "Erro ao buscar dados do calendário" });
    }
  });

  // Scheduled posts routes
  app.get("/api/creator/scheduled-posts/date", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const date = new Date(req.query.date as string);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Data inválida" });
      }

      const scheduledPosts = await storage.getScheduledPostsByDate(req.user!.id, date);
      res.json(scheduledPosts);
    } catch (error: any) {
      console.error("Error fetching scheduled posts by date:", error);
      res.status(500).json({ error: "Erro ao buscar posts agendados" });
    }
  });

  app.post("/api/creator/scheduled-posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { 
        scheduledDate, 
        title, 
        content, 
        mediaUrls, 
        tags, 
        isExclusive, 
        folderId, 
        notificationEnabled 
      } = req.body;

      if (!scheduledDate || !title || !content) {
        return res.status(400).json({ error: "Data, título e conteúdo são obrigatórios" });
      }

      const scheduledPost = await storage.createScheduledPost({
        creatorId: req.user!.id,
        scheduledDate: new Date(scheduledDate),
        title,
        content,
        mediaUrls: mediaUrls || [],
        tags: tags || [],
        isExclusive: isExclusive || false,
        folderId: folderId || null,
        notificationEnabled: notificationEnabled !== false,
      });

      res.status(201).json(scheduledPost);
    } catch (error: any) {
      console.error("Error creating scheduled post:", error);
      res.status(500).json({ error: "Erro ao agendar post" });
    }
  });

  app.patch("/api/creator/scheduled-posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const { 
        scheduledDate, 
        title, 
        content, 
        mediaUrls, 
        tags, 
        isExclusive, 
        folderId, 
        notificationEnabled 
      } = req.body;

      const updateData: any = {};
      if (scheduledDate !== undefined) updateData.scheduledDate = new Date(scheduledDate);
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (mediaUrls !== undefined) updateData.mediaUrls = mediaUrls;
      if (tags !== undefined) updateData.tags = tags;
      if (isExclusive !== undefined) updateData.isExclusive = isExclusive;
      if (folderId !== undefined) updateData.folderId = folderId;
      if (notificationEnabled !== undefined) updateData.notificationEnabled = notificationEnabled;

      const updatedPost = await storage.updateScheduledPost(id, req.user!.id, updateData);
      res.json(updatedPost);
    } catch (error: any) {
      console.error("Error updating scheduled post:", error);
      res.status(500).json({ error: error.message || "Erro ao atualizar post agendado" });
    }
  });

  app.delete("/api/creator/scheduled-posts/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const deleted = await storage.deleteScheduledPost(id, req.user!.id);
      if (!deleted) {
        return res.status(404).json({ error: "Post agendado não encontrado" });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting scheduled post:", error);
      res.status(500).json({ error: "Erro ao excluir post agendado" });
    }
  });

  app.post("/api/creator/scheduled-posts/:id/publish", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const publishedPost = await storage.publishScheduledPost(id);
      res.status(201).json(publishedPost);
    } catch (error: any) {
      console.error("Error publishing scheduled post:", error);
      res.status(500).json({ error: error.message || "Erro ao publicar post agendado" });
    }
  });

  // Reminders routes
  app.get("/api/creator/reminders/date", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const date = new Date(req.query.date as string);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Data inválida" });
      }

      const reminders = await storage.getRemindersByDate(req.user!.id, date);
      res.json(reminders);
    } catch (error: any) {
      console.error("Error fetching reminders by date:", error);
      res.status(500).json({ error: "Erro ao buscar lembretes" });
    }
  });

  app.post("/api/creator/reminders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { reminderDate, title, description, notificationEnabled } = req.body;

      if (!reminderDate || !title) {
        return res.status(400).json({ error: "Data e título são obrigatórios" });
      }

      const reminder = await storage.createReminder({
        creatorId: req.user!.id,
        reminderDate: new Date(reminderDate),
        title,
        description: description || null,
        notificationEnabled: notificationEnabled !== false,
      });

      res.status(201).json(reminder);
    } catch (error: any) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Erro ao criar lembrete" });
    }
  });

  app.patch("/api/creator/reminders/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const { reminderDate, title, description, notificationEnabled, isCompleted } = req.body;

      const updateData: any = {};
      if (reminderDate !== undefined) updateData.reminderDate = new Date(reminderDate);
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (notificationEnabled !== undefined) updateData.notificationEnabled = notificationEnabled;
      if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

      const updatedReminder = await storage.updateReminder(id, req.user!.id, updateData);
      res.json(updatedReminder);
    } catch (error: any) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ error: error.message || "Erro ao atualizar lembrete" });
    }
  });

  app.delete("/api/creator/reminders/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const deleted = await storage.deleteReminder(id, req.user!.id);
      if (!deleted) {
        return res.status(404).json({ error: "Lembrete não encontrado" });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ error: "Erro ao excluir lembrete" });
    }
  });

  // ===== PAID MEDIA LINKS ROUTES =====

  // Lista todos os links do criador
  app.get("/api/creator/paid-links", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { isActive } = req.query;
      const filters = isActive ? { isActive: isActive === 'true' } : undefined;

      const links = await storage.getPaidMediaLinks(req.user!.id, filters);
      res.json(links);
    } catch (error: any) {
      console.error("Error fetching paid media links:", error);
      res.status(500).json({ error: "Erro ao buscar links de mídia paga" });
    }
  });

  // Criar novo link
  app.post("/api/creator/paid-links", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { title, description, mediaUrl, mediaType, thumbnailUrl, price, sourceType, sourceId } = req.body;

      if (!title || !mediaUrl || !mediaType || !price) {
        return res.status(400).json({ error: "Título, URL da mídia, tipo e preço são obrigatórios" });
      }

      // Gerar slug único
      const slug = Math.random().toString(36).substring(2, 11); // 9 caracteres aleatórios

      const link = await storage.createPaidMediaLink({
        creatorId: req.user!.id,
        slug,
        title,
        description: description || null,
        mediaUrl,
        mediaType,
        thumbnailUrl: thumbnailUrl || null,
        price: parseFloat(price),
        sourceType,
        sourceId: sourceId || null,
      });

      res.status(201).json(link);
    } catch (error: any) {
      console.error("Error creating paid media link:", error);
      res.status(500).json({ error: "Erro ao criar link de mídia paga" });
    }
  });

  // Atualizar link
  app.patch("/api/creator/paid-links/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const { title, description, price } = req.body;

      if (!title && !description && !price) {
        return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização" });
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (price) updateData.price = parseFloat(price);

      const link = await storage.updatePaidMediaLink(parseInt(id), req.user!.id, updateData);
      res.json(link);
    } catch (error: any) {
      console.error("Error updating paid media link:", error);
      res.status(500).json({ error: "Erro ao atualizar link de mídia paga" });
    }
  });

  // Excluir link
  app.delete("/api/creator/paid-links/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const success = await storage.deletePaidMediaLink(parseInt(id), req.user!.id);

      if (!success) {
        return res.status(404).json({ error: "Link não encontrado" });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting paid media link:", error);
      res.status(500).json({ error: "Erro ao excluir link de mídia paga" });
    }
  });

  // Ativar/desativar link
  app.patch("/api/creator/paid-links/:id/toggle", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const link = await storage.togglePaidMediaLinkStatus(parseInt(id), req.user!.id);
      res.json(link);
    } catch (error: any) {
      console.error("Error toggling paid media link status:", error);
      res.status(500).json({ error: "Erro ao alterar status do link" });
    }
  });

  // Estatísticas detalhadas do link
  app.get("/api/creator/paid-links/:id/stats", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const purchases = await storage.getPurchasesByLink(parseInt(id));
      
      // Calcular estatísticas
      const stats = {
        totalPurchases: purchases.length,
        totalRevenue: purchases.reduce((sum, purchase) => sum + purchase.amount, 0),
        recentPurchases: purchases.slice(0, 10), // Últimas 10 compras
        averagePrice: purchases.length > 0 ? purchases.reduce((sum, purchase) => sum + purchase.amount, 0) / purchases.length : 0,
      };

      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching link stats:", error);
      res.status(500).json({ error: "Erro ao buscar estatísticas do link" });
    }
  });

  // ===== PAID MEDIA LINKS - ROTAS PÚBLICAS =====

  // Preview do link (público)
  app.get("/api/paid-link/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const link = await storage.getPaidMediaLinkBySlug(slug);

      if (!link || !link.isActive) {
        return res.status(404).json({ error: "Link não encontrado ou desativado" });
      }

      // Incrementar contador de views
      await storage.updateLinkStats(link.id, 'view');

      // Buscar dados do criador
      const creator = await storage.getUser(link.creatorId);
      if (!creator) {
        return res.status(404).json({ error: "Criador não encontrado" });
      }

      res.json({
        ...link,
        creator: {
          id: creator.id,
          username: creator.username,
          display_name: creator.display_name,
          profile_image: creator.profile_image,
        }
      });
    } catch (error: any) {
      console.error("Error fetching paid link preview:", error);
      res.status(500).json({ error: "Erro ao buscar preview do link" });
    }
  });

  // Iniciar processo de compra (placeholder)
  app.post("/api/paid-link/:slug/purchase", async (req, res) => {
    try {
      const { slug } = req.params;
      const link = await storage.getPaidMediaLinkBySlug(slug);

      if (!link || !link.isActive) {
        return res.status(404).json({ error: "Link não encontrado ou desativado" });
      }

      // Simular processo de pagamento (placeholder)
      const accessToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Criar purchase simulada
      const purchase = await storage.createPurchase({
        linkId: link.id,
        userId: null, // Compra anônima
        amount: link.price,
        paymentStatus: "completed", // Simulado como completado
        accessToken,
        expiresAt: null, // Acesso permanente
      });

      // Atualizar estatísticas
      await storage.updateLinkStats(link.id, 'purchase', link.price);

      res.json({
        success: true,
        accessToken,
        message: "Compra realizada com sucesso! (Simulado)"
      });
    } catch (error: any) {
      console.error("Error processing purchase:", error);
      res.status(500).json({ error: "Erro ao processar compra" });
    }
  });

  // Verificar acesso e liberar mídia
  app.get("/api/paid-link/:slug/verify/:token", async (req, res) => {
    try {
      const { slug, token } = req.params;
      const link = await storage.getPaidMediaLinkBySlug(slug);

      if (!link) {
        return res.status(404).json({ error: "Link não encontrado" });
      }

      const hasAccess = await storage.verifyPurchaseAccess(link.id, token);

      if (!hasAccess) {
        return res.status(403).json({ error: "Acesso negado. Token inválido ou expirado." });
      }

      // Buscar dados do criador
      const creator = await storage.getUser(link.creatorId);
      if (!creator) {
        return res.status(404).json({ error: "Criador não encontrado" });
      }

      res.json({
        ...link,
        creator: {
          id: creator.id,
          username: creator.username,
          display_name: creator.display_name,
          profile_image: creator.profile_image,
        }
      });
    } catch (error: any) {
      console.error("Error verifying access:", error);
      res.status(500).json({ error: "Erro ao verificar acesso" });
    }
  });

  // ===== PROMOTIONS & SUBSCRIPTION MANAGEMENT ROUTES =====

  // Subscription Price Routes
  app.get("/api/creator/subscription-price", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const price = await storage.getSubscriptionPrice(req.user!.id);
      res.json({ price });
    } catch (error: any) {
      console.error("Error fetching subscription price:", error);
      res.status(500).json({ error: "Erro ao buscar preço da assinatura" });
    }
  });

  app.patch("/api/creator/subscription-price", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { price } = req.body;

      if (typeof price !== 'number' || price < 3.99 || price > 100.00) {
        return res.status(400).json({ error: "Preço deve estar entre R$ 3,99 e R$ 100,00" });
      }

      await storage.updateSubscriptionPrice(req.user!.id, price);
      res.json({ message: "Preço atualizado com sucesso" });
    } catch (error: any) {
      console.error("Error updating subscription price:", error);
      res.status(500).json({ error: "Erro ao atualizar preço da assinatura" });
    }
  });

  // Free Trial Setting Routes
  app.get("/api/creator/free-trial-setting", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const allowed = await storage.getFreeTrialSetting(req.user!.id);
      res.json({ allowed });
    } catch (error: any) {
      console.error("Error fetching free trial setting:", error);
      res.status(500).json({ error: "Erro ao buscar configuração de teste gratuito" });
    }
  });

  app.patch("/api/creator/free-trial-setting", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { allowed } = req.body;

      if (typeof allowed !== 'boolean') {
        return res.status(400).json({ error: "Valor inválido para configuração de teste gratuito" });
      }

      await storage.updateFreeTrialSetting(req.user!.id, allowed);
      res.json({ message: "Configuração de teste gratuito atualizada com sucesso" });
    } catch (error: any) {
      console.error("Error updating free trial setting:", error);
      res.status(500).json({ error: "Erro ao atualizar configuração de teste gratuito" });
    }
  });

  // Subscription Packages Routes
  app.get("/api/creator/subscription-packages", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const packages = await storage.getSubscriptionPackages(req.user!.id);
      res.json(packages);
    } catch (error: any) {
      console.error("Error fetching subscription packages:", error);
      res.status(500).json({ error: "Erro ao buscar pacotes de subscrição" });
    }
  });

  app.post("/api/creator/subscription-packages", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { durationMonths, discountPercent } = req.body;

      // Validações
      if (![3, 6, 12].includes(durationMonths)) {
        return res.status(400).json({ error: "Duração deve ser 3, 6 ou 12 meses" });
      }

      if (typeof discountPercent !== 'number' || discountPercent < 1 || discountPercent > 50) {
        return res.status(400).json({ error: "Desconto deve estar entre 1% e 50%" });
      }

      // Verificar se já existe pacote com a mesma duração
      const existingPackages = await storage.getSubscriptionPackages(req.user!.id);
      const duplicatePackage = existingPackages.find(pkg => pkg.durationMonths === durationMonths);
      if (duplicatePackage) {
        return res.status(400).json({ error: "Já existe um pacote com esta duração" });
      }

      // Verificar limite de 3 pacotes ativos
      const activePackages = existingPackages.filter(pkg => pkg.isActive);
      if (activePackages.length >= 3) {
        return res.status(400).json({ error: "Máximo de 3 pacotes ativos simultaneamente" });
      }

      const newPackage = await storage.createSubscriptionPackage({
        creatorId: req.user!.id,
        durationMonths,
        discountPercent,
        isActive: true
      });

      res.status(201).json(newPackage);
    } catch (error: any) {
      console.error("Error creating subscription package:", error);
      res.status(500).json({ error: "Erro ao criar pacote de subscrição" });
    }
  });

  app.patch("/api/creator/subscription-packages/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const { durationMonths, discountPercent } = req.body;

      // Validações
      if (durationMonths && ![3, 6, 12].includes(durationMonths)) {
        return res.status(400).json({ error: "Duração deve ser 3, 6 ou 12 meses" });
      }

      if (discountPercent !== undefined && (typeof discountPercent !== 'number' || discountPercent < 1 || discountPercent > 50)) {
        return res.status(400).json({ error: "Desconto deve estar entre 1% e 50%" });
      }

      const updatedPackage = await storage.updateSubscriptionPackage(
        parseInt(id),
        req.user!.id,
        { durationMonths, discountPercent }
      );

      res.json(updatedPackage);
    } catch (error: any) {
      console.error("Error updating subscription package:", error);
      res.status(500).json({ error: "Erro ao atualizar pacote de subscrição" });
    }
  });

  app.delete("/api/creator/subscription-packages/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const success = await storage.deleteSubscriptionPackage(parseInt(id), req.user!.id);

      if (!success) {
        return res.status(404).json({ error: "Pacote não encontrado" });
      }

      res.json({ message: "Pacote excluído com sucesso" });
    } catch (error: any) {
      console.error("Error deleting subscription package:", error);
      res.status(500).json({ error: "Erro ao excluir pacote de subscrição" });
    }
  });

  app.patch("/api/creator/subscription-packages/:id/toggle", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const updatedPackage = await storage.togglePackageStatus(parseInt(id), req.user!.id);

      res.json(updatedPackage);
    } catch (error: any) {
      console.error("Error toggling package status:", error);
      res.status(500).json({ error: "Erro ao alterar status do pacote" });
    }
  });

  // Promotional Offers Routes
  app.get("/api/creator/promotional-offers", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { isActive } = req.query;
      const filters = isActive ? { isActive: isActive === 'true' } : undefined;

      const offers = await storage.getPromotionalOffers(req.user!.id, filters);
      res.json(offers);
    } catch (error: any) {
      console.error("Error fetching promotional offers:", error);
      res.status(500).json({ error: "Erro ao buscar ofertas promocionais" });
    }
  });

  app.post("/api/creator/promotional-offers", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { title, description, offerType, trialDays, discountPercent, discountDurationMonths, targetAudience, notifyFollowers, startDate, endDate } = req.body;

      // Validações básicas
      if (!title || title.length < 3) {
        return res.status(400).json({ error: "Título deve ter pelo menos 3 caracteres" });
      }

      if (!['trial', 'discount'].includes(offerType)) {
        return res.status(400).json({ error: "Tipo de oferta deve ser 'trial' ou 'discount'" });
      }

      if (!['new', 'existing', 'all'].includes(targetAudience)) {
        return res.status(400).json({ error: "Público-alvo deve ser 'new', 'existing' ou 'all'" });
      }

      // Validações específicas por tipo
      if (offerType === 'trial') {
        if (!trialDays || ![3, 7, 14, 30].includes(trialDays)) {
          return res.status(400).json({ error: "Dias de teste deve ser 3, 7, 14 ou 30" });
        }
      } else if (offerType === 'discount') {
        if (typeof discountPercent !== 'number' || discountPercent < 5 || discountPercent > 70) {
          return res.status(400).json({ error: "Desconto deve estar entre 5% e 70%" });
        }
        if (!discountDurationMonths || discountDurationMonths < 1 || discountDurationMonths > 12) {
          return res.status(400).json({ error: "Duração do desconto deve estar entre 1 e 12 meses" });
        }
      }

      // Verificar limite de 5 ofertas ativas
      const activeOffers = await storage.getPromotionalOffers(req.user!.id, { isActive: true });
      if (activeOffers.length >= 5) {
        return res.status(400).json({ error: "Máximo de 5 ofertas ativas simultaneamente" });
      }

      // Validar datas
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "Data de fim deve ser posterior à data de início" });
      }

      const newOffer = await storage.createPromotionalOffer({
        creatorId: req.user!.id,
        title,
        description,
        offerType,
        trialDays: offerType === 'trial' ? trialDays : null,
        discountPercent: offerType === 'discount' ? discountPercent : null,
        discountDurationMonths: offerType === 'discount' ? discountDurationMonths : null,
        targetAudience,
        notifyFollowers: notifyFollowers || false,
        isActive: true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      });

      res.status(201).json(newOffer);
    } catch (error: any) {
      console.error("Error creating promotional offer:", error);
      res.status(500).json({ error: "Erro ao criar oferta promocional" });
    }
  });

  app.patch("/api/creator/promotional-offers/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const { title, description, targetAudience, notifyFollowers, startDate, endDate } = req.body;

      // Validações básicas
      if (title && title.length < 3) {
        return res.status(400).json({ error: "Título deve ter pelo menos 3 caracteres" });
      }

      if (targetAudience && !['new', 'existing', 'all'].includes(targetAudience)) {
        return res.status(400).json({ error: "Público-alvo deve ser 'new', 'existing' ou 'all'" });
      }

      // Validar datas
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "Data de fim deve ser posterior à data de início" });
      }

      const updatedOffer = await storage.updatePromotionalOffer(
        parseInt(id),
        req.user!.id,
        { 
          title, 
          description, 
          targetAudience, 
          notifyFollowers,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null
        }
      );

      res.json(updatedOffer);
    } catch (error: any) {
      console.error("Error updating promotional offer:", error);
      res.status(500).json({ error: "Erro ao atualizar oferta promocional" });
    }
  });

  app.delete("/api/creator/promotional-offers/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const success = await storage.deletePromotionalOffer(parseInt(id), req.user!.id);

      if (!success) {
        return res.status(404).json({ error: "Oferta não encontrada" });
      }

      res.json({ message: "Oferta excluída com sucesso" });
    } catch (error: any) {
      console.error("Error deleting promotional offer:", error);
      res.status(500).json({ error: "Erro ao excluir oferta promocional" });
    }
  });

  app.patch("/api/creator/promotional-offers/:id/toggle", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { id } = req.params;
      const updatedOffer = await storage.toggleOfferStatus(parseInt(id), req.user!.id);

      res.json(updatedOffer);
    } catch (error: any) {
      console.error("Error toggling offer status:", error);
      res.status(500).json({ error: "Erro ao alterar status da oferta" });
    }
  });

  // ===== AUTOMATIC MESSAGES ROUTES =====

  // Listar todas as mensagens do criador
  app.get("/api/creator/automatic-messages", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      // Temporário: permitir acesso para debug
      console.log("User type:", req.user!.user_type);
      console.log("User ID:", req.user!.id);
      
      const creatorId = req.user!.id;
      const messages = await storage.getAutomaticMessages(creatorId);
      
      console.log("Messages returned:", messages.length);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching automatic messages:", error);
      res.status(500).json({ error: "Erro ao buscar mensagens automáticas" });
    }
  });

  // Buscar mensagem específica
  app.get("/api/creator/automatic-messages/:eventType", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const creatorId = req.user!.id;
      const { eventType } = req.params;
      
      // Validar eventType
      const validEventTypes = ['new_subscriber', 'new_follower', 'subscriber_canceled', 're_subscribed', 'subscription_renewed', 'new_purchase', 'first_message_reply'];
      if (!validEventTypes.includes(eventType)) {
        return res.status(400).json({ error: "Tipo de evento inválido" });
      }

      const message = await storage.getAutomaticMessageByEvent(creatorId, eventType);
      
      if (!message) {
        return res.status(404).json({ error: "Mensagem não encontrada" });
      }
      
      res.json(message);
    } catch (error) {
      console.error("Error fetching automatic message:", error);
      res.status(500).json({ error: "Erro ao buscar mensagem automática" });
    }
  });

  // Criar ou atualizar mensagem
  app.put("/api/creator/automatic-messages/:eventType", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const creatorId = req.user!.id;
      const { eventType } = req.params;
      const { isEnabled, messageText } = req.body;

      // Validar eventType
      const validEventTypes = ['new_subscriber', 'new_follower', 'subscriber_canceled', 're_subscribed', 'subscription_renewed', 'new_purchase', 'first_message_reply'];
      if (!validEventTypes.includes(eventType)) {
        return res.status(400).json({ error: "Tipo de evento inválido" });
      }

      // Validar dados
      if (typeof isEnabled !== 'boolean') {
        return res.status(400).json({ error: "isEnabled deve ser um boolean" });
      }

      if (!messageText || typeof messageText !== 'string') {
        return res.status(400).json({ error: "messageText é obrigatório" });
      }

      if (messageText.length < 1 || messageText.length > 500) {
        return res.status(400).json({ error: "messageText deve ter entre 1 e 500 caracteres" });
      }

      const message = await storage.upsertAutomaticMessage(creatorId, eventType, {
        isEnabled,
        messageText
      });

      res.json(message);
    } catch (error) {
      console.error("Error upserting automatic message:", error);
      res.status(500).json({ error: "Erro ao salvar mensagem automática" });
    }
  });

  // Toggle ativar/desativar
  app.patch("/api/creator/automatic-messages/:eventType/toggle", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const creatorId = req.user!.id;
      const { eventType } = req.params;

      // Validar eventType
      const validEventTypes = ['new_subscriber', 'new_follower', 'subscriber_canceled', 're_subscribed', 'subscription_renewed', 'new_purchase', 'first_message_reply'];
      if (!validEventTypes.includes(eventType)) {
        return res.status(400).json({ error: "Tipo de evento inválido" });
      }

      const message = await storage.toggleAutomaticMessage(creatorId, eventType);
      
      res.json(message);
    } catch (error) {
      console.error("Error toggling automatic message:", error);
      res.status(500).json({ error: "Erro ao alterar status da mensagem automática" });
    }
  });

  // Resetar para mensagem padrão
  app.post("/api/creator/automatic-messages/:eventType/reset", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const creatorId = req.user!.id;
      const { eventType } = req.params;

      // Validar eventType
      const validEventTypes = ['new_subscriber', 'new_follower', 'subscriber_canceled', 're_subscribed', 'subscription_renewed', 'new_purchase', 'first_message_reply'];
      if (!validEventTypes.includes(eventType)) {
        return res.status(400).json({ error: "Tipo de evento inválido" });
      }

      const message = await storage.resetAutomaticMessage(creatorId, eventType);
      
      res.json(message);
    } catch (error) {
      console.error("Error resetting automatic message:", error);
      res.status(500).json({ error: "Erro ao resetar mensagem automática" });
    }
  });

  // ===== SUBSCRIBER LISTS ROUTES =====

  // Listar todas as listas do criador
  app.get("/api/creator/lists", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { listType, isActive } = req.query;
      const filters: any = {};
      
      if (listType) filters.listType = listType as 'smart' | 'custom';
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const lists = await storage.getSubscriberLists(req.user!.id, filters);
      res.json(lists);
    } catch (error: any) {
      console.error("Error fetching subscriber lists:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar listas" });
    }
  });

  // Detalhes de uma lista específica
  app.get("/api/creator/lists/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      if (isNaN(listId)) {
        return res.status(400).json({ error: "ID da lista inválido" });
      }

      const list = await storage.getListById(listId, req.user!.id);
      if (!list) {
        return res.status(404).json({ error: "Lista não encontrada" });
      }

      res.json(list);
    } catch (error: any) {
      console.error("Error fetching list details:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar lista" });
    }
  });

  // Criar nova lista
  app.post("/api/creator/lists", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { name, description, listType, filters } = req.body;

      if (!name || !listType) {
        return res.status(400).json({ error: "Nome e tipo da lista são obrigatórios" });
      }

      if (name.length < 3 || name.length > 50) {
        return res.status(400).json({ error: "Nome deve ter entre 3 e 50 caracteres" });
      }

      if (description && description.length > 200) {
        return res.status(400).json({ error: "Descrição deve ter no máximo 200 caracteres" });
      }

      if (!['smart', 'custom'].includes(listType)) {
        return res.status(400).json({ error: "Tipo da lista deve ser 'smart' ou 'custom'" });
      }

      const newList = await storage.createSubscriberList({
        creatorId: req.user!.id,
        name: name.trim(),
        description: description?.trim() || null,
        listType,
        filters: filters ? JSON.stringify(filters) : null,
      });

      res.status(201).json(newList);
    } catch (error: any) {
      console.error("Error creating list:", error);
      res.status(500).json({ error: error.message || "Erro ao criar lista" });
    }
  });

  // Atualizar lista existente
  app.patch("/api/creator/lists/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      if (isNaN(listId)) {
        return res.status(400).json({ error: "ID da lista inválido" });
      }

      const { name, description, filters } = req.body;

      const updateData: any = {};
      if (name !== undefined) {
        if (name.length < 3 || name.length > 50) {
          return res.status(400).json({ error: "Nome deve ter entre 3 e 50 caracteres" });
        }
        updateData.name = name.trim();
      }
      if (description !== undefined) {
        if (description && description.length > 200) {
          return res.status(400).json({ error: "Descrição deve ter no máximo 200 caracteres" });
        }
        updateData.description = description?.trim() || null;
      }
      if (filters !== undefined) {
        updateData.filters = filters ? JSON.stringify(filters) : null;
      }

      const updatedList = await storage.updateSubscriberList(listId, req.user!.id, updateData);
      res.json(updatedList);
    } catch (error: any) {
      console.error("Error updating list:", error);
      res.status(500).json({ error: error.message || "Erro ao atualizar lista" });
    }
  });

  // Excluir lista
  app.delete("/api/creator/lists/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      if (isNaN(listId)) {
        return res.status(400).json({ error: "ID da lista inválido" });
      }

      await storage.deleteSubscriberList(listId, req.user!.id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting list:", error);
      res.status(500).json({ error: error.message || "Erro ao excluir lista" });
    }
  });

  // Ativar/desativar lista
  app.patch("/api/creator/lists/:id/toggle", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      if (isNaN(listId)) {
        return res.status(400).json({ error: "ID da lista inválido" });
      }

      const updatedList = await storage.toggleListStatus(listId, req.user!.id);
      res.json(updatedList);
    } catch (error: any) {
      console.error("Error toggling list status:", error);
      res.status(500).json({ error: error.message || "Erro ao alterar status da lista" });
    }
  });

  // ===== LIST MEMBERS ROUTES =====

  // Listar membros da lista (paginado)
  app.get("/api/creator/lists/:id/members", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      if (isNaN(listId)) {
        return res.status(400).json({ error: "ID da lista inválido" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await storage.getListMembers(listId, req.user!.id, page, limit);
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching list members:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar membros da lista" });
    }
  });

  // Adicionar membro à lista
  app.post("/api/creator/lists/:id/members", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      const { userId } = req.body;

      if (isNaN(listId)) {
        return res.status(400).json({ error: "ID da lista inválido" });
      }

      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const newMember = await storage.addMemberToList(listId, userId, req.user!.id);
      res.status(201).json(newMember);
    } catch (error: any) {
      console.error("Error adding member to list:", error);
      res.status(500).json({ error: error.message || "Erro ao adicionar membro à lista" });
    }
  });

  // Remover membro da lista
  app.delete("/api/creator/lists/:id/members/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      const userId = parseInt(req.params.userId);

      if (isNaN(listId) || isNaN(userId)) {
        return res.status(400).json({ error: "IDs inválidos" });
      }

      await storage.removeMemberFromList(listId, userId, req.user!.id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error removing member from list:", error);
      res.status(500).json({ error: error.message || "Erro ao remover membro da lista" });
    }
  });

  // Adicionar múltiplos membros à lista
  app.post("/api/creator/lists/:id/members/bulk", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      const { userIds } = req.body;

      if (isNaN(listId)) {
        return res.status(400).json({ error: "ID da lista inválido" });
      }

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "Lista de IDs de usuários é obrigatória" });
      }

      const validUserIds = userIds.filter(id => typeof id === 'number' && !isNaN(id));
      if (validUserIds.length === 0) {
        return res.status(400).json({ error: "IDs de usuários inválidos" });
      }

      const newMembers = await storage.addMultipleMembersToList(listId, validUserIds, req.user!.id);
      res.status(201).json(newMembers);
    } catch (error: any) {
      console.error("Error adding multiple members to list:", error);
      res.status(500).json({ error: error.message || "Erro ao adicionar membros à lista" });
    }
  });

  // ===== BULK ACTIONS ROUTES =====

  // Enviar mensagem em massa para a lista
  app.post("/api/creator/lists/:id/send-message", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const listId = parseInt(req.params.id);
      const { message } = req.body;

      if (isNaN(listId)) {
        return res.status(400).json({ error: "ID da lista inválido" });
      }

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: "Mensagem é obrigatória" });
      }

      if (message.length > 500) {
        return res.status(400).json({ error: "Mensagem deve ter no máximo 500 caracteres" });
      }

      const result = await storage.sendMessageToList(listId, req.user!.id, message.trim());
      res.json(result);
    } catch (error: any) {
      console.error("Error sending message to list:", error);
      res.status(500).json({ error: error.message || "Erro ao enviar mensagens" });
    }
  });

  // Preview de membros de lista inteligente
  app.post("/api/creator/lists/preview-smart", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      if (req.user!.user_type !== 'creator') return res.sendStatus(403);

      const { filters } = req.body;

      if (!filters || typeof filters !== 'object') {
        return res.status(400).json({ error: "Filtros são obrigatórios" });
      }

      const members = await storage.getSmartListMembers(req.user!.id, filters);
      res.json({
        memberCount: members.length,
        preview: members.slice(0, 10) // Primeiros 10 membros como preview
      });
    } catch (error: any) {
      console.error("Error previewing smart list:", error);
      res.status(500).json({ error: error.message || "Erro ao gerar preview da lista" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
