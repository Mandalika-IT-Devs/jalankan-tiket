# Akun agen

## Kenapa agent butuh akun sendiri

Kit banyak menulis ke GitHub: issue, PR, komentar, push, dan merge. Kalau semua itu lewat akun pribadi Anda, GitHub melihat satu orang yang membuat puluhan issue dan PR dalam beberapa hari. Bagi sistem anti-penyalahgunaan GitHub, pola itu mirip akun spam. Akun Anda bisa disuspend, dan Anda ikut terkunci dari semua repo.

Repo besar menghindarinya dengan menjalankan otomasi lewat identitas bot, misalnya `dependabot[bot]` atau akun mesin seperti `k8s-ci-robot`. Kit ini memakai cara yang sama:
- agent menulis lewat **akun agen**;
- Anda tetap memakai akun pribadi untuk memasang label persetujuan, meninjau PR, dan mengubah pengaturan repo.

Sebelum menulis apa pun ke GitHub, setiap skill kit memeriksa dua hal:
- **Akun `gh` yang aktif.** Bila akun itu tercantum di `.github/CODEOWNERS`, artinya akun pemilik.
- **Alamat remote `origin`.** Bila memakai SSH, push memakai kunci SSH pemilik.

Bila salah satu kena, skill berhenti dan menunjuk ke halaman ini. Pengecualiannya hanya `/tiket:siapkan-proyek`, yang membuat repo dan labelnya dengan akun Anda.

## Pilihan akun

| | Akun mesin | GitHub App |
|---|---|---|
| Wujud | Akun GitHub biasa yang hanya dipakai agent | Aplikasi yang dipasang di repo, tampil sebagai `nama[bot]` |
| Penyiapan di laptop | Mudah: `gh auth login` dengan akun itu | Lebih repot: tokennya harus dibuat ulang setiap jam |
| Cocok untuk | Claude Code di laptop (rekomendasi) | Tim yang sudah terbiasa dengan GitHub App |

Halaman ini memandu akun mesin.

[Syarat layanan GitHub](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) mengizinkan satu orang memegang satu akun pribadi gratis ditambah satu akun mesin. Akun mesin hanya dipakai untuk otomasi, dan Anda yang bertanggung jawab atasnya.

**Jangan membuat akun mesin selama akun pribadi Anda sedang disuspend atau ditinjau GitHub.** Itu bisa dianggap menghindari suspend. Tunggu sampai akun pulih, atau tanyakan dulu ke GitHub Support.

## Langkah penyiapan

Satu akun mesin cukup untuk semua proyek Anda.

1. **Buat akun mesin.** Keluar dari GitHub di browser, atau pakai jendela privat. Daftar akun baru dengan email lain, misalnya `nama+bot@domain.com`. Pilih nama yang jelas, misalnya `<nama-anda>-bot`. Nyalakan verifikasi dua langkah.
2. **Beri akses ke repo.** Dengan akun pribadi, buka repo → **Settings** → **Collaborators** → **Add people**, lalu undang akun mesin dengan peran **Write**. Masuk dengan akun mesin, lalu terima undangannya. Ulangi untuk setiap repo proyek.
3. **Login `gh` dengan akun mesin.** Di terminal:

   ```
   gh auth login --hostname github.com --git-protocol https --scopes workflow
   ```

   Saat browser terbuka, pastikan yang sedang masuk adalah akun mesin. `gh` menyimpan kedua akun, dan akun yang baru login menjadi akun aktif.
4. **Arahkan push lewat akun mesin.** Di folder proyek:

   ```
   git remote set-url origin https://github.com/<pemilik>/<repo>.git
   gh auth setup-git
   ```

5. **Periksa.** Ketik `/tiket:cek-proyek`. Baris `agent account` harus OK dan menyebut nama akun mesin.

## Berpindah akun

- **Melihat akun aktif:** `gh auth status --active`.
- **Pindah ke akun pribadi**, misalnya untuk perintah `!` yang butuh hak admin seperti memasang ruleset: `gh auth switch --user <akun-pribadi>`.
- **Kembali ke akun mesin** sebelum menjalankan skill kit: `gh auth switch --user <akun-mesin>`.

Agent tidak pernah berpindah akun sendiri. Aturan izin proyek melarang agent menjalankan `gh auth login`, `logout`, `switch`, `refresh`, `token`, dan `setup-git`.

Label persetujuan dan review PR tetap Anda kerjakan di halaman GitHub, dengan akun pribadi.

## Laju kerja agent

Selain memakai akun sendiri, agent juga menjaga lajunya:
- **Satu koordinator per akun agen.** `/tiket:jalankan` tidak mau mulai bila koordinator lain masih berjalan di repo lain di laptop yang sama. Jangan pula menjalankan proyek lain dengan akun agen yang sama dari laptop lain pada waktu yang sama.
- **Jeda.** Agent menunggu paling sedikit 10 detik di antara dua tulisan ke GitHub, dan 30 detik di antara dua issue baru. Menerbitkan 20 tiket butuh sekitar 10 menit.
- **Komentar seperlunya.** Agent hanya berkomentar bila ada yang perlu Anda baca.
- **CI dicek tiap 60 detik.**
- **Tidak menunggu Anda.** PR yang butuh label persetujuan dilaporkan, lalu ditinggal sampai Anda memasang labelnya.
- **Berhenti saat dibatasi.** Bila GitHub menjawab 403 atau 429, atau menyebut batas laju atau akun yang disuspend, agent langsung berhenti tanpa mencoba ulang. Setelah itu agent melaporkan keadaan terakhir.
- **Verifikasi lokal dulu.** Agent hanya push setelah perintah verify dan test e2e hijau di laptop, supaya kuota Actions tidak habis untuk build yang pasti gagal.

Baca juga: [Keamanan dan pagar](security.md) · [Tanya jawab](faq.md)
