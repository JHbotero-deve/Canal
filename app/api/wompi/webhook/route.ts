import { NextResponse } from "next/server";
import { db } from "../../../../lib/supabase";
import { eventoValido, type Evento } from "../../../../lib/wompi";
import { correo, esc } from "../../../../lib/correo";
import { log } from "../../../../lib/log";

const MAPA: Record<string, string> = { APPROVED: "pagado", DECLINED: "fallido", ERROR: "fallido", VOIDED: "anulado" };

export async function POST(req: Request) {
  const body = (await req.json()) as Evento;
  if (!eventoValido(body)) { await log("aviso", "webhook firma invalida"); return NextResponse.json({ ok: false }, { status: 401 }); }

  if (body.event === "transaction.updated") {
    const t = body.data.transaction;
    const st = MAPA[t.status];
    if (st) {
      const { data: o } = await db().from("orders").select("*").eq("reference", t.reference).single();
      if (!o) await log("error", "webhook orden inexistente", { ref: t.reference });
      else if (Number(o.amount_cents) !== t.amount_in_cents) await log("error", "webhook monto no coincide", { ref: t.reference });
      else if (!(o.status === "pagado" && st === "fallido")) {
        await db().from("orders").update({ status: st, wompi_tx: t.id, paid_at: st === "pagado" ? new Date().toISOString() : null }).eq("reference", t.reference);
        if (st === "pagado" && o.status !== "pagado") {
          await db().rpc("descontar_stock", { pid: o.product_id, n: o.qty });
          const total = "$" + (o.amount_cents / 100).toLocaleString("es-CO");
          const det = `<p>Producto: ${esc(o.product_id)} x${o.qty}<br>Total: ${total}<br>Cliente: ${esc(o.name ?? "")} (${esc(o.email)})<br>Ref: ${esc(o.reference)}</p>`;
          await correo(process.env.SELLER_EMAIL!, "💰 Nueva venta " + total, "<h2>Pago aprobado</h2>" + det);
          await correo(o.email, "Recibimos tu pago ✅", "<h2>¡Gracias por tu compra!</h2>" + det + "<p>Te contactaremos para la entrega.</p>");
        }
      }
    }
  }
  return NextResponse.json({ ok: true });
}
