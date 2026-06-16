import type { Tool, Field, Option } from "../types";
import { num, fmt, ok, no } from "../format";
import iDiskon from "../../../svg/ticket-percent.svg?raw";
import iCicilan from "../../../svg/chart-no-axes-combined.svg?raw";
import iUntung from "../../../svg/diff.svg?raw";
import iMargin from "../../../svg/chart-pie.svg?raw";
import iBunga from "../../../svg/badge-percent.svg?raw";
import iZakat from "../../../svg/heart-handshake.svg?raw";
import iPpn from "../../../svg/scroll-text.svg?raw";
import iKpr from "../../../svg/house.svg?raw";
import iTabungan from "../../../svg/piggy-bank.svg?raw";
import iSplit from "../../../svg/receipt-text.svg?raw";
import iBep from "../../../svg/chart-column.svg?raw";

const f = (key: string, label: string): Field => ({ key, label, type: "number", placeholder: label });
const opt = (value: string, label: string): Option => ({ value, label });

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

const ppn: Tool = {
  id: "ppn",
  cat: "fin",
  label: "PPN / Pajak",
  icon: iPpn,
  keywords: ["ppn", "pajak", "tax", "vat", "faktur"],
  fields: () => [
    f("harga", "Harga"),
    { key: "tarif", label: "Tarif (%)", type: "number", placeholder: "11", default: "11" },
    {
      key: "mode",
      label: "Mode",
      type: "select",
      options: [opt("ex", "Harga belum termasuk PPN"), opt("in", "Harga sudah termasuk PPN")],
    },
  ],
  compute: (v) => {
    const h = num(v, "harga"), t = num(v, "tarif");
    if (h === null || t === null) return no("Lengkapi input");
    if ((v.mode || "ex") === "ex") {
      const pajak = (h * t) / 100;
      return ok(fmt(h + pajak, 2), `Termasuk PPN · pajak ${fmt(pajak, 2)} (${fmt(t)}%)`);
    }
    const dpp = h / (1 + t / 100);
    return ok(fmt(dpp, 2), `Harga sebelum PPN · pajak ${fmt(h - dpp, 2)}`);
  },
};

const anuitas: Tool = {
  id: "anuitas",
  cat: "fin",
  label: "KPR / Anuitas",
  icon: iKpr,
  keywords: ["kpr", "anuitas", "kredit", "pmt", "pinjaman", "mortgage", "rumah", "cicilan"],
  fields: () => [f("pinjaman", "Jumlah pinjaman"), f("bunga", "Bunga / tahun (%)"), f("tenor", "Tenor (bulan)")],
  compute: (v) => {
    const p = num(v, "pinjaman"), b = num(v, "bunga"), n = num(v, "tenor");
    if (p === null || b === null || n === null) return no("Lengkapi input");
    if (n <= 0) return no("Tenor harus > 0");
    const r = b / 100 / 12;
    const angsuran = r === 0 ? p / n : (p * r) / (1 - Math.pow(1 + r, -n));
    const total = angsuran * n;
    return ok(`${fmt(angsuran, 2)} /bln`, `Total bayar ${fmt(total, 2)} · bunga ${fmt(total - p, 2)}`);
  },
};

const targetTabungan: Tool = {
  id: "targetTabungan",
  cat: "fin",
  label: "Target Tabungan",
  icon: iTabungan,
  keywords: ["tabungan", "target", "saving", "nabung", "investasi", "menabung"],
  fields: () => [f("target", "Target dana"), f("bunga", "Bunga / tahun (%)"), f("bulan", "Lama (bulan)")],
  compute: (v) => {
    const fv = num(v, "target"), b = num(v, "bunga"), n = num(v, "bulan");
    if (fv === null || b === null || n === null) return no("Lengkapi input");
    if (n <= 0) return no("Lama harus > 0");
    const r = b / 100 / 12;
    const setoran = r === 0 ? fv / n : (fv * r) / (Math.pow(1 + r, n) - 1);
    return ok(`${fmt(setoran, 2)} /bln`, `Total setoran ${fmt(setoran * n, 2)} → ${fmt(fv, 2)}`);
  },
};

const patungan: Tool = {
  id: "patungan",
  cat: "fin",
  label: "Patungan / Split Bill",
  icon: iSplit,
  keywords: ["patungan", "split", "bill", "bagi", "tagihan", "share", "tip", "traktir"],
  fields: () => [f("total", "Total tagihan"), f("orang", "Jumlah orang"), f("tip", "Tip (%) opsional")],
  compute: (v) => {
    const total = num(v, "total"), orang = num(v, "orang"), tip = num(v, "tip") ?? 0;
    if (total === null || orang === null) return no("Lengkapi input");
    if (orang <= 0) return no("Jumlah orang harus > 0");
    const grand = total * (1 + tip / 100);
    return ok(`${fmt(grand / orang, 2)} /orang`, `Total ${fmt(grand, 2)}${tip ? ` (+${fmt(tip)}% tip)` : ""}`);
  },
};

const bep: Tool = {
  id: "bep",
  cat: "fin",
  label: "BEP (Titik Impas)",
  icon: iBep,
  keywords: ["bep", "break even", "impas", "titik impas", "modal balik"],
  fields: () => [f("tetap", "Biaya tetap"), f("harga", "Harga jual / unit"), f("variabel", "Biaya variabel / unit")],
  compute: (v) => {
    const tetap = num(v, "tetap"), harga = num(v, "harga"), variabel = num(v, "variabel");
    if (tetap === null || harga === null || variabel === null) return no("Lengkapi input");
    const margin = harga - variabel;
    if (margin <= 0) return no("Harga jual harus > biaya variabel");
    const unit = tetap / margin;
    return ok(`${fmt(Math.ceil(unit))} unit`, `Omzet impas ${fmt(unit * harga, 2)}`);
  },
};

export const finansial: Tool[] = [
  { ...diskon, keywords: ["diskon", "discount", "potongan", "obral"] },
  { ...cicilan, keywords: ["cicilan", "angsuran", "kredit", "flat", "installment"] },
  { ...untungRugi, keywords: ["untung", "rugi", "laba", "profit", "loss"] },
  { ...marginMarkup, keywords: ["margin", "markup", "laba", "profit"] },
  { ...bunga, keywords: ["bunga", "interest", "majemuk", "compound", "deposito", "tunggal"] },
  { ...zakat, keywords: ["zakat", "mal", "nisab", "sedekah", "infak"] },
  ppn,
  anuitas,
  targetTabungan,
  patungan,
  bep,
];
