create table if not exists orders (
  id bigint generated always as identity primary key,
  reference text unique not null,
  product_id text not null, qty int not null,
  amount_cents bigint not null,
  email text not null, name text,
  status text not null default 'pendiente',
  wompi_tx text,
  created_at timestamptz default now(), paid_at timestamptz);

create table if not exists products (
  id text primary key, cat text not null, n text not null, precio int not null default 0,
  vibe text not null default 'joven', tag text, emoji text default '🛍️', link text default '#',
  giro int, stock int not null default 0, foto text, activo boolean default true);
insert into products (id,cat,n,precio,vibe,tag,emoji,stock) values
 ('a1','amazon','Producto Amazon 1',0,'joven','Tendencia','🎧',0),
 ('z1','zapatos','Tenis urbanos',0,'joven','Nuevo','👟',0),
 ('c1','camisas','Camiseta oversize',0,'joven','Tendencia','👕',0),
 ('p1','pijamas','Pijama estampada',0,'joven',null,'🌙',0)
on conflict do nothing;

create table if not exists categorias (
  slug text primary key, titulo text not null, emoji text default '🛍️',
  gradiente text default 'linear-gradient(135deg,#22d3ee,#6366f1)',
  layout text default 'cuadricula', orden int default 0, activa boolean default true);
insert into categorias (slug,titulo,emoji,gradiente,orden) values
 ('amazon','Amazon','📦','linear-gradient(135deg,#f59e0b,#ef4444)',1),
 ('zapatos','Zapatos','👟','linear-gradient(135deg,#22d3ee,#6366f1)',2),
 ('camisas','Camisas','👕','linear-gradient(135deg,#d946ef,#f43f5e)',3),
 ('pijamas','Pijamas','🌙','linear-gradient(135deg,#8b5cf6,#0ea5e9)',4)
on conflict do nothing;

create or replace function descontar_stock(pid text, cant int) returns void language sql as
$$ update products set stock = greatest(0, stock - cant) where id = pid $$;

create table if not exists hits (k text, at timestamptz default now());
create index if not exists hits_k on hits (k, at);
create or replace function limitar(kk text, lim int, seg int) returns boolean language plpgsql as $$
declare c int;
begin
  delete from hits where at < now() - interval '1 hour';
  select count(*) into c from hits where k = kk and at > now() - make_interval(secs => seg);
  if c >= lim then return false; end if;
  insert into hits(k) values (kk);
  return true;
end $$;

create table if not exists eventos (id bigint generated always as identity primary key, nivel text, msg text, meta jsonb, at timestamptz default now());
