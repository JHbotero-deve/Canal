export type Prod = { id: string; cat: string; n: string; precio: number; vibe: string; tag?: string; emoji: string; link: string; giro?: number; stock?: number; foto?: string };

export const CATS: Record<string, { t: string; e: string; g: string }> = {
  amazon: { t: "Amazon", e: "📦", g: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  zapatos: { t: "Zapatos", e: "👟", g: "linear-gradient(135deg,#22d3ee,#6366f1)" },
  camisas: { t: "Camisas", e: "👕", g: "linear-gradient(135deg,#d946ef,#f43f5e)" },
  pijamas: { t: "Pijamas", e: "🌙", g: "linear-gradient(135deg,#8b5cf6,#0ea5e9)" },
};

export const PRODUCTOS: Prod[] = [
  { id: "a1", cat: "amazon", n: "Producto Amazon 1", precio: 0, vibe: "joven", tag: "Tendencia", emoji: "🎧", link: "#" },
  { id: "z1", cat: "zapatos", n: "Tenis urbanos", precio: 0, vibe: "joven", tag: "Nuevo", emoji: "👟", link: "#" },
  { id: "c1", cat: "camisas", n: "Camiseta oversize", precio: 0, vibe: "joven", tag: "Tendencia", emoji: "👕", link: "#" },
  { id: "p1", cat: "pijamas", n: "Pijama estampada", precio: 0, vibe: "joven", emoji: "🌙", link: "#" },
];
