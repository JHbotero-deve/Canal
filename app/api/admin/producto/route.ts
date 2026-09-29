import { NextResponse } from "next/server";
import { esAdmin } from "../../../../lib/admin";
import { db } from "../../../../lib/supabase";
import { log } from "../../../../lib/log";

export async function POST(req: Request) {
  if (!(await esAdmin())) return new NextResponse("No autorizado", { status: 401 });
  const f = await req.formData();
  const g = (k: string) => String(f.get(k) ?? "").trim();
  const id = g("id").toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const volver = NextResponse.redirect(new URL("/admin", req.url), 303);
  if (!id || !g("n")) return volver;

  const rec: Record<string, unknown> = {
    id, cat: g("cat"), n: g("n"), precio: Number(g("precio")) || 0, stock: Number(g("stock")) || 0,
    vibe: g("vibe") || "joven", tag: g("tag") || null, emoji: g("emoji") || "🛍️", link: g("link") || "#",
    giro: Number(g("giro")) || null, activo: f.get("activo") === "on",
  };
  const file = f.get("foto");
  if (file instanceof File && file.size > 0 && file.size < 4e6) {
    const path = id + "-" + Date.now();
    const up = await db().storage.from("productos").upload(path, file, { contentType: file.type });
    if (!up.error) rec.foto = db().storage.from("productos").getPublicUrl(path).data.publicUrl;
    else await log("error", "subida foto", { m: up.error.message });
  }
  const { error } = await db().from("products").upsert(rec);
  if (error) await log("error", "admin producto", { m: error.message });
  return volver;
}
