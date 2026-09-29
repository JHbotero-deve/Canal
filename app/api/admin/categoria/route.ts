import { NextResponse } from "next/server";
import { esAdmin } from "../../../../lib/admin";
import { db } from "../../../../lib/supabase";
import { log } from "../../../../lib/log";

const RESERVADAS = ["admin", "api", "cuenta", "pago", "zona", "_next"];

export async function POST(req: Request) {
  if (!(await esAdmin())) return new NextResponse("No autorizado", { status: 401 });
  const f = await req.formData();
  const g = (k: string) => String(f.get(k) ?? "").trim();
  const slug = g("slug").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const volver = NextResponse.redirect(new URL("/admin/categorias", req.url), 303);
  if (!slug || !g("titulo") || RESERVADAS.includes(slug)) return volver;

  const { error } = await db().from("categorias").upsert({
    slug, titulo: g("titulo"), emoji: g("emoji") || "🛍️", gradiente: g("gradiente"),
    layout: ["cuadricula", "lista", "portada"].includes(g("layout")) ? g("layout") : "cuadricula",
    orden: Number(g("orden")) || 0, activa: f.get("activa") === "on",
  });
  if (error) await log("error", "admin categoria", { m: error.message });
  return volver;
}
