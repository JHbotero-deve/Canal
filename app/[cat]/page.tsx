import { notFound } from "next/navigation";
import Catalogo from "../componentes/Catalogo";
import Nav from "../componentes/Nav";
import { getCategorias } from "../../lib/categorias";
import { getProductos } from "../../lib/catalogo";

export const revalidate = 30;

export default async function Page({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const CATS = await getCategorias();
  const c = CATS[cat];
  if (!c) notFound();
  const items = await getProductos(cat);
  return (
    <main className="min-h-screen bg-black text-white p-4 pb-24 max-w-md mx-auto" style={{ background: "radial-gradient(circle at 80% 0%, #3b0764 0%, #000 55%)" }}>
      <h1 className="text-3xl font-black">{c.e} {c.t}</h1>
      <Catalogo items={items} g={c.g} layout={c.layout} />
      <Nav />
    </main>
  );
}
