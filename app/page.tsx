import Link from "next/link";
import Nav from "./componentes/Nav";
import { getCategorias } from "../lib/categorias";
import { getProductos } from "../lib/catalogo";

export const revalidate = 30;

export default async function Home() {
  const CATS = await getCategorias();
  const top = (await getProductos()).filter((p) => p.tag);
  return (
    <main className="min-h-screen bg-black text-white p-4 pb-24 max-w-md mx-auto" style={{ background: "radial-gradient(circle at 20% 0%, #3b0764 0%, #000 55%)" }}>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs tracking-widest text-fuchsia-300">TU ESTILO, TU RITMO</p>
        <Link href="/cuenta" className="text-sm">👤 Mi cuenta</Link>
      </div>
      <h1 className="text-4xl font-black leading-tight mt-1">Lo que te mueve,<br />en un solo lugar.</h1>
      <p className="text-white/60 mt-2 text-sm">Zapatos, camisas, pijamas y lo mejor de Amazon. Para todos los gustos.</p>
      <div className="grid grid-cols-2 gap-3 mt-6">
        {Object.entries(CATS).map(([k, c]) => (
          <Link key={k} href={"/" + k} className="rounded-3xl h-28 p-4 flex flex-col justify-between active:scale-95 transition" style={{ background: c.g }}>
            <span className="text-3xl">{c.e}</span><span className="font-black">{c.t}</span>
          </Link>
        ))}
      </div>
      <h2 className="font-bold mt-8">🔥 Tendencia</h2>
      <div className="flex gap-3 overflow-x-auto mt-3 pb-2">
        {top.map((p) => (
          <Link key={p.id} href={"/" + p.cat} className="min-w-36 rounded-3xl bg-white/5 border border-white/10 p-3">
            <div className="text-5xl text-center">{p.emoji}</div>
            <p className="text-sm font-semibold mt-2">{p.n}</p>
          </Link>
        ))}
      </div>
      <Nav />
    </main>
  );
}
