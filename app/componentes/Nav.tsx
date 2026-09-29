import Link from "next/link";
import { getCategorias } from "../../lib/categorias";

export default async function Nav() {
  const CATS = await getCategorias();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-10 bg-black/80 backdrop-blur border-t border-white/10">
      <div className="max-w-md mx-auto flex justify-around gap-4 px-3 py-2 text-xs overflow-x-auto">
        <Link href="/" className="flex flex-col items-center text-white/80 shrink-0"><span className="text-lg">🏠</span>Inicio</Link>
        {Object.entries(CATS).map(([k, c]) => (
          <Link key={k} href={"/" + k} className="flex flex-col items-center text-white/80 shrink-0"><span className="text-lg">{c.e}</span>{c.t}</Link>
        ))}
      </div>
    </nav>
  );
}
