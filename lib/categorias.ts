import { db } from "./supabase";
import { CATS } from "./productos";

export type Cat = { t: string; e: string; g: string; layout: string };

export async function getCategorias(): Promise<Record<string, Cat>> {
  const { data } = await db().from("categorias").select("*").eq("activa", true).order("orden");
  if (!data?.length) return Object.fromEntries(Object.entries(CATS).map(([k, c]) => [k, { ...c, layout: "cuadricula" }]));
  return Object.fromEntries(data.map((r) => [r.slug, { t: r.titulo, e: r.emoji, g: r.gradiente, layout: r.layout }]));
}
