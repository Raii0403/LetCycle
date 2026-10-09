# Letcycle

Aplikasi mobile bank sampah untuk membantu nasabah Purwokerto memantau saldo,
poin daur ulang, dampak setoran, tempat pengumpulan, dan berita daur ulang.

## Menjalankan aplikasi

```bash
npm install
npx expo start
```

Pindai kode QR dengan Expo Go, atau tekan `a` untuk membuka Android emulator.
Untuk menjalankan versi web, gunakan `npx expo start --web`.

## Struktur utama

- `app/`: rute Expo Router dan layar beranda.
- `components/home/`: komponen profil, ringkasan, kategori, berita, dan navigasi.
- `constants/`: palet warna aplikasi.
- `data/home.ts`: data contoh tempat setor, kategori, berita, dan fakta daur ulang.
