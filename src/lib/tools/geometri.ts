import type { Tool, Field, Option, Values } from "../types";
import { num, fmt, ok, no } from "../format";
import iVolume from "../../../svg/rotate-3d.svg?raw";
import iLuasRuang from "../../../svg/cuboid.svg?raw";
import iKeliling from "../../../svg/rotate-ccw.svg?raw";
import iLuasDatar from "../../../svg/shapes.svg?raw";
import iPythagoras from "../../../svg/triangle-right.svg?raw";
import iJarak2 from "../../../svg/route.svg?raw";
import iDiagonal from "../../../svg/diameter.svg?raw";
import iJuring from "../../../svg/chart-pie.svg?raw";
import iGradien from "../../../svg/chart-line.svg?raw";
// Ikon bentuk untuk picker
import sCube from "../../../svg/box.svg?raw";
import sCuboid from "../../../svg/cuboid.svg?raw";
import sCylinder from "../../../svg/cylinder.svg?raw";
import sCone from "../../../svg/cone.svg?raw";
import sBall from "../../../svg/ball.svg?raw";
import sPyramid from "../../../svg/pyramid.svg?raw";
import sSquare from "../../../svg/square.svg?raw";
import sRect from "../../../svg/rectangle-horizontal.svg?raw";
import sTriangle from "../../../svg/triangle.svg?raw";
import sCircle from "../../../svg/circle.svg?raw";
import sDiamond from "../../../svg/diamond.svg?raw";
import sGenjang from "../../../svg/genjang.svg?raw";
import sTrapesium from "../../../svg/trapesium.svg?raw";
import sLayang from "../../../svg/layang2.svg?raw";

const PI = Math.PI;
const opt = (value: string, label: string, icon?: string): Option => ({ value, label, icon });
const f = (key: string, label: string): Field => ({ key, label, type: "number", placeholder: label });
const shapeField = (options: Option[]): Field => ({ key: "shape", label: "Bangun", type: "select", options, picker: true });

const ruangShapes: Option[] = [
  opt("kubus", "Kubus", sCube),
  opt("balok", "Balok", sCuboid),
  opt("tabung", "Tabung", sCylinder),
  opt("kerucut", "Kerucut", sCone),
  opt("bola", "Bola", sBall),
  opt("prisma", "Prisma", sPyramid),
];

const datarShapes: Option[] = [
  opt("persegi", "Persegi", sSquare),
  opt("persegiPanjang", "Persg. Panjang", sRect),
  opt("segitiga", "Segitiga", sTriangle),
  opt("lingkaran", "Lingkaran", sCircle),
  opt("jajar", "Jajar Genjang", sGenjang),
  opt("trapesium", "Trapesium", sTrapesium),
  opt("belahKetupat", "Belah Ketupat", sDiamond),
  opt("layang", "Layang", sLayang),
];

const pilihBangun = (v: Values) => no(v.shape ? "Lengkapi input" : "Pilih bangun");

const volume: Tool = {
  id: "volume",
  cat: "geo",
  label: "Volume",
  icon: iVolume,
  fields: (v) => {
    const base = [shapeField(ruangShapes)];
    switch (v.shape) {
      case "kubus": return [...base, f("sisi", "Sisi")];
      case "balok": return [...base, f("p", "Panjang"), f("l", "Lebar"), f("t", "Tinggi")];
      case "tabung": return [...base, f("r", "Jari-jari"), f("t", "Tinggi")];
      case "kerucut": return [...base, f("r", "Jari-jari"), f("t", "Tinggi")];
      case "bola": return [...base, f("r", "Jari-jari")];
      case "prisma": return [...base, f("a", "Alas Segitiga"), f("ts", "Tinggi Segitiga"), f("tp", "Tinggi Prisma")];
      default: return base;
    }
  },
  compute: (v) => {
    let V: number | null = null;
    switch (v.shape) {
      case "kubus": { const a = num(v, "sisi"); if (a !== null) V = a ** 3; break; }
      case "balok": { const p = num(v, "p"), l = num(v, "l"), t = num(v, "t"); if (p !== null && l !== null && t !== null) V = p * l * t; break; }
      case "tabung": { const r = num(v, "r"), t = num(v, "t"); if (r !== null && t !== null) V = PI * r * r * t; break; }
      case "kerucut": { const r = num(v, "r"), t = num(v, "t"); if (r !== null && t !== null) V = (1 / 3) * PI * r * r * t; break; }
      case "bola": { const r = num(v, "r"); if (r !== null) V = (4 / 3) * PI * r ** 3; break; }
      case "prisma": { const a = num(v, "a"), ts = num(v, "ts"), tp = num(v, "tp"); if (a !== null && ts !== null && tp !== null) V = 0.5 * a * ts * tp; break; }
    }
    return V === null ? pilihBangun(v) : ok(fmt(V, 2), "Volume (satuan³)");
  },
};

const luasRuang: Tool = {
  id: "luasRuang",
  cat: "geo",
  label: "Luas Permukaan",
  icon: iLuasRuang,
  fields: (v) => {
    const base = [shapeField(ruangShapes)];
    switch (v.shape) {
      case "kubus": return [...base, f("sisi", "Sisi")];
      case "balok": return [...base, f("p", "Panjang"), f("l", "Lebar"), f("t", "Tinggi")];
      case "tabung": return [...base, f("r", "Jari-jari"), f("t", "Tinggi")];
      case "kerucut": return [...base, f("r", "Jari-jari"), f("s", "Garis Pelukis")];
      case "bola": return [...base, f("r", "Jari-jari")];
      case "prisma": return [...base, f("a", "Alas Segitiga"), f("ts", "Tinggi Segitiga"), f("tp", "Tinggi Prisma")];
      default: return base;
    }
  },
  compute: (v) => {
    let L: number | null = null;
    switch (v.shape) {
      case "kubus": { const a = num(v, "sisi"); if (a !== null) L = 6 * a * a; break; }
      case "balok": { const p = num(v, "p"), l = num(v, "l"), t = num(v, "t"); if (p !== null && l !== null && t !== null) L = 2 * (p * l + p * t + l * t); break; }
      case "tabung": { const r = num(v, "r"), t = num(v, "t"); if (r !== null && t !== null) L = 2 * PI * r * (r + t); break; }
      case "kerucut": { const r = num(v, "r"), s = num(v, "s"); if (r !== null && s !== null) L = PI * r * (r + s); break; }
      case "bola": { const r = num(v, "r"); if (r !== null) L = 4 * PI * r * r; break; }
      case "prisma": { const a = num(v, "a"), ts = num(v, "ts"), tp = num(v, "tp"); if (a !== null && ts !== null && tp !== null) { const alas = 0.5 * a * ts; const kel = a + ts + Math.sqrt(a * a + ts * ts); L = 2 * alas + kel * tp; } break; }
    }
    return L === null ? pilihBangun(v) : ok(fmt(L, 2), "Luas permukaan (satuan²)");
  },
};

const keliling: Tool = {
  id: "keliling",
  cat: "geo",
  label: "Keliling",
  icon: iKeliling,
  fields: (v) => {
    const base = [shapeField(datarShapes)];
    switch (v.shape) {
      case "persegi": return [...base, f("sisi", "Sisi")];
      case "persegiPanjang": return [...base, f("p", "Panjang"), f("l", "Lebar")];
      case "segitiga": return [...base, f("a", "Sisi a"), f("b", "Sisi b"), f("c", "Sisi c")];
      case "lingkaran": return [...base, f("r", "Jari-jari")];
      case "jajar": return [...base, f("a", "Alas"), f("b", "Sisi Miring")];
      case "trapesium": return [...base, f("a", "Sisi a"), f("b", "Sisi b"), f("c", "Sisi c"), f("d", "Sisi d")];
      case "belahKetupat":
      case "layang": return [...base, f("a", "Sisi"), f("b", "Sisi lain")];
      default: return base;
    }
  },
  compute: (v) => {
    let K: number | null = null;
    switch (v.shape) {
      case "persegi": { const s = num(v, "sisi"); if (s !== null) K = 4 * s; break; }
      case "persegiPanjang": { const p = num(v, "p"), l = num(v, "l"); if (p !== null && l !== null) K = 2 * (p + l); break; }
      case "segitiga": { const a = num(v, "a"), b = num(v, "b"), c = num(v, "c"); if (a !== null && b !== null && c !== null) K = a + b + c; break; }
      case "lingkaran": { const r = num(v, "r"); if (r !== null) K = 2 * PI * r; break; }
      case "jajar": { const a = num(v, "a"), b = num(v, "b"); if (a !== null && b !== null) K = 2 * (a + b); break; }
      case "trapesium": { const a = num(v, "a"), b = num(v, "b"), c = num(v, "c"), d = num(v, "d"); if (a !== null && b !== null && c !== null && d !== null) K = a + b + c + d; break; }
      case "belahKetupat":
      case "layang": { const a = num(v, "a"), b = num(v, "b"); if (a !== null && b !== null) K = 2 * (a + b); break; }
    }
    return K === null ? pilihBangun(v) : ok(fmt(K, 2), "Keliling (satuan)");
  },
};

const luasDatar: Tool = {
  id: "luasDatar",
  cat: "geo",
  label: "Luas Datar",
  icon: iLuasDatar,
  fields: (v) => {
    const base = [shapeField(datarShapes)];
    switch (v.shape) {
      case "persegi": return [...base, f("sisi", "Sisi")];
      case "persegiPanjang": return [...base, f("p", "Panjang"), f("l", "Lebar")];
      case "segitiga": return [...base, f("alas", "Alas"), f("t", "Tinggi")];
      case "lingkaran": return [...base, f("r", "Jari-jari")];
      case "jajar": return [...base, f("alas", "Alas"), f("t", "Tinggi")];
      case "trapesium": return [...base, f("a", "Sisi sejajar a"), f("b", "Sisi sejajar b"), f("t", "Tinggi")];
      case "belahKetupat":
      case "layang": return [...base, f("d1", "Diagonal 1"), f("d2", "Diagonal 2")];
      default: return base;
    }
  },
  compute: (v) => {
    let L: number | null = null;
    switch (v.shape) {
      case "persegi": { const s = num(v, "sisi"); if (s !== null) L = s * s; break; }
      case "persegiPanjang": { const p = num(v, "p"), l = num(v, "l"); if (p !== null && l !== null) L = p * l; break; }
      case "segitiga": { const a = num(v, "alas"), t = num(v, "t"); if (a !== null && t !== null) L = 0.5 * a * t; break; }
      case "lingkaran": { const r = num(v, "r"); if (r !== null) L = PI * r * r; break; }
      case "jajar": { const a = num(v, "alas"), t = num(v, "t"); if (a !== null && t !== null) L = a * t; break; }
      case "trapesium": { const a = num(v, "a"), b = num(v, "b"), t = num(v, "t"); if (a !== null && b !== null && t !== null) L = 0.5 * (a + b) * t; break; }
      case "belahKetupat":
      case "layang": { const d1 = num(v, "d1"), d2 = num(v, "d2"); if (d1 !== null && d2 !== null) L = 0.5 * d1 * d2; break; }
    }
    return L === null ? pilihBangun(v) : ok(fmt(L, 2), "Luas (satuan²)");
  },
};

const pythagoras: Tool = {
  id: "pythagoras",
  cat: "geo",
  label: "Pythagoras",
  icon: iPythagoras,
  fields: () => [f("a", "Sisi a"), f("b", "Sisi b")],
  compute: (v) => {
    const a = num(v, "a"), b = num(v, "b");
    if (a === null || b === null) return no("Masukkan sisi a & b");
    return ok(fmt(Math.sqrt(a * a + b * b), 4), "Sisi miring (c)");
  },
};

const jarak2titik: Tool = {
  id: "jarak2titik",
  cat: "geo",
  label: "Jarak 2 Titik",
  icon: iJarak2,
  fields: () => [f("x1", "x₁"), f("y1", "y₁"), f("x2", "x₂"), f("y2", "y₂")],
  compute: (v) => {
    const x1 = num(v, "x1"), y1 = num(v, "y1"), x2 = num(v, "x2"), y2 = num(v, "y2");
    if (x1 === null || y1 === null || x2 === null || y2 === null) return no("Lengkapi 4 koordinat");
    const d = Math.hypot(x2 - x1, y2 - y1);
    return ok(fmt(d, 4), `Titik tengah (${fmt((x1 + x2) / 2, 2)}, ${fmt((y1 + y2) / 2, 2)})`);
  },
};

const diagShapes: Option[] = [
  opt("persegi", "Persegi", sSquare),
  opt("persegiPanjang", "Persg. Panjang", sRect),
  opt("kubus", "Kubus", sCube),
  opt("balok", "Balok", sCuboid),
];

const diagonal: Tool = {
  id: "diagonal",
  cat: "geo",
  label: "Diagonal",
  icon: iDiagonal,
  fields: (v) => {
    const base = [shapeField(diagShapes)];
    switch (v.shape) {
      case "persegi": return [...base, f("sisi", "Sisi")];
      case "persegiPanjang": return [...base, f("p", "Panjang"), f("l", "Lebar")];
      case "kubus": return [...base, f("sisi", "Sisi")];
      case "balok": return [...base, f("p", "Panjang"), f("l", "Lebar"), f("t", "Tinggi")];
      default: return base;
    }
  },
  compute: (v) => {
    switch (v.shape) {
      case "persegi": { const s = num(v, "sisi"); if (s !== null) return ok(fmt(s * Math.SQRT2, 4), "Diagonal"); break; }
      case "persegiPanjang": { const p = num(v, "p"), l = num(v, "l"); if (p !== null && l !== null) return ok(fmt(Math.hypot(p, l), 4), "Diagonal"); break; }
      case "kubus": { const s = num(v, "sisi"); if (s !== null) return ok(fmt(s * Math.sqrt(3), 4), `Diagonal ruang · bidang ${fmt(s * Math.SQRT2, 3)}`); break; }
      case "balok": { const p = num(v, "p"), l = num(v, "l"), t = num(v, "t"); if (p !== null && l !== null && t !== null) return ok(fmt(Math.sqrt(p * p + l * l + t * t), 4), "Diagonal ruang"); break; }
    }
    return no("Lengkapi input");
  },
};

const juring: Tool = {
  id: "juring",
  cat: "geo",
  label: "Juring & Busur",
  icon: iJuring,
  fields: () => [f("r", "Jari-jari"), f("sudut", "Sudut pusat (°)")],
  compute: (v) => {
    const r = num(v, "r"), a = num(v, "sudut");
    if (r === null || a === null) return no("Lengkapi input");
    const luas = (a / 360) * PI * r * r;
    const busur = (a / 360) * 2 * PI * r;
    return ok(fmt(luas, 2), `Luas juring · panjang busur ${fmt(busur, 2)}`);
  },
};

const gradien: Tool = {
  id: "gradien",
  cat: "geo",
  label: "Gradien Garis",
  icon: iGradien,
  fields: () => [f("x1", "x₁"), f("y1", "y₁"), f("x2", "x₂"), f("y2", "y₂")],
  compute: (v) => {
    const x1 = num(v, "x1"), y1 = num(v, "y1"), x2 = num(v, "x2"), y2 = num(v, "y2");
    if (x1 === null || y1 === null || x2 === null || y2 === null) return no("Lengkapi 4 koordinat");
    if (x2 - x1 === 0) return ok("∞", "Garis vertikal (gradien tak terdefinisi)");
    const m = (y2 - y1) / (x2 - x1);
    const c = y1 - m * x1;
    return ok(fmt(m, 4), `y = ${fmt(m, 3)}x ${c >= 0 ? "+" : "−"} ${fmt(Math.abs(c), 3)}`);
  },
};

export const geometri: Tool[] = [
  { ...volume, keywords: ["volume", "isi", "bangun ruang", "3d"] },
  { ...luasRuang, keywords: ["luas permukaan", "surface area", "bangun ruang"] },
  { ...keliling, keywords: ["keliling", "perimeter", "bangun datar"] },
  { ...luasDatar, keywords: ["luas", "area", "bangun datar"] },
  { ...pythagoras, keywords: ["pythagoras", "phytagoras", "siku", "hipotenusa", "miring"] },
  { ...jarak2titik, keywords: ["jarak", "distance", "koordinat", "titik", "kartesius"] },
  { ...diagonal, keywords: ["diagonal", "bidang", "ruang"] },
  { ...juring, keywords: ["juring", "busur", "sektor", "sector", "arc"] },
  { ...gradien, keywords: ["gradien", "slope", "kemiringan", "garis"] },
];
