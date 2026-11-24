-- NGA: independent grant-information content store.
-- Apply in the Supabase SQL editor after provisioning the project.
-- This schema stores public program metadata only; it is not an applicant database.

create extension if not exists pgcrypto;

create table if not exists public.grant_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 180),
  administering_agency text not null check (char_length(administering_agency) between 1 and 180),
  summary text not null check (char_length(summary) between 1 and 1800),
  eligibility_summary text not null default '' check (char_length(eligibility_summary) <= 1200),
  official_notice_url text not null check (official_notice_url ~ '^https://'),
  official_agency_url text not null check (official_agency_url ~ '^https://'),
  deadline_at timestamptz,
  program_status text not null default 'open' check (program_status in ('open', 'closed', 'withdrawn')),
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  is_published boolean not null default false,
  verified_at timestamptz,
  source_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verified_records_must_have_timestamp
    check (verification_status <> 'verified' or verified_at is not null),
  constraint published_records_must_be_verified
    check (not is_published or verification_status = 'verified')
);

create index if not exists grant_sources_public_listing_idx
  on public.grant_sources (program_status, deadline_at)
  where is_published = true and verification_status = 'verified';

alter table public.grant_sources enable row level security;

-- Public visitors may only read records explicitly verified and published.
drop policy if exists "Public reads verified published grant sources" on public.grant_sources;
create policy "Public reads verified published grant sources"
  on public.grant_sources
  for select
  to anon, authenticated
  using (is_published = true and verification_status = 'verified');

-- No public or authenticated writes. Server-side secret key is used only by
-- the protected Vercel admin function and must never be exposed to browsers.
revoke all on public.grant_sources from anon, authenticated;
grant select on public.grant_sources to anon, authenticated;
grant all on public.grant_sources to service_role;

create or replace function public.set_grant_sources_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists grant_sources_updated_at on public.grant_sources;
create trigger grant_sources_updated_at
before update on public.grant_sources
for each row execute function public.set_grant_sources_updated_at();
