import { createHash, timingSafeEqual } from "crypto";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export type Tx = { id: string; status: string; reference: string; amount_in_cents: number };
export type Evento = {
  event: string;
  data: { transaction: Tx };
  signature: { checksum: string; properties: string[] };
  timestamp: number;
};

export const firmaIntegridad = (ref: string, cents: number) =>
  sha(`${ref}${cents}COP${process.env.WOMPI_INTEGRITY_SECRET}`);

export function eventoValido(b: Evento): boolean {
  try {
    const vals = b.signature.properties.map((p) =>
      String(p.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], b.data))
    );
    const mio = Buffer.from(sha(vals.join("") + b.timestamp + process.env.WOMPI_EVENTS_SECRET), "hex");
    const suyo = Buffer.from(b.signature.checksum, "hex");
    return mio.length === suyo.length && timingSafeEqual(mio, suyo);
  } catch {
    return false;
  }
}
