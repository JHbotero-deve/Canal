import { NextResponse } from "next/server";
import { tokenAdmin } from "../../../../lib/admin";
import { permitido } from "../../../../lib/limite";
import { log } from "../../../../lib/log";

export async function POST(req: Request) {
  if (!(await permitido(req, "admin", 5, 900))) return new NextResponse("Demasiados intentos", { status: 429 });
  const f = await req.formData();
  const ok = !!process.env.ADMIN_PASSWORD && String(f.get("clave") ?? "") === process.env.ADMIN_PASSWORD;
  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  if (ok) res.cookies.set("adm", tokenAdmin(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 28800, path: "/" });
  else await log("aviso", "login admin fallido");
  return res;
}
