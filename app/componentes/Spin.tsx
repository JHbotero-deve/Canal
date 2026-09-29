"use client";
import { useEffect, useRef, useState } from "react";

export default function Spin({ id, frames, nombre }: { id: string; frames: number; nombre: string }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const d = useRef<{ x: number; i: number } | null>(null);

  useEffect(() => {
    for (let k = 1; k <= frames; k++) { const im = new Image(); im.src = `/360/${id}/${k}.jpg`; }
  }, [id, frames]);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setI((v) => (v + 1) % frames), 110);
    return () => clearInterval(t);
  }, [auto, frames]);

  return (
    <div
      className="select-none touch-none"
      onPointerDown={(e) => { setAuto(false); d.current = { x: e.clientX, i }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => {
        if (!d.current) return;
        const paso = Math.round((e.clientX - d.current.x) / 8);
        setI((((d.current.i - paso) % frames) + frames) % frames);
      }}
      onPointerUp={() => (d.current = null)}
      onPointerCancel={() => (d.current = null)}
    >
      <img src={`/360/${id}/${i + 1}.jpg`} alt={nombre} draggable={false} className="w-full rounded-3xl pointer-events-none" />
      <p className="text-center text-xs text-white/50 mt-2">↔ Arrastra para girarlo</p>
    </div>
  );
}
