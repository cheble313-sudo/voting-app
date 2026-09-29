create table if not exists polls (
  id serial primary key,
  question text not null,
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists options (
  id serial primary key,
  poll_id integer not null references polls(id) on delete cascade,
  label text not null,
  position integer not null
);

create table if not exists votes (
  id serial primary key,
  option_id integer not null references options(id) on delete cascade,
  created_at timestamptz not null default now()
);
