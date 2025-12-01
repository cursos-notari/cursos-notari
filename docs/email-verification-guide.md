# Sistema de Verificação de Email

Este sistema implementa verificação de email via link para confirmar inscrições em cursos.

## 📧 Fluxo Completo

1. **Usuário preenche formulário** → Dados salvos como `pending_verification`
2. **Email enviado** → Link com token de verificação
3. **Usuário clica no link** → Token validado e status atualizado para `email_verified`
4. **Redirecionamento** → Usuário enviado para checkout

## 🗄️ Banco de Dados

### Novos campos em `pre_registrations`:
```sql
email_verification_token uuid DEFAULT gen_random_uuid()
email_verified boolean DEFAULT false
email_verified_at timestamptz NULL
```

### Novos status:
- `pending_verification` - Aguardando verificação de email
- `email_verified` - Email verificado, pode prosseguir para checkout

## 🔧 Configuração

### 1. Instalar dependências de email
```bash
# Para Resend (recomendado)
npm install resend

# Para NodeMailer
npm install nodemailer
npm install @types/nodemailer
```

### 2. Configurar variáveis de ambiente
```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxx
EMAIL_FROM=cursos@seudominio.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Executar SQL no Supabase
Execute o arquivo `sql/email-verification-schema.sql` no SQL Editor do Supabase.

## 📁 Arquivos Criados

### Backend
- `sql/email-verification-schema.sql` - Schema do banco
- `src/actions/pre-registration/verify-email.ts` - Verificar token
- `src/actions/email/send-verification.ts` - Enviar email (action)
- `src/api/services/email/send-verification.ts` - Serviço de email
- `src/app/api/send-verification-email/route.ts` - API route

### Frontend
- `src/app/verify-email/page.tsx` - Página de verificação
- `src/components/enrollment/email-verification-pending.tsx` - Estado pendente
- `src/hooks/use-pre-registration.ts` - Hook atualizado

### Configuração
- `.env.example` - Exemplo de variáveis de ambiente

## 🚀 Como Usar

### No componente de inscrição:
```typescript
import { usePreRegistration } from '@/hooks/use-pre-registration';

const { createRegistrationWithEmailVerification } = usePreRegistration();

const result = await createRegistrationWithEmailVerification({
  name: 'João',
  surname: 'Silva',
  email: 'joao@email.com',
  cpf: '12345678901',
  phone: '11999999999',
  classId: 'uuid-da-turma'
}, 'Nome do Curso');

if (result.needsVerification) {
  // Mostrar mensagem "Verifique seu email"
} else {
  // Prosseguir para checkout
}
```

### Template do email:
O email contém:
- Saudação personalizada
- Nome do curso
- Botão "Confirmar Email"
- Link alternativo
- Aviso de expiração (15 minutos)

## 🔗 URLs Importantes

- **Verificação**: `/verify-email?token=UUID&class=CLASS_ID`
- **API de envio**: `/api/send-verification-email`

## 🛡️ Segurança

1. **Tokens únicos** - Cada email tem token UUID único
2. **Expiração** - Links expiram em 15 minutos
3. **Limpeza automática** - Registros não verificados são removidos
4. **Hash CPF** - CPF armazenado como hash SHA-256

## 🎯 Próximos Passos

1. **Configurar provedor de email** (Resend/SendGrid/SMTP)
2. **Personalizar templates** de email
3. **Implementar limpeza automática** de registros expirados
4. **Adicionar rate limiting** para envio de emails
5. **Implementar reenvio** com limite de tentativas

## 🐛 Troubleshooting

### Email não está sendo enviado:
1. Verificar variáveis de ambiente
2. Verificar logs do servidor
3. Testar API route diretamente

### Token inválido:
1. Verificar se não expirou (15 min)
2. Verificar se URL está correta
3. Verificar se registro existe no banco

### CORS ou API errors:
1. Verificar configuração do Next.js
2. Verificar headers das requisições
3. Verificar permissões do Supabase