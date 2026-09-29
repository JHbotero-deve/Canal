import { esAdmin } from "../../lib/admin";
import { db } from "../../lib/supabase";

export const dynamic = "force-dynamic";
const inp = "rounded-xl bg-white/10 p-2 text-sm w-full";

export default async function Admin() {
  if (!(await esAdmin()))
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <form method="post" action="/api/admin/login" className="max-w-sm mx-auto space-y-3">
          <h1 className="text-2xl font-black">Admin</h1>
          <input name="clave" type="password" placeholder="Clave" className={inp} />
          <button className="w-full rounded-xl bg-white text-black p-3 font-bold">Entrar</button>
        </form>
      </main>
    );
  const [{ data: ords }, { data: prods }, { data: evs }] = await Promise.all([
    db().from("orders").select("*").order("created_at", { ascending: false }).limit(30),
    db().from("products").select("*").order("id"),
    db().from("eventos").select("*").order("at", { ascending: false }).limit(15),
  ]);
  const ventas = (ords ?? []).filter((o) => o.status === "pagado").reduce((t, o) => t + o.amount_cents / 100, 0);
  return (
    <main className="min-h-screen bg-black text-white p-4 max-w-2xl mx-auto space-y-6 text-sm">
      <a href="/admin/categorias" className="underline text-cyan-300">Categorías y presentación →</a>
      <h1 className="text-2xl font-black">Panel · Ventas pagadas (últ. 30): ${ventas.toLocaleString("es-CO")}</h1>

      <section>
        <h2 className="font-bold mb-2">Crear / editar producto <span className="text-white/40">(usa un id existente para editar)</span></h2>
        <form method="post" action="/api/admin/producto" encType="multipart/form-data" className="grid grid-cols-2 gap-2">
          <input name="id" placeholder="id (ej. z2)" className={inp} required />
          <input name="n" placeholder="Nombre" className={inp} required />
          <input name="cat" placeholder="Categoría (ruta, ej. zapatos)" className={inp} required />
          <input name="vibe" placeholder="Enfoque (joven, clasico, deportivo…)" className={inp} />
          <input name="precio" type="number" placeholder="Precio COP" className={inp} />
          <input name="stock" type="number" placeholder="Stock" className={inp} />
          <input name="tag" placeholder="Etiqueta (Nuevo)" className={inp} />
          <input name="emoji" placeholder="Emoji" className={inp} />
          <input name="link" placeholder="Link (Amazon)" className={inp} />
          <input name="giro" type="number" placeholder="Fotos 360 (24)" className={inp} />
          <input name="foto" type="file" accept="image/*" className={inp + " col-span-2"} />
          <label className="col-span-2"><input type="checkbox" name="activo" defaultChecked /> Visible en la tienda</label>
          <button className="col-span-2 rounded-xl bg-white text-black p-3 font-bold">Guardar</button>
        </form>
      </section>

      <section>
        <h2 className="font-bold mb-2">Productos</h2>
        {(prods ?? []).map((p) => (
          <p key={p.id} className="border-b border-white/10 py-1">{p.id} · {p.n} · ${p.precio} · stock {p.stock} {p.activo ? "" : "· oculto"}</p>
        ))}
      </section>

      <section>
        <h2 className="font-bold mb-2">Órdenes recientes</h2>
        {(ords ?? []).map((o) => (
          <p key={o.id} className="border-b border-white/10 py-1">{o.status} · {o.product_id} x{o.qty} · ${(o.amount_cents / 100).toLocaleString("es-CO")} · {o.email}</p>
        ))}
      </section>

      <section>
        <h2 className="font-bold mb-2">Eventos y errores</h2>
        {(evs ?? []).map((e) => (
          <p key={e.id} className="border-b border-white/10 py-1 text-white/70">{e.nivel} · {e.msg} · {new Date(e.at).toLocaleString("es-CO")}</p>
        ))}
      </section>
    </main>
  );
}
