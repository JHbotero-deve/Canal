import Link from "next/link";

const MSG: Record<string, [string, string]> = {
  APPROVED: ["✅", "¡Pago aprobado! Te escribiremos al correo con los detalles."],
  PENDING: ["⏳", "Tu pago está en proceso. Te avisaremos al correo."],
  DECLINED: ["❌", "El pago fue rechazado. Puedes intentarlo de nuevo."],
  ERROR: ["⚠️", "Hubo un error con el pago. Inténtalo de nuevo."],
  VOIDED: ["↩️", "El pago fue anulado."],
};

export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  let st = "PENDING";
  if (id) {
    try {
      const r = await fetch("https://production.wompi.co/v1/transactions/" + encodeURIComponent(id), { cache: "no-store" });
      st = (await r.json()).data?.status ?? st;
    } catch {}
  }
  const [e, m] = MSG[st] ?? MSG.PENDING;
  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-md mx-auto flex flex-col justify-center text-center">
      <p className="text-6xl">{e}</p>
      <p className="mt-4 text-lg">{m}</p>
      <Link href="/" className="mt-8 rounded-2xl py-3 bg-white text-black font-bold">Volver a la tienda</Link>
    </main>
  );
}
