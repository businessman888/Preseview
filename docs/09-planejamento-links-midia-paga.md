# Planejamento: Links de Mídia Paga

**Data de Planejamento:** 15 de Outubro de 2025  
**Versão:** 1.0.0  
**Status:** 📋 **PLANEJAMENTO COMPLETO**

---

## 🎯 **Visão Geral da Funcionalidade**

A funcionalidade "Links de Mídia Paga" permite aos criadores monetizarem seu conteúdo através de links compartilháveis com sistema de preview bloqueado e pagamento para liberação.

### **Fluxo Principal:**
1. **Criador:** Cria link pago para conteúdo existente ou novo
2. **Compartilhamento:** Link é compartilhado com preview bloqueado (blur + cadeado)
3. **Usuário:** Vê preview, clica "Pagar" e após pagamento acessa mídia permanentemente

---

## 📊 **Funcionalidades Detalhadas**

### 1. **Criação de Links Pagos**
- **3 opções de conteúdo:**
  - **Do Feed:** Posts existentes do criador
  - **Do Cofre:** Itens salvos no vault
  - **Upload Novo:** Arquivo direto para link pago
- **Configuração:**
  - Título (obrigatório)
  - Descrição (opcional)
  - Preço em reais (R$)
  - Preview da mídia selecionada
- **Geração automática:**
  - Slug único (ex: `abc123xyz`)
  - Link compartilhável
  - QR Code para compartilhamento

### 2. **Página de Gestão (Criador)**
- **Lista de links** com estatísticas
- **Filtros:** Todos, Ativos, Inativos
- **Busca** por título/descrição
- **Ordenação:** Mais recentes, Mais vendidos, Maior receita
- **Ações por link:**
  - Copiar link
  - Gerar QR Code
  - Editar (título, descrição, preço)
  - Ativar/Desativar
  - Ver estatísticas detalhadas
  - Excluir

### 3. **Preview Público (Blur + Cadeado)**
- **Layout bloqueado:**
  - Thumbnail com blur forte (20px)
  - Ícone de cadeado grande no centro
  - Título e descrição do conteúdo
  - Avatar e nome do criador
  - Preço em destaque
  - Botão "Pagar R$ X para ver" (placeholder)
  - Texto: "Após o pagamento, você terá acesso permanente"
- **Estados:**
  - Loading enquanto carrega
  - Not Found (link não existe)
  - Preview bloqueado
  - Mídia desbloqueada (se já comprou)

### 4. **Página de Acesso Liberado**
- **Mídia completa** sem blur
- **Informações do criador**
- **Call-to-actions:** Seguir, Assinar, Ver mais conteúdo

### 5. **Sistema de Compartilhamento**
- **Link único** gerado automaticamente
- **QR Code** para compartilhamento
- **Botões sociais:** WhatsApp, Twitter, Facebook, Telegram
- **URL amigável:** `preseview.com/l/abc123xyz`

---

## 🗄️ **Estrutura do Banco de Dados**

### **Tabela: paid_media_links**
```sql
CREATE TABLE paid_media_links (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER NOT NULL REFERENCES users(id),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL, -- image, video, audio
  thumbnail_url TEXT,
  price REAL NOT NULL,
  
  -- Opções de origem
  source_type TEXT NOT NULL, -- post, vault, upload
  source_id INTEGER, -- ID do post ou vault item
  
  -- Estatísticas
  views_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  total_earnings REAL DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabela: paid_media_purchases**
```sql
CREATE TABLE paid_media_purchases (
  id SERIAL PRIMARY KEY,
  link_id INTEGER NOT NULL REFERENCES paid_media_links(id),
  user_id INTEGER REFERENCES users(id), -- null se compra anônima
  amount REAL NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed
  access_token TEXT NOT NULL UNIQUE, -- token único para acesso
  expires_at TIMESTAMP, -- null = permanente
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 **Backend - APIs**

### **Endpoints do Criador (Autenticados)**
```
GET /api/creator/paid-links
  → Lista todos os links do criador com filtros

POST /api/creator/paid-links
  → Criar novo link pago
  Body: { title, description, mediaUrl, mediaType, price, sourceType, sourceId }

PATCH /api/creator/paid-links/:id
  → Atualizar link (título, descrição, preço)
  Body: { title?, description?, price? }

DELETE /api/creator/paid-links/:id
  → Excluir link

PATCH /api/creator/paid-links/:id/toggle
  → Ativar/desativar link

GET /api/creator/paid-links/:id/stats
  → Estatísticas detalhadas do link
```

### **Endpoints Públicos (Não Autenticados)**
```
GET /api/paid-link/:slug
  → Preview do link (com blur)
  → Incrementa contador de views

POST /api/paid-link/:slug/purchase
  → Iniciar processo de compra (placeholder)
  → Retorna token de acesso após pagamento simulado

GET /api/paid-link/:slug/verify/:token
  → Verificar token e liberar acesso à mídia
```

---

## 🎨 **Frontend - Componentes**

### **1. PaidLinksToolbar.tsx**
- **Botão principal:** "+ Criar Link" (abre modal)
- **Campo de pesquisa:** Buscar por título/descrição
- **Filtros:** [Todos] [Ativos] [Inativos]
- **Ordenação:** Dropdown (Mais recentes, Mais vendidos, Maior receita)

### **2. PaidLinkCard.tsx**
- **Thumbnail:** Mídia com blur leve para preview
- **Informações:**
  - Título e descrição
  - Preço em destaque (R$)
  - Badge de tipo (Imagem/Vídeo/Áudio)
  - Badge de status (Ativo/Inativo)
- **Estatísticas:**
  - 👁️ Views
  - 💰 Vendas
  - 💵 Receita total
- **Ações:**
  - Copiar link
  - QR Code
  - Editar
  - Toggle ativo/inativo
  - Excluir

### **3. PaidLinksGrid.tsx**
- **Grid responsivo:** 3 colunas desktop, 2 tablet, 1 mobile
- **Loading states:** Skeletons durante carregamento
- **Empty state:** Mensagem quando não há links
- **Paginação:** 10 links por página

### **4. CreatePaidLinkModal.tsx**
- **Tab 1: Selecionar Conteúdo**
  - Opção A: Do Feed (posts existentes)
  - Opção B: Do Cofre (vault items)
  - Opção C: Upload Novo (arquivo direto)
- **Tab 2: Configurar Link**
  - Título (obrigatório)
  - Descrição (opcional)
  - Preço em reais (R$)
  - Preview da mídia selecionada
- **Tab 3: Compartilhar**
  - Link gerado automaticamente
  - Botão copiar link
  - QR Code gerado
  - Botões de compartilhamento social

### **5. EditPaidLinkModal.tsx**
- **Campos editáveis:** Título, descrição, preço
- **Restrições:** Não permite trocar a mídia
- **Validação:** Campos obrigatórios
- **Ações:** Salvar alterações, Cancelar

### **6. LinkStatsModal.tsx**
- **Gráfico:** Visualizações ao longo do tempo
- **Lista:** Compras recentes
- **Métricas:**
  - Total de receita
  - Taxa de conversão (views → purchases)
  - Média de preço por venda

---

## 📱 **Páginas Públicas**

### **1. PaidLinkPreviewPage.tsx**
**Layout:**
- **Header:** Logo Preseview (clicável para home)
- **Container central:**
  - Thumbnail com blur forte (filter: blur(20px))
  - Ícone de cadeado grande sobreposto
  - Título do conteúdo
  - Descrição (se houver)
  - Avatar e nome do criador
  - Preço em destaque (R$)
  - Botão "Pagar R$ X para ver" (placeholder)
  - Texto: "Após o pagamento, você terá acesso permanente"
- **Footer:** Links legais

**Estados:**
- Loading (skeleton)
- Not Found (link não existe/desativado)
- Preview bloqueado
- Mídia desbloqueada (se já comprou)

### **2. PaidLinkAccessPage.tsx**
**Quando usuário acessa com token válido:**
- Mídia completa sem blur
- Título e descrição
- Avatar e nome do criador
- Botão "Seguir criador"
- Botão "Assinar"
- Botão "Ver mais conteúdo"

---

## 🔄 **Fluxo de Implementação**

### **Fase 1: Database & Backend**
1. Criar tabelas no schema
2. Implementar funções de storage
3. Criar endpoints da API
4. Adicionar dados mock

### **Fase 2: Hook & Lógica**
1. Criar hook use-paid-links.ts
2. Implementar queries e mutations
3. Testar integração com APIs

### **Fase 3: Componentes de Gestão**
1. PaidLinksToolbar
2. PaidLinkCard
3. PaidLinksGrid
4. CreatePaidLinkModal

### **Fase 4: Páginas Públicas**
1. PaidLinkPreviewPage
2. PaidLinkAccessPage
3. Integração com rotas públicas

### **Fase 5: Funcionalidades Avançadas**
1. EditPaidLinkModal
2. LinkStatsModal
3. QR Code e compartilhamento
4. Polimento e testes

---

## 📊 **Dados Mock para Desenvolvimento**

### **Links Mock:**
```javascript
[
  {
    id: 1,
    slug: "abc123xyz",
    title: "Treino de pernas exclusivo",
    description: "Exercícios avançados para definir as pernas",
    mediaUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    mediaType: "video",
    price: 19.90,
    viewsCount: 245,
    purchasesCount: 12,
    totalEarnings: 238.80,
    isActive: true
  },
  {
    id: 2,
    slug: "def456ghi",
    title: "Receita secreta do bolo",
    description: "Minha receita especial de bolo de chocolate",
    mediaUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    mediaType: "image",
    price: 9.90,
    viewsCount: 156,
    purchasesCount: 8,
    totalEarnings: 79.20,
    isActive: true
  },
  {
    id: 3,
    slug: "jkl789mno",
    title: "Podcast sobre investimentos",
    description: "Dicas valiosas sobre como investir seu dinheiro",
    mediaUrl: "https://example.com/audio.mp3",
    mediaType: "audio",
    price: 4.90,
    viewsCount: 89,
    purchasesCount: 5,
    totalEarnings: 24.50,
    isActive: true
  }
]
```

---

## 🎯 **Critérios de Sucesso**

### **Funcionalidade:**
- ✅ Criador pode criar links pagos para conteúdo
- ✅ Preview público com blur e cadeado funciona
- ✅ Sistema de compartilhamento (link, QR Code, social)
- ✅ Gestão completa de links (editar, ativar/desativar, excluir)
- ✅ Estatísticas de views e vendas
- ✅ Placeholder para pagamento (botão sem ação)

### **UX/UI:**
- ✅ Interface intuitiva para criadores
- ✅ Preview público atrativo e claro
- ✅ Responsividade completa
- ✅ Loading states em todas as operações
- ✅ Error handling adequado
- ✅ Animações suaves

### **Performance:**
- ✅ Carregamento rápido das páginas
- ✅ Cache inteligente com React Query
- ✅ Otimização de imagens e mídia

---

## 📁 **Arquivos a Serem Criados**

### **Schema & Backend:**
- `shared/schema.ts` - adicionar paidMediaLinks e paidMediaPurchases
- `server/storage.ts` - implementar funções de paid links
- `server/routes.ts` - adicionar rotas da API

### **Hooks:**
- `client/src/hooks/use-paid-links.ts` - hook customizado

### **Componentes de Gestão:**
- `client/src/components/creator/paid-links/PaidLinksToolbar.tsx`
- `client/src/components/creator/paid-links/PaidLinkCard.tsx`
- `client/src/components/creator/paid-links/PaidLinksGrid.tsx`
- `client/src/components/creator/paid-links/CreatePaidLinkModal.tsx`
- `client/src/components/creator/paid-links/EditPaidLinkModal.tsx`
- `client/src/components/creator/paid-links/LinkStatsModal.tsx`

### **Páginas Públicas:**
- `client/src/pages/PaidLinkPreviewPage.tsx`
- `client/src/pages/PaidLinkAccessPage.tsx`

### **Páginas:**
- `client/src/pages/creator/tools/PaidMediaLinksPage.tsx` - implementação completa

### **Documentação:**
- `docs/09-implementacao-links-midia-paga.md` - documentação pós-implementação

---

## 🚀 **Próximos Passos**

1. **Aprovação do plano** pelo usuário
2. **Implementação** seguindo as fases definidas
3. **Testes** de funcionalidade e UX
4. **Documentação** final da implementação
5. **Deploy** e validação

---

*Planejamento criado em 15 de Outubro de 2025*
