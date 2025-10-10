# Plataforma de Criadores - Creator Platform

## Descrição
Plataforma de criadores em português (brasileiro) onde usuários podem se conectar com seus criadores favoritos através de conteúdo exclusivo, stories, posts, mensagens diretas e gorjetas/assinaturas.

## Stack Tecnológico
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express.js, TypeScript  
- **Database**: PostgreSQL com Drizzle ORM
- **UI Framework**: Radix UI components com Tailwind CSS
- **Styling**: CSS customizado com fonte Inria Sans

## Arquitetura do Projeto

### Estrutura Frontend
- `/client/src/pages/ScreenHome.tsx` - Feed principal com stories e posts
- `/client/src/pages/ScreenMessages.tsx` - Lista de conversas e mensagens
- `/client/src/pages/ScreenNotifications.tsx` - Notificações categorizadas
- `/client/src/pages/ScreenProfile.tsx` - Perfil do usuário com gestão de posts
- `/client/src/components/StoriesBar.tsx` - Barra de stories circular
- `/client/src/components/StoryViewer.tsx` - Visualizador de stories
- `/client/src/components/PostCard.tsx` - Card de post com todas as interações
- `/client/src/components/CreatePostModal.tsx` - Modal para criar posts/stories

### Estrutura Backend  
- `/server/index.ts` - Servidor Express e middleware
- `/server/routes.ts` - Rotas da API
- `/server/storage.ts` - Interface de armazenamento de dados
- `/server/db.ts` - Configuração do PostgreSQL/Neon

### Shared
- `/shared/schema.ts` - Schema do banco e tipos TypeScript

## Funcionalidades Implementadas

### Stories (24h de expiração)
- ✅ Formato circular na parte superior do feed
- ✅ Suporte para vídeos e fotos
- ✅ Visualizador de stories com barra de progresso
- ✅ Expiração automática em 24 horas
- ✅ Contador de visualizações

### Posts e Feed
- ✅ Feed mostra todos os posts de usuários
- ✅ Cada post tem: curtir, comentar, salvar, tip ($), assinar
- ✅ Suporte para múltiplas imagens/vídeos
- ✅ Posts exclusivos para assinantes
- ✅ Sistema de tags

### Notificações
- ✅ Organizadas por tipo
- ✅ Seguidores no topo
- ✅ Depois assinantes
- ✅ Depois curtidas/comentários/tips
- ✅ Todas as notificações em português

### Mensagens
- ✅ Lista de todas as conversas
- ✅ Histórico de mensagens
- ✅ Indicador de mensagens não lidas
- ✅ Busca de conversas

### Perfil
- ✅ Mostra posts do usuário
- ✅ Gerenciamento de posts (editar/deletar)
- ✅ Abas: todos os posts, imagens, vídeos
- ✅ Estatísticas (posts, seguidores, seguindo)
- ✅ Botão para tornar-se criador

### Monetização
- ✅ Sistema de assinaturas
- ✅ Gorjetas/tips em posts
- ✅ Conteúdo exclusivo para assinantes
- ✅ Preços configuráveis por criador

### Configurações Completas
- ✅ Estrutura de settings multi-nível (settings > seção > sub-seção)
- ✅ Gerenciamento de Conta:
  - Edição de informações (nome de exibição, bio)
  - Alteração de email
  - Alteração de senha (com bcrypt)
  - Exclusão de conta
- ✅ Configurações de Privacidade:
  - Controle de visibilidade do perfil
  - Status online/offline
  - Permissões de mensagens
  - Visibilidade de assinaturas
  - Gerenciamento de usuários bloqueados
- ✅ Pagamentos e Assinaturas:
  - Gerenciamento de assinaturas ativas
  - Carteira e métodos de pagamento
  - Histórico de transações
- ✅ Notificações e Ajuda

### Navegação
- ✅ Barra inferior com: Home, Mensagens, Criar (+), Notificações, Perfil
- ✅ Botão "+" para criadores adicionarem conteúdo
- ✅ Design mobile-first
- ✅ Acesso às configurações via perfil

## Status da Migração
- [x] Estrutura do projeto configurada
- [x] Todas as dependências instaladas
- [x] Servidor rodando na porta 5000
- [x] Sistema de autenticação implementado
- [x] Banco de dados PostgreSQL configurado
- [x] Todas as páginas criadas e funcionais
- [x] Componentes de stories implementados
- [x] Feed de posts completo
- [x] Sistema de notificações
- [x] Sistema de mensagens
- [x] Perfil com gestão de posts

## Dependências de Assets
A aplicação referencia assets do Figma em `/figmaAssets/`:
- Imagens de perfil de criadores (ellipse-*.png, frame-*.png)
- Imagens de posts (fttpost2.png)
- Gráficos de header (head.svg)
- Ícones de UI (verified.png)

## Configuração do Banco de Dados

### PostgreSQL com Neon
O projeto usa PostgreSQL serverless (Neon) com configuração SSL para desenvolvimento e produção:

**Arquivo: `server/db.ts`**
```typescript
neonConfig.webSocketConstructor = ws;

// Desabilita verificação TLS apenas em desenvolvimento
const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: isDevelopment ? {
    rejectUnauthorized: false
  } : true
});
```

### Schema do Banco
Principais tabelas:
- `users` - Usuários da plataforma
- `creator_profiles` - Perfis de criadores
- `posts` - Posts de criadores
- `stories` - Stories (24h de expiração)
- `story_views` - Visualizações de stories
- `likes` - Curtidas em posts
- `comments` - Comentários em posts
- `bookmarks` - Posts salvos
- `tips` - Gorjetas/doações
- `subscriptions` - Assinaturas de criadores
- `follows` - Seguidores
- `notifications` - Notificações
- `messages` - Mensagens diretas

## Mudanças Recentes

### 2025-10-10: Sistema Completo de Configurações
- ✅ Implementada estrutura completa de configurações em português
- ✅ Gerenciamento de conta com edição de perfil, email e senha
- ✅ Segurança de senha com bcrypt (hash e verificação)
- ✅ Configurações de privacidade com controles granulares
- ✅ Sistema de pagamentos e assinaturas (infraestrutura completa)
- ✅ Métodos CRUD para payment methods e transactions
- ✅ Todas as páginas com validação e feedback ao usuário
- ✅ Navegação multi-nível (settings → seção → sub-seção)
- ✅ Correção de roteamento com useLocation para rotas aninhadas

### 2025-10-09: Implementação Completa da Plataforma
- ✅ Criados componentes de Stories circular com visualizador
- ✅ Implementado feed de posts com todas as funcionalidades
- ✅ Página de notificações com categorização
- ✅ Página de mensagens funcional
- ✅ Perfil com gestão de posts
- ✅ Modal para criar posts e stories
- ✅ Sistema de curtidas, comentários, salvos, tips e assinaturas
- ✅ Removida seção de criadores sugeridos do feed principal
- ✅ Todas as funcionalidades em português brasileiro

### 2025-10-09: Correção de Erro SSL com Neon
- Configurado `neonConfig.pipelineTLS = false` para resolver problemas de certificado
- Configurado Pool com `ssl: { rejectUnauthorized: false }` para ambiente de desenvolvimento

### 2025-10-09: Sistema de Conta Unificado
- Removida seleção de tipo de usuário do registro
- Criada página "Tornar-se Criador" em `/become-creator`
- Adicionado endpoint `POST /api/user/become-creator`
- Botão "Tornar-se Criador" no perfil para usuários regulares

## Preferências do Usuário
- Idioma: Português (Brasil)
- Tema: Gradiente rosa/roxo
- Design: Mobile-first
- Stories: Formato circular, 24h de expiração
- Feed: Mostrar todos os posts, sem criadores sugeridos
- Notificações: Categorizadas por tipo (seguidores > assinantes > interações)

## Como Usar

### Para Usuários Regulares
1. Criar conta na plataforma
2. Seguir criadores favoritos
3. Ver stories e posts no feed
4. Curtir, comentar e salvar posts
5. Enviar gorjetas para criadores
6. Assinar criadores para conteúdo exclusivo
7. Trocar mensagens diretas

### Para Criadores
1. Criar conta regular
2. Tornar-se criador (definir preço de assinatura)
3. Criar stories e posts
4. Adicionar conteúdo exclusivo para assinantes
5. Receber gorjetas e assinaturas
6. Interagir com fãs via mensagens

## Próximos Passos Sugeridos
- [ ] Implementar sistema de pagamento (Stripe/PagSeguro)
- [ ] Adicionar upload real de vídeos e imagens
- [ ] Implementar chat em tempo real (WebSocket)
- [ ] Sistema de analytics para criadores
- [ ] Notificações push
- [ ] Sistema de denúncias/moderação
- [ ] Verificação de criadores (badge azul)
