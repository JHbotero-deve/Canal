"use client";
import { useEffect, useRef, useState } from "react";

type S = Record<string, number>;
const KEYS = ["Enfoque", "Dinero", "Mente", "Creatividad", "Cuerpo"];
const A = [
  { id: "gaming", n: "Gaming", e: "🎮", s: [3, 0, 2, 2, 0], q: ["Juega 1 partida y analiza tu peor error", "Copia 1 táctica de un clip de un pro"] },
  { id: "inv", n: "Inversión", e: "📈", s: [2, 3, 2, 0, 0], q: ["Estudia 1 gráfico 10 min (sin comprar)", "Anota 1 idea de inversión y por qué"] },
  { id: "code", n: "Código", e: "💻", s: [2, 2, 3, 2, 0], q: ["Resuelve 1 reto pequeño de programación", "Cambia 1 detalle de tu app y pruébalo"] },
  { id: "dis", n: "Diseño", e: "🎨", s: [1, 1, 1, 3, 0], q: ["Rediseña 1 pantalla que uses a diario", "Guarda 3 referencias visuales y di qué te gusta"] },
  { id: "lec", n: "Lectura", e: "📚", s: [2, 0, 3, 1, 0], q: ["Lee 10 páginas y resume en 1 frase", "Escribe 1 idea que te cambió la forma de pensar"] },
  { id: "idi", n: "Idiomas", e: "🌎", s: [1, 1, 3, 1, 0], q: ["Aprende 5 palabras y úsalas en frases", "Mira 5 min de un video en otro idioma"] },
  { id: "fit", n: "Fitness", e: "💪", s: [1, 0, 1, 0, 3], q: ["Haz 10 min de ejercicio sin celular", "Estira 5 min y toma agua"] },
  { id: "neg", n: "Emprender", e: "🚀", s: [2, 3, 1, 2, 0], q: ["Encuentra 1 problema que la gente pagaría por resolver", "Escribe 1 oferta en 2 líneas"] },
];
const KEY = "zona-v1";
type St = { sel: string[]; xp: number; done: string[]; day: string; last: string; streak: number };
const today = () => new Date().toDateString();
const init: St = { sel: [], xp: 0, done: [], day: today(), last: "", streak: 0 };

export default function Zona() {
  const [st, setSt] = useState<St>(init);
  const [ok, setOk] = useState(false);
  const [mins, setMins] = useState(25);
  const [left, setLeft] = useState(0);
  const [run, setRun] = useState(false);
  const minsRef = useRef(25);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s: St = JSON.parse(raw);
        setSt(s.day === today() ? s : { ...s, done: [], day: today() });
      }
    } catch {}
    setOk(true);
  }, []);
  useEffect(() => {
    if (ok) try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {}
  }, [st, ok]);

  const mark = (s: St, add: number): St => {
    let streak = s.streak;
    if (s.last !== today()) {
      streak = s.last === new Date(Date.now() - 864e5).toDateString() ? s.streak + 1 : 1;
    }
    return { ...s, xp: s.xp + add, streak, last: today() };
  };

  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(t);
          setRun(false);
          setSt((s) => mark(s, minsRef.current * 2));
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [run]);

  const chosen = A.filter((a) => st.sel.includes(a.id));
  const stats: S = {};
  KEYS.forEach((k, i) => (stats[k] = chosen.reduce((t, a) => t + a.s[i], 0)));
  const quests = chosen.flatMap((a) => a.q.map((q) => ({ id: a.id + q, q, e: a.e })));
  const lvl = Math.floor(st.xp / 100) + 1;
  const pct = st.xp % 100;
  const name = chosen.length ? chosen.map((a) => a.n).join(" × ") : "Elige tu combo";

  const toggle = (id: string) =>
    setSt((s) => ({
      ...s,
      sel: s.sel.includes(id) ? s.sel.filter((x) => x !== id) : s.sel.length < 3 ? [...s.sel, id] : s.sel,
    }));
  const finish = (id: string) =>
    setSt((s) => (s.done.includes(id) ? s : { ...mark(s, 20), done: [...s.done, id] }));
  const start = () => { minsRef.current = mins; setLeft(mins * 60); setRun(true); };
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-16 max-w-md mx-auto" style={{ background: "radial-gradient(circle at 20% 0%, #3b0764 0%, #000 55%)" }}>
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest text-fuchsia-300">ZONA</p>
          <h1 className="text-2xl font-black">Nivel {lvl}</h1>
        </div>
        <div className="text-right text-sm">🔥 {st.streak} días<br /><span className="text-cyan-300">{st.xp} XP</span></div>
      </header>
      <div className="h-2 rounded-full bg-white/10 mt-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: pct + "%", background: "linear-gradient(90deg,#22d3ee,#d946ef)" }} />
      </div>

      <h2 className="mt-6 font-bold">1. Tus activos <span className="text-white/50 text-sm">(máx. 3)</span></h2>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {A.map((a) => {
          const on = st.sel.includes(a.id);
          return (
            <button key={a.id} onClick={() => toggle(a.id)} className={"rounded-2xl p-3 text-left border transition active:scale-95 " + (on ? "border-fuchsia-400 bg-fuchsia-500/20 shadow-[0_0_20px_#d946ef55]" : "border-white/10 bg-white/5")}>
              <span className="text-2xl">{a.e}</span>
              <p className="font-semibold text-sm mt-1">{a.n}</p>
            </button>
          );
        })}
      </div>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-cyan-300">TU COMBO</p>
        <h3 className="text-xl font-black">{name}</h3>
        <div className="mt-3 space-y-2">
          {KEYS.map((k) => (
            <div key={k} className="flex items-center gap-2 text-xs">
              <span className="w-20 text-white/70">{k}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: Math.min(100, stats[k] * 20) + "%", background: "linear-gradient(90deg,#22d3ee,#d946ef)" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <h2 className="mt-6 font-bold">2. Misiones de hoy</h2>
      <div className="space-y-2 mt-2">
        {quests.length === 0 && <p className="text-white/40 text-sm">Elige activos para desbloquear misiones.</p>}
        {quests.map((x) => {
          const d = st.done.includes(x.id);
          return (
            <button key={x.id} onClick={() => finish(x.id)} className={"w-full flex gap-3 items-center rounded-2xl p-3 text-left border active:scale-95 transition " + (d ? "border-emerald-400/50 bg-emerald-500/10 opacity-60" : "border-white/10 bg-white/5")}>
              <span className="text-xl">{d ? "✅" : x.e}</span>
              <span className="text-sm flex-1">{x.q}</span>
              <span className="text-xs text-cyan-300">+20</span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-6 font-bold">3. Sprint de enfoque</h2>
      <section className="mt-2 rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
        <p className="text-5xl font-black tabular-nums">{run ? `${mm}:${ss}` : `${mins}:00`}</p>
        {!run && (
          <div className="flex justify-center gap-2 mt-3">
            {[15, 25, 45].map((m) => (
              <button key={m} onClick={() => setMins(m)} className={"px-3 py-1 rounded-full text-sm border " + (mins === m ? "border-cyan-400 text-cyan-300" : "border-white/10 text-white/60")}>{m} min</button>
            ))}
          </div>
        )}
        <button onClick={run ? () => { setRun(false); setLeft(0); } : start} className="mt-4 w-full rounded-2xl py-3 font-bold active:scale-95 transition" style={{ background: run ? "#3f3f46" : "linear-gradient(90deg,#22d3ee,#d946ef)" }}>
          {run ? "Abandonar" : `Empezar (+${mins * 2} XP)`}
        </button>
        <p className="text-xs text-white/40 mt-2">Sin celular, sin excusas. Terminar completo da el XP.</p>
      </section>
    </main>
  );
}
