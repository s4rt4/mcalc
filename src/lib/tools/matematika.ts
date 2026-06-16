import type { Tool, Field, Option } from "../types";
import { num, fmt, ok, no } from "../format";
import iPersentase from "../../../svg/percent.svg?raw";
import iPecahan from "../../../svg/decimals-arrow-right.svg?raw";
import iSkala from "../../../svg/scaling.svg?raw";
import iFpb from "../../../svg/git-fork.svg?raw";
import iKuad from "../../../svg/superscript.svg?raw";
import iStat from "../../../svg/table.svg?raw";
import iPerm from "../../../svg/asterisk.svg?raw";
import iTrig from "../../../svg/triangle-right.svg?raw";
import iDeret from "../../../svg/list-video.svg?raw";
import iFaktor from "../../../svg/share-2.svg?raw";

const f = (key: string, label: string): Field => ({ key, label, type: "number", placeholder: label });
const opt = (value: string, label: string): Option => ({ value, label });

const persentase: Tool = {
  id: "persentase",
  cat: "mat",
  label: "Persentase",
  icon: iPersentase,
  fields: () => [f("nilai", "Nilai"), f("persen", "Persentase (%)")],
  compute: (v) => {
    const n = num(v, "nilai"), p = num(v, "persen");
    if (n === null || p === null) return no("Lengkapi input");
    return ok(fmt((n * p) / 100, 4), `${fmt(p)}% dari ${fmt(n)}`);
  },
};

const pecahan: Tool = {
  id: "pecahan",
  cat: "mat",
  label: "Pecahan",
  icon: iPecahan,
  fields: () => [f("num", "Pembilang"), f("den", "Penyebut")],
  compute: (v) => {
    const a = num(v, "num"), b = num(v, "den");
    if (a === null || b === null) return no("Lengkapi input");
    if (b === 0) return no("Penyebut tidak boleh 0");
    return ok(fmt(a / b, 6), `${fmt(a)} / ${fmt(b)}`);
  },
};

const skala: Tool = {
  id: "skala",
  cat: "mat",
  label: "Skala",
  icon: iSkala,
  fields: () => [f("peta", "Jarak di peta (cm)"), f("skala", "Skala (1 : ?)")],
  compute: (v) => {
    const jp = num(v, "peta"), s = num(v, "skala");
    if (jp === null || s === null) return no("Lengkapi input");
    if (s <= 0) return no("Skala harus > 0");
    return ok(`${fmt((jp * s) / 100000, 3)} km`, "Jarak sebenarnya");
  },
};

const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

const fpbkpk: Tool = {
  id: "fpbkpk",
  cat: "mat",
  label: "FPB & KPK",
  icon: iFpb,
  fields: () => [f("a", "Angka 1"), f("b", "Angka 2"), f("c", "Angka 3 (opsional)")],
  compute: (v) => {
    const a = num(v, "a"), b = num(v, "b"), c = num(v, "c");
    if (a === null || b === null) return no("Isi minimal 2 angka");
    const ints = [a, b, ...(c !== null ? [c] : [])].map((x) => Math.round(Math.abs(x)));
    if (ints.some((x) => x === 0)) return no("Angka harus > 0");
    const g = ints.reduce((p, x) => gcd(p, x));
    const l = ints.reduce((p, x) => (p * x) / gcd(p, x));
    return ok(`FPB ${fmt(g)}`, `KPK ${fmt(l)}`);
  },
};

const kuadrat: Tool = {
  id: "kuadrat",
  cat: "mat",
  label: "Persamaan Kuadrat",
  icon: iKuad,
  fields: () => [f("a", "a"), f("b", "b"), f("c", "c")],
  compute: (v) => {
    const a = num(v, "a"), b = num(v, "b"), c = num(v, "c");
    if (a === null || b === null || c === null) return no("Lengkapi a, b, c");
    if (a === 0) return no("a tidak boleh 0");
    const D = b * b - 4 * a * c;
    if (D < 0) return ok("Tidak ada akar real", `D = ${fmt(D, 2)}`);
    const x1 = (-b + Math.sqrt(D)) / (2 * a);
    const x2 = (-b - Math.sqrt(D)) / (2 * a);
    return ok(`x₁ = ${fmt(x1, 3)} · x₂ = ${fmt(x2, 3)}`, `Diskriminan D = ${fmt(D, 2)}`);
  },
};

const statistik: Tool = {
  id: "statistik",
  cat: "mat",
  label: "Statistik",
  icon: iStat,
  fields: () => [
    { key: "data", label: "Data (pisah koma/spasi)", type: "number", placeholder: "cth: 7, 8, 9, 6, 8" },
  ],
  compute: (v) => {
    const arr = (v.data ?? "")
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter(Number.isFinite);
    if (arr.length === 0) return no("Masukkan data angka");
    const mean = arr.reduce((p, x) => p + x, 0) / arr.length;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const freq = new Map<number, number>();
    for (const x of arr) freq.set(x, (freq.get(x) ?? 0) + 1);
    const maxF = Math.max(...freq.values());
    const modus =
      maxF <= 1
        ? "—"
        : [...freq.entries()]
            .filter(([, fq]) => fq === maxF)
            .map(([x]) => fmt(x))
            .join(", ");
    return ok(`Rata-rata ${fmt(mean, 3)}`, `Median ${fmt(median, 3)} · Modus ${modus} · n=${arr.length}`);
  },
};

const factorial = (n: number): number => {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
};

const permutasi: Tool = {
  id: "permutasi",
  cat: "mat",
  label: "Permutasi & Kombinasi",
  icon: iPerm,
  fields: () => [f("n", "n"), f("r", "r")],
  compute: (v) => {
    const nN = num(v, "n"), rN = num(v, "r");
    if (nN === null || rN === null) return no("Isi n & r");
    const n = Math.round(nN), r = Math.round(rN);
    if (n < 0 || r < 0) return no("n, r ≥ 0");
    if (r > n) return no("syarat: r ≤ n");
    const P = factorial(n) / factorial(n - r);
    const C = P / factorial(r);
    return ok(`nPr = ${fmt(P)}`, `nCr = ${fmt(C)} · n! = ${fmt(factorial(n))}`);
  },
};

const trigonometri: Tool = {
  id: "trigonometri",
  cat: "mat",
  label: "Trigonometri",
  icon: iTrig,
  keywords: ["sin", "cos", "tan", "sinus", "cosinus", "tangen", "sudut", "trigonometri"],
  fields: () => [
    { key: "fn", label: "Fungsi", type: "select", options: [opt("sin", "sin"), opt("cos", "cos"), opt("tan", "tan")] },
    f("sudut", "Sudut"),
    { key: "mode", label: "Satuan", type: "select", options: [opt("deg", "Derajat"), opt("rad", "Radian")] },
  ],
  compute: (v) => {
    const a = num(v, "sudut");
    if (a === null) return no("Masukkan sudut");
    const mode = v.mode || "deg";
    const rad = mode === "deg" ? (a * Math.PI) / 180 : a;
    const fn = v.fn || "sin";
    if (fn === "tan" && Math.abs(Math.cos(rad)) < 1e-12) return ok("∞", "tan tak terdefinisi");
    const r = fn === "sin" ? Math.sin(rad) : fn === "cos" ? Math.cos(rad) : Math.tan(rad);
    return ok(fmt(r, 6), `${fn}(${fmt(a)}${mode === "deg" ? "°" : " rad"}) =`);
  },
};

const logpangkat: Tool = {
  id: "logpangkat",
  cat: "mat",
  label: "Logaritma & Pangkat",
  icon: iKuad,
  keywords: ["log", "ln", "logaritma", "pangkat", "akar", "root", "eksponen", "power", "sqrt", "kuadrat"],
  fields: (v) => {
    const op: Field = {
      key: "op",
      label: "Operasi",
      type: "select",
      options: [
        opt("pow", "Pangkat (xʸ)"),
        opt("root", "Akar pangkat-n"),
        opt("log", "Logaritma basis-b"),
        opt("ln", "Logaritma natural (ln)"),
        opt("log10", "Logaritma basis-10"),
      ],
    };
    switch (v.op) {
      case "root": return [op, f("x", "Bilangan (x)"), f("n", "Akar ke- (n)")];
      case "log": return [op, f("x", "Bilangan (x)"), f("b", "Basis (b)")];
      case "ln":
      case "log10": return [op, f("x", "Bilangan (x)")];
      default: return [op, f("x", "Basis (x)"), f("y", "Pangkat (y)")];
    }
  },
  compute: (v) => {
    const op = v.op || "pow";
    const x = num(v, "x");
    if (x === null) return no("Masukkan bilangan");
    switch (op) {
      case "pow": {
        const y = num(v, "y");
        if (y === null) return no("Masukkan pangkat");
        return ok(fmt(Math.pow(x, y), 6), `${fmt(x)} ^ ${fmt(y)} =`);
      }
      case "root": {
        const n = num(v, "n");
        if (n === null || n === 0) return no("Masukkan n ≠ 0");
        if (x < 0 && n % 2 === 0) return no("Akar genap dari bilangan negatif");
        const r = x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n);
        return ok(fmt(r, 6), `akar-${fmt(n)} dari ${fmt(x)} =`);
      }
      case "log": {
        const b = num(v, "b");
        if (b === null || b <= 0 || b === 1) return no("Basis harus > 0 dan ≠ 1");
        if (x <= 0) return no("x harus > 0");
        return ok(fmt(Math.log(x) / Math.log(b), 6), `log${fmt(b)}(${fmt(x)}) =`);
      }
      case "ln":
        if (x <= 0) return no("x harus > 0");
        return ok(fmt(Math.log(x), 6), `ln(${fmt(x)}) =`);
      case "log10":
        if (x <= 0) return no("x harus > 0");
        return ok(fmt(Math.log10(x), 6), `log(${fmt(x)}) =`);
    }
    return no();
  },
};

const deret: Tool = {
  id: "deret",
  cat: "mat",
  label: "Barisan & Deret",
  icon: iDeret,
  keywords: ["barisan", "deret", "aritmetika", "geometri", "suku", "sequence", "series"],
  fields: (v) => [
    { key: "jenis", label: "Jenis", type: "select", options: [opt("aritmetika", "Aritmetika"), opt("geometri", "Geometri")] },
    f("a", "Suku pertama (a)"),
    f("b", v.jenis === "geometri" ? "Rasio (r)" : "Beda (b)"),
    f("n", "Suku ke- (n)"),
  ],
  compute: (v) => {
    const a = num(v, "a"), b = num(v, "b"), nN = num(v, "n");
    if (a === null || b === null || nN === null) return no("Lengkapi input");
    const n = Math.round(nN);
    if (n < 1) return no("n harus ≥ 1");
    if ((v.jenis || "aritmetika") === "geometri") {
      const Un = a * Math.pow(b, n - 1);
      const Sn = b === 1 ? a * n : (a * (Math.pow(b, n) - 1)) / (b - 1);
      return ok(`Un = ${fmt(Un, 4)}`, `Jumlah Sn = ${fmt(Sn, 4)}`);
    }
    const Un = a + (n - 1) * b;
    const Sn = (n / 2) * (2 * a + (n - 1) * b);
    return ok(`Un = ${fmt(Un, 4)}`, `Jumlah Sn = ${fmt(Sn, 4)}`);
  },
};

const SUP = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
const sup = (n: number): string => (n <= 1 ? "" : String(n).split("").map((d) => SUP[+d]).join(""));

const faktorprima: Tool = {
  id: "faktorprima",
  cat: "mat",
  label: "Faktorisasi Prima",
  icon: iFaktor,
  keywords: ["prima", "faktor", "faktorisasi", "prime", "factor", "pohon faktor"],
  fields: () => [f("n", "Bilangan bulat > 1")],
  compute: (v) => {
    const nN = num(v, "n");
    if (nN === null) return no("Masukkan bilangan");
    let n = Math.round(Math.abs(nN));
    if (n < 2) return no("Harus bilangan bulat > 1");
    const factors: [number, number][] = [];
    for (let d = 2; d * d <= n; d++) {
      let c = 0;
      while (n % d === 0) { n /= d; c++; }
      if (c) factors.push([d, c]);
    }
    if (n > 1) factors.push([n, 1]);
    const str = factors.map(([p, e]) => `${p}${sup(e)}`).join(" × ");
    const flat = factors.flatMap(([p, e]) => Array(e).fill(p)).join(" · ");
    return ok(str, `= ${flat}`);
  },
};

export const matematika: Tool[] = [
  { ...persentase, keywords: ["persen", "percent", "%"] },
  { ...pecahan, keywords: ["fraction", "bagi", "pembilang", "penyebut", "desimal"] },
  { ...skala, keywords: ["scale", "peta", "map", "denah"] },
  { ...fpbkpk, keywords: ["fpb", "kpk", "gcd", "lcm", "kelipatan", "faktor"] },
  { ...kuadrat, keywords: ["quadratic", "abc", "akar", "diskriminan", "persamaan"] },
  { ...statistik, keywords: ["statistik", "rata-rata", "mean", "median", "modus", "average"] },
  { ...permutasi, keywords: ["permutasi", "kombinasi", "combination", "npr", "ncr", "faktorial"] },
  trigonometri,
  logpangkat,
  deret,
  faktorprima,
];
