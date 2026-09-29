import { db } from "./supabase";
import type { Prod } from "./productos";

export async function getProductos(cat?: string): Promise<Prod[]> {
  let q = db().from("products").select("*").eq("activo", true).order("id");
  if (cat) q = q.eq("cat", cat);
  const { data } = await q;
  return (data ?? []).map((r) => ({
    id: r.id, cat: r.cat, n: r.n, precio: r.precio, vibe: r.vibe, tag: r.tag ?? undefined,
    emoji: r.emoji, link: r.link, giro: r.giro ?? undefined, stock: r.stock, foto: r.foto ?? undefined,
  }));
}
