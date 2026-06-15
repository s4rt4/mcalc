# M-Calc

Kalkulator serbaguna ringan — penulisan ulang `kalkulator-serbaguna` (single-file HTML)
menjadi aplikasi desktop native.

## Tech stack

- **Tauri 2** (Rust + WebView2) — binary kecil, hemat RAM
- **Svelte 5** (runes) + **Vite 6** + **TypeScript**
- **Tailwind CSS v4**

Bundle frontend: ~52 KB JS / ~13 KB CSS (≈22 KB gzip).

## Layout

Satu jendela compact (~390×660) bergaya kalkulator HP, navigasi **bottom tabs**:

```
Header (judul + toggle tema)
Chip row (alat dalam kategori aktif)
Display hasil (live, tanpa tombol Hitung)
Input
Bottom tabs: 📐 Geometri · 🔄 Konversi · % Matematika · 💰 Finansial
```

16 alat: Volume, Luas Permukaan, Keliling, Luas Datar, Pythagoras, Berat, Jarak,
Suhu, Mata Uang, Waktu, Kecepatan, Persentase, Pecahan, Skala, Diskon, Cicilan.

Tiap alat didefinisikan secara *data-driven* di `src/lib/tools/` (field deklaratif +
fungsi `compute` murni), dirender oleh satu `ToolView.svelte`.

## Pengembangan

```bash
pnpm install
pnpm tauri dev      # dev (port 1430, tidak bentrok dgn project Tauri lain)
pnpm tauri build    # installer Windows
```

> Port dev sengaja **1430/1431** agar bisa jalan bersamaan dengan project Tauri
> lain (meusic/mark-hulk memakai 1420/1421).

## Catatan

- Kurs mata uang masih **statik** (USD/IDR/EUR/JPY), sama seperti versi lama.
- Ikon di `src-tauri/icons/` masih placeholder — ganti dengan ikon M-Calc lalu
  jalankan `pnpm tauri icon <path.png>`.
