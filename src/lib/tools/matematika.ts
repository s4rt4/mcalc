import type { Tool, Field } from "../types";
import { num, fmt, ok, no } from "../format";
import iPersentase from "../../../svg/percent.svg?raw";
import iPecahan from "../../../svg/decimals-arrow-right.svg?raw";
import iSkala from "../../../svg/scaling.svg?raw";

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

export const matematika: Tool[] = [persentase, pecahan, skala];
