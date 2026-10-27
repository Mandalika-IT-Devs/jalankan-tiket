# Mulai cepat

Panduan ini membawa Anda dari nol sampai Claude mengerjakan tiket pertama sendiri.

## Yang perlu ada di laptop

- **Claude Code**, versi 2.1.299 atau lebih baru. Bisa CLI, bisa juga tab Code di Claude Desktop.
- **Git dan GitHub CLI (`gh`)**. Login dengan `gh auth login`.
  - Token login butuh izin `repo` dan `workflow`, karena kit menulis berkas CI.
  - Bila izin `workflow` belum ada, tambahkan dengan `gh auth refresh -s workflow`.
- **`jq`.**
- **Untuk stack bawaan (Next.js + PostgreSQL):**
  - Node.js LTS, versi 22 atau 24;
  - pnpm (aktifkan dengan `corepack enable`);
  - Docker yang bisa dipakai tanpa `sudo`.

## 1. Pasang plugin (sekali per laptop)

Di sesi Claude Code, ketik satu per satu:

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add Mandalika-IT-Devs/jalankan-tiket
/plugin install tiket@jalankan-tiket
```

Setelah itu, buka sesi baru atau ketik `/reload-plugins`. mattpocock-skills ikut terpasang otomatis.

Supaya kit selalu versi terbaru, nyalakan auto-update: `/plugin` → Marketplaces → `jalankan-tiket` → Enable auto-update.

## 2. Siapkan proyek

1. Siapkan foldernya:
   - **proyek baru:** buat folder kosong;
   - **proyek lama:** buka repo yang sudah ada. Bacaan tambahannya ada di [Proyek lama](existing-projects.md).
2. Buka sesi Claude Code di folder itu, lalu pilih mode izin **Auto**.
3. Ketik:

   ```
   /tiket:siapkan-proyek
   ```

Claude akan menanyakan:
- bahasa;
- nama produk;
- repo GitHub;
- stack;
- jenis CI;
- apakah produk punya tampilan.

Setiap pertanyaan punya satu pilihan rekomendasi, jadi Anda bisa menjawab "setuju semua".

Hasilnya:
- repo GitHub;
- label dan milestone M1;
- CI;
- semua dokumen awal yang masih kosong.

Di akhir, Claude memberi dua perintah. Jalankan keduanya sendiri dengan mengetik `!` di depannya:
- satu untuk melindungi branch `main`, yang hanya berlaku bila repo Anda publik atau akun GitHub Anda berbayar;
- satu untuk menyalakan Dependabot alerts, supaya GitHub mengirim email saat library proyek punya celah keamanan baru.

Setelah kedua perintah itu, siapkan **akun agen**: akun GitHub terpisah yang dipakai agent untuk menulis ke GitHub, supaya akun pribadi Anda tidak terlihat seperti bot spam. Langkahnya ada di [Akun agen](agent-account.md). Skill berikutnya berhenti selama `gh` masih memakai akun Anda.

## 3. Rencanakan produk

1. Taruh semua bahan tentang produk di `docs/input/`: catatan, dokumen, dan contoh berkas.
2. Ketik:

   ```
   /tiket:rencanakan-produk
   ```

Ini sesi tanya-jawab terpanjang. Claude akan menanyai Anda sampai setiap aturan, angka, dan rumus jelas. Setelah itu Claude menulis:
- PRD;
- glosarium;
- daftar keputusan terbuka;
- skenario UAT;
- contoh hitungan.

Semua dokumen itu masuk lewat PR. Pasang label `disetujui-pemilik` di PR tersebut.

## 4. Rencanakan tahap pertama

```
/tiket:rencanakan-tahap
```

Claude mengusulkan isi tahap M1, menanyakan keputusan yang dibutuhkan, lalu membuat tiketnya di GitHub. Tiket pertama selalu `[T00]` fondasi.

## 5. Jalankan

```
/tiket:jalankan
```

Biarkan berjalan. Claude mengerjakan tiket satu per satu, dengan urutan:
1. menulis kode;
2. meninjau hasilnya;
3. membuka PR;
4. menunggu CI;
5. me-merge.

Bila menemukan pertanyaan bisnis, Claude memarkir tiket itu dan lanjut ke tiket lain. Di akhir, Anda menerima laporan berisi pertanyaan beserta rekomendasinya.

## 6. Jawab, lalu lanjutkan

```
/tiket:catat-keputusan
```

Jawab "setuju semua", atau sebut nomor yang jawabannya berbeda. Setelah PR keputusan di-merge, jalankan `/tiket:jalankan` lagi.

Ragu apa langkah berikutnya? Ketik `/tiket:cek-proyek`. Claude akan memeriksa proyek dan menyebut langkah selanjutnya.

Baca berikutnya: [Cara kerja](how-it-works.md) · [Daftar perintah](commands.md) · [Proyek lama](existing-projects.md)
