# Catatan Demo Modul 3

## Langkah 1 — Fondasi asynchronous dan tipe

**File yang ditambahkan**

- `utils/delay.ts`
- `types/api.ts`
- `types/product.ts`
- `types/article.ts`
- `services/api.ts`
- `components/Loading.tsx`
- `components/ErrorMessage.tsx`

**Cara kerjanya**

- `delay(ms)` membuat Promise yang selesai setelah `setTimeout`.
- `fetchJson<T>()` mengambil data dengan `fetch`, memeriksa `response.ok`, lalu mengubah respons menjadi JSON bertipe `T`. Fungsi ini memakai `resolve` jika berhasil dan `reject` jika server, jaringan, atau timeout bermasalah.
- Interface mendeskripsikan bentuk respons produk dan post dari API, serta bentuk artikel yang dipakai aplikasi.
- `Loading` dan `ErrorMessage` adalah tampilan bersama agar layar bisa menunjukkan proses memuat atau menawarkan tombol coba lagi.

**Kaitan dengan rubrik**

- **Async function dan Promise:** `delay` adalah custom Promise; `fetchJson` membungkus proses fetch dalam Promise.
- **`.then()`, `resolve()`, dan `reject()`:** `fetchJson` memakai `.then()` untuk memproses respons, `resolve()` untuk hasil sukses, dan `reject()` untuk kegagalan.
- **Interface:** `ApiResponse<T>`, `ProductApi`, `PostApi`, dan `Article` memberi bentuk yang jelas pada data.

## Langkah 2 — Marketplace dari API

**File yang ditambahkan atau diubah**

- `services/productService.ts`
- `app/marketplace.tsx`

**Cara kerjanya**

- `getProducts()` memakai `await` untuk mengambil respons produk, menunggu satu detik agar tampilan loading terlihat, lalu memetakan data mentah ke interface `Product` yang sudah ada. Contohnya, `title` API menjadi `name` aplikasi.
- Hasil yang berhasil disimpan dalam cache sederhana di dalam modul. Pemanggilan berikutnya memakai `Promise.resolve(cache)`.
- Marketplace memakai state untuk daftar produk, status loading, dan pesan error. Tombol coba lagi menjalankan pemuatan ulang.
- Filter memakai daftar dari state `products` dan `keyword`. Debounce 300 ms, cleanup `clearTimeout`, dan `useMemo` tetap dipakai.

**Kaitan dengan rubrik**

- **Mengambil data External API dengan Interface:** `ProductApi` menjadi bentuk data mentah, lalu mapper membuat object `Product`.
- **Async function:** `getProducts()` memakai `async/await`; `delay()` adalah custom async helper berbasis Promise.
- **Modifikasi langsung:** bagian URL, jeda, ikon default, atau aturan pemetaan dapat diubah sebagai latihan yang mudah diamati.

## Langkah 3 — Berita dan tips dari API

**File yang ditambahkan atau diubah**

- `services/articleService.ts`
- `components/home/home-sections.tsx`
- `app/index.tsx`

**Cara kerjanya**

- `getArticles()` mengambil daftar post dan memakai rantai `.then()` untuk memetakan tiap post ke `Article`, tanpa `async/await`.
- Tag pertama menjadi kategori. Waktu baca dihitung dari jumlah kata pada `body` dengan perkiraan 200 kata per menit dan minimal satu menit. Tanggal, ikon, dan warna memakai nilai default.
- `NewsSection` memiliki state loading dan error, serta tombol untuk mencoba mengambil artikel lagi. Chip filter dibentuk dari kategori unik yang berhasil diterima, ditambah “Semua”.
- Data statis di `data/home.ts` tetap disimpan.

**Kaitan dengan rubrik**

- **Mengambil data External API dengan Interface:** respons post bertipe `PostsApiResponse` dan hasil pemetaan bertipe `Article`.
- **`.then()`:** alur service memproses respons dan hasil pemetaan secara berantai; kegagalan diteruskan ke `.catch()`.
- **Modifikasi langsung:** tag kategori atau rumus waktu baca dapat diubah lalu hasilnya dilihat pada kartu berita.

## Langkah 4 — Profil Akun dari API

**File yang ditambahkan atau diubah**

- `types/user.ts`
- `app/account.tsx`

**Cara kerjanya**

- Halaman Akun mengambil `/users/1` dengan `fetchJson<User>()`.
- `.then()` menyimpan data pengguna ke state. Halaman menunjukkan nama dari `firstName` dan `lastName`, serta menyediakan loading, pesan error, dan coba lagi.
- Navigasi kembali yang sudah ada tetap berjalan.

**Kaitan dengan rubrik**

- **Mengambil data External API dengan Interface:** respons pengguna diketik dengan interface `User`.
- **`.then()`:** hasil fetch disimpan ke state melalui `.then()`, sedangkan kegagalan ditangani dengan `.catch()`.
- **Modifikasi langsung:** ganti ID pada URL untuk meminta profil lain, atau ubah field nama yang ditampilkan.

## Tiga pertanyaan yang mungkin ditanyakan

### 1. Kenapa fungsi `async` mengembalikan Promise? Apa beda `return` dan `resolve`?

Fungsi yang diberi `async` selalu menghasilkan Promise. Nilai yang dikembalikan dengan `return` menjadi hasil sukses Promise tersebut; kalau terjadi error, Promise ditolak. `resolve` adalah fungsi yang diberikan oleh `new Promise((resolve, reject) => ...)` untuk menandai bahwa Promise selesai dengan hasil sukses. Jadi `return` dipakai di dalam fungsi, sedangkan `resolve` dipakai untuk menyelesaikan Promise yang dibuat manual. `reject` menyelesaikan Promise dengan kondisi gagal.

### 2. Kenapa `useEffect` tidak bisa langsung `async`? Apa fungsi dependency array `[]`, dan apa arti `response.ok`? Apa beda GET dan POST?

Callback `useEffect` dipakai untuk pekerjaan efek dan boleh mengembalikan fungsi cleanup. Fungsi `async` selalu mengembalikan Promise, bukan fungsi cleanup, jadi buat fungsi `async` di dalam effect lalu panggil dari sana. Dependency array `[]` berarti effect berjalan saat komponen dipasang (mount), bukan setiap render. `response.ok` bernilai `true` untuk status HTTP sukses, yaitu rentang 200–299. GET biasanya meminta atau membaca data; POST biasanya mengirim data baru ke server lewat body request.

### 3. Kenapa debounce memakai `setTimeout` dan `clearTimeout`? Apa bedanya dengan `setTimeout` pada API?

Debounce menunda pemrosesan pencarian selama 300 ms supaya pencarian hanya diperbarui setelah pengguna berhenti mengetik. Setiap perubahan input membersihkan timer sebelumnya dengan `clearTimeout`, sehingga timer lama tidak ikut berjalan. Timer debounce hanya mengatur waktu pemrosesan input di aplikasi; fetch API adalah permintaan jaringan yang berjalan asynchronous dan waktunya bergantung pada server serta jaringan. Timeout di `fetchJson` berbeda lagi: timer itu menolak Promise jika permintaan belum selesai dalam batas waktu yang ditentukan.
