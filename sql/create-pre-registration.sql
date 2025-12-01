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
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = '' as $$
DECLARE
  v_existing_verified record;
  v_existing_unverified record;
  v_encrypted_cpf bytea;
  v_encryption_key text;
  v_new_or_updated record;
  v_verification_code varchar(6);
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
      'id', v_new_or_updated.id,
      'token', v_new_or_updated.token,
      'status', v_new_or_updated.status,
      'class_id', v_new_or_updated.class_id,
      'expires_at', v_new_or_updated.expires_at
    )
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'code', 'internal_error', 'message', 'Erro interno ao criar pré-inscrição: ' || sqlerrm);
END;
$$;