# Sistema de Login e Cadastro - Usuário e Criador

## Visão Geral

Implementar uma página de entrada unificada onde usuários podem fazer login ou se cadastrar como usuário padrão (simples) ou criador (multi-etapas). A interface deve seguir exatamente o design da imagem fornecida.

## Componentes Principais

### 1. Página de Entrada Principal

**Arquivo:** `client/src/pages/AuthPage.tsx` (refatorar completamente)

**Layout baseado na imagem:**

```
+--------------------------------------------------+
|  Lado Esquerdo (Hero)          Lado Direito      |
|  - Título: "Conecte-se com     +---------------+ |
|    seus criadores favoritos"   | [Login] [Cad] | |
|  - Subtítulo                   |               | |
|  - Benefícios                  | Formulário    | |
|                                |               | |
|                                | [Cadastrar]   | |
|                                | [Sou criador] | |
|                                +---------------+ |
+--------------------------------------------------+
```

**Estrutura:**

- Duas colunas (hero + formulário)
- Hero esquerdo com título, subtítulo e descrição
- Direita: Tabs "Login" e "Cadastrar-se"
- Na aba "Cadastrar-se": exibir formulário simples de usuário
- Abaixo do botão "Cadastrar-se": link sublinhado "Sou criador"
- Ao clicar "Sou criador": redirecionar para `/register/creator`

**Formulário de Cadastro Usuário Padrão:**

Campos (conforme imagem):
- Nome (input text)
- Email (input email)
- Senha (input password)
- Botões de social login: Google, Twitter, Facebook
- Botão "Cadastrar-se" (vermelho/rosa)
- Link "Sou criador" (sublinhado, abaixo)

**Formulário de Login:**

- Email ou Username
- Senha
- Botão "Login"

### 2. Página de Cadastro de Criador

**Arquivo:** `client/src/pages/RegisterCreatorPage.tsx` (novo)

Reutilizar completamente o wizard multi-etapas já criado em `BecomeCreatorPage.tsx`, mas com modificações:

**Etapas:**

1. **Etapa 0 (NOVA): Senha e Dados Básicos**
   - Nome
   - Email
   - Senha
   - Confirmação de senha
   - Botão "Continuar"

2. **Etapa 1: Gênero** (já existe em `GenderStep.tsx`)
3. **Etapa 2: Foto e Handle** (já existe em `ProfilePhotoStep.tsx`)
4. **Etapa 3: Banner e Bio** (já existe em `BannerBioStep.tsx`)
5. **Etapa 4: Preço de Assinatura** (já existe em `SubscriptionPriceStep.tsx`)
6. **Etapa 5: Verificação de Identidade** (já existe em `VerificationStep.tsx`)
   - Permitir pular esta etapa
   - Não bloquear cadastro se usuário pular

**Criar novo componente:**

`client/src/pages/register-creator/steps/PasswordStep.tsx`

Campos:
- Nome (input)
- Email (input)
- Senha (input password)
- Confirmar senha (input password)
- Validações:
  - Nome: mínimo 2 caracteres
  - Email: formato válido e único
  - Senha: mínimo 8 caracteres
  - Confirmar senha: deve ser igual a senha

**Modificar:**

`client/src/pages/RegisterCreatorPage.tsx` - copiar lógica de `BecomeCreatorPage.tsx` e adicionar:

```typescript
const STEPS = [
  { id: 0, component: PasswordStep, title: 'Dados de acesso' },
  { id: 1, component: GenderStep, title: 'Gênero' },
  { id: 2, component: ProfilePhotoStep, title: 'Foto de perfil e @handle' },
  { id: 3, component: BannerBioStep, title: 'Banner e biografia' },
  { id: 4, component: SubscriptionPriceStep, title: 'Preço de assinatura' },
  { id: 5, component: VerificationStep, title: 'Verificar identidade' }
];
```

### 3. Backend

**Endpoint de Registro de Usuário Padrão:**

Já existe: `POST /api/register` (verificar se está funcionando)

**Endpoint de Registro de Criador:**

Criar novo: `POST /api/register/creator`

Aceita todos os dados do wizard:
```typescript
{
  name: string;
  email: string;
  password: string;
  gender?: string;
  profileImage?: string;
  displayName?: string;
  username?: string;
  coverImage?: string;
  bio?: string;
  subscriptionPrice: number;
  verificationStatus?: string;
}
```

Lógica:
1. Criar usuário com `user_type = 'creator'`
2. Criar registro em `creator_profiles`
3. Fazer login automático
4. Retornar usuário e token

**Modificar em `server/routes.ts`:**

```typescript
app.post("/api/register/creator", async (req, res) => {
  try {
    const { name, email, password, ...creatorData } = req.body;
    
    // Validar dados
    // Criar usuário como creator
    // Criar perfil de criador
    // Retornar usuário
  } catch (error) {
    // Tratar erros
  }
});
```

**Modificar em `server/storage.ts`:**

Criar função: `createCreatorAccount(userData, creatorProfileData)`

### 4. Fluxo de Autenticação

**Após Login/Registro:**

Sistema detecta automaticamente `user.userType`:
- Se `'user'` → redireciona para `/` (home de usuário)
- Se `'creator'` → redireciona para `/` (home de criador)

O hook `useAuth` já faz essa verificação.

### 5. Verificação de Identidade

**Modificação importante:**

Na etapa de verificação (VerificationStep.tsx):
- Botão "Continuar" → permite pular
- Botão "Verificar depois" → permite pular
- Não bloquear criação de conta
- Marcar como `verificationStatus: 'pending'`

## Arquivos a Criar

1. `client/src/pages/RegisterCreatorPage.tsx` - Página de registro de criador
2. `client/src/pages/register-creator/steps/PasswordStep.tsx` - Etapa 0: Senha e dados básicos

## Arquivos a Modificar

1. `client/src/pages/AuthPage.tsx` - Refatorar para seguir design da imagem
   - Adicionar link "Sou criador" abaixo do botão de cadastro
   - Simplificar formulário de cadastro de usuário (sem tipo de conta)
   - Melhorar layout conforme imagem

2. `client/src/App.tsx` - Adicionar rota `/register/creator`

3. `server/routes.ts` - Criar endpoint `POST /api/register/creator`

4. `server/storage.ts` - Criar função `createCreatorAccount()`

5. `client/src/pages/become-creator/steps/VerificationStep.tsx`
   - Garantir que ambos botões permitem pular a verificação

## Fluxo Completo

### Usuário Padrão:

1. Acessa `/auth`
2. Clica em "Cadastrar-se"
3. Preenche: Nome, Email, Senha
4. Clica "Cadastrar-se"
5. Sistema cria conta como `user_type = 'user'`
6. Faz login automático
7. Redireciona para home de usuário

### Criador:

1. Acessa `/auth`
2. Clica em "Cadastrar-se"
3. Clica em "Sou criador" (link sublinhado)
4. Redireciona para `/register/creator`
5. **Etapa 0:** Preenche Nome, Email, Senha
6. **Etapa 1:** Seleciona gênero
7. **Etapa 2:** Define foto e username
8. **Etapa 3:** Define banner e bio (pode pular)
9. **Etapa 4:** Define preço de assinatura
10. **Etapa 5:** Verificação (pode pular com qualquer botão)
11. Sistema cria conta como `user_type = 'creator'`
12. Cria perfil de criador
13. Faz login automático
14. Redireciona para home de criador

## Validações

**Usuário Padrão:**
- Nome: mínimo 2 caracteres
- Email: formato válido, único
- Senha: mínimo 8 caracteres

**Criador:**
- Todos os campos de usuário padrão
- Username: único, formato válido
- Preço: >= 0
- Verificação: opcional (não bloqueia)

## Estilo Visual

Seguir exatamente a imagem fornecida:
- Hero esquerdo com gradiente
- Card branco direito
- Tabs superiores
- Campos arredondados
- Botões de social login (ícones coloridos)
- Botão primário vermelho/rosa
- Link sublinhado para "Sou criador"

## Tasks de Implementação

### Fase 1: Componentes Base
- [ ] Criar PasswordStep.tsx para etapa inicial do cadastro de criador
- [ ] Criar RegisterCreatorPage.tsx reutilizando wizard multi-etapas

### Fase 2: Página de Autenticação
- [ ] Refatorar AuthPage.tsx para seguir design da imagem com link 'Sou criador'

### Fase 3: Verificação de Identidade
- [ ] Atualizar VerificationStep.tsx para permitir pular verificação sem bloqueio

### Fase 4: Backend
- [ ] Criar endpoint POST /api/register/creator no backend
- [ ] Criar função createCreatorAccount() no storage.ts

### Fase 5: Rotas e Integração
- [ ] Adicionar rota /register/creator no App.tsx

### Fase 6: Testes
- [ ] Testar fluxo completo de cadastro de usuário padrão
- [ ] Testar fluxo completo de cadastro de criador com todas etapas

## Considerações Técnicas

### Reutilização de Código
- Reutilizar completamente o wizard de "tornar-se criador" existente
- Adicionar apenas uma etapa inicial (senha e dados básicos)
- Manter toda a lógica de navegação e salvamento

### Validação de Email
- Implementar verificação de email único no backend
- Mostrar feedback em tempo real no frontend

### Upload de Imagens
- Preparar estrutura para upload (pode ser mock inicialmente)
- Validação de tipos e tamanhos de arquivo

### Verificação de Identidade
- Permitir pular a etapa sem bloquear o cadastro
- Marcar status como 'pending' para implementação futura

### Responsividade
- Garantir que o design funcione em mobile e desktop
- Manter consistência com o resto da aplicação

## Status: Planejado
**Data de Criação:** 2025-01-15
**Próxima Etapa:** Aguardando aprovação para início da implementação
