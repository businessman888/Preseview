# Implementação da Sidebar de Ferramentas do Criador (Versão Web)

## Visão Geral

Este documento descreve a implementação de uma barra lateral de navegação para criadores na versão web da plataforma. A sidebar substitui a navegação inferior (bottom navigation) apenas na versão desktop, mantendo a navegação bottom intacta para dispositivos móveis.

## Objetivos

1. Criar uma sidebar lateral fixa para navegação de criadores na versão web
2. Implementar menu expandível "Ferramentas do Criador" com 10 sub-itens
3. Manter a navegação bottom apenas para versão mobile (< 768px)
4. Criar estrutura de páginas placeholder para futuras funcionalidades
5. Garantir navegação fluida entre todas as seções

## Estrutura de Navegação

### Barra Lateral Principal (Sidebar)

A sidebar será exibida apenas na versão web e conterá os seguintes itens (de cima para baixo):

#### Navegação Principal
1. **Foto de Perfil** → Página do perfil do criador
2. **Home** → Dashboard do criador (Painel/Feed)
3. **Notificações** → Página de notificações
4. **Mensagens** → Página de mensagens
5. **Ferramentas do Criador** → Menu expandível (descrito abaixo)
6. **Finanças** → Página de finanças
7. **Carteira e Pagamentos** → Página de carteira

#### Ações
8. **Botão "+"** → Modal para adicionar conteúdo (post/story)

#### Menu Inferior
9. **Menu "..."** → Opções adicionais
10. **Configurações** → Página de configurações
11. **Favoritos** → Conteúdos salvos pelo criador
12. **Logout** → Sair da conta
13. **Dark Mode** → Toggle tema escuro/claro

### Menu Expandível: Ferramentas do Criador

Quando o usuário clica em "Ferramentas do Criador", o menu expande inline mostrando os seguintes sub-itens:

1. **Estatísticas** → Analytics e métricas de desempenho
2. **Cofre** → Conteúdo arquivado/protegido
3. **Fila** → Agendamento de posts
4. **Links de mídia paga** → Gestão de links para conteúdo pago
5. **Links de rastreio** → URLs rastreáveis para campanhas
6. **Promoções** → Gestão de promoções e ofertas
7. **Mensagens automáticas** → Respostas automáticas
8. **Listas** → Listas de assinantes/segmentação
9. **Ferramentas IA** → Ferramentas de inteligência artificial
10. **Gestão** → Configurações de gestão (Badge "Beta")

## Arquitetura de Componentes

### Novos Componentes

```
client/src/components/creator/
├── CreatorSidebar.tsx          # Sidebar principal
├── CreatorToolsMenu.tsx        # Menu expandível de ferramentas
└── CreatorLayout.tsx           # Layout wrapper (sidebar + conteúdo)
```

### Novas Páginas

#### Ferramentas do Criador
```
client/src/pages/creator/tools/
├── StatisticsPage.tsx          # Estatísticas
├── VaultPage.tsx              # Cofre
├── QueuePage.tsx              # Fila
├── PaidMediaLinksPage.tsx     # Links de mídia paga
├── TrackingLinksPage.tsx      # Links de rastreio
├── PromotionsPage.tsx         # Promoções
├── AutoMessagesPage.tsx       # Mensagens automáticas
├── ListsPage.tsx              # Listas
├── AIToolsPage.tsx            # Ferramentas IA
└── ManagementPage.tsx         # Gestão
```

#### Páginas Adicionais
```
client/src/pages/creator/
├── FinancesPage.tsx           # Finanças
├── WalletPage.tsx             # Carteira e Pagamentos
└── FavoritesPage.tsx          # Favoritos
```

## Rotas

### Novas Rotas a Adicionar

```typescript
// Ferramentas do Criador
/creator/tools/statistics        → StatisticsPage
/creator/tools/vault            → VaultPage
/creator/tools/queue            → QueuePage
/creator/tools/paid-media-links → PaidMediaLinksPage
/creator/tools/tracking-links   → TrackingLinksPage
/creator/tools/promotions       → PromotionsPage
/creator/tools/auto-messages    → AutoMessagesPage
/creator/tools/lists            → ListsPage
/creator/tools/ai-tools         → AIToolsPage
/creator/tools/management       → ManagementPage

// Páginas adicionais
/creator/finances               → FinancesPage
/creator/wallet                 → WalletPage
/creator/favorites              → FavoritesPage
```

### Rota Existente
```typescript
/                               → CreatorDashboard (para criadores logados)
                                   Mostra tabs: Painel | Feed
```

## Comportamento Responsivo

### Versão Web (≥ 768px)
- **Sidebar lateral visível** com todos os itens de navegação
- **Navegação bottom oculta**
- Layout: `[Sidebar Fixa] + [Conteúdo Principal]`
- Sidebar sempre visível, ocupando coluna à esquerda

### Versão Mobile (< 768px)
- **Sidebar lateral oculta**
- **Navegação bottom visível** (comportamento atual mantido)
- Layout mobile-first existente permanece inalterado

## Implementação por Etapas

### Etapa 1: Componente CreatorSidebar
**Arquivo:** `client/src/components/creator/CreatorSidebar.tsx`

**Funcionalidades:**
- Renderizar todos os 13 itens de navegação
- Usar hook `useIsMobile()` para mostrar apenas na versão web
- Integração com `wouter` para navegação
- Estados hover e active para cada item
- Ícones do `lucide-react`

**Estrutura:**
```typescript
interface SidebarItem {
  id: string;
  icon: LucideIcon;
  label?: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  isExpandable?: boolean;
}
```

### Etapa 2: Menu Expandível CreatorToolsMenu
**Arquivo:** `client/src/components/creator/CreatorToolsMenu.tsx`

**Funcionalidades:**
- Estado expandido/colapsado
- Renderizar 10 sub-itens
- Highlight do item ativo baseado na rota atual
- Animação suave de expansão
- Badge "Beta" no item Gestão

### Etapa 3: Layout Wrapper CreatorLayout
**Arquivo:** `client/src/components/creator/CreatorLayout.tsx`

**Funcionalidades:**
- Detectar se é mobile ou web
- Web: renderizar sidebar + conteúdo
- Mobile: renderizar apenas conteúdo (navigation bottom já existe no conteúdo)
- Layout flex com sidebar fixa

**Estrutura:**
```typescript
interface CreatorLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean; // Para mobile
}
```

### Etapa 4: Páginas Placeholder
**Todas as páginas de ferramentas e adicionais**

**Estrutura padrão:**
```typescript
export function [PageName]() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold">[Título da Página]</h1>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Esta funcionalidade está em desenvolvimento.
          </p>
        </div>
      </main>
    </div>
  );
}
```

### Etapa 5: Configuração de Rotas
**Arquivo:** `client/src/App.tsx`

**Alterações:**
- Adicionar importações de todas as novas páginas
- Adicionar rotas no componente Router
- Manter ordem lógica das rotas

### Etapa 6: Atualização do CreatorDashboard
**Arquivo:** `client/src/pages/CreatorDashboard.tsx`

**Alterações:**
- Envolver conteúdo com `<CreatorLayout>`
- Remover navegação bottom condicional (apenas se web)
- Manter tabs Painel/Feed
- Passar prop `showBottomNav={true}` para mobile

### Etapa 7: Estilização
**Design System:**
- Seguir imagem de referência fornecida
- Cores: rosa (#ec4899) e roxo (#9333ea) para elementos ativos
- Sidebar: fundo branco (light) / cinza-900 (dark)
- Largura sidebar: ~240-280px
- Espaçamento vertical entre itens: 8-12px
- Ícones: tamanho 24px
- Animações: suaves (300ms ease-in-out)

## Detalhes de Implementação

### Hook useIsMobile
**Já existe:** `client/src/hooks/use-mobile.tsx`

**Breakpoint:** 768px
```typescript
const isMobile = useIsMobile(); // true se < 768px
```

### Ícones Necessários (lucide-react)
- Home, Bell, MessageCircle, Search, User
- Plus, Settings, Heart/Star (favoritos), LogOut
- Moon/Sun (dark mode)
- ChartBar (estatísticas), Vault, Calendar (fila)
- Link, Tag (promoções), MessageSquare, List
- Sparkles (IA), Settings (gestão)
- DollarSign (finanças), Wallet
- ChevronDown/ChevronUp (expandir menu)

### Estado Global
- Usar `wouter` para detectar rota ativa
- Hook `useAuth()` para dados do usuário (foto de perfil)
- Estado local para menu expandido

### Navegação
- Usar `Link` do wouter para navegação entre páginas
- Usar `useLocation()` para highlight do item ativo
- Modal de AddContent mantém comportamento atual

## Fluxo de Navegação do Usuário

### Cenário 1: Criador faz login (Web)
1. Usuário faz login como criador
2. É direcionado para `/` (home)
3. `CreatorDashboard` é renderizado dentro de `CreatorLayout`
4. Sidebar aparece à esquerda
5. Conteúdo principal mostra tabs "Painel" e "Feed"
6. Navegação bottom não aparece

### Cenário 2: Criador faz login (Mobile)
1. Usuário faz login como criador
2. É direcionado para `/` (home)
3. `CreatorDashboard` é renderizado
4. Sidebar não aparece
5. Conteúdo principal mostra tabs "Painel" e "Feed"
6. Navegação bottom aparece na parte inferior

### Cenário 3: Acessar Ferramentas (Web)
1. Criador clica em "Ferramentas do Criador" na sidebar
2. Menu expande inline mostrando 10 sub-itens
3. Criador clica em "Estatísticas"
4. Navega para `/creator/tools/statistics`
5. Sidebar permanece visível com menu expandido
6. Conteúdo principal mostra página de Estatísticas
7. Item "Estatísticas" fica destacado no menu

### Cenário 4: Adicionar Conteúdo
1. Criador clica no botão "+" na sidebar (web) ou bottom nav (mobile)
2. Modal `AddContentModal` abre
3. Criador pode criar post ou story
4. Comportamento idêntico em ambas versões

## Considerações Técnicas

### Performance
- Sidebar renderiza uma vez e permanece montada
- Usar `React.memo` nos itens de menu se necessário
- Lazy loading das páginas de ferramentas

### Acessibilidade
- Labels ARIA para ícones
- Navegação por teclado (Tab, Enter)
- Indicadores visuais de foco
- Contraste adequado de cores

### Manutenibilidade
- Componentes pequenos e focados
- Props interfaces bem definidas
- Código comentado em seções críticas
- Seguir padrões existentes do projeto

## Próximos Passos (Pós-Implementação)

Após concluir a estrutura base, as funcionalidades serão implementadas em cada seção:

1. **Estatísticas:** Gráficos de earnings, subscribers, engagement
2. **Cofre:** Upload e gerenciamento de mídia
3. **Fila:** Calendário de agendamento de posts
4. **Links:** Geradores de links rastreáveis
5. **Promoções:** Criação de ofertas e descontos
6. **Mensagens Automáticas:** Templates e triggers
7. **Listas:** Segmentação de audiência
8. **IA:** Ferramentas de geração de conteúdo
9. **Gestão:** Configurações avançadas
10. **Finanças:** Relatórios financeiros
11. **Carteira:** Saques e métodos de pagamento
12. **Favoritos:** Grid de conteúdos salvos

## Checklist de Implementação

- [ ] Criar `CreatorSidebar.tsx` com todos os itens de navegação
- [ ] Criar `CreatorToolsMenu.tsx` com menu expandível
- [ ] Criar `CreatorLayout.tsx` com lógica responsiva
- [ ] Criar 10 páginas de ferramentas em `/creator/tools/`
- [ ] Criar 3 páginas adicionais (Finanças, Carteira, Favoritos)
- [ ] Adicionar todas as rotas no `App.tsx`
- [ ] Atualizar `CreatorDashboard.tsx` para usar layout
- [ ] Aplicar estilos seguindo design de referência
- [ ] Testar responsividade (mobile e web)
- [ ] Testar navegação entre todas as páginas
- [ ] Verificar estados ativos/hover
- [ ] Validar dark mode
- [ ] Revisar acessibilidade

## Referências

- Imagens de design fornecidas pelo cliente
- Hook `useIsMobile`: `client/src/hooks/use-mobile.tsx`
- Padrões de componentes: `client/src/components/creator/`
- Roteamento atual: `client/src/App.tsx`

