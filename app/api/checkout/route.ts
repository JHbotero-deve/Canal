import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "../../../lib/supabase";
import { firmaIntegridad } from "../../../lib/wompi";
import { permitido } from "../../../lib/limite";
import { log } from "../../../lib/log";

export async function POST(req: Request) {
  if (!(await permitido(req, "checkout", 10, 60))) return NextResponse.json({ error: "Demasiados intentos, espera un minuto" }, { status: 429 });
  const { id, qty, email, nombre } = await req.json();
  const n = Math.min(10, Math.max(1, Number(qty) || 1));
  const mail = String(email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(mail)) return NextResponse.json({ error: "Correo inválido" }, { status: 400 });

  const { data: p } = await db().from("products").select("*").eq("id", String(id)).eq("activo", true).single();
  if (!p || p.cat === "amazon" || !p.precio) return NextResponse.json({ error: "Producto no disponible" }, { status: 400 });
  if (p.stock < n) return NextResponse.json({ error: "Sin stock suficiente" }, { status: 409 });

  const cents = p.precio * 100 * n;
  const ref = "ORD-" + randomUUID();
  const { error } = await db().from("orders").insert({
    reference: ref, product_id: p.id, qty: n, amount_cents: cents, email: mail, name: String(nombre ?? "").slice(0, 80), status: "pendiente",
  });
  if (error) { await log("error", "checkout insert", { m: error.message }); return NextResponse.json({ error: "No se pudo crear la orden" }, { status: 500 }); }

  const q = new URLSearchParams({
    "public-key": process.env.WOMPI_PUBLIC_KEY!, currency: "COP", "amount-in-cents": String(cents), reference: ref,
    "signature:integrity": firmaIntegridad(ref, cents), "redirect-url": process.env.NEXT_PUBLIC_SITE_URL + "/pago/resultado",
    "customer-data:email": mail, "customer-data:full-name": String(nombre ?? ""),
  });
  return NextResponse.json({ url: "https://checkout.wompi.co/p/?" + q.toString() });
}
