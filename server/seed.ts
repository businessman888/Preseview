import { db } from "./db";
import { users, creatorProfiles, posts, stories, follows } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  const hashedPassword = await bcrypt.hash("senha123", 10);

  const creators = await db.insert(users).values([
    {
      username: "julia_fitness",
      email: "julia@example.com",
      password: hashedPassword,
      display_name: "Julia Santos",
      bio: "Fitness e bem-estar 💪",
      profileImage: "https://i.pravatar.cc/150?img=1",
      coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      userType: "creator",
      isVerified: true,
    },
    {
      username: "carlos_silva",
      email: "carlos@example.com",
      password: hashedPassword,
      display_name: "Carlos Silva",
      bio: "Fotógrafo profissional 📸",
      profileImage: "https://i.pravatar.cc/150?img=12",
      coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800",
      userType: "creator",
      isVerified: true,
    },
    {
      username: "ana_costa",
      email: "ana@example.com",
      password: hashedPassword,
      display_name: "Ana Costa",
      bio: "Chef e amante da culinária 🍳",
      profileImage: "https://i.pravatar.cc/150?img=5",
      coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
      userType: "creator",
      isVerified: false,
    },
    {
      username: "pedro_oliveira",
      email: "pedro@example.com",
      password: hashedPassword,
      display_name: "Pedro Oliveira",
      bio: "Viajante pelo mundo 🌍",
      profileImage: "https://i.pravatar.cc/150?img=13",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      userType: "creator",
      isVerified: true,
    },
    {
      username: "felipe_gamer",
      email: "felipe@example.com",
      password: hashedPassword,
      display_name: "Felipe Costa",
      bio: "Gamer profissional, Streamings diárias e dicas de games!",
      profileImage: "https://i.pravatar.cc/150?img=8",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      userType: "creator",
      isVerified: true,
    },
    {
      username: "maria_yoga",
      email: "maria@example.com",
      password: hashedPassword,
      display_name: "Maria Oliveira",
      bio: "Professora de yoga, Viva bem-estar!",
      profileImage: "https://i.pravatar.cc/150?img=9",
      coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      userType: "creator",
      isVerified: true,
    },
  ]).returning();

  console.log("✅ Criadores criados:", creators.length);

  await db.insert(creatorProfiles).values(
    creators.map((creator) => ({
      userId: creator.id,
      subscriptionPrice: 29.90,
      description: creator.bio || "",
      categories: ["Lifestyle", "Entretenimento"],
      isActive: true,
      subscriberCount: Math.floor(Math.random() * 1000) + 100,
      postCount: Math.floor(Math.random() * 50) + 10,
    }))
  );

  console.log("✅ Perfis de criadores criados");

  const samplePosts = await db.insert(posts).values([
    {
      creatorId: creators[0].id,
      title: "Treino do dia",
      content: "Mais um dia de superação! 💪 #fitness #motivacao",
      mediaUrls: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"],
      tags: ["fitness", "motivacao"],
      likesCount: 234,
      commentsCount: 18,
      viewsCount: 1250,
    },
    {
      creatorId: creators[1].id,
      title: "Golden Hour",
      content: "Capturando a magia do pôr do sol 🌅",
      mediaUrls: ["https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800"],
      tags: ["fotografia", "natureza"],
      likesCount: 456,
      commentsCount: 32,
      viewsCount: 2340,
    },
    {
      creatorId: creators[2].id,
      title: "Nova receita",
      content: "Bolo de chocolate vegano delicioso! 🍰",
      mediaUrls: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800"],
      tags: ["culinaria", "vegano"],
      likesCount: 189,
      commentsCount: 24,
      viewsCount: 890,
    },
    {
      creatorId: creators[3].id,
      title: "Paris",
      content: "Explorando as ruas de Paris 🗼",
      mediaUrls: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800"],
      tags: ["viagem", "paris"],
      likesCount: 678,
      commentsCount: 45,
      viewsCount: 3210,
    },
  ]).returning();

  console.log("✅ Posts criados:", samplePosts.length);

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await db.insert(stories).values([
    {
      creatorId: creators[0].id,
      mediaUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400",
      caption: "Treino matinal 💪",
      viewsCount: 145,
      expiresAt,
    },
    {
      creatorId: creators[1].id,
      mediaUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400",
      caption: "Nova sessão de fotos 📸",
      viewsCount: 234,
      expiresAt,
    },
    {
      creatorId: creators[2].id,
      mediaUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400",
      caption: "Preparando algo especial 🍳",
      viewsCount: 189,
      expiresAt,
    },
    {
      creatorId: creators[3].id,
      mediaUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      caption: "Em algum lugar da Europa 🌍",
      viewsCount: 312,
      expiresAt,
    },
    {
      creatorId: creators[4].id,
      mediaUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
      caption: "Live às 20h! 🎮",
      viewsCount: 567,
      expiresAt,
    },
    {
      creatorId: creators[5].id,
      mediaUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
      caption: "Aula de yoga ao ar livre 🧘‍♀️",
      viewsCount: 423,
      expiresAt,
    },
  ]);

  console.log("✅ Stories criados");

  const guestUserId = 1;
  
  await db.insert(follows).values(
    creators.map((creator) => ({
      followerId: guestUserId,
      followingId: creator.id,
    }))
  );

  console.log("✅ Follows criados para o usuário convidado");

  console.log("🎉 Seed concluído com sucesso!");
}

seed()
  .catch((error) => {
    console.error("❌ Erro no seed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
