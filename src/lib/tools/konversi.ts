import type { Tool, Option } from "../types";
import { num, fmt, ok, no } from "../format";
import iBerat from "../../../svg/scale.svg?raw";
import iJarak from "../../../svg/ruler-dimension-line.svg?raw";
import iSuhu from "../../../svg/thermometer.svg?raw";
import iUang from "../../../svg/dollar-sign.svg?raw";
import iWaktu from "../../../svg/clock.svg?raw";
import iKecepatan from "../../../svg/orbit.svg?raw";
import iLuas from "../../../svg/square.svg?raw";
import iVolC from "../../../svg/droplet.svg?raw";
import iData from "../../../svg/arrow-down-0-1.svg?raw";
import iBil from "../../../svg/binary.svg?raw";
import iTekanan from "../../../svg/circle-gauge.svg?raw";
import iEnergi from "../../../svg/zap.svg?raw";
import iDaya from "../../../svg/hand-fist.svg?raw";
import iSudut from "../../../svg/square-round-corner.svg?raw";
import iRomawi from "../../../svg/tally-3.svg?raw";
import iBbm from "../../../svg/fuel.svg?raw";

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

const tekanan = conv("tekanan", "Tekanan", iTekanan, [
  ["Pa", "Pascal", 1],
  ["kPa", "Kilopascal", 1000],
  ["bar", "Bar", 100000],
  ["atm", "Atmosfer", 101325],
  ["psi", "psi", 6894.76],
  ["mmHg", "mmHg", 133.322],
]);

const energi = conv("energi", "Energi", iEnergi, [
  ["J", "Joule", 1],
  ["kJ", "Kilojoule", 1000],
  ["cal", "Kalori", 4.184],
  ["kcal", "Kilokalori", 4184],
  ["kWh", "kWh", 3600000],
  ["BTU", "BTU", 1055.06],
]);

const daya = conv("daya", "Daya", iDaya, [
  ["W", "Watt", 1],
  ["kW", "Kilowatt", 1000],
  ["hp", "Horsepower", 745.7],
  ["PS", "PK / PS", 735.5],
]);

const sudut = conv("sudut", "Sudut", iSudut, [
  ["deg", "Derajat", 1],
  ["rad", "Radian", 180 / Math.PI],
  ["grad", "Gradian", 0.9],
]);

// Angka Romawi ↔ desimal (1–3999, bentuk kanonik).
const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];
function toRoman(n: number): string | null {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  let r = "";
  for (const [v, s] of ROMAN) while (n >= v) { r += s; n -= v; }
  return r;
}
function fromRoman(s: string): number | null {
  const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const c = val[s[i]];
    if (!c) return null;
    const next = val[s[i + 1]];
    if (next && c < next) total -= c;
    else total += c;
  }
  return toRoman(total) === s ? total : null; // tolak bentuk tak baku (mis. IIII)
}

const romawi: Tool = {
  id: "romawi",
  cat: "konv",
  label: "Angka Romawi",
  icon: iRomawi,
  keywords: ["romawi", "roman", "numeral", "angka"],
  fields: () => [
    { key: "val", label: "Nilai", type: "number", placeholder: "cth: 2024 atau MMXXIV" },
    { key: "from", label: "Dari", type: "select", options: [opt("dec", "Desimal"), opt("rom", "Romawi")] },
    { key: "to", label: "Ke", type: "select", options: [opt("dec", "Desimal"), opt("rom", "Romawi")] },
  ],
  compute: (v) => {
    const raw = (v.val ?? "").trim();
    if (!raw) return no("Masukkan nilai");
    const from = v.from || "dec";
    const to = v.to || "dec";
    if (from === to) return ok(raw.toUpperCase(), "Basis sama");
    if (from === "dec") {
      const n = Number(raw);
      const r = Number.isFinite(n) ? toRoman(n) : null;
      return r ? ok(r, `${fmt(n)} =`) : no("Hanya bilangan bulat 1–3999");
    }
    const n = fromRoman(raw.toUpperCase());
    return n === null ? no(`"${raw}" bukan angka Romawi valid`) : ok(fmt(n), `${raw.toUpperCase()} =`);
  },
};

// Konsumsi BBM (non-linear): basis km/Liter.
const BBM_OPT: Option[] = [opt("kml", "km/Liter"), opt("l100", "L/100 km"), opt("mpg", "mpg (US)")];
const MPG_TO_KML = 0.425143707;
const bbm: Tool = {
  id: "bbm",
  cat: "konv",
  label: "Konsumsi BBM",
  icon: iBbm,
  keywords: ["bbm", "bensin", "fuel", "irit", "konsumsi", "mpg", "boros"],
  fields: () => [
    { key: "val", label: "Nilai", type: "number", placeholder: "Masukkan nilai" },
    { key: "from", label: "Dari", type: "select", options: BBM_OPT },
    { key: "to", label: "Ke", type: "select", options: BBM_OPT },
  ],
  compute: (v) => {
    const x = num(v, "val");
    if (x === null) return no("Masukkan nilai");
    if (x <= 0) return no("Nilai harus > 0");
    const from = v.from || "kml";
    const to = v.to || "kml";
    const kml = from === "kml" ? x : from === "l100" ? 100 / x : x * MPG_TO_KML;
    const out = to === "kml" ? kml : to === "l100" ? 100 / kml : kml / MPG_TO_KML;
    const lbl = (k: string) => BBM_OPT.find((o) => o.value === k)!.label;
    return ok(`${fmt(out, 2)} ${lbl(to)}`, `${fmt(x, 2)} ${lbl(from)} =`);
  },
};

export const konversi: Tool[] = [
  { ...berat, keywords: ["massa", "timbang", "weight", "kilogram", "gram", "pound", "ons"] },
  { ...jarak, keywords: ["panjang", "distance", "length", "meter", "mil", "kaki", "yard"] },
  { ...suhu, keywords: ["temperature", "celsius", "fahrenheit", "kelvin", "derajat"] },
  { ...uang, keywords: ["mata uang", "kurs", "currency", "dollar", "rupiah", "euro", "yen", "forex"] },
  { ...waktu, keywords: ["time", "detik", "menit", "jam", "hari", "minggu", "durasi"] },
  { ...kecepatan, keywords: ["speed", "velocity", "laju", "kmh"] },
  { ...luas, keywords: ["area", "hektar", "are", "tanah"] },
  { ...volumeCairan, keywords: ["volume", "liter", "galon", "cairan", "isi"] },
  { ...data, keywords: ["byte", "bit", "kilobyte", "megabyte", "gigabyte", "storage", "memori"] },
  { ...bilangan, keywords: ["biner", "binary", "oktal", "heksa", "hex", "desimal", "basis"] },
  { ...tekanan, keywords: ["pressure", "ban", "atm", "psi", "pascal"] },
  { ...energi, keywords: ["energy", "joule", "kalori", "kwh", "btu", "listrik"] },
  { ...daya, keywords: ["power", "watt", "horsepower", "pk", "ps", "tenaga"] },
  { ...sudut, keywords: ["angle", "radian", "gradian", "derajat"] },
  romawi,
  bbm,
];
