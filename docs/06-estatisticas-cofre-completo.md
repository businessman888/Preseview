# Implementação: Estatísticas Completas + Cofre

**Data de Implementação:** 15 de Outubro de 2025  
**Versão:** 1.0.0  
**Status:** 📋 Planejamento Completo - Pronto para Implementação

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Parte 1: Completar Estatísticas](#parte-1-completar-estatísticas)
3. [Parte 2: Implementar Página do Cofre](#parte-2-implementar-página-do-cofre)
4. [Ordem de Implementação](#ordem-de-implementação)
5. [Detalhes Técnicos](#detalhes-técnicos)
6. [Componentes Reutilizáveis](#componentes-reutilizáveis)
7. [Testes](#testes)

---

## 🎯 Visão Geral

Completar a implementação das funcionalidades de **Estatísticas** e **Cofre** para criadores, seguindo exatamente as especificações fornecidas:

### Objetivos
- ✅ Completar 3 tabs restantes de Estatísticas (Monthly Earnings, Subscribers, Content)
- ✅ Implementar página completa do Cofre com grid de thumbnails
- ✅ Sistema de filtragem avançada e gerenciamento de pastas
- ✅ Interface idêntica às imagens fornecidas
- ✅ Funcionalidades de gerenciamento (excluir, editar, mover, selecionar)

---

## 📊 Parte 1: Completar Estatísticas

### 1.1 Monthly Earnings Tab

**Arquivo:** `client/src/components/creator/statistics/MonthlyEarningsTab.tsx`

**Funcionalidades:**
- Gráfico de barras mostrando ganhos por mês do ano (usando Recharts BarChart)
- Card de resumo com total do ano
- Tabela com dados mensais (mês, valor, assinantes, posts)
- Filtro de ano (2024, 2025, etc.)

**API já existe:** `/api/creator/monthly-earnings?year=2025`

**Interface:**
```typescript
interface MonthlyEarningsProps {
  year: number;
  onYearChange: (year: number) => void;
}
```

### 1.2 Subscribers Tab

**Arquivo:** `client/src/components/creator/statistics/SubscribersTab.tsx`

**Funcionalidades:**
- Cards de resumo: Total de assinantes, Ativos, Novos no período, Cancelados
- Gráfico de linha mostrando evolução de assinantes por período (Recharts LineChart)
- Tabela de assinantes com colunas:
  - Nome (com avatar)
  - Data de inscrição
  - Valor da assinatura
  - Status (ativo/cancelado) - badge verde/vermelho
  - Ações: Visualizar, Oferecer desconto
- Filtro de período (Todo o período, Semanal, Mensal, Último dia)
- Paginação na tabela

**API já existe:** `/api/creator/subscribers-stats?period=all`

**Novo endpoint necessário:** `/api/creator/subscribers-list?page=1&limit=20`

```typescript
Response: {
  subscribers: Array<{
    id: number,
    userId: number,
    username: string,
    displayName: string,
    avatar: string,
    subscriptionDate: string,
    amount: number,
    status: 'active' | 'cancelled'
  }>,
  total: number,
  page: number,
  totalPages: number
}
```

**Modal de desconto:** `DiscountOfferModal.tsx` - formulário para oferecer desconto personalizado

### 1.3 Content Tab

**Arquivo:** `client/src/components/creator/statistics/ContentTab.tsx`

**Funcionalidades:**
- Cards de resumo: Total de posts, Views totais, Likes totais, Comentários totais, Presentes totais
- Gráfico de área (Recharts AreaChart) com múltiplas linhas:
  - Visualizações (azul)
  - Curtidas (vermelho)
  - Comentários (verde)
  - Presentes (amarelo)
- Filtro de período (Todo o período, Semanal, Mensal, Último dia)
- Toggle para mostrar/ocultar cada métrica no gráfico
- Média de views por post

**API já existe:** `/api/creator/content-stats?period=all`

### 1.4 Atualizar StatisticsPage.tsx

Substituir placeholders das tabs Monthly, Subscribers e Content pelos novos componentes.

---

## 🗂️ Parte 2: Implementar Página do Cofre

### 2.1 Backend - Novos Endpoints

**Arquivo:** `server/storage.ts`

Adicionar funções:

```typescript
// Buscar conteúdo do criador com filtros
async getCreatorVaultContent(
  creatorId: number,
  filters: {
    type?: 'all' | 'images' | 'videos' | 'audios',
    folderId?: number | null,
    search?: string,
    page?: number,
    limit?: number
  }
): Promise<{
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
}>

// Buscar pastas do criador
async getCreatorFolders(creatorId: number): Promise<Array<{
  id: number,
  name: string,
  contentCount: number,
  createdAt: string
}>>

// Criar pasta
async createFolder(creatorId: number, name: string): Promise<Folder>

// Mover conteúdo para pasta
async moveContentToFolder(contentId: number, folderId: number | null): Promise<void>

// Deletar conteúdo
async deleteContent(contentId: number, creatorId: number): Promise<boolean>
```

**Arquivo:** `server/routes.ts`

Adicionar endpoints:
- `GET /api/creator/vault/content?type=all&folderId=null&search=&page=1&limit=20`
- `GET /api/creator/vault/folders`
- `POST /api/creator/vault/folders` - body: { name: string }
- `PATCH /api/creator/vault/content/:id/move` - body: { folderId: number | null }
- `DELETE /api/creator/vault/content/:id`

### 2.2 Schema - Tabela de Pastas

**Arquivo:** `shared/schema.ts`

Adicionar tabela (se não existir):

```typescript
export const vaultFolders = pgTable("vault_folders", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

Atualizar tabela `posts` para incluir `folderId`:

```typescript
folderId: integer("folder_id").references(() => vaultFolders.id),
```

### 2.3 Frontend - Componentes do Cofre

**Arquivo:** `client/src/pages/creator/tools/VaultPage.tsx`

Estrutura completa:

```typescript
- Header com título "Cofre"
- Barra de ferramentas superior:
  - Dropdown "Todas as pastas" (listar pastas + opção criar nova)
  - Botão "+ Fol" para criar pasta
  - Campo de pesquisa "Pesquisar no cofre..."
  - Filtros por tipo: [Todos] [Imagens] [Videos] [Audios]
  - Botão "Selecionar tudo" (checkbox)
- Grid de thumbnails (4 colunas em desktop, 2 em tablet, 1 em mobile)
- Paginação no final
```

**Componentes auxiliares:**

1. **`VaultToolbar.tsx`** - Barra superior com filtros
2. **`VaultGrid.tsx`** - Grid de thumbnails
3. **`VaultItem.tsx`** - Card individual do conteúdo:
   - Thumbnail da imagem/video
   - Badge "Publicado" (rosa, canto superior esquerdo)
   - Ícone de edição (canto superior direito)
   - Play button (se for vídeo, com duração "0:05")
   - Nome do conteúdo
   - Data de criação
   - Checkbox para seleção
   - Overlay hover com ícones de stats:
     - Views (olho)
     - Likes (coração)
     - Comments (balão)
     - Gifts (presente)
4. **`CreateFolderModal.tsx`** - Modal para criar pasta
5. **`VaultActionsBar.tsx`** - Barra de ações quando há itens selecionados:
   - Mover para pasta
   - Excluir
   - Editar (se único item selecionado)

**Hook:** `client/src/hooks/use-vault.ts`

```typescript
export function useVaultContent(filters: VaultFilters) {
  return useQuery({
    queryKey: ['vault-content', filters],
    queryFn: () => apiRequest('/api/creator/vault/content', { params: filters })
  });
}

export function useVaultFolders() {
  return useQuery({
    queryKey: ['vault-folders'],
    queryFn: () => apiRequest('/api/creator/vault/folders')
  });
}

export function useCreateFolder() {
  return useMutation({
    mutationFn: (name: string) => apiRequest('/api/creator/vault/folders', {
      method: 'POST',
      body: { name }
    })
  });
}

export function useMoveContent() {
  return useMutation({
    mutationFn: ({ contentId, folderId }) => 
      apiRequest(`/api/creator/vault/content/${contentId}/move`, {
        method: 'PATCH',
        body: { folderId }
      })
  });
}

export function useDeleteContent() {
  return useMutation({
    mutationFn: (contentId: number) =>
      apiRequest(`/api/creator/vault/content/${contentId}`, {
        method: 'DELETE'
      })
  });
}
```

### 2.4 Dados Mock

Criar dados mock no `storage.ts` baseados nas imagens fornecidas:
- Posts com thumbnails de exemplo
- Stats: views, likes, comments, gifts
- Diferentes tipos: image/video
- Status "Publicado"
- Datas variadas

---

## 📅 Ordem de Implementação

### Fase 1: Completar Estatísticas (2-3 horas)

1. Criar `MonthlyEarningsTab.tsx` com gráfico de barras
2. Criar `SubscribersTab.tsx` com tabela e gráfico
3. Criar `ContentTab.tsx` com gráfico multi-linha
4. Criar endpoint `/api/creator/subscribers-list`
5. Criar `DiscountOfferModal.tsx`
6. Atualizar `StatisticsPage.tsx` para usar novos componentes
7. Testar todas as tabs

### Fase 2: Backend do Cofre (1-2 horas)

1. Adicionar tabela `vault_folders` no schema (se necessário)
2. Adicionar campo `folderId` em posts
3. Implementar funções no `storage.ts`
4. Criar endpoints no `routes.ts`
5. Criar dados mock
6. Testar endpoints

### Fase 3: Frontend do Cofre (3-4 horas)

1. Criar `VaultToolbar.tsx` com filtros e pesquisa
2. Criar `VaultItem.tsx` - card do conteúdo
3. Criar `VaultGrid.tsx` - grid responsivo
4. Criar `CreateFolderModal.tsx`
5. Criar `VaultActionsBar.tsx` - ações em lote
6. Criar hook `use-vault.ts`
7. Atualizar `VaultPage.tsx` completa
8. Implementar seleção múltipla
9. Implementar mover para pasta
10. Implementar exclusão
11. Testar responsividade

### Fase 4: Polimento (1 hora)

1. Loading states e skeletons
2. Error handling
3. Confirmações de exclusão
4. Animações de transição
5. Dark mode
6. Testes finais

**Tempo Total Estimado:** 7-10 horas

---

## 🔧 Detalhes Técnicos

### Grid Layout (VaultGrid)

```css
.vault-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .vault-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .vault-grid {
    grid-template-columns: 1fr;
  }
}
```

### VaultItem Card

- Aspect ratio 16:9 para thumbnails
- Overlay com stats aparece no hover
- Checkbox no canto inferior esquerdo
- Badge "Publicado" posição absoluta top-left
- Ícone edição posição absoluta top-right

```css
.vault-item {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.vault-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.vault-item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.2s ease;
}

.vault-item:hover .vault-item-overlay {
  transform: translateY(0);
}
```

### Filtros

Estado gerenciado localmente:

```typescript
const [filters, setFilters] = useState({
  type: 'all',
  folderId: null,
  search: '',
  page: 1
});
```

### Seleção Múltipla

```typescript
const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

const toggleSelection = (id: number) => {
  setSelectedIds(prev => {
    const newSet = new Set(prev);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return newSet;
  });
};

const selectAll = () => {
  setSelectedIds(new Set(content.map(item => item.id)));
};

const clearSelection = () => {
  setSelectedIds(new Set());
};
```

### Tabela de Assinantes

```typescript
interface SubscriberRow {
  id: number;
  userId: number;
  username: string;
  displayName: string;
  avatar: string;
  subscriptionDate: string;
  amount: number;
  status: 'active' | 'cancelled';
}

const columns = [
  {
    key: 'user',
    label: 'Assinante',
    render: (row: SubscriberRow) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.avatar} />
          <AvatarFallback>{row.displayName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.displayName}</div>
          <div className="text-sm text-gray-500">@{row.username}</div>
        </div>
      </div>
    )
  },
  {
    key: 'subscriptionDate',
    label: 'Data de Inscrição',
    render: (row: SubscriberRow) => format(new Date(row.subscriptionDate), 'dd/MM/yyyy', { locale: ptBR })
  },
  {
    key: 'amount',
    label: 'Valor',
    render: (row: SubscriberRow) => `$${row.amount.toFixed(2)}`
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: SubscriberRow) => (
      <Badge variant={row.status === 'active' ? 'default' : 'destructive'}>
        {row.status === 'active' ? 'Ativo' : 'Cancelado'}
      </Badge>
    )
  },
  {
    key: 'actions',
    label: 'Ações',
    render: (row: SubscriberRow) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Visualizar</Button>
        <Button variant="outline" size="sm" onClick={() => openDiscountModal(row)}>
          Oferecer Desconto
        </Button>
      </div>
    )
  }
];
```

---

## 🧩 Componentes Reutilizáveis

Criar em `client/src/components/ui/`:

### DataTable.tsx - Tabela de Assinantes

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
}

export function DataTable<T>({ data, columns, pagination, loading }: DataTableProps<T>) {
  // Implementação da tabela com paginação
}
```

### StatBadge.tsx - Badge de Estatística

```typescript
interface StatBadgeProps {
  value: number;
  label: string;
  trend?: 'up' | 'down' | 'flat';
  color?: 'green' | 'red' | 'blue' | 'yellow';
}

export function StatBadge({ value, label, trend, color = 'blue' }: StatBadgeProps) {
  // Badge com ícone de trend e cor personalizada
}
```

### ContentThumbnail.tsx - Thumbnail Reutilizável

```typescript
interface ContentThumbnailProps {
  src: string;
  alt: string;
  type: 'image' | 'video';
  duration?: string;
  stats?: {
    views: number;
    likes: number;
    comments: number;
    gifts: number;
  };
  overlay?: boolean;
}

export function ContentThumbnail({ src, alt, type, duration, stats, overlay = true }: ContentThumbnailProps) {
  // Thumbnail com overlay de stats e play button para vídeos
}
```

---

## 🧪 Testes

### Estatísticas

- [ ] Monthly Earnings mostra gráfico correto
- [ ] Subscribers lista assinantes com paginação
- [ ] Content mostra métricas corretas
- [ ] Filtros de período funcionam em todas tabs
- [ ] Modal de desconto abre e funciona
- [ ] Gráficos são responsivos
- [ ] Dark mode funciona em todos os componentes

### Cofre

- [ ] Grid carrega conteúdo corretamente
- [ ] Filtros por tipo funcionam (Todos, Imagens, Videos, Audios)
- [ ] Pesquisa por nome funciona
- [ ] Criar pasta funciona
- [ ] Filtrar por pasta funciona
- [ ] Seleção múltipla funciona
- [ ] Mover para pasta funciona
- [ ] Excluir conteúdo funciona (com confirmação)
- [ ] Responsividade em mobile/tablet/desktop
- [ ] Overlay de stats aparece no hover
- [ ] Badges "Publicado" aparecem corretamente
- [ ] Play button aparece em vídeos
- [ ] Paginação funciona
- [ ] Loading states funcionam
- [ ] Error handling funciona

### Integração

- [ ] Navegação entre tabs funciona
- [ ] Sidebar funciona corretamente
- [ ] Rotas funcionam
- [ ] APIs respondem corretamente
- [ ] Dados mock são exibidos
- [ ] Performance é adequada

---

## 📊 Dados Mock

### Conteúdo do Cofre

```typescript
const mockVaultContent = [
  {
    id: 1,
    title: "Meu treino de hoje",
    mediaUrl: "https://example.com/video1.mp4",
    mediaType: "video",
    thumbnail: "https://example.com/thumb1.jpg",
    views: 1250,
    likes: 234,
    comments: 18,
    gifts: 5,
    createdAt: "2025-10-10T10:30:00Z",
    folderId: null,
    isPublished: true
  },
  {
    id: 2,
    title: "Sessão de fotos na praia",
    mediaUrl: "https://example.com/image1.jpg",
    mediaType: "image",
    thumbnail: "https://example.com/thumb2.jpg",
    views: 890,
    likes: 156,
    comments: 12,
    gifts: 3,
    createdAt: "2025-10-09T15:45:00Z",
    folderId: 1,
    isPublished: true
  },
  // ... mais itens
];
```

### Assinantes

```typescript
const mockSubscribers = [
  {
    id: 1,
    userId: 2,
    username: "mature_catfish",
    displayName: "Mature Catfish",
    avatar: "",
    subscriptionDate: "2025-10-01T00:00:00Z",
    amount: 9.90,
    status: "active"
  },
  // ... mais assinantes
];
```

---

## 🚀 Como Testar

### 1. Estatísticas

1. **Fazer login como criador:**
   - Usuário: `julia_fitness`
   - Senha: `senha123`

2. **Acessar estatísticas:**
   - Navegar para `/creator/tools/statistics`
   - Ou: Sidebar > "Ferramentas do Criador" > "Estatísticas"

3. **Testar cada tab:**
   - **Earnings:** Já funcional
   - **Monthly Earnings:** Gráfico de barras, filtro de ano
   - **Subscribers:** Tabela, gráfico, modal de desconto
   - **Content:** Gráfico multi-linha, toggles de métricas

### 2. Cofre

1. **Acessar cofre:**
   - Navegar para `/creator/tools/vault`
   - Ou: Sidebar > "Ferramentas do Criador" > "Cofre"

2. **Testar funcionalidades:**
   - Filtros por tipo de mídia
   - Pesquisa por nome
   - Criar pasta
   - Seleção múltipla
   - Mover para pasta
   - Excluir conteúdo
   - Responsividade

---

## ✅ Checklist Final

### Funcionalidades Core
- [ ] 4 tabs de estatísticas funcionais
- [ ] Gráficos interativos (barras, linhas, área)
- [ ] Tabela de assinantes com paginação
- [ ] Modal de desconto
- [ ] Grid de cofre responsivo
- [ ] Sistema de pastas
- [ ] Seleção múltipla
- [ ] Filtros avançados

### UI/UX
- [ ] Design idêntico às imagens
- [ ] Responsividade completa
- [ ] Dark mode
- [ ] Loading states
- [ ] Error states
- [ ] Animações suaves
- [ ] Confirmações de ações

### Técnico
- [ ] APIs funcionando
- [ ] Performance adequada
- [ ] Sem erros de console
- [ ] TypeScript sem erros
- [ ] Build funcionando

### Testes
- [ ] Testes manuais completos
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Acessibilidade

---

**Status:** 📋 Pronto para implementação  
**Próximo passo:** Iniciar Fase 1 - Completar Estatísticas

---

*Última atualização: 15 de Outubro de 2025, 18:00*
