import { NextResponse } from "next/server";
import { db } from "../../../lib/supabase";
import { permitido } from "../../../lib/limite";

export async function GET(req: Request) {
  if (!(await permitido(req, "cuenta", 30, 60))) return NextResponse.json([], { status: 429 });
  const t = (req.headers.get("authorization") ?? "").replace("Bearer ", "");
  const { data: u } = await db().auth.getUser(t);
  const mail = u.user?.email?.toLowerCase();
  if (!mail) return NextResponse.json([], { status: 401 });
  const { data } = await db().from("orders").select("reference,product_id,qty,amount_cents,status,created_at").eq("email", mail).order("created_at", { ascending: false }).limit(50);
  return NextResponse.json(data ?? []);
}
