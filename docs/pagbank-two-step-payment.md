# Sistema de Pagamento em Duas Etapas - PagBank

## 📋 Como Funciona

O sistema agora implementa corretamente o processo de pagamento do PagBank em duas etapas:

### 1️⃣ **Primeira Etapa: Criar Ordem Base**
- Cria uma "ordem container" no PagBank
- Armazena os dados da ordem no banco (cache)
- Reutiliza ordens existentes válidas (< 1 hora)

### 2️⃣ **Segunda Etapa: Solicitar Método Específico**
- Quando o usuário escolhe PIX/Boleto, faz nova requisição
- Utiliza a URL `rel: "PAY"` da ordem base
- Obtém QR Code (PIX) ou dados do boleto

## 🔧 **Arquivos Criados/Modificados**

### Actions (Server)
- `request-payment-method.ts` - Solicita métodos específicos
- `complete-payment-order.ts` - Gerencia processo completo
- `get-or-create-pagbank-order.ts` - Cache de ordens (já existia)

### Hooks (Client)
- `use-payment-methods.ts` - Gerencia estado dos métodos

### Componentes
- `page.tsx` - Server Component (busca ordem base)
- `checkout-content.tsx` - Client Component (UI interativa)

## 🚀 **Fluxo de Funcionamento**

```
1. Usuário acessa /checkout/[token]
   ↓
2. Server busca/cria ordem base PagBank
   ↓
3. Client Component renderiza botões PIX/Boleto/Cartão
   ↓
4. Usuário clica em PIX → Client solicita dados PIX
   ↓
5. Server faz requisição para URL "PAY" com type: "PIX"
   ↓
6. PagBank retorna QR Code → Exibe para usuário
```

## 💡 **Benefícios**

✅ **Cache Inteligente**: Evita criar múltiplas ordens no reload
✅ **Loading Estados**: UX melhor durante carregamento
✅ **Gestão de Erros**: Feedback claro ao usuário
✅ **Lazy Loading**: Só carrega dados quando necessário
✅ **Reutilização**: Ordens válidas são reutilizadas

## 🧪 **Para Testar**

1. Execute o SQL: `sql/add-payment-fields.sql`
2. Acesse uma URL de checkout válida
3. Clique nos botões PIX/Boleto para ver carregamento dinâmico
4. Recarregue a página - mesma ordem será reutilizada

## 📊 **Monitoramento**

Use o endpoint `/api/payment/cleanup` para:
- `GET`: Ver estatísticas de ordens
- `POST`: Limpar ordens antigas (24h+)

## 🔐 **Segurança**

- API Key opcional para endpoints de limpeza
- Tokens de verificação únicos por inscrição
- Cache limitado por tempo (1 hora)