import type { Tool, Option } from "../types";
import { num, fmt, ok, no } from "../format";
import iBerat from "../../../svg/scale.svg?raw";
import iJarak from "../../../svg/ruler-dimension-line.svg?raw";
import iSuhu from "../../../svg/thermometer.svg?raw";
import iUang from "../../../svg/dollar-sign.svg?raw";
import iWaktu from "../../../svg/clock.svg?raw";
import iKecepatan from "../../../svg/orbit.svg?raw";
import iLuas from "../../../svg/square.svg?raw";
import iVolC from "../../../svg/cylinder.svg?raw";
import iData from "../../../svg/hexagon.svg?raw";
import iBil from "../../../svg/variable.svg?raw";

const opt = (value: string, label: string): Option => ({ value, label });

/**
 * Konverter linear via faktor ke satuan basis.
 * spec: [value, label, faktorKeBasis][] — basis = faktor 1.
 * hasil = nilai * faktor[from] / faktor[to].
 */
function conv(id: string, label: string, icon: string, spec: [string, string, number][]): Tool {
  const options = spec.map(([v, l]) => opt(v, l));
  const factor: Record<string, number> = {};
  for (const [v, , fac] of spec) factor[v] = fac;
  const first = spec[0][0];

  return {
    id,
    cat: "konv",
    label,
    icon,
    fields: () => [
      { key: "val", label: "Nilai", type: "number", placeholder: "Masukkan nilai" },
      { key: "from", label: "Dari", type: "select", options },
      { key: "to", label: "Ke", type: "select", options },
    ],
    compute: (v) => {
      const x = num(v, "val");
      if (x === null) return no("Masukkan nilai");
      const from = v.from || first;
      const to = v.to || first;
      return ok(`${fmt((x * factor[from]) / factor[to])} ${to}`, `${fmt(x)} ${from} =`);
    },
  };
}

const berat = conv("berat", "Berat", iBerat, [
  ["kg", "Kilogram", 1000],
  ["g", "Gram", 1],
  ["mg", "Miligram", 0.001],
  ["lb", "Pound", 453.592],
  ["oz", "Ons", 28.3495],
]);

const jarak = conv("jarak", "Jarak", iJarak, [
  ["km", "Kilometer", 1000],
  ["m", "Meter", 1],
  ["cm", "Centimeter", 0.01],
  ["mm", "Milimeter", 0.001],
  ["mile", "Mil", 1609.34],
  ["yard", "Yard", 0.9144],
  ["ft", "Kaki", 0.3048],
]);

const kecepatan = conv("kecepatan", "Kecepatan", iKecepatan, [
  ["kmh", "km/jam", 1 / 3.6],
  ["ms", "m/s", 1],
  ["mph", "mil/jam", 0.44704],
]);

const waktu = conv("waktu", "Waktu", iWaktu, [
  ["detik", "Detik", 1],
  ["menit", "Menit", 60],
  ["jam", "Jam", 3600],
  ["hari", "Hari", 86400],
  ["minggu", "Minggu", 604800],
]);

// Kurs statik terhadap 1 USD (sama seperti versi lama). Faktor ke basis USD = 1/kurs.
const uang = conv("uang", "Mata Uang", iUang, [
  ["USD", "USD", 1],
  ["IDR", "IDR", 1 / 16000],
  ["EUR", "EUR", 1 / 0.92],
  ["JPY", "JPY", 1 / 145],
]);

const suhu: Tool = {
  id: "suhu",
  cat: "konv",
  label: "Suhu",
  icon: iSuhu,
  fields: () => [
    { key: "val", label: "Nilai", type: "number", placeholder: "Masukkan nilai" },
    { key: "from", label: "Dari", type: "select", options: [opt("C", "Celsius"), opt("F", "Fahrenheit"), opt("K", "Kelvin")] },
    { key: "to", label: "Ke", type: "select", options: [opt("C", "Celsius"), opt("F", "Fahrenheit"), opt("K", "Kelvin")] },
  ],
  compute: (v) => {
    const x = num(v, "val");
    if (x === null) return no("Masukkan nilai");
    const from = v.from || "C";
    const to = v.to || "C";
    const c = from === "C" ? x : from === "F" ? ((x - 32) * 5) / 9 : x - 273.15;
    const r = to === "C" ? c : to === "F" ? (c * 9) / 5 + 32 : c + 273.15;
    return ok(`${fmt(r, 2)} °${to}`, `${fmt(x, 2)} °${from} =`);
  },
};

const luas = conv("luas", "Luas", iLuas, [
  ["m2", "m²", 1],
  ["cm2", "cm²", 0.0001],
  ["mm2", "mm²", 0.000001],
  ["km2", "km²", 1000000],
  ["ha", "Hektar", 10000],
  ["are", "Are", 100],
  ["ft2", "kaki²", 0.092903],
]);

const volumeCairan = conv("volumeCairan", "Volume Cairan", iVolC, [
  ["L", "Liter", 1],
  ["mL", "mL", 0.001],
  ["m3", "m³", 1000],
  ["cc", "cc", 0.001],
  ["gal", "Galon (US)", 3.78541],
]);

// Basis 1024 (KB = 1024 B), umum dipakai untuk penyimpanan.
const data = conv("data", "Data Digital", iData, [
  ["bit", "bit", 0.125],
  ["B", "Byte", 1],
  ["KB", "KB", 1024],
  ["MB", "MB", 1048576],
  ["GB", "GB", 1073741824],
  ["TB", "TB", 1099511627776],
]);

const basisOpts: Option[] = [
  opt("10", "Desimal (10)"),
  opt("2", "Biner (2)"),
  opt("8", "Oktal (8)"),
  opt("16", "Heksa (16)"),
];

const bilangan: Tool = {
  id: "bilangan",
  cat: "konv",
  label: "Bilangan",
  icon: iBil,
  fields: () => [
    { key: "val", label: "Nilai", type: "number", placeholder: "cth: 1010 atau FF" },
    { key: "from", label: "Dari basis", type: "select", options: basisOpts },
    { key: "to", label: "Ke basis", type: "select", options: basisOpts },
  ],
  compute: (v) => {
    const raw = (v.val ?? "").trim();
    if (!raw) return no("Masukkan nilai");
    const from = Number(v.from || "10");
    const to = Number(v.to || "10");
    const n = parseInt(raw, from);
    if (Number.isNaN(n)) return no(`"${raw}" bukan basis ${from} yang valid`);
    return ok(n.toString(to).toUpperCase(), `${raw} (basis ${from}) =`);
  },
};

export const konversi: Tool[] = [
  berat,
  jarak,
  suhu,
  uang,
  waktu,
  kecepatan,
  luas,
  volumeCairan,
  data,
  bilangan,
];
