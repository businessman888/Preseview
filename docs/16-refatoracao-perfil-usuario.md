# Refatoração da Página de Perfil do Usuário

## Contexto

A página de perfil atual (`ScreenProfile.tsx`) é complexa com funcionalidades de criador. Precisamos simplificá-la para usuários comuns, seguindo o design das imagens fornecidas.

## Análise das Imagens

### Imagem 1 - Perfil Principal
- Banner superior simples
- Foto de perfil circular sobreposta ao banner
- Nome e username
- Botão "Editar perfil" único
- Duas abas: "Purchased" (Compras) e "Liked" (Curtidas)
- Sidebar direita com "Criadores sugeridos"

### Imagem 2 - Menu Editar Perfil
- Tela simples com banner
- Foto de perfil central com ícone de câmera
- Item único clicável: "Informações de perfil" com descrição e seta

### Imagem 3 - Edição de Informações
- Formulário com campos:
  - Nome
  - Handle (username)
  - Bio (textarea grande)
  - Localização
- Botão "Guardar" no topo direito
- Botão voltar no topo esquerdo

## Estrutura da Implementação

### 1. Refatorar `ScreenProfile.tsx`

#### Layout Principal
```
- Banner simples (sem settings icon)
- Foto de perfil circular centralizada
- Nome e username
- Botão "Editar perfil" (redireciona para /profile/edit)
- Tabs: Purchased | Liked
- Grid de conteúdo (3 colunas)
- Sidebar direita desktop: Criadores Sugeridos
```

#### Mudanças específicas
- Remover botões "Insights" e "Promotion" (só criadores têm)
- Remover filtros de vídeos/imagens (simplificar para apenas Purchased/Liked)
- Remover opções de criação/exclusão de posts
- Adicionar componente SuggestedCreators na sidebar direita (desktop)
- Layout responsivo: desktop com sidebar, mobile sem sidebar

### 2. Criar `client/src/pages/EditProfilePage.tsx`

Página de menu de edição de perfil (Imagem 2):
```tsx
- Banner com foto do usuário
- Foto de perfil grande centralizada com ícone de upload
- Card clicável: "Informações de perfil"
  - Título: "Informações de perfil"
  - Subtítulo: "Adiciona ou altera o handle, nome, bio e localização"
  - Ícone de seta para direita
  - Ao clicar: navega para /profile/edit/info
```

### 3. Criar `client/src/pages/EditProfileInfoPage.tsx`

Página de edição de informações (Imagem 3):
```tsx
- Header com botão voltar e botão "Guardar"
- Formulário com campos:
  - Nome (input text)
  - Handle (input text com validação)
  - Bio (textarea grande)
  - Localização (input text)
- Validação e salvamento via API
```

### 4. Atualizar Backend (se necessário)

Verificar endpoints existentes para:
- Atualizar nome, username, bio, localização
- Buscar compras do usuário
- Buscar likes do usuário

### 5. Criar/Atualizar Hooks

#### `useUserPurchases.ts`
- Hook para buscar conteúdo comprado pelo usuário
- Cache com React Query

#### `useUserLikes.ts`
- Hook para buscar conteúdo curtido pelo usuário
- Cache com React Query

### 6. Componentes Auxiliares

#### `PurchasedGrid.tsx`
- Grid 3x3 de conteúdo comprado
- Clique abre modal de visualização

#### `LikedGrid.tsx`
- Grid 3x3 de conteúdo curtido
- Clique abre modal de visualização

## Rotas a Adicionar

```
/profile -> Perfil principal (atualizado)
/profile/edit -> Menu de edição (novo)
/profile/edit/info -> Edição de informações (novo)
```

## Arquivos a Criar

1. `client/src/pages/EditProfilePage.tsx` - Menu de edição
2. `client/src/pages/EditProfileInfoPage.tsx` - Formulário de informações
3. `client/src/hooks/useUserPurchases.ts` - Hook para compras
4. `client/src/hooks/useUserLikes.ts` - Hook para likes
5. `client/src/components/user/PurchasedGrid.tsx` - Grid de compras
6. `client/src/components/user/LikedGrid.tsx` - Grid de likes
7. `client/src/components/user/ProfileSuggestedCreators.tsx` - Criadores sugeridos (sidebar)

## Arquivos a Modificar

1. `client/src/pages/ScreenProfile.tsx` - Simplificar para usuários
2. `client/src/App.tsx` - Adicionar novas rotas
3. Possivelmente `server/routes.ts` - Endpoints de likes/purchases se não existirem

## Estilo Visual

- Usar cores e tipografia consistentes com imagens
- Banner: gradiente simples ou cor sólida
- Foto de perfil: border branco, shadow suave
- Botões: estilo arredondado, primário em rosa/vermelho
- Cards: background branco, border sutil
- Responsive: mobile sem sidebar de criadores sugeridos

## Considerações Técnicas

- Manter compatibilidade com criadores (verificar `user.userType`)
- Validação de username único no backend
- Feedback visual durante salvamento
- Estados de loading apropriados
- Tratamento de erros com toasts

## Implementação por Etapas

### Etapa 1: Criar páginas de edição
- [ ] Criar `EditProfilePage.tsx`
- [ ] Criar `EditProfileInfoPage.tsx`
- [ ] Adicionar rotas no `App.tsx`

### Etapa 2: Criar hooks e componentes
- [ ] Criar `useUserPurchases.ts`
- [ ] Criar `useUserLikes.ts`
- [ ] Criar `PurchasedGrid.tsx`
- [ ] Criar `LikedGrid.tsx`
- [ ] Criar `ProfileSuggestedCreators.tsx`

### Etapa 3: Refatorar perfil principal
- [ ] Simplificar `ScreenProfile.tsx`
- [ ] Implementar layout com abas Purchased/Liked
- [ ] Adicionar sidebar de criadores sugeridos (desktop)

### Etapa 4: Verificar backend
- [ ] Verificar endpoints de likes/purchases
- [ ] Criar endpoints se necessário
- [ ] Testar integração completa

## Status

**Planejamento:** ✅ Concluído  
**Implementação:** ✅ Concluído  
**Testes:** ✅ Pronto para teste  

## Resumo da Implementação

### ✅ Arquivos Criados:
1. `client/src/pages/EditProfilePage.tsx` - Menu de edição de perfil
2. `client/src/pages/EditProfileInfoPage.tsx` - Formulário de informações
3. `client/src/hooks/useUserPurchases.ts` - Hook para compras
4. `client/src/hooks/useUserLikes.ts` - Hook para likes
5. `client/src/components/user/PurchasedGrid.tsx` - Grid de compras
6. `client/src/components/user/LikedGrid.tsx` - Grid de likes
7. `client/src/components/user/ProfileSuggestedCreators.tsx` - Criadores sugeridos (sidebar)

### ✅ Arquivos Modificados:
1. `client/src/pages/ScreenProfile.tsx` - Refatorado para layout simplificado
2. `client/src/App.tsx` - Adicionadas novas rotas
3. `server/storage.ts` - Adicionadas funções getUserPurchases e getUserLikes
4. `server/routes.ts` - Adicionados endpoints /api/user/purchases e /api/user/likes

### ✅ Funcionalidades Implementadas:
- Layout responsivo com sidebar desktop e navegação mobile
- Abas Purchased e Liked funcionais
- Sistema de edição de perfil em duas etapas
- Integração com backend para purchases e likes
- Criadores sugeridos na sidebar
- Estados de loading e empty states
- Validação de formulários

---

*Documento criado em: 2025-01-14*  
*Versão: 1.0 - Implementação Concluída*
