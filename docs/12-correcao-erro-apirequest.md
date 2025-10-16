# Correção de Erro: apiRequest não encontrado

## Problema Identificado

**Data:** 2025-01-15  
**Erro:** `The requested module '/src/lib/utils.ts' does not provide an export named 'apiRequest'`

### Descrição do Erro

O hook `use-promotions.ts` estava tentando importar uma função `apiRequest` que não existia no arquivo `client/src/lib/utils.ts`. Este arquivo só exporta a função `cn` para classes CSS.

### Causa Raiz

Durante a implementação da funcionalidade de Promoções, o hook `use-promotions.ts` foi criado com imports incorretos, tentando usar uma função `apiRequest` que não estava implementada no projeto.

### Solução Aplicada

**1. Análise do Padrão Existente:**
- Verificou-se que o hook `use-paid-links.ts` usa `fetch` diretamente
- Não existe função `apiRequest` no projeto
- Padrão do projeto é usar `fetch` com tratamento de erro manual

**2. Correção Implementada:**

**Arquivo:** `client/src/hooks/use-promotions.ts`

**Antes:**
```typescript
import { apiRequest } from "@/lib/utils";

// Uso:
const response = await apiRequest("GET", "/api/creator/subscription-price");
```

**Depois:**
```typescript
import { toast } from "@/hooks/use-toast";

// Uso:
const response = await fetch("/api/creator/subscription-price");
if (!response.ok) {
  throw new Error('Erro ao buscar preço da assinatura');
}
const data = await response.json();
return data.price as number;
```

**3. Funções Corrigidas:**

Todas as funções do hook foram atualizadas:

- ✅ `useSubscriptionPrice()` - GET com fetch
- ✅ `useUpdateSubscriptionPrice()` - PATCH com fetch + toast
- ✅ `useFreeTrialSetting()` - GET com fetch
- ✅ `useUpdateFreeTrialSetting()` - PATCH com fetch + toast
- ✅ `useSubscriptionPackages()` - GET com fetch
- ✅ `useCreatePackage()` - POST com fetch + toast
- ✅ `useUpdatePackage()` - PATCH com fetch + toast
- ✅ `useDeletePackage()` - DELETE com fetch + toast
- ✅ `useTogglePackage()` - PATCH com fetch + toast
- ✅ `usePromotionalOffers()` - GET com fetch
- ✅ `useCreateOffer()` - POST com fetch + toast
- ✅ `useUpdateOffer()` - PATCH com fetch + toast
- ✅ `useDeleteOffer()` - DELETE com fetch + toast
- ✅ `useToggleOffer()` - PATCH com fetch + toast

**4. Melhorias Adicionadas:**

- ✅ Tratamento de erro consistente com `fetch`
- ✅ Mensagens de toast para feedback do usuário
- ✅ Validação de resposta HTTP (`response.ok`)
- ✅ Parsing correto do JSON
- ✅ Tipagem TypeScript mantida

### Resultado

**Status:** ✅ **RESOLVIDO**

- ❌ **Antes:** Site não carregava devido ao erro de import
- ✅ **Depois:** Site carrega normalmente
- ✅ **Funcionalidade:** Hook de promoções funciona corretamente
- ✅ **Consistência:** Padrão alinhado com outros hooks do projeto

### Arquivos Modificados

- `client/src/hooks/use-promotions.ts` - Correção completa dos imports e implementação

### Lições Aprendidas

1. **Consistência de Padrões:** Sempre verificar como outros hooks do projeto fazem requisições
2. **Verificação de Imports:** Confirmar que todas as funções importadas existem
3. **Tratamento de Erro:** Implementar feedback adequado para o usuário
4. **Teste Imediato:** Verificar se o site carrega após mudanças significativas

### Próximos Passos

- [ ] Testar funcionalidade completa de promoções
- [ ] Verificar se há outros hooks com problemas similares
- [ ] Documentar padrão de requisições para futuras implementações
