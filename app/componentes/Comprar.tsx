"use client";
import { useState } from "react";
import type { Prod } from "../../lib/productos";

export default function Comprar({ p }: { p: Prod }) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [qty, setQty] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [err, setErr] = useState("");

  if (p.cat === "amazon")
    return <a href={p.link} target="_blank" rel="noopener noreferrer sponsored" className="block mt-4 text-center font-bold rounded-2xl py-3 bg-white text-black">Ver en Amazon</a>;
  if (!p.precio) return <p className="mt-4 text-white/50 text-sm">Precio por confirmar.</p>;

  const pagar = async () => {
    setErr(""); setCargando(true);
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, qty, email, nombre }) });
      const j = await r.json();
      if (j.url) window.location.href = j.url;
      else { setErr(j.error || "Error al iniciar el pago"); setCargando(false); }
    } catch { setErr("Sin conexión"); setCargando(false); }
  };

  const inp = "w-full rounded-2xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 mt-2";
  return (
    <div className="mt-4">
      <input className={inp} placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input className={inp} placeholder="Tu correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="flex items-center gap-4 mt-3">
        <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full bg-white/10 text-xl">−</button>
        <span className="text-xl font-bold">{qty}</span>
        <button onClick={() => setQty(Math.min(10, qty + 1))} className="w-10 h-10 rounded-full bg-white/10 text-xl">+</button>
        <span className="ml-auto text-cyan-300 font-bold">${(p.precio * qty).toLocaleString("es-CO")}</span>
      </div>
      {err && <p className="text-red-400 text-sm mt-2">{err}</p>}
      <button onClick={pagar} disabled={cargando} className="w-full mt-4 rounded-2xl py-3 font-bold text-black disabled:opacity-50" style={{ background: "linear-gradient(90deg,#22d3ee,#d946ef)" }}>
        {cargando ? "Abriendo Wompi..." : "Pagar con Wompi"}
      </button>
      <p className="text-center text-[11px] text-white/40 mt-2">Pago seguro procesado por Wompi (Bancolombia).</p>
    </div>
  );
}
