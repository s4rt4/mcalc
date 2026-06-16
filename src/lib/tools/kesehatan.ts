import type { Tool, Field, Option } from "../types";
import { num, fmt, ok, no } from "../format";
import { parseDate, fmtDate, diffDays, addDays } from "../dateutil";
import iBmi from "../../../svg/person-standing.svg?raw";
import iBeratIdeal from "../../../svg/user-star.svg?raw";
import iKalori from "../../../svg/biceps-flexed.svg?raw";
import iAir from "../../../svg/glass-water.svg?raw";
import iLemak from "../../../svg/dumbbell.svg?raw";
import iHpl from "../../../svg/baby.svg?raw";

const f = (key: string, label: string): Field => ({ key, label, type: "number", placeholder: label });
const opt = (value: string, label: string): Option => ({ value, label });
const genderField: Field = {
  key: "gender",
  label: "Jenis kelamin",
  type: "select",
  options: [opt("pria", "Pria"), opt("wanita", "Wanita")],
};

const bmi: Tool = {
  id: "bmi",
  cat: "sehat",
  label: "BMI",
  icon: iBmi,
  keywords: ["bmi", "imt", "indeks massa tubuh", "gemuk", "kurus", "obesitas"],
  fields: () => [f("berat", "Berat (kg)"), f("tinggi", "Tinggi (cm)")],
  compute: (v) => {
    const w = num(v, "berat"), h = num(v, "tinggi");
    if (w === null || h === null) return no("Lengkapi input");
    if (h <= 0) return no("Tinggi harus > 0");
    const m = h / 100;
    const bmi = w / (m * m);
    const kat = bmi < 18.5 ? "Kurus" : bmi < 25 ? "Normal" : bmi < 30 ? "Gemuk" : "Obesitas";
    return ok(fmt(bmi, 1), `Kategori: ${kat}`);
  },
};

const beratIdeal: Tool = {
  id: "beratIdeal",
  cat: "sehat",
  label: "Berat Ideal",
  icon: iBeratIdeal,
  keywords: ["berat ideal", "ideal weight", "broca", "bb ideal"],
  fields: () => [f("tinggi", "Tinggi (cm)"), genderField],
  compute: (v) => {
    const h = num(v, "tinggi");
    if (h === null) return no("Masukkan tinggi");
    if (h <= 100) return no("Tinggi harus > 100 cm");
    const broca = h - 100;
    const ideal = (v.gender || "pria") === "wanita" ? broca - broca * 0.15 : broca - broca * 0.1;
    return ok(`${fmt(ideal, 1)} kg`, "Rumus Broca");
  },
};

const bmr: Tool = {
  id: "bmr",
  cat: "sehat",
  label: "BMR & Kalori",
  icon: iKalori,
  keywords: ["bmr", "kalori", "calorie", "tdee", "metabolisme", "diet", "defisit"],
  fields: () => [
    f("berat", "Berat (kg)"),
    f("tinggi", "Tinggi (cm)"),
    f("umur", "Umur (tahun)"),
    genderField,
    {
      key: "akt",
      label: "Aktivitas",
      type: "select",
      options: [
        opt("1.2", "Jarang olahraga"),
        opt("1.375", "Ringan (1–3x/mgg)"),
        opt("1.55", "Sedang (3–5x/mgg)"),
        opt("1.725", "Berat (6–7x/mgg)"),
        opt("1.9", "Sangat berat"),
      ],
    },
  ],
  compute: (v) => {
    const w = num(v, "berat"), h = num(v, "tinggi"), a = num(v, "umur");
    if (w === null || h === null || a === null) return no("Lengkapi input");
    const base = 10 * w + 6.25 * h - 5 * a;
    const bmr = (v.gender || "pria") === "wanita" ? base - 161 : base + 5;
    const fac = num(v, "akt") ?? 1.2;
    return ok(`${fmt(bmr * fac, 0)} kkal/hari`, `BMR ${fmt(bmr, 0)} kkal · kebutuhan harian`);
  },
};

const airMinum: Tool = {
  id: "airMinum",
  cat: "sehat",
  label: "Kebutuhan Air",
  icon: iAir,
  keywords: ["air", "minum", "water", "hidrasi", "cairan"],
  fields: () => [f("berat", "Berat (kg)")],
  compute: (v) => {
    const w = num(v, "berat");
    if (w === null) return no("Masukkan berat");
    const liter = w * 0.033;
    return ok(`${fmt(liter, 2)} L/hari`, `≈ ${fmt((liter * 1000) / 240, 0)} gelas (240 ml)`);
  },
};

const lemakTubuh: Tool = {
  id: "lemakTubuh",
  cat: "sehat",
  label: "Lemak Tubuh",
  icon: iLemak,
  keywords: ["lemak", "body fat", "persen lemak", "komposisi tubuh"],
  fields: () => [f("berat", "Berat (kg)"), f("tinggi", "Tinggi (cm)"), f("umur", "Umur (tahun)"), genderField],
  compute: (v) => {
    const w = num(v, "berat"), h = num(v, "tinggi"), a = num(v, "umur");
    if (w === null || h === null || a === null) return no("Lengkapi input");
    if (h <= 0) return no("Tinggi harus > 0");
    const m = h / 100;
    const bmi = w / (m * m);
    const sex = (v.gender || "pria") === "pria" ? 1 : 0;
    const bf = 1.2 * bmi + 0.23 * a - 10.8 * sex - 5.4; // Deurenberg
    return ok(`${fmt(Math.max(bf, 0), 1)}%`, "Estimasi (rumus Deurenberg)");
  },
};

const hpl: Tool = {
  id: "hpl",
  cat: "sehat",
  label: "HPL Kehamilan",
  icon: iHpl,
  keywords: ["hpl", "kehamilan", "hamil", "hpht", "due date", "pregnancy", "melahirkan"],
  fields: () => [{ key: "hpht", label: "Hari pertama haid terakhir", type: "date" }],
  compute: (v) => {
    const d = parseDate(v.hpht);
    if (!d) return no("Pilih tanggal HPHT");
    const due = addDays(d, 280);
    const usia = Math.max(diffDays(d, new Date()), 0);
    return ok(fmtDate(due), `Perkiraan lahir · usia ${Math.floor(usia / 7)} mgg ${usia % 7} hr`);
  },
};

export const kesehatan: Tool[] = [bmi, beratIdeal, bmr, airMinum, lemakTubuh, hpl];
