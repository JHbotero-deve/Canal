import { db } from "./supabase";

export const log = async (nivel: string, msg: string, meta: object = {}) => {
  console.error(nivel, msg, meta);
  try { await db().from("eventos").insert({ nivel, msg, meta }); } catch {}
};
