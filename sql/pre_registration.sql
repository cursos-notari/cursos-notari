-- Habilita a extensão para criptografia (hashing), se ainda não estiver habilitada.
create extension IF not exists pgcrypto
with
  SCHEMA extensions;

-- ======== TIPOS CUSTOMIZADOS (ENUM) ========
do $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pre_registration_status') THEN
    CREATE TYPE public.pre_registration_status AS ENUM (
        'pending_verification',
        'email_verified',
        'confirmed',
        'cancelled',
        'expired'
    );
  END IF;
END$$;

-- ======== TABELA DE PRÉ-INSCRIÇÃO ========
-- Dropa a tabela existente para recriá-la com a nova estrutura
-- DROP TABLE IF EXISTS public.pre_registrations;
create table public.pre_registrations (
  id uuid primary key default gen_random_uuid (),
  class_id uuid not null references public.classes (id) on delete CASCADE,
  -- Informações do possível aluno
  name text,
  surname text,
  email text not null,
  phone text,
  cpf_encrypted bytea,
  -- Campos de endereço
  street text,
  "number" text, -- "number" entre aspas pois é uma palavra reservada
  complement text,
  locality text, -- Bairro
  city text,
  region_code text, -- Estado (UF)
  postal_code text,
  -- Status da inscrição
  status public.pre_registration_status not null default 'pending_verification',
  -- Status da verificação do email
  email_verified boolean not null default false,
  email_verified_at timestamptz,
  -- Token da pré-inscrição
  token uuid not null default gen_random_uuid (),
  -- Código de verificação para validar o email
  verification_code varchar(6) default LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
  verification_attempts integer default 0,
  verification_code_expires_at timestamptz default (now() + interval '15 minutes'),
  -- Controle de reenvio do código
  resend_attempts integer not null default 0,
  last_resend_at timestamptz,
  -- Informações da ordem de pagamento
  pagbank_order_id text,
  pagbank_order_data jsonb,
  order_created_at timestamptz,
  -- Timestamps
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '15 minutes')
);

-- ======== ÍNDICES ========
create index IF not exists pre_registrations_verification_code_idx on public.pre_registrations (verification_code);

create index IF not exists pre_registrations_expires_idx on public.pre_registrations (expires_at);

create unique INDEX IF not exists pre_registrations_token_idx on public.pre_registrations (token);

create unique INDEX IF not exists pre_registrations_unique_verified_email_per_class_idx on public.pre_registrations (class_id, email)
where
  (email_verified = true);

-- ======== RLS (Row Level Security) ========
alter table public.pre_registrations ENABLE row LEVEL SECURITY;

-- ======== FUNÇÕES (RPC) ========
create or replace function public.create_pre_registration (
  p_name text,
  p_surname text,
  p_email text,
  p_cpf text,
  p_phone text,
  p_class_id uuid,
  p_street text,
  p_number text,
  p_complement text,
  p_locality text,
  p_city text,
  p_region_code text,
  p_postal_code text
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = '' as $$
DECLARE
  v_existing_verified record;
  v_existing_unverified record;
  v_encrypted_cpf bytea;
  v_encryption_key text;
  v_new_or_updated record;
  v_verification_code varchar(6);
  v_attempts_reset BOOLEAN;
BEGIN
  SELECT decrypted_secret INTO v_encryption_key FROM vault.decrypted_secrets WHERE name = 'CPF_ENCRYPTION_KEY';
  IF v_encryption_key IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'internal_error', 'message', 'Chave de criptografia não configurada.');
  END IF;

  v_encrypted_cpf := extensions.pgp_sym_encrypt(p_cpf, v_encryption_key);

  -- 1. Verifica se já existe uma inscrição VERIFICADA (por e-mail ou CPF)
  SELECT * INTO v_existing_verified FROM public.pre_registrations
  WHERE class_id = p_class_id AND email_verified = true AND (
    email = p_email OR
    extensions.pgp_sym_decrypt(cpf_encrypted, v_encryption_key) = p_cpf
  );

  IF FOUND THEN
    IF v_existing_verified.email = p_email THEN
      RETURN jsonb_build_object(
        'success', false,
        'code', 'email_already_verified',
        'message', 'Este e-mail já está verificado para esta turma.',
        'data', jsonb_build_object(
          'token', v_existing_verified.token,
          'status', v_existing_verified.status
        )
      );
    ELSE
      RETURN jsonb_build_object(
        'success', false,
        'code', 'cpf_already_registered',
        'message', 'Este CPF já está registrado para esta turma.'
      );
    END IF;
  END IF;

  -- 2. Procura por uma inscrição NÃO VERIFICADA com o mesmo e-mail
  SELECT * INTO v_existing_unverified FROM public.pre_registrations
  WHERE email = p_email AND class_id = p_class_id AND email_verified = false;

  -- Gera um novo código. Ele só será usado se for um NOVO registro ou um registro EXPIRADO.
  v_verification_code := lpad(floor(random() * 1000000)::text, 6, '0');

  IF FOUND THEN
    -- 3. Inscrição NÃO VERIFICADA ENCONTRADA. Aplicar lógica condicional.
    
    -- 3a. VERIFICA SE O CÓDIGO ANTIGO EXPIROU
    IF v_existing_unverified.verification_code_expires_at <= now() THEN
      
      -- CÓDIGO EXPIROU: Atualiza os dados E GERA UM NOVO CÓDIGO/TENTATIVAS
      v_attempts_reset := true; -- indica pro frontend que precisa resetar as tentativas
      UPDATE public.pre_registrations
      SET
        name = p_name,
        surname = p_surname,
        cpf_encrypted = v_encrypted_cpf,
        phone = p_phone,
        street = p_street,
        "number" = p_number,
        complement = p_complement,
        locality = p_locality,
        city = p_city,
        region_code = p_region_code,
        postal_code = p_postal_code,
        
        -- Zera o estado da verificação
        verification_code = v_verification_code,
        verification_attempts = 0,
        verification_code_expires_at = now() + interval '15 minutes',
        expires_at = now() + interval '15 minutes', -- Reseta a expiração da pré-inscrição
        resend_attempts = 0,
        last_resend_at = NULL
      WHERE id = v_existing_unverified.id
      RETURNING * INTO v_new_or_updated;

    ELSE
      v_attempts_reset := false; -- avisa o frontend que precisa manter o registro de tantativas
      -- 3b. CÓDIGO AINDA VÁLIDO: Apenas atualiza os dados pessoais, MANTÉM O ESTADO da verificação
      UPDATE public.pre_registrations
      SET
        name = p_name,
        surname = p_surname,
        cpf_encrypted = v_encrypted_cpf,
        phone = p_phone,
        street = p_street,
        "number" = p_number,
        complement = p_complement,
        locality = p_locality,
        city = p_city,
        region_code = p_region_code,
        postal_code = p_postal_code
        -- Nenhum campo de verificação é alterado
      WHERE id = v_existing_unverified.id
      RETURNING * INTO v_new_or_updated;

    END IF;
    
  ELSE
    v_attempts_reset := true;
    -- 4. Nenhuma inscrição encontrada. CRIAR UMA NOVA.
    INSERT INTO public.pre_registrations (
      name, surname, email, cpf_encrypted, phone, class_id, status, verification_code, verification_code_expires_at,
      street, "number", complement, locality, city, region_code, postal_code
    )
    VALUES (
      p_name, p_surname, p_email, v_encrypted_cpf, p_phone, p_class_id, 'pending_verification', v_verification_code, now() + interval '15 minutes',
      p_street, p_number, p_complement, p_locality, p_city, p_region_code, p_postal_code
    )
    RETURNING * INTO v_new_or_updated;
  END IF;

  -- 5. Retorna os dados da inscrição (nova ou atualizada)
  RETURN jsonb_build_object(
    'success', true,
    'code', 'created',
    'message', 'Pré-inscrição criada!',
    'data', jsonb_build_object(
      'token', v_new_or_updated.token,
      'status', v_new_or_updated.status,
      'attempts_reset', v_attempts_reset
    )
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'code', 'internal_error', 'message', 'Erro interno ao criar pré-inscrição: ' || sqlerrm);
END;
$$;

-- função para vericar código de validação
create or replace function public.verify_email_code (
  p_email text,
  p_class_id uuid,
  p_verification_code varchar(6)
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = '' as $$
DECLARE
  v_registration record;
  v_class_exists boolean;
  v_max_attempts integer := 3;
BEGIN
  -- verifica se a turma existe
  SELECT EXISTS (
    SELECT
      1
    FROM
      public.classes
    WHERE
      id = p_class_id
  ) INTO v_class_exists;


  IF NOT v_class_exists THEN
    RETURN jsonb_build_object('success', false, 'code', 'class_not_found', 'message', 'A turma especificada não foi encontrada.');
  END IF;

  -- busca o registro de pré-inscrição
  SELECT
    *
  INTO
    v_registration
  FROM
    public.pre_registrations
  WHERE
    email = p_email AND class_id = p_class_id;


  -- verifica se a pré-inscrição foi encontrada
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'code', 'email_not_found_for_class', 'message', 'Nenhuma pré-inscrição encontrada para este e-mail nesta turma.');
  END IF;


  -- Verifica se o e-mail já foi verificado
  IF v_registration.email_verified = true THEN
    RETURN jsonb_build_object('success', false, 'code', 'already_verified', 'message', 'Este e-mail já foi verificado anteriormente.');
  END IF;


  -- Verifica se o código de verificação expirou
  IF v_registration.verification_code_expires_at <= now() THEN
    RETURN jsonb_build_object('success', false, 'code', 'code_expired', 'message', 'O código de verificação expirou. Por favor, solicite um novo.');
  END IF;


  -- Verifica se o número máximo de tentativas foi excedido
  IF v_registration.verification_attempts >= v_max_attempts THEN
    RETURN jsonb_build_object('success', false, 'code', 'max_attempts_exceeded', 'message', 'Você excedeu o número máximo de tentativas.');
  END IF;


  -- Verifica se o código de verificação está incorreto
  IF v_registration.verification_code <> p_verification_code THEN
    -- Incrementa a contagem de tentativas se o código estiver incorreto
    UPDATE public.pre_registrations
    SET
      verification_attempts = verification_attempts + 1
    WHERE
      id = v_registration.id;


    RETURN jsonb_build_object('success', false, 'code', 'code_invalid', 'message', 'O código de verificação está incorreto.');
  END IF;


  -- Se o código estiver correto, atualiza o status para verificado e zera as tentativas
  UPDATE public.pre_registrations
  SET
    email_verified = true,
    email_verified_at = now(),
    status = 'email_verified',
    verification_attempts = 0
  WHERE
    id = v_registration.id;


  -- Retorna sucesso
  RETURN jsonb_build_object(
    'success',
    true,
    'code',
    'email_verified',
    'message',
    'Email verificado com sucesso!',
    'data',
    jsonb_build_object(
      'id',
      v_registration.id,
      'token',
      v_registration.token,
      'class_id',
      v_registration.class_id
    )
  );
EXCEPTION
  -- Bloco para tratamento de erros
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'code', 'internal_error', 'message', 'Erro interno do servidor: ' || sqlerrm);
END;
$$;

-- Função para reenviar código de validação
create or replace function public.resend_verification_code (p_email text, p_class_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = '' as $$
DECLARE
  v_registration record;
  v_new_code varchar(6);
  v_cooldown_period interval := '30 seconds';
  v_max_resends integer := 3;
BEGIN
  SELECT * INTO v_registration
    FROM public.pre_registrations
    WHERE email = p_email AND class_id = p_class_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'REGISTRATION_NOT_FOUND',
      'message', 'Pré-registro não encontrado.'
    );
  END IF;
  
  IF v_registration.email_verified = true THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'EMAIL_ALREADY_VERIFIED',
      'message', 'Este e-mail já foi verificado.'
    );
  END IF;
  
  IF v_registration.resend_attempts >= v_max_resends THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'MAX_RESEND_ATTEMPTS_EXCEEDED',
      'message', 'Você atingiu o número máximo de reenvios de código. Por favor, entre em contato com o suporte.'
    );
  END IF;
    
  IF v_registration.last_resend_at IS NOT NULL AND v_registration.last_resend_at > (now() - v_cooldown_period) THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'TOO_MANY_REQUESTS',
      'message', 'Por favor, aguarde um pouco antes de solicitar um novo código.'
    );
  END IF;
  
  v_new_code := lpad(floor(random() * 1000000)::text, 6, '0');
  
  UPDATE public.pre_registrations
    SET
      verification_code = v_new_code,
      verification_attempts = 0,
      verification_code_expires_at = now() + interval '15 minutes',
      resend_attempts = v_registration.resend_attempts + 1,
      last_resend_at = now()
  WHERE id = v_registration.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'code', 'CODE_RESENT',
    'message', 'Novo código de verificação enviado!',
    'data', jsonb_build_object( 'verification_code', v_new_code )
  );


EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'code', 'INTERNAL_ERROR',
    'message', 'Erro interno: ' || sqlerrm
  );
END; $$;

-- Função para buscar uma pré-inscrição pelo token público
create or replace function public.get_pre_registration_by_token (p_token UUID) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = '' as $$
DECLARE
  v_registration record;
  v_encryption_key text;
BEGIN
  -- busca a chave de criptografia para decifrar o cpf
  SELECT decrypted_secret INTO v_encryption_key FROM vault.decrypted_secrets WHERE name = 'CPF_ENCRYPTION_KEY';
  IF v_encryption_key IS NULL THEN
    RETURN jsonb_build_object('success', false, 'code', 'internal_error', 'message', 'chave de criptografia não configurada.');
  END IF;

  -- seleciona todos os campos da tabela e decifra o cpf
  SELECT
    id, class_id, name, surname, email, phone, status, email_verified,
    token, created_at, expires_at, verification_code, verification_attempts,
    verification_code_expires_at, resend_attempts, last_resend_at,
    street, "number", complement, locality, city, region_code, postal_code,
    pagbank_order_id, pagbank_order_data, order_created_at, -- <-- campos adicionados
    extensions.pgp_sym_decrypt(cpf_encrypted, v_encryption_key) AS cpf
  INTO v_registration
  FROM public.pre_registrations
  WHERE token = p_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'not_found',
      'message', 'Nenhum registro de pré-inscrição foi encontrado com o token fornecido.'
    );
  END IF;

  -- retorna o objeto jsonb completo com todos os campos
  RETURN jsonb_build_object(
    'success', true,
    'code', 'found',
    'message', 'Registro de pré-inscrição encontrado com sucesso.',
    'data', jsonb_build_object(
      'id', v_registration.id,
      'class_id', v_registration.class_id,
      'name', v_registration.name,
      'surname', v_registration.surname,
      'email', v_registration.email,
      'phone', v_registration.phone,
      'status', v_registration.status,
      'email_verified', v_registration.email_verified,
      'token', v_registration.token,
      'created_at', v_registration.created_at,
      'expires_at', v_registration.expires_at,
      'verification_code', v_registration.verification_code,
      'verification_attempts', v_registration.verification_attempts,
      'verification_code_expires_at', v_registration.verification_code_expires_at,
      'resend_attempts', v_registration.resend_attempts,
      'last_resend_at', v_registration.last_resend_at,
      'cpf', v_registration.cpf,
      'street', v_registration.street,
      'number', v_registration.number,
      'complement', v_registration.complement,
      'locality', v_registration.locality,
      'city', v_registration.city,
      'region_code', v_registration.region_code,
      'postal_code', v_registration.postal_code,
      'pagbank_order_id', v_registration.pagbank_order_id,
      'pagbank_order_data', v_registration.pagbank_order_data,
      'order_created_at', v_registration.order_created_at
    )
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'internal_error',
      'message', 'Ocorreu um erro interno no servidor: ' || sqlerrm
    );
END;
$$;