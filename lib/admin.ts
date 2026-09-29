import { cookies } from "next/headers";
import { createHash } from "crypto";

export const tokenAdmin = () => createHash("sha256").update("adm:" + process.env.ADMIN_PASSWORD).digest("hex");
export async function esAdmin() {
  return !!process.env.ADMIN_PASSWORD && (await cookies()).get("adm")?.value === tokenAdmin();
}
