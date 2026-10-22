# Panduan Pemilik Produk

Peran Anda adalah pemilik produk. Claude Code mengerjakan, meninjau, dan me-merge tiket sendiri lewat plugin `tiket`. Tugas Anda ada empat:
- merencanakan produk dan setiap tahap;
- menjawab pertanyaan bisnis saat ada tiket yang diparkir;
- memasang label `{{LABEL_OWNER_APPROVED}}` pada PR yang mengubah berkas terlindungi;
- melakukan UAT.

## Aturan satu koordinator

Hanya satu orang yang boleh menjalankan `/tiket:jalankan` di repo ini pada satu waktu. Kalau ada dua koordinator berjalan bersamaan, keduanya akan mengambil tiket yang sama dan saling menimpa `main`.

## Menjalankan tiket

1. Siapkan laptop:
   - nyalakan Docker, bila proyek ini memakainya;
   - colokkan laptop ke listrik;
   - matikan mode tidur otomatis.
2. Buka sesi Claude Code di folder repo, lalu pilih mode izin **Auto**.
3. Ketik `/tiket:jalankan`, lalu biarkan berjalan. Setiap putaran mengerjakan satu tiket: pelaksana → peninjau → PR → CI → merge.

Kalau sesi terputus, misalnya karena kuota habis atau laptop mati, buka sesi baru dan ketik `/tiket:jalankan` lagi. Pekerjaan berlanjut dari keadaan terakhir di GitHub.

## Saat koordinator berhenti dengan laporan akhir

- **Ada tiket yang diparkir.** Laporan memuat pertanyaan bernomor, dan setiap pertanyaan punya satu pilihan rekomendasi.
  1. Jalankan `/tiket:catat-keputusan`.
  2. Jawab, misalnya "setuju semua" atau "setuju semua kecuali 2: pilih c".
  3. Jalankan `/tiket:jalankan` lagi.
- **Keputusan Anda mengubah berkas terlindungi**, misalnya PRD. PR-nya membutuhkan label `{{LABEL_OWNER_APPROVED}}`, dan label itu Anda pasang sendiri di GitHub.
- **Semua tiket di tahap ini sudah tertutup.** Lanjutkan dengan merencanakan tahap berikutnya.

## Merencanakan

Ada dua sesi yang membutuhkan Anda aktif menjawab:
- `/tiket:rencanakan-produk`: sekali di awal proyek, atau saat produk berubah besar. Sesi ini menyusun PRD, glosarium, ADR, keputusan terbuka, skenario UAT, dan contoh hitungan dari bahan di `docs/input/`.
- `/tiket:rencanakan-tahap`: sekali per tahap. Sesi ini menanyakan keputusan yang dibutuhkan tahap itu, lalu membuat tiket di milestone-nya.

Setelah satu tahap selesai, jalankan `/retro` dari mattpocock-skills. Perintah ini memperbaiki aturan dan CI berdasarkan pengalaman di tahap itu.

## Memeriksa kesehatan proyek

`/tiket:cek-proyek` memeriksa berkas kit, label, milestone, CI, dan versi plugin, lalu menyebut langkah berikutnya. Jalankan kapan saja Anda ragu.

## UAT

Setelah tiket paket UAT selesai, ikuti `docs/UAT.md`. Setiap temuan dilaporkan sebagai tiket perbaikan baru.
