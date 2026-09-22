-- ========================================================
-- BookGenie V1 Master Database Migration
-- Includes: Triggers, Profiles, Books, Assets, Pages,
--           Versions, Uploads, Jobs, Usage, RLS & Storage
-- ========================================================

create extension if not exists "uuid-ossp";

-- 1. Automatic updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. Profiles table (synced with Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text not null,
  avatar_url text,
  tier text default 'free' check (tier in ('free', 'creator', 'pro')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists tr_profiles_updated_at on public.profiles;
create trigger tr_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 3. Automatic user profile creation on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Books table
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  subtitle text,
  book_type text not null,
  language text default 'English',
  style text default 'Editorial',
  status text default 'planning' check (status in ('planning', 'writing', 'generating_visuals', 'designing', 'completed', 'failed')),
  progress integer default 0,
  page_target integer default 20,
  page_count integer default 0,
  cover_asset_id uuid,
  blueprint jsonb,
  version_number integer default 1,
  is_shared boolean default false,
  share_token uuid default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists tr_books_updated_at on public.books;
create trigger tr_books_updated_at
  before update on public.books
  for each row execute function public.handle_updated_at();

-- 5. Assets table (Private storage by default)
create table if not exists public.assets (
  id uuid default gen_random_uuid() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  type text default 'illustration' check (type in ('cover', 'illustration', 'diagram')),
  storage_path text not null,
  prompt text,
  provider text default 'gemini',
  created_at timestamptz default now()
);

-- Foreign key for cover_asset_id
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'fk_books_cover_asset') then
    alter table public.books
      add constraint fk_books_cover_asset
      foreign key (cover_asset_id) references public.assets(id) on delete set null;
  end if;
end $$;

-- 6. Book Pages table
create table if not exists public.book_pages (
  id uuid default gen_random_uuid() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  page_number integer not null,
  chapter_index integer default 0,
  title text,
  page_type text default 'illustrated_content',
  layout text default 'standard',
  blocks jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(book_id, page_number)
);

drop trigger if exists tr_book_pages_updated_at on public.book_pages;
create trigger tr_book_pages_updated_at
  before update on public.book_pages
  for each row execute function public.handle_updated_at();

-- 7. Book Versions (Snapshots for rollback & non-destructive natural-language edits)
create table if not exists public.book_versions (
  id uuid default gen_random_uuid() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  version_number integer not null,
  document_snapshot jsonb not null, -- Complete canonical BookDocument (schemaVersion: 1)
  change_instruction text,
  created_at timestamptz default now()
);

-- 8. Uploads table (User source materials)
create table if not exists public.uploads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  storage_path text not null,
  extracted_text text,
  file_size bigint,
  created_at timestamptz default now()
);

-- 9. Jobs table (With atomic claiming & idempotency fields)
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  type text default 'full_generation' check (type in ('full_generation', 'page_regeneration')),
  status text default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  stage text default 'planning',
  progress integer default 0,
  claimed_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  attempt_count integer default 0,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists tr_jobs_updated_at on public.jobs;
create trigger tr_jobs_updated_at
  before update on public.jobs
  for each row execute function public.handle_updated_at();

-- 10. Generation Usage (Fine-grained token/image cost accounting)
create table if not exists public.generation_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  provider text not null,
  model text not null,
  generation_type text not null,
  input_tokens bigint default 0,
  output_tokens bigint default 0,
  image_count integer default 0,
  estimated_cost numeric(10, 6) default 0,
  created_at timestamptz default now()
);

-- 11. Usage Records (Monthly Quotas)
create table if not exists public.usage_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  books_created_this_month integer default 0,
  images_generated integer default 0,
  period_start date default current_date,
  updated_at timestamptz default now(),
  unique(user_id, period_start)
);

drop trigger if exists tr_usage_records_updated_at on public.usage_records;
create trigger tr_usage_records_updated_at
  before update on public.usage_records
  for each row execute function public.handle_updated_at();

-- ========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ========================================================

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.assets enable row level security;
alter table public.book_pages enable row level security;
alter table public.book_versions enable row level security;
alter table public.uploads enable row level security;
alter table public.jobs enable row level security;
alter table public.generation_usage enable row level security;
alter table public.usage_records enable row level security;

-- Profiles
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Books (owner or public tokenized share)
create policy "books_select" on public.books for select using (auth.uid() = user_id or is_shared = true);
create policy "books_insert" on public.books for insert with check (auth.uid() = user_id);
create policy "books_update" on public.books for update using (auth.uid() = user_id);
create policy "books_delete" on public.books for delete using (auth.uid() = user_id);

-- Assets
create policy "assets_select" on public.assets for select using (
  exists (select 1 from public.books where books.id = assets.book_id and (books.user_id = auth.uid() or books.is_shared = true))
);
create policy "assets_insert" on public.assets for insert with check (
  exists (select 1 from public.books where books.id = assets.book_id and books.user_id = auth.uid())
);

-- Book Pages
create policy "book_pages_select" on public.book_pages for select using (
  exists (select 1 from public.books where books.id = book_pages.book_id and (books.user_id = auth.uid() or books.is_shared = true))
);

-- Book Versions
create policy "book_versions_select" on public.book_versions for select using (
  exists (select 1 from public.books where books.id = book_versions.book_id and books.user_id = auth.uid())
);

-- Uploads
create policy "uploads_select" on public.uploads for select using (auth.uid() = user_id);
create policy "uploads_insert" on public.uploads for insert with check (auth.uid() = user_id);
create policy "uploads_delete" on public.uploads for delete using (auth.uid() = user_id);

-- Jobs
create policy "jobs_select" on public.jobs for select using (
  exists (select 1 from public.books where books.id = jobs.book_id and books.user_id = auth.uid())
);

-- Generation Usage
create policy "generation_usage_select" on public.generation_usage for select using (auth.uid() = user_id);
create policy "usage_records_select" on public.usage_records for select using (auth.uid() = user_id);

-- ========================================================
-- STORAGE BUCKETS & POLICIES
-- ========================================================

insert into storage.buckets (id, name, public) values
  ('uploads', 'uploads', false),
  ('assets', 'assets', false),
  ('exports', 'exports', false),
  ('demo', 'demo', true)
on conflict (id) do nothing;

create policy "Uploads: user access own folder" on storage.objects
  for all using (bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Assets: user access own book assets" on storage.objects
  for select using (bucket_id = 'assets' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Exports: user access own files" on storage.objects
  for all using (bucket_id = 'exports' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'exports' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Demo: public read" on storage.objects
  for select using (bucket_id = 'demo');
