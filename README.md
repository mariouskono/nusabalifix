# NUSABali - Aplikasi Rekomendasi Wisata di Kepulauan Bali

**NUSABali** merupakan aplikasi yang dirancang untuk memudahkan wisatawan, baik dari dalam negeri maupun mancanegara. Proyek ini dikembangkan sebagai bagian dari Tugas Akhir dalam program Studi Independen bersama Coding Camp 2025 yang didukung oleh DBS Foundation.

## Deskripsi Aplikasi

**NUSABali** adalah platform terpadu yang bertujuan untuk membantu wisatawan merencanakan kunjungan wisata di Bali. Aplikasi ini menyediakan berbagai fitur unggulan untuk mempermudah pengguna dalam memilih destinasi, antara lain:

- **Kategori Wisata:** Menyediakan empat kategori utama, yaitu Alam, Rekreasi, Umum, dan Budaya.
- **Wilayah Tujuan:** Menampilkan destinasi berdasarkan wilayah administratif di Bali, mencakup 8 kabupaten dan 1 kota.
- **Filter Berdasarkan Rating:** Pengguna dapat menyaring tempat wisata sesuai dengan rating atau ulasan yang diinginkan.
- **Tampilan Rute pada Peta:** Menyediakan visualisasi rute perjalanan berdasarkan hasil rekomendasi yang telah dipilih pengguna.

## Struktur Proyek

Proyek ini terdiri dari tiga komponen utama:

### 1. **NUSABali (Frontend)**
Antarmuka pengguna web yang dibangun menggunakan:
- **Progressive Web App (PWA) support**
- **Model, View, Presenter (MVP)**
- Menggunakan **Transition yang mulus** dan **animasi**
- Mengembangkan **modular bundler** dari **webpack**
- Menggunakan **HTML, CSS, JavaScript**

### 2. **NUSABali (Backend)**
Layanan RESTful API yang menyajikan:
- **Fitur rekomendasi**

Teknologi yang digunakan:
- **Node.js**
- **Hapi.js framework**

### 3. **Inference (Model Machine Learning)**
Komponen Machine Learning untuk sistem rekomendasi destinasi wisata di Bali mencakup:
- **Model Deep Learning (FCNN/MLP)** yang merekomendasikan destinasi berdasarkan lokasi dan rating, disimpan dalam format `.h5`.
- **Dashboard interaktif** menggunakan **Streamlit** untuk menampilkan rekomendasi dan tombol rute ke Google Maps.
- **Integrasi API dan backend** untuk menghubungkan model dan dataset, memastikan pengalaman pengguna yang responsif di platform web.

## Instalasi dan Pengaturan Proyek

### Instalasi Frontend
1. Instal dependensi:
   ```bash
   npm install
    ```

2. Jalankan untuk development:

   ```bash
   npm run dev
   ```

3. Build Website (Dist):

   ```bash
   npm run build
   ```

### Instalasi Backend

1. Masuk ke direktori backend:

   ```bash
   cd backend
   ```

2. Instal dependensi:

   ```bash
   npm install
   ```

3. Jalankan server:

   ```bash
   npm start
   ```

## Deployment

Aplikasi ini dirancang untuk dapat di-deploy dalam beberapa cara:

* **Frontend:** Netlify (Yang kami pakai), Vercel, atau hosting statis lainnya
* **Backend:** Railway (Yang kami pakai), Heroku, AWS, atau layanan cloud lainnya

## Tim Pengembang

NUSABali dikembangkan oleh Tim Mahasiswa dalam program Studi Independen Coding Camp 2025 yang didukung oleh DBS Foundation.

## Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT**.
