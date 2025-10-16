# Planejamento: Fila (Calendário de Agendamento)

**Data de Planejamento:** 15 de Outubro de 2025  
**Versão:** 1.0.0  
**Status:** 📋 **PLANEJAMENTO COMPLETO**

---

## 🎯 **Visão Geral da Funcionalidade**

A funcionalidade "Fila" é um calendário mensal interativo que permite aos criadores:

- **Visualizar** posts agendados, lembretes e posts publicados em formato de calendário
- **Agendar** novos posts para datas futuras (do cofre existente ou criando novo conteúdo)
- **Criar lembretes** para tarefas e notas pessoais
- **Gerenciar** todo o cronograma de conteúdo em uma interface visual intuitiva

---

## 📊 **Funcionalidades Detalhadas**

### 1. **Calendário Visual**
- **Layout:** Grid 7x6 (semanas x dias) similar ao Google Calendar
- **Navegação:** Botões anterior/próximo para navegar entre meses
- **Header:** Mostra mês e ano atual (ex: "October 2025")
- **Células clicáveis:** Cada dia do mês é clicável para interação

### 2. **Indicadores Visuais**
- **🟣 Posts Agendados:** Bolinha rosa para posts programados
- **🟢 Lembretes:** Bolinha verde para lembretes criados
- **🔵 Posts Publicados:** Bolinha azul para posts já publicados
- **Múltiplos indicadores:** Quando há vários itens no mesmo dia

### 3. **Interação por Dia**
Ao clicar em um dia do calendário:
- **Modal abre** mostrando todos os itens daquele dia
- **Seção de visualização:** Lista posts agendados, lembretes e posts publicados
- **Seção de ações:** Botões "Agendar Post" e "Adicionar Lembrete"

### 4. **Agendamento de Posts**
Modal com duas opções:
- **Tab "Do Cofre":** Selecionar conteúdo existente do vault + escolher data/hora
- **Tab "Novo Post":** Criar post completo (reutilizar CreatePostModal) + data/hora
- **Configurações:** Data/hora, toggle notificação, botão agendar

### 5. **Sistema de Lembretes**
- **Campos:** Título, descrição (opcional), data/hora
- **Funcionalidades:** Criar, editar, excluir, marcar como completo
- **Notificações:** Toggle para ativar/desativar lembretes

---

## 🗄️ **Estrutura do Banco de Dados**

### **Tabela: scheduled_posts**
```sql
CREATE TABLE scheduled_posts (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER NOT NULL REFERENCES users(id),
  scheduled_date TIMESTAMP NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  tags TEXT[],
  is_exclusive BOOLEAN DEFAULT false,
  folder_id INTEGER REFERENCES vault_folders(id),
  status TEXT DEFAULT 'pending', -- pending, published, cancelled
  published_post_id INTEGER REFERENCES posts(id),
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabela: reminders**
```sql
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER NOT NULL REFERENCES users(id),
  reminder_date TIMESTAMP NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  notification_enabled BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 **Backend - APIs**

### **Endpoints do Calendário**
```
GET /api/creator/calendar?year=2025&month=10
→ Retorna dados completos do mês (scheduledPosts, reminders, publishedPosts)
```

### **Endpoints de Posts Agendados**
```
GET /api/creator/scheduled-posts/date?date=2025-10-14
POST /api/creator/scheduled-posts
PATCH /api/creator/scheduled-posts/:id
DELETE /api/creator/scheduled-posts/:id
POST /api/creator/scheduled-posts/:id/publish
```

### **Endpoints de Lembretes**
```
GET /api/creator/reminders/date?date=2025-10-14
POST /api/creator/reminders
PATCH /api/creator/reminders/:id
DELETE /api/creator/reminders/:id
```

---

## 🎨 **Frontend - Componentes**

### **1. CalendarGrid.tsx**
- **Responsabilidade:** Renderizar o grid 7x6 do calendário
- **Funcionalidades:** Navegação mensal, células clicáveis, indicadores visuais
- **Props:** `year`, `month`, `onDayClick`, `calendarData`

### **2. CalendarDayCell.tsx**
- **Responsabilidade:** Célula individual de um dia
- **Funcionalidades:** Mostrar número do dia, indicadores coloridos, hover effects
- **Props:** `date`, `isCurrentMonth`, `items`, `onClick`

### **3. DayModal.tsx**
- **Responsabilidade:** Modal que abre ao clicar em um dia
- **Funcionalidades:** Listar itens do dia, ações para criar novo conteúdo
- **Seções:** Visualização de itens + botões de ação

### **4. SchedulePostModal.tsx**
- **Responsabilidade:** Modal para agendar posts
- **Funcionalidades:** Tabs (Do Cofre/Novo Post), date picker, configurações
- **Integração:** Conecta com vault existente e sistema de posts

### **5. ReminderModal.tsx**
- **Responsabilidade:** Modal para criar/editar lembretes
- **Funcionalidades:** Campos de título/descrição, date picker, toggles

### **6. CalendarLegend.tsx**
- **Responsabilidade:** Legenda visual dos indicadores
- **Funcionalidades:** Explicar significado das cores/bolinhas

---

## 📱 **Experiência do Usuário**

### **Fluxo Principal:**
1. **Usuário acessa** `/creator/tools/queue`
2. **Vê calendário** do mês atual com indicadores visuais
3. **Clica em um dia** para ver detalhes
4. **Modal abre** mostrando itens daquele dia
5. **Pode agendar** novo post ou criar lembrete
6. **Navega** entre meses usando setas

### **Estados da Interface:**
- **Loading:** Skeleton durante carregamento dos dados
- **Empty:** Mensagem quando não há itens no mês
- **Error:** Tratamento de erros com toasts
- **Success:** Confirmações de ações realizadas

---

## 🔄 **Integração com Sistema Existente**

### **Com Cofre (Vault):**
- **Buscar conteúdo** existente para agendar
- **Reutilizar mídia** já salva no vault
- **Manter consistência** entre vault e fila

### **Com Posts:**
- **Publicar agendados** vira post real
- **Vincular scheduledPost** com publishedPost
- **Manter histórico** de posts publicados

### **Com Estatísticas:**
- **Contabilizar** posts agendados vs publicados
- **Métricas** de produtividade do criador

---

## 📊 **Dados Mock para Desenvolvimento**

### **Posts Agendados (Outubro 2025):**
```javascript
[
  {
    id: 1,
    scheduledDate: "2025-10-15T14:00:00Z",
    title: "Treino de pernas",
    content: "Hoje foi dia de pernas! 💪",
    status: "pending"
  },
  {
    id: 2,
    scheduledDate: "2025-10-20T18:00:00Z", 
    title: "Receita saudável",
    content: "Nova receita de salada",
    status: "pending"
  }
]
```

### **Lembretes:**
```javascript
[
  {
    id: 1,
    reminderDate: "2025-10-16T09:00:00Z",
    title: "Gravar vídeo para YouTube",
    description: "Preparar script e equipamentos"
  },
  {
    id: 2,
    reminderDate: "2025-10-25T10:00:00Z",
    title: "Revisar posts da semana",
    description: "Analisar performance dos posts"
  }
]
```

---

## 🎯 **Critérios de Sucesso**

### **Funcionalidade:**
- ✅ Calendário renderiza corretamente com navegação mensal
- ✅ Indicadores visuais aparecem nos dias corretos
- ✅ Modais abrem ao clicar em dias
- ✅ Agendamento de posts funciona (do cofre e novo)
- ✅ Criação de lembretes funciona
- ✅ Publicação manual de posts agendados funciona

### **UX/UI:**
- ✅ Interface idêntica à imagem de referência
- ✅ Responsividade completa (mobile/tablet/desktop)
- ✅ Loading states em todas as operações
- ✅ Error handling com toasts informativos
- ✅ Animações suaves e transições

### **Performance:**
- ✅ Carregamento rápido do calendário
- ✅ Cache inteligente com React Query
- ✅ Otimização de re-renders desnecessários

---

## 📁 **Arquivos a Serem Criados**

### **Schema & Backend:**
- `shared/schema.ts` - adicionar tabelas scheduledPosts e reminders
- `server/storage.ts` - implementar funções de calendar/scheduled/reminders
- `server/routes.ts` - adicionar rotas da API

### **Hooks:**
- `client/src/hooks/use-queue.ts` - hook customizado para fila

### **Componentes:**
- `client/src/components/creator/queue/CalendarGrid.tsx`
- `client/src/components/creator/queue/CalendarDayCell.tsx`
- `client/src/components/creator/queue/DayModal.tsx`
- `client/src/components/creator/queue/SchedulePostModal.tsx`
- `client/src/components/creator/queue/ReminderModal.tsx`
- `client/src/components/creator/queue/CalendarLegend.tsx`

### **Páginas:**
- `client/src/pages/creator/tools/QueuePage.tsx` - implementação completa

### **Documentação:**
- `docs/08-implementacao-fila-calendario.md` - documentação pós-implementação

---

## 🔄 **Fluxo de Implementação**

### **Fase 1: Database & Backend**
1. Criar tabelas no schema
2. Implementar funções de storage
3. Criar endpoints da API
4. Adicionar dados mock

### **Fase 2: Hook & Lógica**
1. Criar hook use-queue.ts
2. Implementar queries e mutations
3. Testar integração com APIs

### **Fase 3: Componentes Base**
1. CalendarGrid e CalendarDayCell
2. CalendarLegend
3. Estrutura básica do calendário

### **Fase 4: Modais & Interações**
1. DayModal
2. SchedulePostModal
3. ReminderModal
4. Integração com vault

### **Fase 5: Integração & Polimento**
1. Integrar todos os componentes na QueuePage
2. Implementar estados de loading/error
3. Testes de responsividade
4. Documentação final

---

## 🚀 **Próximos Passos**

1. **Aprovação do plano** pelo usuário
2. **Implementação** seguindo as fases definidas
3. **Testes** de funcionalidade e UX
4. **Documentação** final da implementação
5. **Deploy** e validação em produção

---

*Planejamento criado em 15 de Outubro de 2025*
