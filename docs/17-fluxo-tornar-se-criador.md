# Fluxo Multi-Etapas: Tornar-se Criador

## Visão Geral

Implementar um fluxo de onboarding com 5 etapas para usuários se tornarem criadores, seguindo o design das imagens fornecidas. Após completar todas as etapas, a conta do usuário será automaticamente convertida para criador.

## Estrutura do Fluxo

### Rota Principal
`/become-creator` → Substituir a página atual por um componente de wizard multi-etapas

### Estado do Wizard
- Gerenciar progresso das etapas (1-5)
- Armazenar dados temporariamente (localStorage ou state)
- Indicador visual de progresso (dots no topo)
- Navegação: Voltar / Continuar / Pular (quando aplicável)

## Etapas Detalhadas

### Etapa 1: Seleção de Gênero
**Arquivo:** `client/src/pages/become-creator/steps/GenderStep.tsx`

**Layout (conforme Imagem 1):**
- Header: "Gênero" com indicador de progresso (dots)
- Título: "Como você se identifica?"
- Opções (botões de seleção única):
  - Feminino
  - Masculino
  - Não binário
  - Outro
  - Prefiro não dizer
- Botão "Continuar" (bottom)
- Botão X (fechar/cancelar) no topo direito

**Estado:**
```typescript
gender: 'feminino' | 'masculino' | 'nao-binario' | 'outro' | 'prefiro-nao-dizer'
```

### Etapa 2: Foto de Perfil e Identificação
**Arquivo:** `client/src/pages/become-creator/steps/ProfilePhotoStep.tsx`

**Layout (conforme Imagem 2):**
- Header: "Foto de perfil e @handle" com indicador de progresso
- Título: "Define a tua foto de perfil e @handle"
- Avatar circular grande (clicável para upload)
  - Ícone de câmera sobreposto
  - Placeholder circular cinza
- Campo "Nome de exibição"
  - Input text
  - Exemplo: "Superb Aardvark"
- Campo "Líder" (Username)
  - Input text com validação
  - Exemplo: "superb-aardvark-79"
  - Validação: único, sem espaços, caracteres especiais limitados
- Botão "Continuar" (bottom)
- Link "Saltar por agora" (opcional)

**Upload de Foto:**
- Aceitar formatos: JPG, PNG, WEBP
- Tamanho máximo: 5MB
- Crop/resize para 400x400px
- Upload para storage (usar endpoint existente ou criar novo)

**Estado:**
```typescript
profilePicture: File | null
displayName: string
username: string
```

### Etapa 3: Banner e Bio
**Arquivo:** `client/src/pages/become-creator/steps/BannerBioStep.tsx`

**Layout (conforme Imagem 3):**
- Header: "Banner e biografia" com indicador de progresso
- Título: "Define o banner e a bio"
- Banner (área retangular clicável)
  - Placeholder com logo/texto "fanvue"
  - Upload de imagem de banner
  - Dimensões recomendadas: 1500x500px
- Campo "Era" (Bio)
  - Textarea grande
  - Placeholder vazio
  - Múltiplas linhas
- Botão "Continuar" (bottom)
- Link "Saltar por agora" (opcional)

**Upload de Banner:**
- Aceitar formatos: JPG, PNG, WEBP
- Tamanho máximo: 10MB
- Dimensões recomendadas: 1500x500px

**Estado:**
```typescript
coverImage: File | null
bio: string
```

### Etapa 4: Preço de Assinatura
**Arquivo:** `client/src/pages/become-creator/steps/SubscriptionPriceStep.tsx`

**Layout:**
- Header: "Preço de assinatura" com indicador de progresso
- Título: "Quanto os assinantes vão pagar?"
- Subtítulo: "Defina o valor mensal da assinatura para acessar seu conteúdo exclusivo"
- Input numérico grande (R$)
  - Formato: moeda brasileira
  - Mínimo: R$ 0,00 (gratuito)
  - Máximo: R$ 999,99
  - Incrementos: R$ 0,01
- Sugestões de valores comuns (chips clicáveis):
  - R$ 9,90
  - R$ 19,90
  - R$ 29,90
  - R$ 49,90
  - Gratuito
- Informação: "Você pode alterar o preço depois"
- Botão "Continuar" (bottom)

**Estado:**
```typescript
subscriptionPrice: number
```

### Etapa 5: Verificação de Identidade
**Arquivo:** `client/src/pages/become-creator/steps/VerificationStep.tsx`

**Layout (conforme Imagens 4 e 5):**
- Header: "Verificar identidade" com indicador de progresso
- Título: "Verifica a tua identidade para levantar ganhos"
- Subtítulo: "A verificação é rápida e permite que você saque os ganhos futuros! Todos os dados estão seguros."
- Seção: "O que esperar:"
  - Card 1: "Verificação de documento"
    - Ícone: documento
    - Descrição: "Garante que não há reflexos no teu rosto nem no documento."
  - Card 2: "Selfie - verificação de liveness"
    - Ícone: câmera
    - Descrição: "Garante que nada obstrua a verificação da sua foto."
  - Card 3: "Para melhores resultados usa o celular"
    - Ícone: info
- Botão "Continuar" (inicia verificação)

**Opções:**
1. **Verificar Agora:** Redireciona para fluxo de verificação (pode ser integração com serviço terceiro como Stripe Identity, Veriff, etc.)
2. **Verificar Depois:** Pula esta etapa mas marca como pendente no perfil

**Estado:**
```typescript
verificationStatus: 'pending' | 'in_progress' | 'verified' | 'rejected'
verificationSkipped: boolean
```

## Componente Principal: Wizard

**Arquivo:** `client/src/pages/BecomeCreatorPage.tsx` (refatorar)

```typescript
const STEPS = [
  { id: 1, component: GenderStep, title: 'Gênero' },
  { id: 2, component: ProfilePhotoStep, title: 'Foto de perfil e @handle' },
  { id: 3, component: BannerBioStep, title: 'Banner e biografia' },
  { id: 4, component: SubscriptionPriceStep, title: 'Preço de assinatura' },
  { id: 5, component: VerificationStep, title: 'Verificar identidade' }
];

interface FormData {
  gender: string;
  profilePicture: File | null;
  displayName: string;
  username: string;
  coverImage: File | null;
  bio: string;
  subscriptionPrice: number;
  verificationStatus: string;
}
```

**Funcionalidades:**
- Progress indicator (dots) no topo
- Botão voltar (exceto na primeira etapa)
- Botão X para cancelar (com confirmação)
- Salvar progresso em localStorage
- Validação por etapa antes de avançar

## Backend

### Endpoint: Atualizar/Criar
**Modificar:** `POST /api/user/become-creator`

Aceitar novos campos:
```typescript
{
  gender?: string;
  profileImage?: string; // URL após upload
  displayName?: string;
  username?: string;
  coverImage?: string; // URL após upload
  bio?: string;
  subscriptionPrice: number;
  verificationStatus?: string;
}
```

### Endpoints de Upload
**Usar existentes ou criar:**
- `POST /api/upload/profile-picture`
- `POST /api/upload/cover-image`

### Função: `storage.upgradeToCreator()`
**Atualizar em:** `server/storage.ts`

Modificar para:
1. Atualizar `users.user_type = 'creator'`
2. Criar registro em `creator_profiles` com todos os dados
3. Atualizar campos do perfil do usuário (foto, nome, username, bio, banner)
4. Retornar usuário atualizado

### Validações Backend
- Username único
- Formato de email válido (se necessário)
- Preço >= 0
- Verificar se usuário já não é criador

## Arquivos a Criar

1. `client/src/pages/become-creator/steps/GenderStep.tsx`
2. `client/src/pages/become-creator/steps/ProfilePhotoStep.tsx`
3. `client/src/pages/become-creator/steps/BannerBioStep.tsx`
4. `client/src/pages/become-creator/steps/SubscriptionPriceStep.tsx`
5. `client/src/pages/become-creator/steps/VerificationStep.tsx`
6. `client/src/components/ProgressDots.tsx` - Indicador de progresso
7. `client/src/hooks/useImageUpload.ts` - Hook para upload de imagens

## Arquivos a Modificar

1. `client/src/pages/BecomeCreatorPage.tsx` - Refatorar para wizard
2. `server/routes.ts` - Atualizar endpoint `/api/user/become-creator`
3. `server/storage.ts` - Atualizar função `upgradeToCreator()`
4. `shared/schema.ts` - Adicionar campos no tipo `User` e `CreatorProfile` se necessário

## Fluxo de Dados

### Ao Completar Todas as Etapas:

1. **Upload de Imagens:**
   - Fazer upload da foto de perfil (se fornecida)
   - Fazer upload do banner (se fornecido)
   - Obter URLs das imagens

2. **Enviar Dados:**
   ```typescript
   POST /api/user/become-creator
   {
     gender,
     profileImage: uploadedProfileUrl,
     displayName,
     username,
     coverImage: uploadedCoverUrl,
     bio,
     subscriptionPrice,
     verificationStatus
   }
   ```

3. **Resposta:**
   - Backend atualiza usuário para criador
   - Retorna usuário atualizado
   - Frontend invalida cache do `useAuth`
   - Redireciona para `/profile` ou dashboard de criador

4. **Transição Automática:**
   - Hook `useAuth` detecta `userType === 'creator'`
   - Interface muda automaticamente para versão de criador
   - Usuário vê dashboard de criador

## Considerações de UX

- **Salvamento Automático:** Salvar progresso em localStorage a cada etapa
- **Recuperação:** Se usuário fechar e voltar, retomar de onde parou
- **Validação:** Feedback visual imediato (campos obrigatórios, formato, etc.)
- **Loading States:** Skeleton/spinner durante uploads
- **Erros:** Mensagens claras com ações sugeridas
- **Confirmação de Saída:** Alert se usuário tentar sair com dados não salvos

## Estilo Visual

- **Progress Dots:** Círculos no topo, preenchidos para etapas concluídas
- **Botões:**
  - Primário: "Continuar" (rosa/vermelho, full width)
  - Secundário: "Saltar por agora" (texto, centro)
  - Ícone: X (topo direito)
- **Layout:** Centralizado, max-width, responsivo
- **Animações:** Transições suaves entre etapas (slide/fade)

## Validações por Etapa

1. **Gênero:** Pelo menos uma opção selecionada
2. **Perfil:** 
   - displayName: mínimo 2 caracteres
   - username: mínimo 3 caracteres, único, formato válido
3. **Banner/Bio:** Opcional (pode pular)
4. **Preço:** Número válido >= 0
5. **Verificação:** Opcional (pode pular, mas marcar como pendente)

## Cronograma de Implementação

### Fase 1: Estrutura Base
- [x] Criar estrutura de pastas para steps
- [x] Criar componente ProgressDots
- [x] Criar hook useImageUpload
- [x] Refatorar BecomeCreatorPage para wizard

### Fase 2: Etapas do Wizard
- [ ] Implementar GenderStep (Etapa 1)
- [ ] Implementar ProfilePhotoStep (Etapa 2)
- [ ] Implementar BannerBioStep (Etapa 3)
- [ ] Implementar SubscriptionPriceStep (Etapa 4)
- [ ] Implementar VerificationStep (Etapa 5)

### Fase 3: Backend e Integração
- [ ] Atualizar endpoint /api/user/become-creator
- [ ] Atualizar storage.upgradeToCreator()
- [ ] Implementar endpoints de upload
- [ ] Testar fluxo completo

### Fase 4: Testes e Refinamentos
- [ ] Testes de validação por etapa
- [ ] Testes de upload de imagens
- [ ] Testes de transição usuário → criador
- [ ] Ajustes de UX e responsividade

## Notas Técnicas

### Estado do Wizard
```typescript
interface WizardState {
  currentStep: number;
  formData: FormData;
  isLoading: boolean;
  errors: Record<string, string>;
}

const useWizard = () => {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    formData: {},
    isLoading: false,
    errors: {}
  });

  const saveProgress = () => {
    localStorage.setItem('become-creator-progress', JSON.stringify(state));
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('become-creator-progress');
    if (saved) {
      setState(JSON.parse(saved));
    }
  };

  return { state, setState, saveProgress, loadProgress };
};
```

### Validação de Username
```typescript
const validateUsername = async (username: string) => {
  // Verificar formato
  const isValidFormat = /^[a-zA-Z0-9_-]+$/.test(username) && username.length >= 3;
  
  if (!isValidFormat) {
    return { valid: false, error: 'Username deve ter pelo menos 3 caracteres e conter apenas letras, números, _ e -' };
  }

  // Verificar se é único
  const response = await apiRequest('GET', `/api/user/check-username?username=${username}`);
  const isUnique = response.ok;

  return { valid: isUnique, error: isUnique ? null : 'Username já está em uso' };
};
```

### Upload de Imagens
```typescript
const useImageUpload = () => {
  const uploadImage = async (file: File, type: 'profile' | 'cover') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await apiRequest('POST', '/api/upload/image', formData);
    
    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }

    return await response.json();
  };

  return { uploadImage };
};
```

---

*Documento criado em: 2025-01-14*  
*Versão: 1.0*  
*Status: Planejamento Concluído*
