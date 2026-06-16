# M-Calc

Kalkulator serbaguna **ringan** untuk desktop Windows — 58 alat hitung dalam satu
jendela compact, lengkap dengan pencarian global. Penulisan ulang
`kalkulator-serbaguna` (single-file HTML) menjadi aplikasi native dengan Tauri.

<p align="center">
  <img src="screenshots/light.png" width="260" alt="M-Calc mode terang" />
  &nbsp;
  <img src="screenshots/dark.png" width="260" alt="M-Calc mode gelap" />
  &nbsp;
  <img src="screenshots/search.png" width="260" alt="Pencarian global M-Calc" />
</p>

## Fitur

- **58 alat** dalam 6 kategori (navigasi bottom-tabs + chip per alat)
- **Pencarian global instan** — ketik kata kunci (mis. `persegi`, `ppn`, `bmi`);
  hasil mencakup deep-link per bentuk, mendukung sinonim Indonesia dan Inggris
- **Perhitungan live** — hasil langsung muncul saat mengetik, tanpa tombol
- **Salin hasil** ke clipboard sekali klik
- **Mode terang & gelap** dengan palet cokelat serasi logo
- **Sangat ringan** — installer hanya ~1,9 MB, RAM kecil (WebView2 bawaan Windows)

### Daftar alat

| Kategori | Alat |
|---|---|
| **Geometri** | Volume · Luas Permukaan · Keliling · Luas Datar · Pythagoras · Jarak 2 Titik · Diagonal · Juring & Busur · Gradien Garis |
| **Konversi** | Berat · Jarak · Suhu · Mata Uang · Waktu · Kecepatan · Luas · Volume Cairan · Data Digital · Bilangan (basis) · Tekanan · Energi · Daya · Sudut · Angka Romawi · Konsumsi BBM |
| **Matematika** | Persentase · Pecahan · Skala · FPB & KPK · Persamaan Kuadrat · Statistik · Permutasi & Kombinasi · Trigonometri · Logaritma & Pangkat · Barisan & Deret · Faktorisasi Prima |
| **Finansial** | Diskon · Cicilan · Untung/Rugi · Margin & Markup · Bunga · Zakat · PPN/Pajak · KPR/Anuitas · Target Tabungan · Patungan/Split Bill · BEP |
| **Kesehatan** | BMI · Berat Ideal · BMR & Kalori · Kebutuhan Air · Lemak Tubuh · HPL Kehamilan |
| **Tanggal** | Selisih Tanggal · Hitung Umur · Tambah/Kurang Hari · Hari Kerja · Hitung Mundur |

## Unduh

Ambil installer terbaru di **[Releases](https://github.com/s4rt4/mcalc/releases/latest)**:
unduh `m-calc_x.y.z_x64-setup.exe`, jalankan (per-user, tanpa admin), Windows x64.
Installer mendeteksi versi terpasang dan meng-upgrade in-place tanpa perlu uninstall
versi sebelumnya.

## Tech stack

- **Tauri 2** (Rust + WebView2) — binary kecil, hemat RAM
- **Svelte 5** (runes) + **Vite 6** + **TypeScript**
- **Tailwind CSS v4**

Bundle frontend: ~123 KB JS / ~20 KB CSS (sekitar 43 KB gzip).

## Arsitektur

Tiap alat didefinisikan secara *data-driven* di `src/lib/tools/`
(`geometri` · `konversi` · `matematika` · `finansial` · `kesehatan` · `tanggal`)
sebagai objek `Tool` berisi field deklaratif + fungsi `compute` murni, lalu
dirender oleh satu komponen generik `ToolView.svelte`. Menambah alat = menambah
satu objek. Pencarian global dibangun otomatis dari label, kategori, dan kata
kunci tiap alat.

```
src/
├─ App.svelte              # shell: searchbar + chip row + konten + bottom bar
├─ lib/
│  ├─ ToolView.svelte      # renderer generik (display + input)
│  ├─ Field.svelte         # input / dropdown / shape-picker / date
│  ├─ search.ts            # indeks & pencarian global
│  ├─ dateutil.ts          # util tanggal
│  ├─ types.ts, format.ts
│  └─ tools/               # definisi 58 alat (6 kategori)
svg/                       # logo + ikon (lucide, currentColor)
src-tauri/                 # backend Rust + konfigurasi + installer
```

## Pengembangan

```bash
pnpm install
pnpm tauri dev      # dev (port 1430 — sengaja beda agar tak bentrok project Tauri lain)
pnpm tauri build --bundles nsis   # installer Windows (.exe)
```

## Kustomisasi tema

Palet aksen dipusatkan di blok `@theme` pada `src/app.css` — ubah 4 baris hex
`--color-brand-*` untuk mengganti seluruh aksen aplikasi.

## Catatan

- Kurs mata uang masih **statik** (USD/IDR/EUR/JPY).
- Ikon & logo: SVG di `svg/` (format lucide `currentColor`); app icon di-generate
  dari `svg/logo.svg` via `pnpm tauri icon`.

## Lisensi

MIT (c) Sarta
