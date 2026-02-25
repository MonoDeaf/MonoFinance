-- 1. Create the main state table with user ownership
-- We drop the old table if it exists to ensure correct structure
drop table if exists mono_app_state;

create table mono_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Realtime for this table so devices sync instantly
-- Note: You might need to check if the publication 'supabase_realtime' exists in your DB
-- If this fails, you can create it first with: CREATE PUBLICATION supabase_realtime;
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

-- 5. Automatically update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_mono_app_state_updated_at
    before update on mono_app_state
    for each row
    execute procedure update_updated_at_column();