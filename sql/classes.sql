-- drops seguros (CASCADE para limpar dependências)
drop table if exists class_schedules cascade;

drop table if exists classes cascade;

drop view if exists open_classes;

drop type if exists class_status cascade;

-- enum de status
create type class_status as ENUM(
  'planned',
  'open',
  'closed',
  'in_progress',
  'finished',
  'canceled'
);

-- criação da tabela classes
create table classes (
  id UUID primary key default gen_random_uuid (),
  name TEXT not null,
  description TEXT,
  opening_date DATE not null,
  closing_date DATE not null,
  total_seats INTEGER not null check (total_seats > 0),
  occupied_seats INTEGER default 0 check (
    occupied_seats >= 0
    and occupied_seats <= total_seats
  ),
  registration_fee DECIMAL(10, 2) not null check (registration_fee >= 0),
  address TEXT not null,
  status class_status default 'planned',
  created_at TIMESTAMPTZ default NOW(),
  updated_at TIMESTAMPTZ default NOW()
  -- check (closing_date > opening_date)
);

-- criação da tabela de horários
create table class_schedules (
  id UUID primary key default gen_random_uuid (),
  class_id UUID not null references classes (id) on delete CASCADE,
  scheduled_time TIMESTAMPTZ not null,
  created_at TIMESTAMPTZ default NOW()
);

-- view pública para turmas abertas
create or replace view public.open_classes as
select
  c.id,
  c.name,
  c.address,
  c.total_seats,
  c.occupied_seats,
  c.opening_date,
  c.closing_date,
  c.registration_fee,
  coalesce(
    array_agg(
      cs.scheduled_time
      order by
        cs.scheduled_time
    ) filter (
      where
        cs.scheduled_time is not null
    ),
    array[]::timestamptz[]
  ) as schedules
from
  classes c
left join 
  class_schedules cs on cs.class_id = c.id
where
  c.status = 'open'
group by c.id;

-- indices (drop if exists não é necessário pois as tabelas foram dropadas)
create index idx_classes_status on classes (status);

create index idx_class_schedules_class_id on class_schedules (class_id);

-- trigger para updated_at
-- drop trigger antes de criar (caso já exista)
drop trigger if exists update_classes_updated_at on classes;

create trigger update_classes_updated_at BEFORE
update on classes for EACH row
execute function public.update_updated_at_column ();

-- RLS
alter table classes ENABLE row LEVEL SECURITY;

alter table class_schedules ENABLE row LEVEL SECURITY;

alter view public.public_classes
set
  (security_invoker = true);

-- ======== FUNÇÕES ========
-- cria nova turma e seus horários
create or replace function create_class_with_schedules (
  p_name TEXT,
  p_description TEXT,
  p_opening_date DATE,
  p_closing_date DATE,
  p_total_seats INTEGER,
  p_registration_fee DECIMAL(10, 2),
  p_address TEXT,
  p_status class_status,
  p_schedules timestamptz[] -- array de timestamp's
) RETURNS UUID -- retorna o id da turma criada
LANGUAGE plpgsql SECURITY INVOKER -- mantém rls
as $$
DECLARE
    new_class_id UUID;
    schedule_time TIMESTAMPTZ;
BEGIN
    INSERT INTO classes (
        name,
        description,
        opening_date,
        closing_date,
        total_seats,
        registration_fee,
        address,
        status
    )
    VALUES (
        p_name,
        p_description,
        p_opening_date,
        p_closing_date,
        p_total_seats,
        p_registration_fee,
        p_address,
        p_status
    )
    RETURNING id INTO new_class_id; -- insere o id na variável

    -- verifica se os horários foram passados
    IF p_schedules IS NOT NULL AND array_length(p_schedules, 1) > 0 THEN
        -- itera sobre os horários e insere cada um
        FOREACH schedule_time IN ARRAY p_schedules
        LOOP
            INSERT INTO class_schedules (
                class_id,
                scheduled_time
            )
            VALUES (
                new_class_id,
                schedule_time
            );
        END LOOP;
    END IF;

    -- retorna o id da turma criada
    RETURN new_class_id;
END;
$$;

-- busca todas as turmas agregadas aos seus horários
create or replace function public.get_all_classes_with_schedules () RETURNS table (
  id UUID,
  name TEXT,
  description TEXT,
  opening_date DATE,
  closing_date DATE,
  total_seats INTEGER,
  occupied_seats INTEGER,
  registration_fee DECIMAL,
  address TEXT,
  status class_status,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  schedules timestamptz[]
) LANGUAGE plpgsql SECURITY INVOKER -- mantém rls
set
  search_path = '' as $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.opening_date,
    c.closing_date,
    c.total_seats,
    c.occupied_seats,
    c.registration_fee,
    c.address,
    c.status,
    c.created_at,
    c.updated_at,
    COALESCE(
      ARRAY_AGG(cs.scheduled_time ORDER BY cs.scheduled_time) 
      FILTER (WHERE cs.scheduled_time IS NOT NULL), 
      ARRAY[]::TIMESTAMPTZ[]
    ) as schedules
  FROM public.classes c
  LEFT JOIN public.class_schedules cs ON c.id = cs.class_id
  GROUP BY c.id
  ORDER BY c.created_at DESC;
END;
$$;

-- atualiza turma e seus horários
create or replace function public.update_class_with_schedules (
  p_class_id UUID,
  p_name TEXT,
  p_description TEXT,
  p_opening_date DATE,
  p_closing_date DATE,
  p_total_seats INTEGER,
  p_registration_fee DECIMAL,
  p_address TEXT,
  p_status TEXT,
  p_schedules timestamptz[]
) RETURNS VOID LANGUAGE plpgsql SECURITY INVOKER -- mantém rls
set
  search_path = '' as $$
DECLARE
  schedule_time TIMESTAMPTZ;
BEGIN
  -- validações básicas
  IF p_total_seats <= 0 THEN
    RAISE EXCEPTION 'Total de vagas deve ser maior que zero';
  END IF;
  
  IF p_opening_date > p_closing_date THEN
    RAISE EXCEPTION 'Data de abertura não pode ser posterior à data de fechamento';
  END IF;

  -- verificar se a turma existe
  IF NOT EXISTS (SELECT 1 FROM public.classes WHERE id = p_class_id) THEN
    RAISE EXCEPTION 'Turma não encontrada';
  END IF;

  -- atualizar dados da turma
  UPDATE public.classes SET
    name = p_name,
    description = p_description,
    opening_date = p_opening_date,
    closing_date = p_closing_date,
    total_seats = p_total_seats,
    registration_fee = p_registration_fee,
    address = p_address,
    status = p_status::public.class_status
  WHERE id = p_class_id;

  -- remover horários antigos
  DELETE FROM public.class_schedules WHERE class_id = p_class_id;

  -- inserir novos horários
  IF p_schedules IS NOT NULL AND array_length(p_schedules, 1) > 0 THEN
    FOREACH schedule_time IN ARRAY p_schedules
    LOOP
      INSERT INTO public.class_schedules (class_id, scheduled_time)
      VALUES (p_class_id, schedule_time);
    END LOOP;
  END IF;
END;
$$;