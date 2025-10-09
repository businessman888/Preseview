import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'default_secret_key_for_development',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate request body with Zod schema
      const validationResult = insertUserSchema.extend({
        password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
      }).safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Dados inválidos", 
          details: validationResult.error.flatten().fieldErrors 
        });
      }

      const { username, email, password, displayName, userType } = validationResult.data;
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Nome de usuário já existe" });
      }

      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email já está em uso" });
      }

      // Sanitize and create user with only expected fields
      const sanitizedUserData = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: await hashPassword(password),
        displayName: displayName.trim(),
        userType: userType || 'user',
      };

      const user = await storage.createUser(sanitizedUserData);

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          userType: user.userType,
          isVerified: user.isVerified
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local", {
    failureMessage: "Credenciais inválidas"
  }), (req, res) => {
    const user = req.user as SelectUser;
    res.status(200).json({ 
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      userType: user.userType,
      isVerified: user.isVerified
    });
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      let guestUser = await storage.getUserByUsername("convidado");
      
      if (!guestUser) {
        guestUser = await storage.createUser({
          username: "convidado",
          email: "convidado@app.com",
          password: await hashPassword("123456"),
          displayName: "Usuário Convidado",
          userType: "user",
        });
      }
      
      req.login(guestUser, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao criar sessão" });
        }
        res.json({ 
          id: guestUser.id,
          username: guestUser.username,
          email: guestUser.email,
          displayName: guestUser.displayName,
          userType: guestUser.userType,
          isVerified: guestUser.isVerified
        });
      });
      return;
    }
    const user = req.user as SelectUser;
    res.json({ 
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      userType: user.userType,
      isVerified: user.isVerified
    });
  });
}