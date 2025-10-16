# Planejamento: Mensagens Automáticas

## Visão Geral

Sistema que permite criadores configurarem mensagens automáticas personalizadas para 7 eventos diferentes, com suporte a variáveis dinâmicas e controle de ativação individual.

## 1. Database Schema

**Arquivo:** `shared/schema.ts`

Criar tabela para armazenar as configurações de mensagens automáticas:

```typescript
export const automaticMessages = pgTable("automatic_messages", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  eventType: text("event_type").notNull(), // new_subscriber, new_follower, subscriber_canceled, re_subscribed, subscription_renewed, new_purchase, first_message_reply
  isEnabled: boolean("is_enabled").default(true).notNull(),
  messageText: text("message_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Unique constraint: um registro por evento por criador
// Index em (creatorId, eventType)
```

**Tipos de Eventos:**
- `new_subscriber` - Novo assinante
- `new_follower` - Novo seguidor
- `subscriber_canceled` - Assinatura cancelada
- `re_subscribed` - Re-assinatura
- `subscription_renewed` - Assinatura renovada
- `new_purchase` - Nova compra
- `first_message_reply` - Primeira resposta de mensagem

**Variáveis Dinâmicas Suportadas:**
- `{user_name}` - Nome do usuário
- `{creator_name}` - Nome do criador
- `{subscription_price}` - Preço da assinatura
- `{purchase_amount}` - Valor da compra
- `{renewal_date}` - Data de renovação
- `{date}` - Data atual

## 2. Backend - Storage Functions

**Arquivo:** `server/storage.ts`

```typescript
// Buscar todas as mensagens de um criador
getAutomaticMessages(creatorId: number): Promise<AutomaticMessage[]>

// Buscar mensagem específica por evento
getAutomaticMessageByEvent(creatorId: number, eventType: string): Promise<AutomaticMessage | null>

// Criar ou atualizar mensagem de um evento
upsertAutomaticMessage(creatorId: number, eventType: string, data: {
  isEnabled: boolean;
  messageText: string;
}): Promise<AutomaticMessage>

// Ativar/desativar mensagem
toggleAutomaticMessage(creatorId: number, eventType: string): Promise<AutomaticMessage>

// Resetar mensagem para padrão do sistema
resetAutomaticMessage(creatorId: number, eventType: string): Promise<AutomaticMessage>
```

**Mensagens Padrão (Templates):**

```typescript
const DEFAULT_MESSAGES = {
  new_subscriber: "Olá {user_name}! 🎉 Bem-vindo(a) à minha comunidade exclusiva! Obrigado por se tornar um assinante. Estou animado(a) para compartilhar conteúdo especial com você!",
  new_follower: "Oi {user_name}! 👋 Obrigado por me seguir! Fique atento ao meu perfil para não perder nenhum conteúdo novo!",
  subscriber_canceled: "Olá {user_name}, lamento ver você partir. 😢 Se mudou de ideia ou tem algum feedback, estou aqui! Espero te ver novamente em breve.",
  re_subscribed: "Que bom ter você de volta, {user_name}! 🎊 Obrigado por renovar sua confiança. Vamos continuar essa jornada juntos!",
  subscription_renewed: "Oi {user_name}! ✨ Sua assinatura foi renovada com sucesso. Obrigado por continuar me apoiando!",
  new_purchase: "Olá {user_name}! 🛒 Obrigado pela sua compra! Espero que aproveite o conteúdo exclusivo. Qualquer dúvida, estou à disposição!",
  first_message_reply: "Oi {user_name}! 💬 Obrigado pela mensagem! Vou responder assim que possível. Sua interação é muito importante para mim!"
};
```

## 3. Backend - API Routes

**Arquivo:** `server/routes.ts`

```typescript
// Listar todas as mensagens do criador
GET /api/creator/automatic-messages
Response: AutomaticMessage[]

// Buscar mensagem específica
GET /api/creator/automatic-messages/:eventType
Response: AutomaticMessage

// Criar ou atualizar mensagem
PUT /api/creator/automatic-messages/:eventType
Body: { isEnabled: boolean, messageText: string }
Response: AutomaticMessage

// Toggle ativar/desativar
PATCH /api/creator/automatic-messages/:eventType/toggle
Response: AutomaticMessage

// Resetar para mensagem padrão
POST /api/creator/automatic-messages/:eventType/reset
Response: AutomaticMessage
```

**Validações:**
- `messageText`: 1-500 caracteres
- `eventType`: deve ser um dos 7 tipos válidos
- Autenticação: apenas criador pode gerenciar suas mensagens

## 4. Frontend - Hook Customizado

**Arquivo:** `client/src/hooks/use-automatic-messages.ts`

```typescript
// Queries
export function useAutomaticMessages()
export function useAutomaticMessage(eventType: string)

// Mutations
export function useUpsertAutomaticMessage()
export function useToggleAutomaticMessage()
export function useResetAutomaticMessage()

// Utilities
export function getEventLabel(eventType: string): string
export function getEventIcon(eventType: string): string
export function replaceVariables(text: string, variables: Record<string, string>): string
export function getAvailableVariables(eventType: string): string[]
```

## 5. Frontend - Componentes

### AutomaticMessagesPage.tsx

**Arquivo:** `client/src/pages/creator/tools/AutomaticMessagesPage.tsx`

Layout principal da página:

```typescript
<CreatorLayout>
  <header>
    <h1>Mensagens automáticas</h1>
    <p>Configure mensagens automáticas para eventos específicos.</p>
  </header>
  
  <main>
    <MessageConfigList />
  </main>
</CreatorLayout>
```

### MessageConfigList.tsx

**Arquivo:** `client/src/components/creator/automatic-messages/MessageConfigList.tsx`

Lista de cards com todas as mensagens automáticas:

- Grid responsivo de cards
- Cada card representa um evento
- Visual: ícone do evento + título + status (ON/OFF)
- Click no card abre modal de edição

### MessageConfigCard.tsx

**Arquivo:** `client/src/components/creator/automatic-messages/MessageConfigCard.tsx`

Card individual de configuração:

**Elementos:**
- Ícone do evento (à esquerda)
- Título do evento ("New subscriber", "New follower", etc.)
- Toggle ON/OFF (canto superior direito)
- Seta para indicar clicável (canto direito)
- Estado ativo: borda verde
- Estado inativo: opacidade reduzida

**Props:**
```typescript
{
  eventType: string;
  title: string;
  icon: ReactNode;
  isEnabled: boolean;
  onToggle: () => void;
  onClick: () => void;
}
```

### EditMessageModal.tsx

**Arquivo:** `client/src/components/creator/automatic-messages/EditMessageModal.tsx`

Modal para editar mensagem:

**Seções:**

1. **Header:**
   - Título do evento
   - Toggle ON/OFF
   - Botão fechar

2. **Editor de Mensagem:**
   - Textarea para texto da mensagem
   - Contador de caracteres (atual/500)
   - Suporte a formatação (negrito, itálico, emojis)
   - Suporte a anexar mídia (imagem/GIF)

3. **Variáveis Disponíveis:**
   - Lista de variáveis clicáveis
   - Click insere variável no cursor
   - Badges coloridos para cada variável
   - Exemplo: `{user_name}`, `{creator_name}`, etc.

4. **Preview:**
   - Visualização da mensagem com variáveis substituídas
   - Exemplo com dados fictícios

5. **Footer:**
   - Botão "Resetar para padrão"
   - Botão "Cancelar"
   - Botão "Salvar alterações"

### MessageVariablePicker.tsx

**Arquivo:** `client/src/components/creator/automatic-messages/MessageVariablePicker.tsx`

Componente para selecionar e inserir variáveis:

- Grid de badges clicáveis
- Cada badge: `{nome_variavel}`
- Click copia ou insere no textarea
- Tooltip com descrição da variável

### MessagePreview.tsx

**Arquivo:** `client/src/components/creator/automatic-messages/MessagePreview.tsx`

Preview da mensagem como será enviada:

- Simula interface de chat
- Mostra avatar do criador
- Texto com variáveis substituídas por exemplos
- Suporta formatação e mídia

### MessageFormatToolbar.tsx

**Arquivo:** `client/src/components/creator/automatic-messages/MessageFormatToolbar.tsx`

Barra de ferramentas de formatação:

- Botão: Negrito (**B**)
- Botão: Itálico (*I*)
- Botão: Emoji picker
- Botão: Anexar imagem/GIF
- Botão: Inserir variável

## 6. UI/UX Design

### Cores e Ícones por Evento:

```typescript
const EVENT_STYLES = {
  new_subscriber: {
    icon: '➕',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  new_follower: {
    icon: '⭐',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  subscriber_canceled: {
    icon: '❌',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  re_subscribed: {
    icon: '🔄',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  subscription_renewed: {
    icon: '🔁',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  new_purchase: {
    icon: '💰',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  first_message_reply: {
    icon: '💬',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
};
```

### Layout da Página:

- Header com título e descrição
- Grid de 2 colunas em desktop, 1 em mobile
- Cards com altura uniforme
- Espaçamento consistente (gap-4)
- Hover: elevação suave
- Toggle animado

## 7. Fluxo de Uso

### Ativar/Desativar Mensagem:

1. Criador visualiza lista de mensagens
2. Clica no toggle ON/OFF de um card
3. Estado atualiza imediatamente
4. Toast de confirmação
5. Mensagem fica ativa/inativa para envios futuros

### Editar Mensagem:

1. Criador clica em um card
2. Modal abre com mensagem atual
3. Edita texto no textarea
4. Clica em variável para inserir
5. Vê preview em tempo real
6. Pode adicionar formatação/mídia
7. Clica "Salvar alterações"
8. Modal fecha com toast de sucesso

### Resetar Mensagem:

1. Criador abre modal de edição
2. Clica "Resetar para padrão"
3. Confirmação: "Tem certeza?"
4. Texto volta ao template padrão
5. Preview atualiza
6. Criador pode salvar ou editar mais

### Inserir Variável:

1. Criador posiciona cursor no textarea
2. Clica em badge de variável
3. Variável é inserida na posição do cursor
4. Preview atualiza automaticamente

## 8. Validações

### Mensagem:
- Mínimo: 1 caractere
- Máximo: 500 caracteres
- Variáveis válidas são substituídas
- Variáveis inválidas são mantidas como texto

### Formatação:
- Negrito: `**texto**`
- Itálico: `*texto*`
- Emojis nativos suportados
- URLs automaticamente clicáveis

### Mídia:
- Formatos: JPG, PNG, GIF
- Tamanho máximo: 5MB
- Preview antes de anexar

## 9. Mock Data

**Arquivo:** `server/storage.ts`

Dados iniciais para cada criador:

```typescript
const mockMessages = [
  { eventType: 'new_subscriber', isEnabled: true, messageText: DEFAULT_MESSAGES.new_subscriber },
  { eventType: 'new_follower', isEnabled: true, messageText: DEFAULT_MESSAGES.new_follower },
  { eventType: 'subscriber_canceled', isEnabled: false, messageText: DEFAULT_MESSAGES.subscriber_canceled },
  { eventType: 're_subscribed', isEnabled: true, messageText: DEFAULT_MESSAGES.re_subscribed },
  { eventType: 'subscription_renewed', isEnabled: true, messageText: DEFAULT_MESSAGES.subscription_renewed },
  { eventType: 'new_purchase', isEnabled: true, messageText: DEFAULT_MESSAGES.new_purchase },
  { eventType: 'first_message_reply', isEnabled: true, messageText: DEFAULT_MESSAGES.first_message_reply },
];
```

## 10. Arquivos a Criar/Modificar

**Criar:**
- `client/src/hooks/use-automatic-messages.ts`
- `client/src/pages/creator/tools/AutomaticMessagesPage.tsx`
- `client/src/components/creator/automatic-messages/MessageConfigList.tsx`
- `client/src/components/creator/automatic-messages/MessageConfigCard.tsx`
- `client/src/components/creator/automatic-messages/EditMessageModal.tsx`
- `client/src/components/creator/automatic-messages/MessageVariablePicker.tsx`
- `client/src/components/creator/automatic-messages/MessagePreview.tsx`
- `client/src/components/creator/automatic-messages/MessageFormatToolbar.tsx`

**Modificar:**
- `shared/schema.ts` - adicionar tabela automaticMessages
- `server/storage.ts` - adicionar funções de mensagens automáticas
- `server/routes.ts` - adicionar rotas da API
- `client/src/App.tsx` - adicionar rota para /creator/tools/automatic-messages

## 11. Roteamento

**Arquivo:** `client/src/App.tsx`

```typescript
// Adicionar rota
<Route path="/creator/tools/automatic-messages" component={AutomaticMessagesPage} />
```

Também adicionar link na sidebar de ferramentas do criador.

---

## Status da Implementação

- [ ] **Database Schema** - Criar tabela automaticMessages
- [ ] **Backend Storage** - Implementar funções de CRUD
- [ ] **Backend Routes** - Criar endpoints da API
- [ ] **Frontend Hook** - use-automatic-messages.ts
- [ ] **MessageConfigList** - Lista de cards de eventos
- [ ] **MessageConfigCard** - Card individual com toggle
- [ ] **EditMessageModal** - Modal de edição completo
- [ ] **MessageVariablePicker** - Seletor de variáveis
- [ ] **MessagePreview** - Preview da mensagem
- [ ] **MessageFormatToolbar** - Barra de formatação
- [ ] **AutomaticMessagesPage** - Página principal
- [ ] **Mock Data** - Dados iniciais
- [ ] **Routing** - Adicionar rota e link na sidebar
- [ ] **Documentação Final** - Atualizar este documento

---

**Data de Criação:** 15/01/2025  
**Autor:** Sistema de Desenvolvimento Preseview  
**Versão:** 1.0
