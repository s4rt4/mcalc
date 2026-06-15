import type { Result, Values } from "./types";

/** Ambil angka dari values; null bila kosong / tak valid. */
export const num = (v: Values, k: string): number | null => {
  const s = v[k];
  if (s === undefined || s.trim() === "") return null;
  const x = Number(s.replace(",", "."));
  return Number.isFinite(x) ? x : null;
};

/** Format angka gaya Indonesia, maksimum `d` desimal (trailing nol dibuang). */
export const fmt = (x: number, d = 4): string =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: d }).format(x);

export const ok = (main: string, caption?: string): Result => ({ ok: true, main, caption });

export const no = (caption = "Lengkapi input"): Result => ({ ok: false, main: "—", caption });
