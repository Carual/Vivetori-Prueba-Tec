# tabla
create table if not exists public.tickets (
    id uuid primary key default gen_random_uuid (),
    created_at timestamptz not null default now(),
    description text not null,
    category text,
    sentiment text,
    processed boolean not null default false
);

# indices
create index if not exists idx_tickets_created_at on public.tickets (created_at desc);

create index if not exists idx_tickets_processed on public.tickets (processed);

# rls
alter table public.tickets enable row level security;
drop policy if exists "tickets_select_anon" on public.tickets;

drop trigger if exists "my_webhook" on "public"."tickets";
create trigger "my_webhook" after insert
on "public"."tickets" for each row
execute function "supabase_functions"."http_request"(
  'https://n8n.carual.com/webhook/webhook-process-ticket',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);