create table mono_app_state (
  id bigint primary key generated always as identity,
  data jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
insert into mono_app_state (id, data) values (1, '{}');
alter publication supabase_realtime add table mono_app_state;