import type { Tool, Field } from "../types";
import { num, fmt, ok, no } from "../format";
import iDiskon from "../../../svg/ticket-percent.svg?raw";
import iCicilan from "../../../svg/chart-no-axes-combined.svg?raw";
import iUntung from "../../../svg/diff.svg?raw";
import iMargin from "../../../svg/chart-pie.svg?raw";
import iBunga from "../../../svg/dollar-sign.svg?raw";
import iZakat from "../../../svg/scale.svg?raw";

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

const untungRugi: Tool = {
  id: "untungRugi",
  cat: "fin",
  label: "Untung / Rugi",
  icon: iUntung,
  fields: () => [f("modal", "Modal / beli"), f("jual", "Harga jual")],
  compute: (v) => {
    const m = num(v, "modal"), j = num(v, "jual");
    if (m === null || j === null) return no("Lengkapi input");
    if (m === 0) return no("Modal tidak boleh 0");
    const s = j - m;
    const p = (s / m) * 100;
    return ok(`${s >= 0 ? "Untung" : "Rugi"} ${fmt(Math.abs(s), 2)}`, `${fmt(Math.abs(p), 2)}% dari modal`);
  },
};

const marginMarkup: Tool = {
  id: "marginMarkup",
  cat: "fin",
  label: "Margin & Markup",
  icon: iMargin,
  fields: () => [f("modal", "Modal / beli"), f("jual", "Harga jual")],
  compute: (v) => {
    const m = num(v, "modal"), j = num(v, "jual");
    if (m === null || j === null) return no("Lengkapi input");
    if (m === 0 || j === 0) return no("Nilai tidak boleh 0");
    const margin = ((j - m) / j) * 100;
    const markup = ((j - m) / m) * 100;
    return ok(`Margin ${fmt(margin, 2)}%`, `Markup ${fmt(markup, 2)}%`);
  },
};

const bunga: Tool = {
  id: "bunga",
  cat: "fin",
  label: "Bunga",
  icon: iBunga,
  fields: () => [f("pokok", "Pokok"), f("rate", "Bunga / tahun (%)"), f("tahun", "Lama (tahun)")],
  compute: (v) => {
    const p = num(v, "pokok"), r = num(v, "rate"), t = num(v, "tahun");
    if (p === null || r === null || t === null) return no("Lengkapi input");
    const simple = p * (1 + (r / 100) * t);
    const compound = p * Math.pow(1 + r / 100, t);
    return ok(`Majemuk ${fmt(compound, 2)}`, `Tunggal ${fmt(simple, 2)}`);
  },
};

const zakat: Tool = {
  id: "zakat",
  cat: "fin",
  label: "Zakat",
  icon: iZakat,
  fields: () => [f("harta", "Total harta / tahun")],
  compute: (v) => {
    const h = num(v, "harta");
    if (h === null) return no("Masukkan total harta");
    return ok(fmt(h * 0.025, 2), "Zakat mal 2,5% (bila capai nisab)");
  },
};

export const finansial: Tool[] = [diskon, cicilan, untungRugi, marginMarkup, bunga, zakat];
