export interface Option {
  value: string;
  label: string;
  /** SVG markup mentah untuk ditampilkan di picker. */
  icon?: string;
}

export interface Field {
  key: string;
  label: string;
  type: "number" | "select";
  placeholder?: string;
  options?: Option[];
  /** Render select sebagai grid tombol ber-ikon, bukan dropdown. */
  picker?: boolean;
}

export type Values = Record<string, string>;

export interface Result {
  ok: boolean;
  /** Angka/hasil utama yang tampil besar di display. */
  main: string;
  /** Keterangan kecil di atas hasil (mis. "100 kg ="). */
  caption?: string;
}

export interface Tool {
  id: string;
  cat: string;
  label: string;
  /** SVG markup mentah (inline via {@html}). */
  icon: string;
  /** Field bisa dinamis tergantung nilai sekarang (mis. pilihan bangun). */
  fields: (v: Values) => Field[];
  compute: (v: Values) => Result;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}
