# Animasi Badge Chat — Konten.com

Preview 4 opsi animasi badge chat baru (morph skala 0.95 → 1) pada tombol chat
aplikasi mobile Konten.com. Dibuat dengan React, Tailwind CSS v4, dan Motion.

## Opsi

| Opsi | Gerakan |
| --- | --- |
| A · Pop | Hanya badge: 0.95 → 1 + fade, 200ms ease-out |
| B · Pulse | Badge dan tombol morph 0.95 → 1 bersamaan (spring 0.4s, tanpa bounce) |
| C · Tumbuh | Badge keluar dari arah tombol, tombol menyusul morph 60ms kemudian |
| D · Bergulir | Badge morph 0.95 → 1, angka bergulir ke atas saat bertambah |

Komponen utama: `src/ChatFab.tsx` (prop `variant`: `"pop" | "pulse" | "grow" | "roll"`).

## Menjalankan lokal

```bash
npm install
npm run dev
```

## Deploy ke Vercel

**Lewat GitHub (disarankan):** push folder ini ke repo GitHub, lalu di
vercel.com pilih **Add New → Project → Import** repo tersebut. Pengaturan build
terbaca otomatis dari `vercel.json`. Klik **Deploy**.

**Lewat CLI:**

```bash
npx vercel        # preview URL
npx vercel --prod # production URL
```

## File HTML tunggal (tanpa server)

```bash
npm run build:single
```

Hasilnya `dist-single/index.html`, bisa dibuka langsung dengan double-click.
