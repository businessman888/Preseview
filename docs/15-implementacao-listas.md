# Implementação do Sistema de Listas para Criadores

## Visão Geral

Este documento detalha a implementação completa do sistema de listas para criadores, permitindo segmentação de assinantes através de listas inteligentes automáticas e listas personalizadas manuais. O sistema oferece funcionalidades de visualização, gerenciamento, envio de mensagens em massa e criação de ofertas direcionadas.

## 1. Schema e Banco de Dados

### Tabelas a serem criadas no `shared/schema.ts`

#### Tabela `subscriber_lists`

```typescript
export const subscriberLists = pgTable("subscriber_lists", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  listType: text("list_type").notNull(), // 'smart' ou 'custom'
  filters: text("filters"), // JSONB string para filtros de listas inteligentes
  memberCount: integer("member_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

**Campos:**
- `id`: Chave primária serial
- `creatorId`: Referência para a tabela users (criador proprietário)
- `name`: Nome da lista (3-50 caracteres)
- `description`: Descrição opcional (máximo 200 caracteres)
- `listType`: Tipo da lista - 'smart' (inteligente) ou 'custom' (personalizada)
- `filters`: JSONB para armazenar filtros de listas inteligentes
- `memberCount`: Contador de membros (atualizado automaticamente)
- `isActive`: Status ativo/inativo da lista
- `createdAt`, `updatedAt`: Timestamps de criação e atualização

#### Tabela `list_members`

```typescript
export const listMembers = pgTable("list_members", {
  id: serial("id").primaryKey(),
  listId: integer("list_id").references(() => subscriberLists.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
  addedBy: text("added_by").default('manual'), // 'auto' ou 'manual'
});
```

**Campos:**
- `id`: Chave primária serial
- `listId`: Referência para subscriber_lists
- `userId`: Referência para users (membro da lista)
- `addedAt`: Timestamp de quando foi adicionado
- `addedBy`: 'auto' (lista inteligente) ou 'manual' (adicionado pelo criador)

#### Tipos de Filtros para Listas Inteligentes

```typescript
export interface SmartListFilters {
  subscriptionStatus?: 'active' | 'expired' | 'cancelled';
  relationshipType?: 'subscriber' | 'follower' | 'both';
  autoRenewal?: 'auto_renewing' | 'non_renewing';
  spending?: {
    type: 'spent_more_than' | 'purchased_paid_media' | 'sent_tips';
    value?: number; // para spent_more_than
  };
  period?: 'new_subscribers' | 'long_term' | 'this_month';
}
```

### Relations e Schemas

```typescript
// Relations
export const subscriberListsRelations = relations(subscriberLists, ({ one, many }) => ({
  creator: one(users, {
    fields: [subscriberLists.creatorId],
    references: [users.id],
  }),
  members: many(listMembers),
}));

export const listMembersRelations = relations(listMembers, ({ one }) => ({
  list: one(subscriberLists, {
    fields: [listMembers.listId],
    references: [subscriberLists.id],
  }),
  user: one(users, {
    fields: [listMembers.userId],
    references: [users.id],
  }),
}));

// Insert Schemas
export const insertSubscriberListSchema = createInsertSchema(subscriberLists).omit({
  id: true,
  memberCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertListMemberSchema = createInsertSchema(listMembers).omit({
  id: true,
  addedAt: true,
});

// Types
export type SubscriberList = typeof subscriberLists.$inferSelect;
export type InsertSubscriberList = typeof subscriberLists.$inferInsert;
export type ListMember = typeof listMembers.$inferSelect;
export type InsertListMember = typeof listMembers.$inferInsert;
```

## 2. Backend (Server)

### Funções a serem implementadas no `server/storage.ts`

#### Gerenciamento de Listas

```typescript
// Buscar todas as listas do criador
async getSubscriberLists(creatorId: number, filters?: { listType?: 'smart' | 'custom', isActive?: boolean }): Promise<SubscriberList[]>

// Buscar lista específica
async getListById(listId: number, creatorId: number): Promise<SubscriberList | null>

// Criar nova lista
async createSubscriberList(data: InsertSubscriberList): Promise<SubscriberList>

// Atualizar lista existente
async updateSubscriberList(listId: number, creatorId: number, data: Partial<InsertSubscriberList>): Promise<SubscriberList>

// Excluir lista
async deleteSubscriberList(listId: number, creatorId: number): Promise<boolean>

// Ativar/desativar lista
async toggleListStatus(listId: number, creatorId: number): Promise<SubscriberList>
```

#### Gerenciamento de Membros

```typescript
// Buscar membros de uma lista (paginado)
async getListMembers(listId: number, creatorId: number, page: number = 1, limit: number = 20): Promise<{
  members: (ListMember & { user: User })[];
  totalCount: number;
  totalPages: number;
}>

// Adicionar membro manualmente
async addMemberToList(listId: number, userId: number, creatorId: number): Promise<ListMember>

// Remover membro
async removeMemberFromList(listId: number, userId: number, creatorId: number): Promise<boolean>

// Adicionar múltiplos membros
async addMultipleMembersToList(listId: number, userIds: number[], creatorId: number): Promise<ListMember[]>

// Calcular membros de lista inteligente dinamicamente
async getSmartListMembers(creatorId: number, filters: SmartListFilters): Promise<User[]>
```

#### Filtros Inteligentes

```typescript
// Aplicar filtros de assinatura
async applySubscriptionFilters(creatorId: number, filters: SmartListFilters): Promise<number[]>

// Aplicar filtros de comportamento
async applyBehaviorFilters(creatorId: number, filters: SmartListFilters): Promise<number[]>

// Recalcular contagem de membros
async calculateListMemberCount(listId: number): Promise<number>
```

#### Ações em Massa

```typescript
// Enviar mensagem para todos os membros de uma lista
async sendMessageToList(listId: number, creatorId: number, message: string): Promise<{
  sentCount: number;
  failedCount: number;
  messageIds: number[];
}>

// Buscar ofertas aplicáveis à lista
async getListEligibleOffers(listId: number, creatorId: number): Promise<PromotionalOffer[]>
```

### Rotas da API a serem adicionadas no `server/routes.ts`

#### Endpoints de Listas

```typescript
// GET /api/creator/lists - Listar todas as listas do criador
// GET /api/creator/lists/:id - Detalhes de uma lista específica
// POST /api/creator/lists - Criar nova lista
// PATCH /api/creator/lists/:id - Atualizar lista existente
// DELETE /api/creator/lists/:id - Excluir lista
// PATCH /api/creator/lists/:id/toggle - Ativar/desativar lista
```

#### Endpoints de Membros

```typescript
// GET /api/creator/lists/:id/members - Listar membros da lista (paginado)
// POST /api/creator/lists/:id/members - Adicionar membro à lista
// DELETE /api/creator/lists/:id/members/:userId - Remover membro da lista
// POST /api/creator/lists/:id/members/bulk - Adicionar múltiplos membros
```

#### Endpoints de Ações

```typescript
// POST /api/creator/lists/:id/send-message - Enviar mensagem em massa para a lista
// GET /api/creator/lists/preview-smart - Preview de quantos membros uma lista inteligente teria
```

## 3. Frontend - Hooks

### Arquivo `client/src/hooks/use-lists.ts`

#### Queries

```typescript
// Buscar todas as listas do criador
export function useSubscriberLists(filters?: { listType?: 'smart' | 'custom', isActive?: boolean }): UseQueryResult<SubscriberList[]>

// Detalhes de uma lista específica
export function useListDetails(listId: number): UseQueryResult<SubscriberList>

// Membros de uma lista (paginado)
export function useListMembers(listId: number, page: number = 1, limit: number = 20): UseQueryResult<{
  members: (ListMember & { user: User })[];
  totalCount: number;
  totalPages: number;
}>

// Preview de lista inteligente
export function useSmartListPreview(filters: SmartListFilters): UseQueryResult<{
  memberCount: number;
  preview: User[];
}>
```

#### Mutations

```typescript
// Criar nova lista
export function useCreateList(): UseMutationResult<SubscriberList, Error, InsertSubscriberList>

// Atualizar lista
export function useUpdateList(): UseMutationResult<SubscriberList, Error, { id: number; data: Partial<InsertSubscriberList> }>

// Excluir lista
export function useDeleteList(): UseMutationResult<boolean, Error, number>

// Ativar/desativar lista
export function useToggleList(): UseMutationResult<SubscriberList, Error, number>

// Adicionar membro
export function useAddMember(): UseMutationResult<ListMember, Error, { listId: number; userId: number }>

// Remover membro
export function useRemoveMember(): UseMutationResult<boolean, Error, { listId: number; userId: number }>

// Adicionar múltiplos membros
export function useAddMultipleMembers(): UseMutationResult<ListMember[], Error, { listId: number; userIds: number[] }>

// Enviar mensagem em massa
export function useSendMessageToList(): UseMutationResult<{ sentCount: number; failedCount: number }, Error, { listId: number; message: string }>
```

## 4. Frontend - Componentes

### Estrutura de diretórios
```
client/src/components/creator/lists/
├── ListsOverview.tsx           # Componente principal com tabs
├── SmartListsTab.tsx           # Tab de listas inteligentes
├── CustomListsTab.tsx          # Tab de listas personalizadas
├── ListCard.tsx                # Card individual de lista
├── ListDetailsModal.tsx        # Modal com detalhes e membros
├── CreateListModal.tsx         # Modal para criar nova lista
├── EditListModal.tsx           # Modal para editar lista
├── SmartListFilters.tsx        # Seleção de filtros inteligentes
├── FilterPreview.tsx           # Preview de filtros
├── MemberList.tsx              # Lista de membros com paginação
├── MemberCard.tsx              # Card individual de membro
├── AddMembersModal.tsx         # Modal para adicionar membros
├── MemberSearch.tsx            # Busca de assinantes
├── ListActionsMenu.tsx         # Menu de ações da lista
├── SendMessageModal.tsx        # Modal para envio em massa
└── CreateOfferForListModal.tsx # Modal para criar oferta
```

### Componentes Principais

#### `ListsOverview.tsx`
- Componente principal que gerencia as tabs
- Header com título e botão "Nova lista personalizada"
- Navegação entre tabs Inteligente e Personalizada
- Empty states e loading states

#### `SmartListsTab.tsx`
- Exibe listas inteligentes pré-definidas
- Cards não editáveis (apenas visualização)
- Ações: visualizar membros, enviar mensagem, criar oferta

#### `CustomListsTab.tsx`
- Grid de listas personalizadas criadas pelo usuário
- Botão para criar nova lista
- Cards com ações completas (editar, excluir, etc.)

#### `ListCard.tsx`
- Card individual para cada lista
- Exibe nome, descrição, contagem de membros
- Ícones de ação (mensagem, editar, excluir)
- Indicador visual de status ativo/inativo

### Componentes de Filtros

#### `SmartListFilters.tsx`
- Interface para selecionar filtros de lista inteligente
- Dropdowns para status de assinatura, tipo de relacionamento
- Campo numérico para filtros de gasto
- Seleção de período

#### `FilterPreview.tsx`
- Mostra quantos membros o filtro retornaria
- Lista preview dos primeiros membros
- Botão para criar lista com esses filtros

### Componentes de Membros

#### `MemberList.tsx`
- Lista paginada de membros
- Busca e filtros
- Ações: remover membro, ver perfil

#### `MemberCard.tsx`
- Card individual de membro
- Avatar, nome, status da assinatura
- Botão de ação (remover da lista)

#### `AddMembersModal.tsx`
- Modal para adicionar membros manualmente
- Busca de assinantes disponíveis
- Seleção múltipla
- Confirmação de adição

### Componentes de Ações

#### `ListActionsMenu.tsx`
- Menu dropdown com ações da lista
- Opções: editar, excluir, enviar mensagem, criar oferta
- Confirmações para ações destrutivas

#### `SendMessageModal.tsx`
- Modal para envio de mensagem em massa
- Campo de texto para mensagem
- Preview de quantos membros receberão
- Confirmação antes do envio

## 5. Listas Inteligentes Pré-definidas

### Lista de listas automáticas:

1. **Subscribers** - Assinantes ativos
2. **Followers** - Seguidores sem assinatura
3. **Non-renewing** - Assinantes sem renovação automática
4. **Auto-renewing** - Assinantes com renovação automática
5. **Expired subscribers** - Assinaturas expiradas
6. **Free trial subscribers** - Em teste gratuito
7. **Spent more than $50** - Gastaram mais de R$50
8. **New this month** - Novos neste mês

### Implementação das listas inteligentes:

```typescript
const SMART_LISTS = [
  {
    id: 'subscribers',
    name: 'Subscribers',
    description: 'Assinantes ativos',
    filters: { subscriptionStatus: 'active', relationshipType: 'subscriber' }
  },
  {
    id: 'followers',
    name: 'Followers',
    description: 'Seguidores sem assinatura',
    filters: { relationshipType: 'follower' }
  },
  {
    id: 'non-renewing',
    name: 'Non-renewing',
    description: 'Assinantes sem renovação automática',
    filters: { subscriptionStatus: 'active', autoRenewal: 'non_renewing' }
  },
  {
    id: 'auto-renewing',
    name: 'Auto-renewing',
    description: 'Assinantes com renovação automática',
    filters: { subscriptionStatus: 'active', autoRenewal: 'auto_renewing' }
  },
  {
    id: 'expired-subscribers',
    name: 'Expired subscribers',
    description: 'Assinaturas expiradas',
    filters: { subscriptionStatus: 'expired' }
  },
  {
    id: 'free-trial',
    name: 'Free trial subscribers',
    description: 'Em teste gratuito',
    filters: { period: 'new_subscribers', subscriptionStatus: 'active' }
  },
  {
    id: 'spent-more-than-50',
    name: 'Spent more than $50',
    description: 'Gastaram mais de R$50',
    filters: { spending: { type: 'spent_more_than', value: 50 } }
  },
  {
    id: 'new-this-month',
    name: 'New this month',
    description: 'Novos neste mês',
    filters: { period: 'this_month' }
  }
];
```

## 6. Integração com Outras Funcionalidades

### Sistema de Promoções
- Adicionar campo `targetListId` na tabela `promotional_offers`
- Permitir selecionar lista de destinatários ao criar oferta
- Filtrar ofertas por lista nas estatísticas

### Sistema de Mensagens
- Integrar envio em massa com sistema de mensagens existente
- Criar mensagem para cada membro da lista
- Tracking de mensagens enviadas por lista

### Estatísticas do Criador
- Adicionar seção "Listas mais engajadas"
- Métricas de conversão por lista
- Taxa de abertura de mensagens por lista
- Crescimento de listas ao longo do tempo

## 7. Validações e Regras de Negócio

### Limites e Validações:
- **Listas personalizadas**: Máximo 50 por criador
- **Nome da lista**: 3-50 caracteres, único por criador
- **Descrição**: Máximo 200 caracteres
- **Membros**: Não permitir usuário duplicado na mesma lista
- **Listas inteligentes**: Apenas visualização, não editáveis
- **Envio de mensagens**: Rate limiting de 1 por minuto
- **Histórico**: Manter logs de mensagens enviadas

### Regras de Segurança:
- Criador só pode gerenciar suas próprias listas
- Validação de permissões em todas as operações
- Sanitização de inputs para prevenir SQL injection
- Rate limiting para APIs de envio em massa

## 8. UI/UX e Design

### Design System:
- Consistência com outras páginas de ferramentas do criador
- Uso de componentes existentes (Card, Button, Modal, etc.)
- Cores e tipografia seguindo o tema atual
- Responsividade para mobile e desktop

### Elementos Visuais:
- **Ícone de envelope** para ação de mensagem
- **Badge com contagem** de membros em cada lista
- **Indicador visual** de lista ativa/inativa
- **Skeleton loaders** durante carregamento
- **Toast notifications** para feedback
- **Confirmação modal** para ações destrutivas

### Estados da Interface:
- **Loading states**: Skeleton loaders para listas e membros
- **Empty states**: Mensagens quando não há listas/membros
- **Error states**: Tratamento de erros com mensagens claras
- **Success states**: Confirmações visuais de ações

### Paginação:
- 20 membros por página na listagem
- Navegação com botões anterior/próximo
- Indicador de página atual
- Contador total de páginas

## 9. Testes e Qualidade

### Casos de Teste:
1. **Criação de listas**: Personalizadas e inteligentes
2. **Gerenciamento de membros**: Adicionar, remover, buscar
3. **Filtros inteligentes**: Todos os tipos de filtro
4. **Envio de mensagens**: Em massa e individual
5. **Integração com promoções**: Criar ofertas para listas
6. **Validações**: Limites, permissões, formatos
7. **Performance**: Listas com muitos membros
8. **Responsividade**: Mobile e desktop

### Métricas de Qualidade:
- Tempo de resposta < 2s para listagens
- Suporte a listas com até 10.000 membros
- Zero memory leaks em operações de massa
- 100% de cobertura de casos críticos

## 10. Documentação Adicional

### Documentação Técnica:
- Schema completo das tabelas
- Documentação de todos os endpoints da API
- Exemplos de uso dos hooks React
- Guia de troubleshooting

### Documentação de Usuário:
- Tutorial de como criar listas
- Guia de filtros inteligentes
- Melhores práticas de segmentação
- Casos de uso comuns

### Screenshots e Mockups:
- Interface principal com tabs
- Modal de criação de lista
- Listagem de membros
- Envio de mensagens em massa
- Criação de ofertas direcionadas

## 11. Roadmap de Implementação

### Fase 1: Fundação (Sprint 1-2)
- [ ] Schema das tabelas
- [ ] Funções básicas de storage
- [ ] Endpoints principais da API
- [ ] Hooks básicos

### Fase 2: Componentes Core (Sprint 3-4)
- [ ] Componentes de listagem
- [ ] Modais de criação e edição
- [ ] Sistema de filtros inteligentes
- [ ] Página principal

### Fase 3: Funcionalidades Avançadas (Sprint 5-6)
- [ ] Envio de mensagens em massa
- [ ] Integração com promoções
- [ ] Componentes de membros
- [ ] Ações em massa

### Fase 4: Polimento (Sprint 7-8)
- [ ] Testes completos
- [ ] Otimizações de performance
- [ ] Documentação final
- [ ] Deploy e monitoramento

## 12. Considerações Técnicas

### Performance:
- Índices nas tabelas para consultas rápidas
- Cache de contagens de membros
- Paginação eficiente para grandes listas
- Lazy loading de componentes pesados

### Escalabilidade:
- Suporte a criadores com milhões de seguidores
- Otimização de queries complexas
- Background jobs para operações pesadas
- Monitoring de uso de recursos

### Manutenibilidade:
- Código bem documentado
- Separação clara de responsabilidades
- Testes automatizados
- Logs detalhados para debugging

---

Este documento serve como guia completo para a implementação do sistema de listas. Cada seção deve ser implementada seguindo as especificações aqui detalhadas, garantindo consistência e qualidade em todo o sistema.



