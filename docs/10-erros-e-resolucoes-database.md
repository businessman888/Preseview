# Erros de Database e Resoluções

## 📋 **Resumo dos Problemas**

Durante o desenvolvimento das funcionalidades **Fila (Calendário)** e **Links de Mídia Paga**, foram identificados vários erros de database relacionados a tabelas inexistentes.

## 🚨 **Erros Identificados**

### 1. **Tabelas da Funcionalidade Fila (Calendário)**

#### **Erro: Tabela "reminders" não existe**
```
Error fetching reminders by date: error: relation "reminders" does not exist
Error fetching calendar data: error: relation "reminders" does not exist
```

**Arquivos afetados:**
- `server/storage.ts` - funções `getRemindersByDate()` e `getRemindersByMonth()`
- `server/routes.ts` - endpoints `/api/creator/reminders/date` e `/api/creator/calendar`

#### **Erro: Tabela "scheduled_posts" não existe**
```
Error fetching scheduled posts by date: error: relation "scheduled_posts" does not exist
```

**Arquivos afetados:**
- `server/storage.ts` - função `getScheduledPostsByDate()`
- `server/routes.ts` - endpoint `/api/creator/scheduled-posts/date`

#### **Erro: Tabela "posts" não existe**
```
Error fetching calendar data: error: relation "posts" does not exist
```

**Arquivos afetados:**
- `server/storage.ts` - função `getCalendarData()` (busca posts publicados)

### 2. **Tabelas da Funcionalidade Links de Mídia Paga**

#### **Erro: Tabela "paid_media_links" não existe**
```
Error fetching paid media links: error: relation "paid_media_links" does not exist
```

**Arquivos afetados:**
- `server/storage.ts` - função `getPaidMediaLinks()`
- `server/routes.ts` - endpoint `/api/creator/paid-links`

### 3. **Erro de Importação no Frontend**

#### **Erro: Importação incorreta do react-router-dom**
```
[vite] Pre-transform error: Failed to resolve import "react-router-dom" from "client/src/pages/PaidLinkPreviewPage.tsx"
```

**Arquivos afetados:**
- `client/src/pages/PaidLinkPreviewPage.tsx`
- `client/src/pages/PaidLinkAccessPage.tsx`

## 🔧 **Resoluções Implementadas**

### 1. **Correção de Importação (RESOLVIDO ✅)**

**Problema:** O projeto usa `wouter` para roteamento, mas os arquivos estavam importando `react-router-dom`.

**Solução aplicada:**
```typescript
// ❌ Antes (incorreto)
import { useParams } from "react-router-dom";

// ✅ Depois (correto)
import { useParams } from "wouter";
```

**Arquivos corrigidos:**
- `client/src/pages/PaidLinkPreviewPage.tsx`
- `client/src/pages/PaidLinkAccessPage.tsx`

### 2. **Tabelas de Database (PENDENTE ⚠️)**

**Problema:** As tabelas necessárias não foram criadas no database.

**Tabelas que precisam ser criadas:**

#### **Para Funcionalidade Fila (Calendário):**
```sql
-- Tabela de lembretes
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de posts agendados
CREATE TABLE scheduled_posts (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  scheduled_date TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'scheduled', -- scheduled, published, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de posts (se não existir)
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  published_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Para Funcionalidade Links de Mídia Paga:**
```sql
-- Tabela de links de mídia paga
CREATE TABLE paid_media_links (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id) NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  thumbnail_url TEXT,
  price REAL NOT NULL,
  source_type TEXT NOT NULL,
  source_id INTEGER,
  views_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  total_earnings REAL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de compras de links
CREATE TABLE paid_media_purchases (
  id SERIAL PRIMARY KEY,
  link_id INTEGER REFERENCES paid_media_links(id) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  amount REAL NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  access_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP,
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

## 📊 **Impacto dos Erros**

### **Funcionalidade Fila (Calendário):**
- ❌ **Não funcional** - Erro 500 em todas as requisições
- ❌ **Calendar data** - Não carrega dados do calendário
- ❌ **Scheduled posts** - Não consegue agendar postagens
- ❌ **Reminders** - Não consegue criar/visualizar lembretes

### **Funcionalidade Links de Mídia Paga:**
- ⚠️ **Parcialmente funcional** - Usa dados mock
- ✅ **Frontend** - Interface funcionando
- ✅ **Preview pages** - Páginas públicas funcionando
- ❌ **Database** - Não persiste dados reais

### **Aplicação Geral:**
- ✅ **Servidor** - Rodando normalmente na porta 5000
- ✅ **Autenticação** - Funcionando
- ✅ **Outras funcionalidades** - Não afetadas

## 🚀 **Próximos Passos para Resolução**

### **Prioridade Alta:**
1. **Criar tabelas no database** usando Drizzle migrations
2. **Executar migrations** para aplicar as mudanças
3. **Testar funcionalidades** após criação das tabelas

### **Prioridade Média:**
1. **Implementar dados mock** mais robustos
2. **Adicionar validações** de erro mais específicas
3. **Melhorar tratamento de erros** no frontend

### **Comandos para Execução:**

```bash
# 1. Gerar migration para as novas tabelas
npx drizzle-kit generate

# 2. Aplicar migrations ao database
npx drizzle-kit migrate

# 3. Verificar se as tabelas foram criadas
npx drizzle-kit studio
```

## 📝 **Observações Importantes**

1. **Dados Mock:** A funcionalidade Links de Mídia Paga está usando dados mock temporariamente, permitindo desenvolvimento e teste do frontend.

2. **Compatibilidade:** O projeto usa **Drizzle ORM** para gerenciamento de database, não SQL direto.

3. **Schema Definition:** As definições das tabelas estão em `shared/schema.ts` mas as tabelas físicas não foram criadas no database.

4. **Desenvolvimento vs Produção:** Em produção, todas as tabelas devem existir antes do deploy.

## 🔍 **Como Verificar se as Tabelas Existem**

```bash
# Conectar ao database e verificar tabelas
psql -h localhost -U username -d database_name

# Listar todas as tabelas
\dt

# Verificar estrutura de uma tabela específica
\d table_name
```

---

**Data da documentação:** 12 de Janeiro de 2025  
**Status:** Erros documentados, resoluções parciais implementadas  
**Próxima ação:** Criação das tabelas no database via Drizzle migrations
