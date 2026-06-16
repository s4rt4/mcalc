/** Util tanggal ringkas untuk alat kategori Kesehatan & Tanggal. */

const MS_DAY = 86400000;

/** Tanggal hari ini sebagai string "YYYY-MM-DD" (zona waktu lokal). */
export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Parse nilai input <input type=date> ("YYYY-MM-DD") → Date lokal, null bila kosong/invalid. */
export function parseDate(s: string | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Selisih hari (b − a), dibulatkan. */
export function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_DAY);
}

/** Tanggal + n hari (aman terhadap DST). */
export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Format gaya Indonesia: "16 Juni 2026". */
export function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
}
