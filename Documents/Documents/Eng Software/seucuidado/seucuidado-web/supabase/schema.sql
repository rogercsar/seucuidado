-- Supabase schema for SeuCuidado
-- Enable Realtime on tables: chats, messages, appointments, transactions

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text check (role in ('user','professional','admin')) default 'user',
  city text,
  address text,
  created_at timestamptz default now()
);

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  specialty text not null,
  price_per_hour numeric not null,
  rating numeric default 0,
  bio text,
  radius_km int default 10,
  city text,
  lat numeric,
  lng numeric,
  approved boolean default false,
  documents jsonb,
  created_at timestamptz default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  professional_id uuid references public.professionals(id) on delete set null,
  scheduled_at timestamptz not null,
  status text check (status in ('requested','confirmed','completed','canceled')) default 'requested',
  price numeric not null,
  created_at timestamptz default now()
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  professional_id uuid references public.professionals(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.chats(id) on delete cascade,
  sender_id uuid references public.users(id) on delete set null,
  text text not null,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete cascade,
  rating int check (rating >=1 and rating <=5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete set null,
  mp_preference_id text,
  mp_payment_id text,
  amount numeric,
  commission numeric,
  status text,
  created_at timestamptz default now()
);

-- Row Level Security policies can be defined based on Supabase Auth
-- Example policies (adjust to your needs):
-- alter table public.messages enable row level security;
-- create policy "read_messages" on public.messages for select using (true);
-- create policy "insert_own_messages" on public.messages for insert with check (auth.uid() = sender_id);