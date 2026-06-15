import type { Tool, Field } from "../types";
import { num, fmt, ok, no } from "../format";
import iPersentase from "../../../svg/percent.svg?raw";
import iPecahan from "../../../svg/decimals-arrow-right.svg?raw";
import iSkala from "../../../svg/scaling.svg?raw";
import iFpb from "../../../svg/git-fork.svg?raw";
import iKuad from "../../../svg/superscript.svg?raw";
import iStat from "../../../svg/table.svg?raw";
import iPerm from "../../../svg/asterisk.svg?raw";

const f = (key: string, label: string): Field => ({ key, label, type: "number", placeholder: label });

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

export const matematika: Tool[] = [persentase, pecahan, skala, fpbkpk, kuadrat, statistik, permutasi];
