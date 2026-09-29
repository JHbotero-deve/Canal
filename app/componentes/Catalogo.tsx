"use client";
import { useState } from "react";
import type { Prod } from "../../lib/productos";
import Spin from "./Spin";
import Comprar from "./Comprar";

export default function Catalogo({ items, g, layout = "cuadricula" }: { items: Prod[]; g: string; layout?: string }) {
  const [q, setQ] = useState("");
  const [v, setV] = useState("todos");
  const [sel, setSel] = useState<Prod | null>(null);
  const vibes = Array.from(new Set(items.map((p) => p.vibe)));
  const lista = items.filter((p) => (v === "todos" || p.vibe === v) && p.n.toLowerCase().includes(q.toLowerCase()));
  const fila = layout === "lista";
  const cols = layout === "cuadricula" ? "grid-cols-2" : "grid-cols-1";
  const alto = layout === "portada" ? "h-56" : fila ? "h-24 w-24 shrink-0" : "h-32";
  const precio = (p: Prod) => (p.precio ? "$" + p.precio.toLocaleString("es-CO") : "Consultar");
  const img = (p: Prod) =>
    p.giro ? <img src={`/360/${p.id}/1.jpg`} alt={p.n} className="h-full w-full object-cover" />
    : p.foto ? <img src={p.foto} alt={p.n} className="h-full w-full object-cover" />
    : p.emoji;

  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="w-full mt-4 rounded-2xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/40" />
      {vibes.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {["todos", ...vibes].map((x) => (
            <button key={x} onClick={() => setV(x)} className={"px-4 py-1.5 rounded-full text-sm border capitalize shrink-0 " + (v === x ? "border-fuchsia-400 bg-fuchsia-500/20" : "border-white/10 text-white/60")}>{x}</button>
          ))}
        </div>
      )}
      <div className={"grid gap-3 mt-4 " + cols}>
        {lista.map((p) => (
          <div key={p.id} onClick={() => setSel(p)} className={"rounded-3xl bg-white/5 border border-white/10 overflow-hidden active:scale-95 transition cursor-pointer " + (fila ? "flex" : "")}>
            <div className={alto + " flex items-center justify-center text-6xl relative overflow-hidden"} style={{ background: g }}>
              {img(p)}
              {p.tag && <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 rounded-full px-2 py-0.5">{p.tag}</span>}
              {p.giro ? <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/60 rounded-full px-2 py-0.5">360°</span> : null}
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold leading-tight">{p.n}</p>
              <p className="text-cyan-300 text-sm mt-1">{precio(p)}</p>
              {p.cat !== "amazon" && p.precio > 0 && p.stock === 0 && <p className="text-red-400 text-xs mt-1">Agotado</p>}
            </div>
          </div>
        ))}
      </div>
      {lista.length === 0 && <p className="text-white/40 text-sm mt-6 text-center">Nada por aquí todavía.</p>}

      {sel && (
        <div className="fixed inset-0 z-20 bg-black/95 p-4 overflow-y-auto">
          <div className="max-w-md mx-auto pb-10">
            <button onClick={() => setSel(null)} className="text-2xl mb-2">✕</button>
            {sel.giro ? <Spin id={sel.id} frames={sel.giro} nombre={sel.n} />
              : sel.foto ? <img src={sel.foto} alt={sel.n} className="w-full rounded-3xl" />
              : <div className="h-64 rounded-3xl flex items-center justify-center text-8xl" style={{ background: g }}>{sel.emoji}</div>}
            <h2 className="text-2xl font-black mt-4">{sel.n}</h2>
            <p className="text-cyan-300 mt-1">{precio(sel)}</p>
            <Comprar p={sel} />
          </div>
        </div>
      )}
    </>
  );
}
