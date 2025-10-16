# Planejamento: Página de Promoções e Definições de Subscrição

## 📋 **Visão Geral**

Implementar uma página completa de promoções onde criadores podem:
- Definir preços de assinatura mensal
- Configurar testes gratuitos sem método de pagamento
- Criar pacotes promocionais com descontos para múltiplos meses
- Gerenciar ofertas especiais para novos e antigos assinantes

## 🎯 **Funcionalidades Principais**

### 1. **Preço por Mês**
- Input para definir preço mensal base
- Validação: mínimo R$ 3.99, máximo R$ 100.00
- Botão "Definir preço"
- Exibição do preço atual

### 2. **Testes Gratuitos**
- Toggle para ativar/desativar testes sem método de pagamento
- Configuração de duração (3, 7, 14, 30 dias)
- Texto explicativo da funcionalidade
- Badge de status (Ativo/Inativo)

### 3. **Pacotes de Subscrição**
- Criação de pacotes com desconto para múltiplos meses
- Durações: 3, 6, 12 meses
- Descontos: 1% a 50%
- Máximo 3 pacotes ativos simultaneamente
- Preview do preço final calculado

### 4. **Ofertas Promocionais**
- Criação de ofertas especiais com período de teste ou desconto
- Tipos: Teste grátis ou Desconto percentual
- Público-alvo: Novos, Existentes, Todos
- Notificação opcional para seguidores
- Máximo 5 ofertas ativas simultaneamente

## 🗄️ **Database Schema**

### **Tabelas Novas:**

#### **subscriptionPackages**
```sql
CREATE TABLE subscription_packages (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id) NOT NULL,
  duration_months INTEGER NOT NULL, -- 3, 6, 12
  discount_percent REAL NOT NULL,   -- 10, 15, 25
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **promotionalOffers**
```sql
CREATE TABLE promotional_offers (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  offer_type TEXT NOT NULL, -- trial, discount
  
  -- Para trial
  trial_days INTEGER, -- 3, 7, 14, 30
  
  -- Para discount
  discount_percent REAL,
  discount_duration_months INTEGER,
  
  -- Configurações
  target_audience TEXT NOT NULL, -- new, existing, all
  notify_followers BOOLEAN DEFAULT false,
  
  -- Status e datas
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  
  -- Estatísticas
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Modificação em creatorProfiles**
```sql
ALTER TABLE creator_profiles 
ADD COLUMN allow_free_trial_without_payment BOOLEAN DEFAULT false;
```

## 🔧 **Backend Implementation**

### **Storage Functions (`server/storage.ts`):**

#### **Subscription Price:**
- `updateSubscriptionPrice(creatorId: number, price: number): Promise<void>`
- `getSubscriptionPrice(creatorId: number): Promise<number>`

#### **Subscription Packages:**
- `getSubscriptionPackages(creatorId: number): Promise<SubscriptionPackage[]>`
- `createSubscriptionPackage(pkg: InsertSubscriptionPackage): Promise<SubscriptionPackage>`
- `updateSubscriptionPackage(id: number, creatorId: number, data: Partial<InsertSubscriptionPackage>): Promise<SubscriptionPackage>`
- `deleteSubscriptionPackage(id: number, creatorId: number): Promise<boolean>`
- `togglePackageStatus(id: number, creatorId: number): Promise<SubscriptionPackage>`

#### **Promotional Offers:**
- `getPromotionalOffers(creatorId: number, filters?: { isActive?: boolean }): Promise<PromotionalOffer[]>`
- `createPromotionalOffer(offer: InsertPromotionalOffer): Promise<PromotionalOffer>`
- `updatePromotionalOffer(id: number, creatorId: number, data: Partial<InsertPromotionalOffer>): Promise<PromotionalOffer>`
- `deletePromotionalOffer(id: number, creatorId: number): Promise<boolean>`
- `toggleOfferStatus(id: number, creatorId: number): Promise<PromotionalOffer>`

#### **Free Trial Setting:**
- `updateFreeTrialSetting(creatorId: number, allowed: boolean): Promise<void>`
- `getFreeTrialSetting(creatorId: number): Promise<boolean>`

### **API Routes (`server/routes.ts`):**

#### **Subscription Price:**
- `PATCH /api/creator/subscription-price` - Atualizar preço mensal base
- `GET /api/creator/subscription-price` - Obter preço atual

#### **Subscription Packages:**
- `GET /api/creator/subscription-packages` - Listar pacotes do criador
- `POST /api/creator/subscription-packages` - Criar novo pacote
- `PATCH /api/creator/subscription-packages/:id` - Atualizar pacote
- `DELETE /api/creator/subscription-packages/:id` - Excluir pacote
- `PATCH /api/creator/subscription-packages/:id/toggle` - Ativar/desativar

#### **Promotional Offers:**
- `GET /api/creator/promotional-offers` - Listar ofertas
- `POST /api/creator/promotional-offers` - Criar oferta
- `PATCH /api/creator/promotional-offers/:id` - Atualizar oferta
- `DELETE /api/creator/promotional-offers/:id` - Excluir oferta
- `PATCH /api/creator/promotional-offers/:id/toggle` - Ativar/desativar

#### **Free Trial:**
- `PATCH /api/creator/free-trial-setting` - Ativar/desativar teste grátis
- `GET /api/creator/free-trial-setting` - Obter configuração atual

## 🎨 **Frontend Implementation**

### **Hook Customizado (`client/src/hooks/use-promotions.ts`):**

#### **Subscription Price:**
- `useSubscriptionPrice()` - Query para obter preço atual
- `useUpdateSubscriptionPrice()` - Mutation para atualizar preço

#### **Subscription Packages:**
- `useSubscriptionPackages()` - Query para listar pacotes
- `useCreatePackage()` - Mutation para criar pacote
- `useUpdatePackage()` - Mutation para atualizar pacote
- `useDeletePackage()` - Mutation para excluir pacote
- `useTogglePackage()` - Mutation para ativar/desativar pacote

#### **Promotional Offers:**
- `usePromotionalOffers(filters?)` - Query para listar ofertas
- `useCreateOffer()` - Mutation para criar oferta
- `useUpdateOffer()` - Mutation para atualizar oferta
- `useDeleteOffer()` - Mutation para excluir oferta
- `useToggleOffer()` - Mutation para ativar/desativar oferta

#### **Free Trial Setting:**
- `useFreeTrialSetting()` - Query para obter configuração
- `useUpdateFreeTrialSetting()` - Mutation para atualizar configuração

### **Componentes da Página:**

#### **SubscriptionPriceSection.tsx**
- Input de preço com validação
- Botão "Definir preço"
- Exibição do preço atual
- Mensagens de limite (min/max)

#### **FreeTrialSection.tsx**
- Toggle switch para ativar/desativar
- Texto explicativo
- Badge de status (Ativo/Inativo)
- Descrição da funcionalidade

#### **SubscriptionPackagesSection.tsx**
- Título e descrição da seção
- Lista de pacotes criados (grid de cards)
- Botão "+ Criar pacote promocional"
- Placeholder quando não há pacotes

#### **PackageCard.tsx**
- Duração em meses (3, 6, 12)
- Percentual de desconto
- Preço calculado (original vs. com desconto)
- Badge de status (Ativo/Inativo)
- Botões: Editar, Excluir, Toggle
- Indicador visual de popularidade

#### **PromotionalOffersSection.tsx**
- Título e descrição da seção
- Lista de ofertas ativas (cards)
- Botão "+ Criar oferta promocional"
- Placeholder quando não há ofertas

#### **OfferCard.tsx**
- Título da oferta
- Tipo (Teste grátis / Desconto)
- Detalhes específicos (dias de teste ou % desconto)
- Público-alvo
- Estatísticas de uso
- Badge de status
- Botões: Editar, Excluir, Toggle
- Data de expiração (se aplicável)

### **Modais:**

#### **CreatePackageModal.tsx**
- Select de duração (3, 6, 12 meses)
- Input de desconto percentual (1-50%)
- Preview do preço final calculado
- Validação em tempo real
- Botão "Criar pacote"

#### **EditPackageModal.tsx**
- Mesmos campos do create
- Pré-preenchimento com dados atuais
- Botão "Salvar alterações"
- Validação de alterações

#### **CreateOfferModal.tsx**
**Tab 1: Tipo de Oferta**
- Radio buttons: Teste gratuito / Desconto
- Se teste: Select de dias (3, 7, 14, 30)
- Se desconto: Input de % e duração em meses

**Tab 2: Configurações**
- Input de título da oferta
- Textarea de descrição
- Select de público-alvo (Novos, Existentes, Todos)
- Toggle "Notificar seguidores"
- Date pickers: Data início e fim (opcional)

**Tab 3: Resumo**
- Preview completo da oferta
- Resumo de configurações
- Botão "Criar oferta"

#### **EditOfferModal.tsx**
- Mesmos campos do create (exceto tipo)
- Não permite alteração do tipo de oferta
- Pré-preenchimento com dados atuais
- Botão "Salvar alterações"

## 📱 **Página Principal**

### **Layout da PromotionsPage.tsx:**

```typescript
<CreatorLayout>
  <header className="bg-white dark:bg-gray-900 border-b">
    <div className="flex items-center">
      <Button variant="ghost" size="sm">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1>Definições de subscrição</h1>
    </div>
  </header>
  
  <main className="max-w-4xl mx-auto p-6 space-y-8">
    <SubscriptionPriceSection />
    <Separator />
    <FreeTrialSection />
    <Separator />
    <SubscriptionPackagesSection />
    <Separator />
    <PromotionalOffersSection />
  </main>
</CreatorLayout>
```

## ✅ **Validações e Regras de Negócio**

### **Preço de Assinatura:**
- Mínimo: R$ 3.99
- Máximo: R$ 100.00
- Apenas 2 casas decimais
- Obrigatório para criadores

### **Pacotes de Subscrição:**
- Durações permitidas: 3, 6, 12 meses
- Desconto: 1% a 50%
- Máximo 3 pacotes ativos simultaneamente
- Não pode ter pacotes duplicados (mesma duração)

### **Ofertas Promocionais:**
- Teste grátis: 3, 7, 14, 30 dias
- Desconto: 5% a 70%
- Duração desconto: 1 a 12 meses
- Máximo 5 ofertas ativas simultaneamente
- Data fim deve ser posterior à data início
- Título obrigatório (mínimo 3 caracteres)

### **Testes Gratuitos:**
- Configurável por criador
- Não requer método de pagamento
- Duração padrão: 7 dias
- Aplicável apenas para novos assinantes

## 🎭 **Dados Mock para Desenvolvimento**

### **Pacotes Mock:**
```typescript
[
  {
    id: 1,
    creatorId: 1,
    durationMonths: 3,
    discountPercent: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    creatorId: 1,
    durationMonths: 6,
    discountPercent: 20,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
```

### **Ofertas Mock:**
```typescript
[
  {
    id: 1,
    creatorId: 1,
    title: "Teste Grátis de 7 dias",
    description: "Experimente sem compromisso",
    offerType: "trial",
    trialDays: 7,
    targetAudience: "new",
    notifyFollowers: false,
    isActive: true,
    usageCount: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    creatorId: 1,
    title: "Desconto de 30% por 3 meses",
    description: "Oferta especial para novos assinantes",
    offerType: "discount",
    discountPercent: 30,
    discountDurationMonths: 3,
    targetAudience: "all",
    notifyFollowers: true,
    isActive: true,
    usageCount: 8,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
```

## 🔄 **Fluxos de Uso**

### **1. Definir Preço Base:**
1. Criador acessa página "Promoções"
2. Visualiza seção "Preço por mês"
3. Insere valor desejado (ex: R$ 19.90)
4. Sistema valida limites (min/max)
5. Clica "Definir preço"
6. Sistema salva e confirma alteração

### **2. Configurar Teste Gratuito:**
1. Na seção "Testes gratuitos"
2. Ativa toggle "Testes gratuitos sem método de pagamento"
3. Sistema salva configuração
4. Badge muda para "Ativo"

### **3. Criar Pacote Promocional:**
1. Clica "+ Criar pacote promocional"
2. Seleciona duração (ex: 6 meses)
3. Define desconto (ex: 20%)
4. Visualiza preview: R$ 95.52 (ao invés de R$ 119.40)
5. Confirma criação
6. Pacote aparece na lista

### **4. Criar Oferta Promocional:**
1. Clica "+ Criar oferta promocional"
2. **Tab 1:** Escolhe tipo (Teste grátis / Desconto)
3. **Tab 2:** Configura detalhes e público-alvo
4. **Tab 3:** Revisa resumo da oferta
5. Confirma criação
6. Oferta aparece na lista (apenas ativas)

## 📁 **Arquivos a Criar**

### **Hooks:**
- `client/src/hooks/use-promotions.ts`

### **Componentes:**
- `client/src/components/creator/promotions/SubscriptionPriceSection.tsx`
- `client/src/components/creator/promotions/FreeTrialSection.tsx`
- `client/src/components/creator/promotions/SubscriptionPackagesSection.tsx`
- `client/src/components/creator/promotions/PackageCard.tsx`
- `client/src/components/creator/promotions/PromotionalOffersSection.tsx`
- `client/src/components/creator/promotions/OfferCard.tsx`
- `client/src/components/creator/promotions/CreatePackageModal.tsx`
- `client/src/components/creator/promotions/EditPackageModal.tsx`
- `client/src/components/creator/promotions/CreateOfferModal.tsx`
- `client/src/components/creator/promotions/EditOfferModal.tsx`

## 📝 **Arquivos a Modificar**

### **Schema:**
- `shared/schema.ts` - Adicionar subscriptionPackages e promotionalOffers

### **Backend:**
- `server/storage.ts` - Adicionar funções de promoções
- `server/routes.ts` - Adicionar rotas da API

### **Frontend:**
- `client/src/pages/creator/tools/PromotionsPage.tsx` - Implementação completa

## 🚀 **Cronograma de Implementação**

### **Fase 1: Database & Backend**
1. Criar tabelas no schema.ts
2. Implementar funções de storage
3. Criar endpoints da API
4. Adicionar dados mock

### **Fase 2: Hooks & Lógica**
1. Criar hook use-promotions.ts
2. Implementar todas as mutations e queries
3. Configurar cache e invalidação

### **Fase 3: Componentes Base**
1. SubscriptionPriceSection
2. FreeTrialSection
3. PackageCard e OfferCard

### **Fase 4: Modais**
1. CreatePackageModal
2. EditPackageModal
3. CreateOfferModal
4. EditOfferModal

### **Fase 5: Integração**
1. SubscriptionPackagesSection
2. PromotionalOffersSection
3. Integração na PromotionsPage
4. Testes e validações

### **Fase 6: Documentação**
1. Criar documentação de implementação
2. Testes finais
3. Verificação de erros

## 🎯 **Critérios de Sucesso**

### **Funcionalidade:**
- ✅ Criador pode definir preço mensal
- ✅ Toggle de teste gratuito funciona
- ✅ Pacotes são criados e calculados corretamente
- ✅ Ofertas são criadas com todas as configurações
- ✅ Todas as validações funcionam
- ✅ Modais abrem e fecham corretamente

### **Performance:**
- ✅ Página carrega em menos de 2 segundos
- ✅ Modais abrem instantaneamente
- ✅ Validações são em tempo real
- ✅ Cache funciona corretamente

### **UX/UI:**
- ✅ Interface igual à imagem de referência
- ✅ Responsivo em mobile e desktop
- ✅ Feedback visual para todas as ações
- ✅ Mensagens de erro claras
- ✅ Loading states apropriados

### **Qualidade:**
- ✅ Sem erros de console
- ✅ Sem warnings de linting
- ✅ Código bem estruturado
- ✅ Componentes reutilizáveis
- ✅ TypeScript sem erros

---

**Data do Planejamento:** 12 de Janeiro de 2025  
**Status:** Planejamento completo  
**Próximo passo:** Implementação seguindo o cronograma definido
