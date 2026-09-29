import { redirect } from "next/navigation";
import { esAdmin } from "../../../lib/admin";
import { db } from "../../../lib/supabase";

export const dynamic = "force-dynamic";
const inp = "rounded-xl bg-white/10 p-2 text-sm w-full";

export default async function Page() {
  if (!(await esAdmin())) redirect("/admin");
  const { data } = await db().from("categorias").select("*").order("orden");
  return (
    <main className="min-h-screen bg-black text-white p-4 max-w-2xl mx-auto space-y-6 text-sm">
      <a href="/admin" className="underline text-cyan-300">← Panel</a>
      <h1 className="text-2xl font-black">Categorías y presentación</h1>
      <form method="post" action="/api/admin/categoria" className="grid grid-cols-2 gap-2">
        <input name="slug" placeholder="Ruta (ej. gorras → /gorras)" className={inp} required />
        <input name="titulo" placeholder="Título" className={inp} required />
        <input name="emoji" placeholder="Emoji" className={inp} />
        <input name="orden" type="number" placeholder="Orden (1, 2, 3…)" className={inp} />
        <select name="layout" className={inp}>
          <option value="cuadricula">Cuadrícula (2 columnas)</option>
          <option value="lista">Lista (filas)</option>
          <option value="portada">Portada (tarjetas grandes)</option>
        </select>
        <select name="gradiente" className={inp}>
          <option value="linear-gradient(135deg,#22d3ee,#6366f1)">Azul</option>
          <option value="linear-gradient(135deg,#d946ef,#f43f5e)">Rosa</option>
          <option value="linear-gradient(135deg,#f59e0b,#ef4444)">Naranja</option>
          <option value="linear-gradient(135deg,#8b5cf6,#0ea5e9)">Morado</option>
          <option value="linear-gradient(135deg,#10b981,#22d3ee)">Verde</option>
        </select>
        <label className="col-span-2"><input type="checkbox" name="activa" defaultChecked /> Visible en la tienda</label>
        <button className="col-span-2 rounded-xl bg-white text-black p-3 font-bold">Guardar categoría</button>
      </form>
      <p className="text-white/40">Usa una ruta existente para editarla. Para ocultarla, desmarca «Visible».</p>
      {(data ?? []).map((c) => (
        <p key={c.slug} className="border-b border-white/10 py-1">{c.emoji} /{c.slug} · {c.titulo} · {c.layout} · orden {c.orden} {c.activa ? "" : "· oculta"}</p>
      ))}
    </main>
  );
}
