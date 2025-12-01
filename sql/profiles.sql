-- aqui criamos o tipo role_types que pode receber os valores 'owner' e 'admin'
create type public.role_type as enum ('owner', 'admin');

-- cria a tabela profiles
create table public.profiles (
  -- se o usuário do auth for excluído o profile também é excluído
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  role public.role_type not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- insere os usuário do auth na tabela profiles
-- por enquanto isso serve pra inserir automaticamente o Leandro
insert into public.profiles (id, email, name, role, created_at, updated_at)
select id, email, 'Leandro Notari', 'owner', now(), now()
from auth.users;

-- FUNÇÕES E TRIGGERS

-- função para criar profile do auth.user
create function public.create_auth_user_profile()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, created_at, updated_at)
  -- 'new' é uma variável especial que representa a linha que está sendo inserida em auth.users
  values (new.id, new.email, 'admin', now(), now());
  return new;
end;
$$ language plpgsql;

-- trigger que chama a função quando um usuário é inserido no auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.create_auth_user_profile();

-- trigger para atualizar o updated_at apos update
create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

-- habilitar RLS (Row Level Security) na tabela profiles
alter table public.profiles enable row level security;