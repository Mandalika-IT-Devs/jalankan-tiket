# Plugin qa: menguji aplikasi buatan tim lain

Plugin `qa` dibuat untuk QA engineer yang menguji aplikasi web buatan tim lain, misalnya ERP, HRIS, toko online, atau POS. Aplikasinya tidak perlu memakai kit ini. Claude menyiapkan pekerjaan QA, memeriksa apakah produk siap diuji, lalu menguji dari luar lewat browser di staging. Bug dilaporkan ke Trello, dan laporan uji ditulis ke Google Docs.

Plugin `tiket` membangun produk, sedangkan `qa` hanya menguji dan melaporkan. `qa` tidak pernah mengubah repo produk atau memperbaiki kodenya.

> **Status: 0.1.0, tahap 1.** Baru tersedia `/qa:siapkan-produk` dan `/qa:audit-kesiapan`. Perencanaan uji, pengujian, dan pelaporan menyusul di tahap 2 dan 3. Rancangannya ada di [ADR-0004](../adr/0004-qa-plugin.md).

## Yang perlu Anda siapkan

- **Akses ke produk:** akses baca ke repo GitHub-nya, URL staging, dan akun uji untuk setiap peran, misalnya admin dan kasir.
- **Di laptop:** Node.js 20.12 atau lebih baru, `git`, `jq`, dan GitHub CLI `gh` yang sudah login.
- **Konektor claude.ai:** Trello dan Google Drive. Sambungkan di pengaturan Connectors claude.ai, lalu buka sesi baru.

## Pasang

```
/plugin marketplace add Mandalika-IT-Devs/jalankan-tiket
/plugin install qa@jalankan-tiket
```

## Alur kerja

1. **Buka sesi Claude Code di folder kosong**, misalnya `~/qa-workspace`. Folder ini menjadi *workspace QA*: repo privat milik Anda yang menampung pekerjaan QA semua produk.
2. **`/qa:siapkan-produk contoh-org/toko-buku`.** Saat pertama kali dijalankan, perintah ini membuat workspace QA. Setelah itu ia menambahkan produk:
   - meng-clone repo produk, hanya untuk dibaca;
   - membaca dokumen dan kodenya untuk menyiapkan rekomendasi;
   - bertanya satu putaran kepada Anda: staging, peran, efek samping, board Trello, dan folder Drive;
   - menyiapkan list "QA – Perlu Ditinjau" di Trello dan folder bukti di Drive;
   - menulis konfigurasi produk dan skrip login.
3. **Isi akun uji sendiri.** Claude tidak pernah melihat kata sandi. Salin berkas contohnya, lalu isi di editor Anda:

   ```
   ! cp products/toko-buku/.env.local.example products/toko-buku/.env.local
   ```

4. **`/qa:audit-kesiapan toko-buku`.** Claude menjalankan 15 pemeriksaan dan menutupnya dengan hasil **SIAP**, **SIAP DENGAN CATATAN**, atau **TERBLOKIR**. Yang diperiksa:
   - pagar keamanan dan alat;
   - staging bisa dibuka dan memang bukan production;
   - versi yang diuji;
   - akun uji dan login tiap peran;
   - cakupan peran;
   - dokumen kebutuhan dan apakah bisa diuji;
   - data uji;
   - efek samping;
   - Trello dan Drive.

   Hasilnya disimpan di `readiness.md` dan Google Docs, lengkap dengan pertanyaan yang bisa Anda teruskan ke tim produk.

## Di mana hasilnya disimpan

| Apa | Tempat |
|---|---|
| Bug | Trello, satu kartu per bug. Kartu baru masuk list "QA – Perlu Ditinjau", lalu Anda memindahkannya ke developer |
| Rencana dan laporan uji | Google Docs, di folder produk |
| Bukti (screenshot, video) | Folder "Bukti" di Google Drive, ditautkan dari kartu dan laporan |
| Kasus uji, test otomatis, riwayat uji | Workspace QA di GitHub, repo privat |

## Aturan keselamatan

- **Repo produk hanya dibaca.** Claude tidak push, tidak membuka issue, PR, atau komentar di sana, dan tidak memperbaiki kodenya.
- **Hanya host yang Anda daftarkan.** Test berhenti sebelum mulai bila targetnya bukan host di `allowedHosts`. Production tidak pernah didaftarkan.
- **Kata sandi tidak pernah lewat Claude.** Login dilakukan oleh skrip Playwright yang membaca `.env.local`. Aturan izin di workspace melarang Claude membaca berkas itu.
- **Data uji diberi penanda** `QA-AUTO`. Data yang tidak dibuat QA tidak pernah diubah atau dihapus.
- **Efek samping.** Selama belum jelas apakah staging mengirim email, SMS, atau WhatsApp sungguhan, atau menerima pembayaran sungguhan, test yang memicunya ditandai TERBLOKIR.
- **Uji beban dan scanner keamanan** butuh izin tertulis dari pemilik aplikasi, dan belum ada perintahnya.

## Status hasil

| Status | Artinya |
|---|---|
| LULUS | Hasil yang diharapkan terlihat, dan ada buktinya |
| GAGAL | Hasilnya berbeda dari yang diharapkan |
| TERBLOKIR | Prasyarat belum ada, misalnya akun atau data |
| TIDAK DIJALANKAN | Direncanakan, tapi belum dicoba di putaran ini |
| TIDAK MEYAKINKAN | Sudah dijalankan, tapi tidak membuktikan apa-apa, misalnya hasilnya berubah-ubah |

Sebuah pemeriksaan tidak pernah dianggap LULUS hanya karena tidak ada yang salah.

## Jenis pengujian

| Jenis | Artinya | Tahap |
|---|---|---|
| Audit kesiapan | Memastikan environment, akun, data, dan dokumen siap sebelum menguji | 1 |
| Smoke test | Cek cepat bahwa fitur utama masih jalan | 2 |
| Fungsional / end-to-end | Satu alur pengguna diuji dari awal sampai akhir, sesuai kebutuhan | 2 |
| Uji API | Endpoint diuji langsung: isi respons, tipe data, aturan bisnis, input salah | 2 |
| Uji hak akses | Satu peran tidak bisa membuka halaman atau data milik peran lain | 2 |
| Exploratory | Penjelajahan terarah tanpa skrip, dengan tujuan dan batas waktu | 2 |
| Aksesibilitas dasar | Pemeriksaan otomatis axe ditambah cek manual, misalnya keyboard | 2 |
| Responsif | Tampilan di beberapa ukuran layar | 2 |
| Regresi | Fitur lama tidak rusak setelah perubahan. Area yang diuji dipilih dari diff antar rilis dan daftar alur kritis | 3 |
| Uji beban, scanner keamanan | Butuh izin tertulis pemilik aplikasi | belum ada |

Kasus uji dirancang dengan teknik ISTQB: partisi ekuivalen, nilai batas, tabel keputusan, dan transisi status.
