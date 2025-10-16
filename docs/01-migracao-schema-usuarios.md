# Implementação 1: Migração do Schema de Usuários e Integração com Supabase

**Data:** Outubro 2024  
**Status:** ✅ Concluído

---

## 📋 Contexto e Motivação

A aplicação Preseview estava utilizando um schema de banco de dados com nomenclatura em camelCase (`displayName`, `userType`, `createdAt`), mas o banco de dados Supabase utiliza convenção snake_case (`display_name`, `user_type`, `created_at`). Isso causava incompatibilidades e erros ao tentar criar ou buscar usuários.

### Problemas Identificados

1. **Erro de coluna não encontrada**: `Could not find the 'displayName' column of 'users' in the schema cache`
2. **Erro de coluna não encontrada**: `Could not find the 'user_type' column of 'users' in the schema cache`
3. **Violação de RLS**: `new row violates row-level security policy for table "users"`
4. **Constraint NOT NULL**: `null value in column "created_at" of relation "users" violates not-null constraint`

---

## 🔧 Mudanças Implementadas

### 1. Schema TypeScript (`shared/schema.ts`)

**Alterações:**
- Atualizado o schema Drizzle para refletir os nomes de colunas do Supabase (snake_case)
- Corrigidos os schemas de inserção para usar os nomes corretos

```typescript
// ANTES
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("displayName").notNull(), // ❌ camelCase
  userType: userTypeEnum("userType").default('user').notNull(), // ❌ camelCase
  createdAt: timestamp("createdAt").defaultNow().notNull(), // ❌ camelCase
  updatedAt: timestamp("updatedAt").defaultNow().notNull(), // ❌ camelCase
});

// DEPOIS
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  display_name: text("display_name").notNull(), // ✅ snake_case
  user_type: userTypeEnum("user_type").default('user').notNull(), // ✅ snake_case
  created_at: timestamp("created_at").defaultNow().notNull(), // ✅ snake_case
  updated_at: timestamp("updated_at").defaultNow().notNull(), // ✅ snake_case
});

// Schemas de inserção também foram atualizados
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true, // ✅ snake_case
  updated_at: true, // ✅ snake_case
});
```

### 2. Backend - Storage (`server/storage.ts`)

**Alterações:**
- Migrados métodos críticos de Drizzle (`db`) para Supabase client
- Ajustados todos os campos para snake_case nas operações de banco

```typescript
// Método getUser migrado para Supabase
async getUser(id: number): Promise<User | undefined> {
  try {
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

// Método createUser atualizado
async createUser(userData: InsertUser): Promise<User> {
  const userDataWithTimestamp = {
    ...userData,
    created_at: new Date().toISOString(), // ✅ Adicionado explicitamente
  };

  const { data, error } = await supabase
    .from('users')
    .insert(userDataWithTimestamp)
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao criar usuário no Supabase:', error);
    throw new Error(error.message);
  }

  return data as User;
}
```

**Outros métodos migrados:**
- `getUserByUsername()`
- `getUserByEmail()`
- `updateUser()`
- `upgradeToCreator()`

### 3. Backend - Autenticação (`server/auth.ts`)

**Alterações:**
- Criado schema Zod customizado para aceitar camelCase do frontend
- Mapeamento explícito de camelCase → snake_case antes de salvar no banco
- Padronização da resposta da API em camelCase para o frontend

```typescript
// Schema Zod customizado para registro
const registerSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  displayName: z.string().min(1, "Nome de exibição é obrigatório"), // ✅ camelCase do frontend
  userType: z.enum(['user', 'creator']).optional(),
});

// Mapeamento para snake_case
const sanitizedUserData = {
  username: username.trim(),
  email: email.trim().toLowerCase(),
  password: await hashPassword(password),
  display_name: displayName.trim(), // ✅ snake_case para o banco
  user_type: userType || 'user', // ✅ snake_case para o banco
};

const user = await storage.createUser(sanitizedUserData);

// Resposta em camelCase para o frontend
res.status(201).json({ 
  id: user.id,
  username: user.username,
  email: user.email,
  displayName: user.display_name, // ✅ camelCase para o frontend
  userType: user.user_type, // ✅ camelCase para o frontend
  isVerified: user.is_verified // ✅ camelCase para o frontend
});
```

### 4. Backend - Rotas (`server/routes.ts`)

**Alterações:**
- Atualizado `display_name` em todas as operações de atualização de perfil
- Corrigido `user_type` em verificações de criador

```typescript
// Atualização de perfil
app.patch("/api/user/profile", async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { displayName, bio } = req.body;
    if (!displayName) {
      return res.status(400).json({ error: "Nome de exibição é obrigatório" });
    }

    const user = await storage.updateUser(req.user!.id, {
      display_name: displayName, // ✅ snake_case para o banco
      bio: bio || null,
    });
    
    res.json(user);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message || "Erro ao atualizar perfil" });
  }
});

// Verificação de criador
if (req.user!.user_type !== 'creator') { // ✅ snake_case
  return res.status(403).json({ error: "Apenas criadores podem acessar" });
}
```

### 5. Backend - Seed (`server/seed.ts`)

**Alterações:**
- Substituído `displayName` por `display_name` em todos os usuários de exemplo

```typescript
const creators = await db.insert(users).values([
  {
    username: "julia_fitness",
    email: "julia@example.com",
    password: hashedPassword,
    display_name: "Julia Santos", // ✅ snake_case
    bio: "Fitness e bem-estar 💪",
    profile_image: "https://i.pravatar.cc/150?img=1",
    cover_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    user_type: "creator", // ✅ snake_case
    is_verified: true,
  },
  // ... outros criadores
]);
```

---

## 🗄️ Configuração do Supabase

### 1. Criação de Colunas

Executado via SQL Editor no Supabase Dashboard:

```sql
-- Adicionar coluna user_type
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'user' NOT NULL;

-- Verificar estrutura
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';
```

### 2. Políticas de RLS (Row Level Security)

Criada política para permitir inserção de novos usuários:

```sql
-- Política para permitir INSERT público (registro de usuários)
CREATE POLICY "Enable insert for anon and authenticated users" 
ON users 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
```

### 3. Reload do Schema Cache

Após alterações estruturais, forçar reload do cache do PostgREST:

```sql
NOTIFY pgrst, 'reload schema';
```

---

## 🐛 Problemas Encontrados e Soluções

### Problema 1: Coluna `display_name` não existe
**Erro:** `Could not find the 'displayName' column of 'users' in the schema cache`

**Causa:** O código estava usando camelCase mas o Supabase esperava snake_case.

**Solução:**
1. Atualizar schema Drizzle para `display_name`
2. Mapear `displayName` (frontend) → `display_name` (banco) no backend
3. Retornar `displayName` (camelCase) nas respostas da API

---

### Problema 2: Coluna `user_type` não existe
**Erro:** `Could not find the 'user_type' column of 'users' in the schema cache`

**Causa:** Coluna não existia no Supabase.

**Solução:**
1. Criar coluna via SQL: `ALTER TABLE users ADD COLUMN user_type TEXT DEFAULT 'user' NOT NULL;`
2. Atualizar schema Drizzle
3. Reload do schema cache

---

### Problema 3: Violação de RLS
**Erro:** `new row violates row-level security policy for table "users"`

**Causa:** Supabase RLS estava bloqueando inserções.

**Solução:**
Criar política RLS para permitir INSERT público:
```sql
CREATE POLICY "Enable insert for anon and authenticated users" 
ON users FOR INSERT TO anon, authenticated WITH CHECK (true);
```

---

### Problema 4: `created_at` NULL
**Erro:** `null value in column "created_at" of relation "users" violates not-null constraint`

**Causa:** Campo `created_at` não estava sendo fornecido explicitamente.

**Solução:**
Adicionar `created_at: new Date().toISOString()` ao criar usuário:
```typescript
const userDataWithTimestamp = {
  ...userData,
  created_at: new Date().toISOString(),
};
```

---

## ✅ Testes Realizados

### 1. Registro de Usuário
```powershell
$body = @{
  username="testuser_final2"
  email="testfinal2@example.com"
  password="password123"
  displayName="Test User Final 2"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/register" `
  -Method POST -Body $body -ContentType "application/json"
```

**Resultado:** ✅ Status 201, usuário criado com sucesso
```json
{
  "id": "c23faea8-d0f9-45d8-bd97-1951b88610de",
  "username": "testuser_final2",
  "email": "testfinal2@example.com",
  "displayName": "Test User Final 2"
}
```

### 2. Login
```powershell
$body = @{username="testuser_final2"; password="password123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/login" `
  -Method POST -Body $body -ContentType "application/json"
```

**Resultado:** ✅ Status 200, login bem-sucedido

### 3. Buscar Usuário Atual
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/user" -Method GET
```

**Resultado:** ✅ Status 200, dados retornados em camelCase

---

## 🎓 Lições Aprendidas

1. **Convenção de Nomenclatura:** Sempre alinhar a nomenclatura entre schema TypeScript e banco de dados desde o início do projeto.

2. **Mapeamento de Dados:** Criar uma camada de mapeamento clara entre frontend (camelCase) e backend/banco (snake_case) evita confusões.

3. **Supabase RLS:** Sempre configurar políticas RLS adequadas antes de testar operações de banco.

4. **Schema Cache:** Após alterações estruturais no Supabase, sempre executar `NOTIFY pgrst, 'reload schema'`.

5. **Validação de Dados:** Usar Zod para validar e transformar dados na entrada da API garante consistência.

6. **Timestamps Explícitos:** Mesmo com `defaultNow()` no schema, é mais seguro fornecer timestamps explicitamente ao inserir dados via Supabase client.

---

## 🚀 Próximos Passos

1. **Migrar Métodos Restantes:** Ainda existem métodos no `storage.ts` que usam Drizzle (`db`) e precisam ser migrados para Supabase.

2. **Remover Auto-criação de Convidado:** O endpoint `/api/user` cria automaticamente um usuário "convidado" quando não há sessão. Isso deve ser removido ou refatorado.

3. **Padronizar Respostas da API:** Criar um helper/middleware para mapear automaticamente snake_case → camelCase nas respostas.

4. **Testes Automatizados:** Implementar testes unitários e de integração para garantir que o mapeamento funciona corretamente.

5. **Documentar Convenções:** Criar guia de estilo de código definindo quando usar camelCase vs snake_case.

---

## 📚 Referências

- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Zod Validation](https://zod.dev/)
- [PostgreSQL Naming Conventions](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)

---

**Última Atualização:** Outubro 2024  
**Autor:** Equipe Preseview










