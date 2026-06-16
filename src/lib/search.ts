import type { Values } from "./types";
import { tools, categories } from "./tools";

/** Satu entri hasil pencarian. Untuk alat ber-bentuk, tiap bentuk jadi entri tersendiri. */
export interface SearchEntry {
  toolId: string;
  cat: string;
  catLabel: string;
  /** Label tampil, mis. "Keliling — Persegi". */
  label: string;
  /** SVG ikon mentah. */
  icon: string;
  /** Nilai awal yang di-set saat dibuka (mis. bentuk terpilih). */
  seed?: Values;
  /** Teks gabungan (lowercase) yang dicocokkan. */
  haystack: string;
}

// Sinonim/aliasing bentuk geometri (Indonesia + Inggris umum).
const SHAPE_KW: Record<string, string> = {
  persegi: "square bujur sangkar",
  persegiPanjang: "rectangle empat persegi panjang",
  segitiga: "triangle",
  lingkaran: "circle bulat",
  jajar: "parallelogram jajaran genjang",
  trapesium: "trapezoid trapezium",
  belahKetupat: "rhombus diamond ketupat",
  layang: "kite layang-layang",
  kubus: "cube",
  balok: "cuboid box",
  tabung: "cylinder silinder",
  kerucut: "cone",
  bola: "sphere ball",
  prisma: "prism",
};

const catLabelOf = (id: string): string => categories.find((c) => c.id === id)?.label ?? "";

function build(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const t of tools) {
    const cl = catLabelOf(t.cat);
    const base = [t.label, cl, ...(t.keywords ?? [])];
    out.push({
      toolId: t.id,
      cat: t.cat,
      catLabel: cl,
      label: t.label,
      icon: t.icon,
      haystack: base.join(" ").toLowerCase(),
    });
    // Alat dengan pemilih bentuk → satu entri per bentuk (deep-link).
    const sf = t.fields({}).find((f) => f.type === "select" && f.picker && f.options);
    if (sf?.options) {
      for (const o of sf.options) {
        if (!o.value) continue;
        out.push({
          toolId: t.id,
          cat: t.cat,
          catLabel: cl,
          label: `${t.label} — ${o.label}`,
          icon: o.icon ?? t.icon,
          seed: { [sf.key]: o.value },
          haystack: [...base, o.label, SHAPE_KW[o.value] ?? ""].join(" ").toLowerCase(),
        });
      }
    }
  }
  return out;
}

const INDEX = build();

/** Cari alat; semua kata kunci (dipisah spasi) harus cocok. Hasil terurut relevansi. */
export function searchTools(q: string, limit = 24): SearchEntry[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const terms = query.split(/\s+/);
  const scored: { e: SearchEntry; s: number }[] = [];
  for (const e of INDEX) {
    let match = true;
    let s = 0;
    for (const term of terms) {
      const i = e.haystack.indexOf(term);
      if (i === -1) {
        match = false;
        break;
      }
      s += i === 0 ? 3 : 1;
    }
    if (!match) continue;
    if (e.label.toLowerCase().startsWith(query)) s += 6; // cocok dari awal label = paling relevan
    if (!e.seed) s += 1; // sedikit utamakan entri dasar di atas varian bentuk
    scored.push({ e, s });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((x) => x.e);
}
