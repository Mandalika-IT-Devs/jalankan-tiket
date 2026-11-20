# Plugin qa: menguji aplikasi buatan tim lain

Plugin `qa` dibuat untuk QA engineer yang menguji aplikasi web buatan tim lain, misalnya ERP, HRIS, toko online, atau POS. Aplikasinya tidak perlu memakai kit ini. Claude menyiapkan pekerjaan QA, memeriksa apakah produk siap diuji, menyusun rencana uji, menguji dari luar lewat browser di staging, lalu melaporkan hasilnya. Bug dilaporkan ke Trello, dan laporan uji ditulis ke Google Docs.

Plugin `tiket` membangun produk, sedangkan `qa` hanya menguji dan melaporkan. `qa` tidak pernah mengubah repo produk atau memperbaiki kodenya.

> **Status: 0.2.0, tervalidasi.** Ketujuh perintah sudah dijalankan pada produk sungguhan: satu siklus penuh dan dua siklus regresi, sekitar 1.000 kasus, 41 bug, dan 9 uji ulang. Run yang panjang juga sudah berhasil dilanjutkan di sesi baru. Beberapa jalur jarang, seperti uji ulang yang gagal dan bug mendesak, baru diuji dengan contoh. Rancangannya ada di [ADR-0004](../adr/0004-qa-plugin.md).

## Yang perlu Anda siapkan

- **Akses ke produk:** akses baca ke repo GitHub-nya, URL staging, dan akun uji untuk setiap peran, misalnya admin dan kasir.
- **Di laptop:** Node.js 20.12 atau lebih baru, `git`, `jq`, dan GitHub CLI `gh` yang sudah login dengan akun GitHub Anda sendiri. Kalau `gh` sedang aktif dengan akun lain, misalnya akun agen untuk proyek `tiket`, `/qa:siapkan-produk` memberi perintah agar git di workspace tetap memakai akun Anda.
- **Konektor claude.ai:** Trello dan Google Drive. Sambungkan di pengaturan Connectors claude.ai, lalu buka sesi baru. Konektor ini hanya muncul bila Claude Code login dengan akun claude.ai. Sesi yang memakai API key tidak mendapatkannya.

## Pasang

```
/plugin marketplace add Mandalika-IT-Devs/jalankan-tiket
/plugin install qa@jalankan-tiket
```

## Perintah

| Perintah | Kapan | Hasil |
|---|---|---|
| `/qa:siapkan-produk` | Sekali per produk | Workspace QA (saat pertama kali), clone repo produk hanya untuk dibaca, konfigurasi, skrip login, list Trello, folder Drive |
| `/qa:audit-kesiapan` | Sebelum menguji, dan setiap kali ragu | 15 pemeriksaan dengan hasil SIAP, SIAP DENGAN CATATAN, atau TERBLOKIR, plus pertanyaan untuk tim produk |
| `/qa:rencanakan-uji` | Di awal pengujian sebuah versi | Kebutuhan ber-ID, pertanyaan, skor risiko, kasus uji, piagam eksplorasi, dan rencana uji di Google Docs |
| `/qa:jalankan-uji` | Setelah rencana siap | Hasil setiap kasus dengan bukti, dan bug yang sudah dikonfirmasi ulang |
| `/qa:laporkan` | Setelah pengujian, atau selama run untuk bug yang sudah terkonfirmasi | Kartu bug di Trello, bukti di Drive, dan laporan uji dengan rekomendasi Go/No-Go |
| `/qa:regresi` | Setiap ada rilis baru di staging | Pilihan uji regresi dari diff antar versi, alur kritis, dan bug yang menunggu uji ulang |
| `/qa:siklus` | Kapan saja | Menjalankan perintah yang perlu secara berurutan, dan hanya memanggil Anda untuk keputusan |

Tulis nama produk di belakang perintah, misalnya `/qa:audit-kesiapan toko-buku`. `/qa:jalankan-uji` juga menerima filter, misalnya `/qa:jalankan-uji toko-buku smoke` atau `/qa:jalankan-uji toko-buku P1`.

## Alur kerja

1. **Buka sesi Claude Code di folder kosong**, misalnya `~/qa-workspace`. Folder ini menjadi *workspace QA*: repo privat milik Anda yang menampung pekerjaan QA semua produk.
2. **`/qa:siapkan-produk contoh-org/toko-buku`.** Claude membuat workspace (saat pertama kali), meng-clone repo produk, membaca dokumen dan kodenya, lalu bertanya satu putaran: staging, peran, efek samping, board Trello, dan folder Drive.
3. **Isi akun uji sendiri.** Claude tidak pernah melihat kata sandi. Salin berkas contohnya, lalu isi di editor Anda:

   ```
   ! cp products/toko-buku/.env.local.example products/toko-buku/.env.local
   ```

4. **`/qa:audit-kesiapan toko-buku`.** Yang diperiksa:
   - pagar keamanan dan alat;
   - staging bisa dibuka dan memang bukan production;
   - versi yang diuji;
   - login tiap peran dan cakupan peran;
   - dokumen kebutuhan dan apakah bisa diuji;
   - data uji dan efek samping;
   - Trello dan Drive.

   Teruskan pertanyaannya ke tim produk.
5. **`/qa:rencanakan-uji toko-buku`.** Claude membuka satu *siklus uji* untuk versi yang sedang di staging, dan menulis rencana ujinya di Google Docs.
6. **`/qa:jalankan-uji toko-buku`.** Smoke test berjalan lebih dulu. Bila gagal, pengujian berhenti. Setelah itu agen `penguji` mengerjakan setiap area, satu per satu. Setiap calon bug diulang secara terpisah oleh agen `pemeriksa`. Hanya bug yang muncul di ketiga percobaan yang dihitung sebagai bug.
   - **Bug mendesak tidak menunggu run selesai.** Bug Kritis, atau Tinggi yang membocorkan kredensial atau data pribadi, menghilangkan data atau uang, atau menghentikan pengujian, langsung diperiksa ulang setelah areanya selesai. Begitu terkonfirmasi, Anda langsung diberi pesan singkat untuk developer.
   - **Run yang panjang bisa melebihi satu sesi chat.** Progresnya tersimpan di folder siklus setelah setiap area. Kalau percakapan sudah terlalu panjang, buka sesi baru di workspace dan ketik `/qa:jalankan-uji toko-buku` lagi: run berlanjut dari titik terakhir.
7. **`/qa:laporkan toko-buku`.** Kartu bug masuk list "QA – Perlu Ditinjau". Tinjau kartunya, lalu pindahkan ke list developer. Claude juga memberi pesan singkat yang siap Anda tempel ke grup tim. Selama run masih berjalan, perintah yang sama hanya membuat kartu untuk bug yang sudah terkonfirmasi, tanpa laporan. Itu berguna untuk bug mendesak, atau untuk run yang panjang supaya developer bisa mulai lebih awal. Ketik perintahnya di sesi baru bila percakapan run sudah panjang.
8. **Saat ada rilis baru: `/qa:regresi toko-buku`, lalu `/qa:jalankan-uji` dan `/qa:laporkan`.** Atau cukup `/qa:siklus toko-buku`.
   - Regresi memilih kasus dari bagian fitur yang tersentuh perubahan kode, bukan seluruh area. Kasus yang mengubah pengaturan bersama di staging ditanyakan dulu kepada Anda.
   - Bug yang diuji ulang diambil dari list uji ulang di Trello, ditambah bug yang nomornya disebut di commit atau nama branch. Bug yang kartunya belum dipindah juga ditanyakan dulu.
   - Kalau staging ternyata menjalankan branch lain, atau di-deploy ulang di tengah run, Claude berhenti dan bertanya. Hasil dari dua versi tidak dicampur.
   - Kartu di list uji ulang yang perbaikannya belum masuk versi di staging ditanyakan dulu, tidak langsung diuji ulang. Laporan menyebut setiap kartu di list itu yang tidak diuji ulang.
   - Kalau Anda memutuskan sebuah kasus P1 tidak dijalankan, Claude langsung mengingatkan bahwa itu membuat rekomendasi NO-GO, dan menawarkan pencatatan sebagai TERBLOKIR dengan prasyarat dan pemiliknya.

## Di mana hasilnya disimpan

| Apa | Tempat |
|---|---|
| Bug | Trello, satu kartu per bug. Kartu baru masuk list "QA – Perlu Ditinjau", lalu Anda memindahkannya ke developer |
| Rencana dan laporan uji | Google Docs, di folder produk |
| Bukti (screenshot, video) | Folder "Bukti" di Google Drive, ditautkan dari kartu dan laporan |
| Kebutuhan, kasus uji, test otomatis, hasil tiap siklus | Workspace QA di GitHub, repo privat |

## Aturan keselamatan

- **Repo produk hanya dibaca.** Claude tidak push, tidak membuka issue, PR, atau komentar di sana, dan tidak memperbaiki kodenya.
- **Hanya host yang Anda daftarkan.** Test berhenti sebelum mulai bila targetnya bukan host di `allowedHosts`. Production tidak pernah didaftarkan.
- **Kata sandi tidak pernah lewat Claude.** Login dilakukan oleh skrip Playwright yang membaca `.env.local`. Aturan izin di workspace melarang Claude membaca berkas itu. Screenshot diperiksa dulu sebelum diunggah, dan URL selalu dicetak dengan isi parameternya disensor. Kalau kata sandi akun uji sampai muncul di URL, login dihentikan dan Anda diminta mengganti kata sandinya.
- **Hasil test tidak menyimpan kata sandi.** Report HTML Playwright tidak dipakai, dan login tidak merekam trace, video, atau screenshot, karena semuanya bisa menyimpan apa yang diketik. Screenshot menyamarkan email dan avatar akun uji bersama serta data orang sungguhan sebelum diunggah.
- **Login dibatasi.** Setiap peran login sekali di awal run. Setelah satu jawaban 429 (terlalu banyak percobaan), semua login berhenti 15 menit supaya akun orang lain di staging tidak ikut terkunci.
- **Data uji diberi penanda** `QA-AUTO`. Data yang tidak dibuat QA tidak pernah diubah atau dihapus.
- **Efek samping.** Selama belum jelas apakah staging mengirim email, SMS, atau WhatsApp sungguhan, atau menerima pembayaran sungguhan, test yang memicunya ditandai TERBLOKIR.
- **Staging dipakai bersama**, jadi test berjalan satu per satu dan tanpa pengulangan otomatis.
- **Uji beban dan scanner keamanan** butuh izin tertulis dari pemilik aplikasi, dan belum ada perintahnya.

## Status hasil

| Status | Artinya |
|---|---|
| LULUS | Hasil yang diharapkan terlihat, dan ada buktinya |
| GAGAL | Hasilnya berbeda dari yang diharapkan |
| TERBLOKIR | Prasyarat belum ada, misalnya akun, data, atau jawaban atas sebuah pertanyaan |
| TIDAK DIJALANKAN | Direncanakan, tapi belum dicoba di putaran ini |
| TIDAK MEYAKINKAN | Sudah dijalankan, tapi tidak membuktikan apa-apa, misalnya hasilnya berubah-ubah |

Sebuah pemeriksaan tidak pernah dianggap LULUS hanya karena tidak ada yang salah.

## Rekomendasi rilis

`/qa:laporkan` memberi rekomendasi. Keputusannya tetap ada di tim produk.
- **NO-GO:** ada bug Kritis yang terbuka, ada bug Tinggi di alur kritis, smoke test gagal, atau ada kasus P1 yang tidak dijalankan.
- **GO DENGAN SYARAT:** ada bug Tinggi di luar alur kritis, atau kasus P1 yang terblokir dengan penanggung jawab yang jelas.
- **GO:** selain itu.

## Jenis pengujian

| Jenis | Artinya | Perintah |
|---|---|---|
| Audit kesiapan | Memastikan environment, akun, data, dan dokumen siap sebelum menguji | `audit-kesiapan` |
| Smoke test | Cek cepat bahwa alur kritis masih jalan | `jalankan-uji` |
| Fungsional / end-to-end | Satu alur pengguna diuji dari awal sampai akhir, sesuai kebutuhan | `jalankan-uji` |
| Uji API | Endpoint diuji langsung: isi respons, tipe data, aturan bisnis, input salah | `jalankan-uji` |
| Uji hak akses | Satu peran tidak bisa membuka halaman atau data milik peran lain | `jalankan-uji` |
| Exploratory | Penjelajahan terarah tanpa skrip, dengan tujuan dan batas waktu | `jalankan-uji` |
| Aksesibilitas dasar | Pemeriksaan otomatis axe ditambah cek manual, misalnya keyboard | `jalankan-uji` |
| Responsif | Tampilan di lebar 375, 768, dan 1280 piksel | `jalankan-uji` |
| Uji ulang | Bug yang sudah diperbaiki diulang untuk memastikan perbaikannya bertahan | `regresi` |
| Regresi | Fitur lama tidak rusak setelah perubahan. Area yang diuji dipilih dari diff antar rilis dan daftar alur kritis | `regresi` |
| Uji beban, scanner keamanan | Butuh izin tertulis pemilik aplikasi | belum ada |

Kasus uji dirancang dengan teknik ISTQB: partisi ekuivalen, nilai batas, tabel keputusan, dan transisi status. Prioritasnya dari skor risiko: dampak × kemungkinan.
