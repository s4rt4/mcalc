import type { Tool, Field } from "../types";
import { num, fmt, ok, no } from "../format";
import { parseDate, fmtDate, diffDays, addDays, todayISO } from "../dateutil";
import iSelisih from "../../../svg/calendar-clock.svg?raw";
import iUmur from "../../../svg/smile.svg?raw";
import iTambah from "../../../svg/diff.svg?raw";
import iHariKerja from "../../../svg/briefcase-business.svg?raw";
import iCountdown from "../../../svg/hourglass.svg?raw";

const dateField = (key: string, label: string, today = false): Field => ({
  key,
  label,
  type: "date",
  default: today ? todayISO() : undefined,
});
const fnum = (key: string, label: string): Field => ({ key, label, type: "number", placeholder: label });

const selisihTanggal: Tool = {
  id: "selisihTanggal",
  cat: "tgl",
  label: "Selisih Tanggal",
  icon: iSelisih,
  keywords: ["selisih", "beda tanggal", "durasi", "jumlah hari", "date diff"],
  fields: () => [dateField("d1", "Tanggal awal"), dateField("d2", "Tanggal akhir", true)],
  compute: (v) => {
    const a = parseDate(v.d1), b = parseDate(v.d2);
    if (!a || !b) return no("Pilih kedua tanggal");
    const d = Math.abs(diffDays(a, b));
    return ok(`${fmt(d)} hari`, `≈ ${fmt(Math.floor(d / 7))} mgg · ${fmt(d / 30.44, 1)} bln`);
  },
};

const umur: Tool = {
  id: "umur",
  cat: "tgl",
  label: "Hitung Umur",
  icon: iUmur,
  keywords: ["umur", "usia", "age", "ulang tahun", "lahir"],
  fields: () => [dateField("lahir", "Tanggal lahir")],
  compute: (v) => {
    const b = parseDate(v.lahir);
    if (!b) return no("Pilih tanggal lahir");
    const now = new Date();
    if (b.getTime() > now.getTime()) return no("Tanggal belum terjadi");
    let y = now.getFullYear() - b.getFullYear();
    let m = now.getMonth() - b.getMonth();
    let d = now.getDate() - b.getDate();
    if (d < 0) {
      m--;
      d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    return ok(`${y} th ${m} bln ${d} hr`, `Total ${fmt(diffDays(b, now))} hari`);
  },
};

const tambahHari: Tool = {
  id: "tambahHari",
  cat: "tgl",
  label: "Tambah / Kurang Hari",
  icon: iTambah,
  keywords: ["tambah hari", "kurang hari", "add days", "tenggat", "deadline", "jatuh tempo"],
  fields: () => [dateField("d", "Tanggal", true), fnum("n", "Jumlah hari (− untuk mundur)")],
  compute: (v) => {
    const d = parseDate(v.d), n = num(v, "n");
    if (!d) return no("Pilih tanggal");
    if (n === null) return no("Masukkan jumlah hari");
    const k = Math.round(n);
    return ok(fmtDate(addDays(d, k)), `${k >= 0 ? "+" : ""}${fmt(k)} hari`);
  },
};

const hariKerja: Tool = {
  id: "hariKerja",
  cat: "tgl",
  label: "Hari Kerja",
  icon: iHariKerja,
  keywords: ["hari kerja", "workday", "weekday", "kerja efektif", "senin jumat"],
  fields: () => [dateField("d1", "Tanggal awal"), dateField("d2", "Tanggal akhir", true)],
  compute: (v) => {
    let a = parseDate(v.d1), b = parseDate(v.d2);
    if (!a || !b) return no("Pilih kedua tanggal");
    if (a.getTime() > b.getTime()) [a, b] = [b, a];
    let count = 0;
    for (let cur = new Date(a); cur.getTime() <= b.getTime(); cur = addDays(cur, 1)) {
      const wd = cur.getDay();
      if (wd !== 0 && wd !== 6) count++;
    }
    return ok(`${fmt(count)} hari kerja`, `dari ${fmt(diffDays(a, b) + 1)} hari (Sen–Jum)`);
  },
};

const countdown: Tool = {
  id: "countdown",
  cat: "tgl",
  label: "Hitung Mundur",
  icon: iCountdown,
  keywords: ["countdown", "hitung mundur", "sisa hari", "acara", "event", "deadline"],
  fields: () => [dateField("target", "Tanggal tujuan")],
  compute: (v) => {
    const t = parseDate(v.target);
    if (!t) return no("Pilih tanggal tujuan");
    const now = parseDate(todayISO())!;
    const d = diffDays(now, t);
    if (d === 0) return ok("Hari ini! 🎉", "Tepat di tanggal tujuan");
    return d > 0
      ? ok(`${fmt(d)} hari lagi`, fmtDate(t))
      : ok(`${fmt(-d)} hari lalu`, `${fmtDate(t)} sudah lewat`);
  },
};

export const tanggal: Tool[] = [selisihTanggal, umur, tambahHari, hariKerja, countdown];
