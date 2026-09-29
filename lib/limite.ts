import { db } from "./supabase";

export async function permitido(req: Request, clave: string, lim: number, seg: number) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const { data } = await db().rpc("limitar", { kk: clave + ":" + ip, lim, seg });
  return data !== false;
}
