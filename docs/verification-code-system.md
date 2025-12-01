# Sistema de Verificação por Código de 6 Dígitos

## 📧 Fluxo Implementado

1. **Usuário preenche formulário** → Dados salvos como `pending_verification`
2. **Email automático enviado** → Código de 6 dígitos 
3. **Usuário vai para página de verificação** → Digite o código
4. **Código validado** → Email confirmado e redirecionamento para checkout

## 🔄 Mudanças Principais

### ❌ **Removido (sistema anterior):**
- Link com token no email
- Verificação automática por URL
- Campo `email_verification_token`

### ✅ **Implementado (novo sistema):**
- Código de 6 dígitos numéricos
- Página interativa para digitar código
- Limitação de tentativas (máx. 3)
- Função de reenvio de código
- Expiração em 15 minutos

## 🗄️ Banco de Dados

### Novos campos em `pre_registrations`:
```sql
verification_code varchar(6)                    -- Código de 6 dígitos
verification_attempts integer DEFAULT 0         -- Contador de tentativas
verification_code_expires_at timestamptz       -- Expiração do código
```

### Funções SQL:
- `verify_email_code()` - Valida código de 6 dígitos
- `resend_verification_code()` - Gera novo código
- `create_pre_registration()` - Atualizada para incluir código

## 📁 Arquivos Criados/Modificados

### Schema
- ✅ `sql/verification-code-schema.sql` - Schema atualizado

### Backend  
- ✅ `src/actions/pre-registration/verify-email.ts` - Verificar código
- ✅ `src/actions/pre-registration/resend-code.ts` - Reenviar código
- ✅ `src/api/services/email/send-verification-code.ts` - Email com código
- ✅ `src/app/api/send-verification-email/route.ts` - API route atualizada

### Frontend
- ✅ `src/app/verify-email/page.tsx` - Página para digitar código
- ✅ `src/hooks/use-pre-registration.ts` - Hook atualizado
- ✅ `src/app/enrollment/[slug]/enrollment-page.tsx` - Redirecionamento

### Types
- ✅ `src/types/database/PreRegistration.ts` - Tipos atualizados

## 🎯 URLs e Parâmetros

### Página de verificação:
```
/verify-email?email=usuario@email.com&class=UUID&className=Nome+do+Curso
```

### Parâmetros:
- `email` - Email do usuário
- `class` - ID da turma
- `className` - Nome da turma (para exibição)

## 🔧 Funcionalidades da Página

### Interface:
- ✅ Campo para 6 dígitos numéricos
- ✅ Validação em tempo real
- ✅ Botão de verificação
- ✅ Função reenviar código
- ✅ Contador de tentativas
- ✅ Timer de expiração visual

### Validações:
- ✅ Máximo 3 tentativas
- ✅ Código expira em 15 minutos
- ✅ Apenas números aceitos
- ✅ Exatamente 6 dígitos

## 📧 Template do Email

### Conteúdo:
- Saudação personalizada
- Nome do curso
- **Código em destaque** (grande, fonte mono)
- Instruções claras
- Avisos de segurança
- Informações de expiração

### Design:
- Layout responsivo
- Código em caixa destacada
- Cores consistentes
- Fácil leitura

## 🔐 Segurança

1. **Limitação de tentativas** - Máx. 3 tentativas por código
2. **Expiração rápida** - 15 minutos
3. **Códigos únicos** - Novo código a cada solicitação
4. **Limpeza automática** - Remove códigos expirados
5. **Hash de CPF** - Mantém segurança dos dados

## 🚀 Como Testar

### 1. Configurar email:
```env
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=cursos@seudominio.com
```

### 2. Executar SQL:
Execute `sql/verification-code-schema.sql` no Supabase

### 3. Fluxo completo:
1. Preencher formulário de inscrição
2. Verificar email recebido
3. Ir para página de verificação
4. Digitar código de 6 dígitos
5. Ser redirecionado para checkout

## 🎨 Melhorias Futuras

1. **Timer visual** na página de verificação
2. **Animações** para feedback visual
3. **Notificações push** como alternativa
4. **Integração SMS** para códigos via celular
5. **Rate limiting** para evitar spam
6. **Analytics** de conversão de códigos

## 🐛 Troubleshooting

### Código não chega:
- Verificar configuração email
- Checar spam
- Verificar logs do servidor

### Código inválido:
- Verificar expiração (15 min)
- Verificar tentativas (máx. 3)
- Usar função reenviar

### Página não carrega:
- Verificar parâmetros URL
- Verificar se classId existe
- Verificar permissões

O sistema agora oferece uma experiência muito mais intuitiva e segura! 🎉