import type { Tool, Field } from "../types";
import { num, fmt, ok, no } from "../format";
import iDiskon from "../../../svg/ticket-percent.svg?raw";
import iCicilan from "../../../svg/chart-no-axes-combined.svg?raw";

const f = (key: string, label: string): Field => ({ key, label, type: "number", placeholder: label });

const diskon: Tool = {
  id: "diskon",
  cat: "fin",
  label: "Diskon",
  icon: iDiskon,
  fields: () => [f("harga", "Harga awal"), f("diskon", "Diskon (%)")],
  compute: (v) => {
    const h = num(v, "harga"), d = num(v, "diskon");
    if (h === null || d === null) return no("Lengkapi input");
    const potongan = (h * d) / 100;
    return ok(fmt(h - potongan, 2), `Harga akhir · hemat ${fmt(potongan, 2)}`);
  },
};

const cicilan: Tool = {
  id: "cicilan",
  cat: "fin",
  label: "Cicilan",
  icon: iCicilan,
  fields: () => [f("pinjaman", "Total pinjaman"), f("bunga", "Bunga / bulan (%)"), f("bulan", "Lama (bulan)")],
  compute: (v) => {
    const p = num(v, "pinjaman"), b = num(v, "bunga"), m = num(v, "bulan");
    if (p === null || b === null || m === null) return no("Lengkapi input");
    if (m <= 0) return no("Lama bulan harus > 0");
    const angsuran = (p * (1 + (b / 100) * m)) / m;
    return ok(`${fmt(angsuran, 2)} /bln`, "Angsuran per bulan");
  },
};

export const finansial: Tool[] = [diskon, cicilan];
