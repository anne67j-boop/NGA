-- NGA application-intake schema. Apply in Supabase before configuring Vercel.
create table if not exists public.grant_applications (
  id uuid primary key default gen_random_uuid(),
  reference_id varchar(40) not null unique,
  grant_slug varchar(120) not null,
  grant_title varchar(255) not null,
  applicant_name varchar(200) not null,
  email varchar(255) not null,
  phone varchar(50) not null,
  street_address varchar(255) not null,
  city varchar(120) not null,
  state varchar(120) not null,
  postal_code varchar(32) not null,
  purpose text not null,
  income_range varchar(80) not null,
  application_data jsonb not null default '{}'::jsonb,
  status varchar(20) not null default 'SUBMITTED'
    check (status in ('DRAFT','SUBMITTED','IN_REVIEW','APPROVED','DECLINED')),
  attachment jsonb,
  reviewer_notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists grant_applications_email_idx on public.grant_applications(email);
create index if not exists grant_applications_program_status_idx on public.grant_applications(grant_slug, status);
create index if not exists grant_applications_submitted_at_idx on public.grant_applications(submitted_at desc);
alter table public.grant_applications enable row level security;
revoke all on public.grant_applications from anon, authenticated;
grant all on public.grant_applications to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('nga-private-attachments', 'nga-private-attachments', false, 10485760,
  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = 10485760, allowed_mime_types = excluded.allowed_mime_types;
-- No anon/authenticated policies: only server-side service-role access is permitted.
