-- 1. Create the main state table with user ownership
-- We drop the old table if it exists to ensure correct structure
drop table if exists mono_app_state;

create table mono_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Realtime for this table so devices sync instantly
alter publication supabase_realtime add table mono_app_state;

-- 3. Enable Row Level Security (RLS)
alter table mono_app_state enable row level security;

-- 4. Create policies to allow users to only access their OWN data

-- Policy for SELECT (Reading)
create policy "Users can view their own state"
on mono_app_state for select
to authenticated
using (auth.uid() = user_id);

-- Policy for INSERT (Creating)
create policy "Users can create their own state"
on mono_app_state for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy for UPDATE (Writing)
create policy "Users can update their own state"
on mono_app_state for update
to authenticated
using (auth.uid() = user_id);