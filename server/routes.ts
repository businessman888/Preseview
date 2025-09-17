import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

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

  const httpServer = createServer(app);

  return httpServer;
}
