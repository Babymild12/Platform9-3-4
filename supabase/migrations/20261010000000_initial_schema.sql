create extension if not exists pgcrypto;

create type public.app_role as enum ('passenger', 'station_staff', 'admin');
create type public.booking_status as enum ('pending_payment', 'confirmed', 'cancelled', 'expired');
create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');
create type public.run_seat_status as enum ('available', 'held', 'booked', 'blocked');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'passenger',
  primary key (user_id, role)
);

create table public.stations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_th text not null,
  name_en text,
  region text,
  active boolean not null default true
);

create table public.trains (
  id uuid primary key default gen_random_uuid(),
  train_number text not null unique,
  name text not null,
  train_type text not null,
  active boolean not null default true
);

create table public.routes (
  id uuid primary key default gen_random_uuid(),
  train_id uuid not null references public.trains(id),
  origin_station_id uuid not null references public.stations(id),
  destination_station_id uuid not null references public.stations(id),
  departure_time time not null,
  arrival_time time not null,
  arrival_day_offset smallint not null default 0 check (arrival_day_offset >= 0),
  active boolean not null default true,
  check (origin_station_id <> destination_station_id),
  unique (train_id, origin_station_id, destination_station_id)
);

create table public.carriages (
  id uuid primary key default gen_random_uuid(),
  train_id uuid not null references public.trains(id) on delete cascade,
  carriage_number text not null,
  seat_class smallint not null check (seat_class between 1 and 3),
  unique (train_id, carriage_number)
);

create table public.seats (
  id uuid primary key default gen_random_uuid(),
  carriage_id uuid not null references public.carriages(id) on delete cascade,
  seat_number text not null,
  seat_type text not null default 'standard',
  unique (carriage_id, seat_number)
);

create table public.train_runs (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id),
  travel_date date not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'delayed', 'cancelled', 'departed', 'arrived')),
  created_at timestamptz not null default now(),
  unique (route_id, travel_date)
);

create table public.run_seats (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.train_runs(id) on delete cascade,
  seat_id uuid not null references public.seats(id),
  status public.run_seat_status not null default 'available',
  fare_amount numeric(10,2) not null check (fare_amount >= 0),
  unique (run_id, seat_id)
);

create table public.seat_holds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  run_seat_id uuid not null references public.run_seats(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (run_seat_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  booking_reference text not null unique default upper(encode(gen_random_bytes(5), 'hex')),
  status public.booking_status not null default 'pending_payment',
  total_amount numeric(10,2) not null check (total_amount >= 0),
  payment_deadline timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_seats (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  run_seat_id uuid not null references public.run_seats(id),
  passenger_name text not null,
  passenger_document_last4 text,
  fare_amount numeric(10,2) not null check (fare_amount >= 0),
  unique (run_seat_id)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  provider text not null default 'simulation',
  provider_reference text,
  status public.payment_status not null default 'pending',
  amount numeric(10,2) not null check (amount >= 0),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  booking_seat_id uuid not null unique references public.booking_seats(id) on delete cascade,
  ticket_number text not null unique default upper(encode(gen_random_bytes(8), 'hex')),
  qr_payload text not null unique default gen_random_uuid()::text,
  issued_at timestamptz not null default now(),
  verified_at timestamptz,
  verified_by uuid references auth.users(id)
);

create index routes_search_idx on public.routes (origin_station_id, destination_station_id) where active;
create index train_runs_date_idx on public.train_runs (travel_date, route_id);
create index run_seats_availability_idx on public.run_seats (run_id, status);
create index bookings_user_created_idx on public.bookings (user_id, created_at desc);
create index seat_holds_expiry_idx on public.seat_holds (expires_at);

create or replace function public.has_role(required_role public.app_role)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = required_role
  );
$$;

create or replace function public.release_expired_holds()
returns integer language plpgsql security definer set search_path = '' as $$
declare released_count integer;
begin
  with expired as (
    delete from public.seat_holds where expires_at <= now() returning run_seat_id
  ), available as (
    update public.run_seats rs set status = 'available'
    from expired e where rs.id = e.run_seat_id and rs.status = 'held'
    returning rs.id
  ) select count(*) into released_count from available;
  return released_count;
end;
$$;

create or replace function public.hold_run_seats(p_run_id uuid, p_seat_ids uuid[])
returns uuid[] language plpgsql security definer set search_path = '' as $$
declare
  requested_count integer := coalesce(cardinality(p_seat_ids), 0);
  held_ids uuid[];
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if requested_count < 1 or requested_count > 6 then raise exception 'Choose between 1 and 6 seats'; end if;
  perform public.release_expired_holds();

  with chosen as (
    select rs.id from public.run_seats rs
    join public.seats s on s.id = rs.seat_id
    join public.carriages c on c.id = s.carriage_id
    join public.train_runs tr on tr.id = rs.run_id
    where rs.run_id = p_run_id and rs.id = any(p_seat_ids)
      and rs.status = 'available' and tr.status = 'scheduled'
    order by rs.id for update of rs skip locked
  ), changed as (
    update public.run_seats rs set status = 'held'
    from chosen c where rs.id = c.id returning rs.id
  ), inserted as (
    insert into public.seat_holds (user_id, run_seat_id, expires_at)
    select auth.uid(), changed.id, now() + interval '12 minutes' from changed
    returning run_seat_id
  ) select array_agg(run_seat_id) into held_ids from inserted;

  if coalesce(cardinality(held_ids), 0) <> requested_count then
    raise exception 'One or more requested seats are no longer available';
  end if;
  return held_ids;
end;
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.stations enable row level security;
alter table public.trains enable row level security;
alter table public.routes enable row level security;
alter table public.carriages enable row level security;
alter table public.seats enable row level security;
alter table public.train_runs enable row level security;
alter table public.run_seats enable row level security;
alter table public.seat_holds enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_seats enable row level security;
alter table public.payments enable row level security;
alter table public.tickets enable row level security;

create policy "Active station directory is readable" on public.stations for select using (active);
create policy "Active trains are readable" on public.trains for select using (active);
create policy "Active routes are readable" on public.routes for select using (active);
create policy "Carriages for active trains are readable" on public.carriages for select using (exists (select 1 from public.trains t where t.id = train_id and t.active));
create policy "Seats for active trains are readable" on public.seats for select using (exists (select 1 from public.carriages c join public.trains t on t.id = c.train_id where c.id = carriage_id and t.active));
create policy "Train runs are readable" on public.train_runs for select using (true);
create policy "Run seats are readable" on public.run_seats for select using (true);
create policy "Users read their profile" on public.profiles for select using (id = (select auth.uid()));
create policy "Users update their profile" on public.profiles for update using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "Users read own roles" on public.user_roles for select using (user_id = (select auth.uid()));
create policy "Users read own holds" on public.seat_holds for select using (user_id = (select auth.uid()));
create policy "Users remove own holds" on public.seat_holds for delete using (user_id = (select auth.uid()));
create policy "Users read own bookings" on public.bookings for select using (user_id = (select auth.uid()) or public.has_role('admin'));
create policy "Users read seats in own bookings" on public.booking_seats for select using (exists (select 1 from public.bookings b where b.id = booking_id and (b.user_id = (select auth.uid()) or public.has_role('admin'))));
create policy "Users read payments in own bookings" on public.payments for select using (exists (select 1 from public.bookings b where b.id = booking_id and (b.user_id = (select auth.uid()) or public.has_role('admin'))));
create policy "Users read tickets in own bookings" on public.tickets for select using (exists (select 1 from public.booking_seats bs join public.bookings b on b.id = bs.booking_id where bs.id = booking_seat_id and (b.user_id = (select auth.uid()) or public.has_role('admin'))));

revoke all on function public.hold_run_seats(uuid, uuid[]) from public, anon;
grant execute on function public.hold_run_seats(uuid, uuid[]) to authenticated;
revoke all on function public.release_expired_holds() from public, anon;
grant execute on function public.release_expired_holds() to authenticated;
grant execute on function public.release_expired_holds() to service_role;