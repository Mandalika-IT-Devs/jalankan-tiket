<!-- Dua tiket untuk deploy ke satu server (VPS). /tiket:rencanakan-tahap membuat keduanya hanya bila pemilik menginginkan deploy. Tiket A memakai label readyForHuman; tiket B memakai readyForAgent dan Blocked by tiket A. -->

# Tiket A: [Txx] Siapkan server dan secret deploy (untuk pemilik)

## Yang dibangun
Server dan kunci yang dibutuhkan workflow deploy. Langkah-langkah ini hanya bisa dikerjakan pemilik.

## Dalam scope
- **Server Linux (VPS)** dengan Docker dan Docker Compose, beserta satu pengguna khusus untuk deploy.
- **Nama domain** yang mengarah ke server. Aksesnya harus HTTPS, karena fitur browser seperti kamera dan lokasi hanya berjalan lewat HTTPS.
- **Secret repository `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`.** Kunci SSH-nya dibuat khusus untuk deploy, lalu kunci publiknya dipasang di server.
- **Penyedia email**, bila produk mengirim email.

Untuk langkah-langkah ini, Claude bisa membuat skrip panduan interaktif dengan skill `wizard` dari mattpocock-skills.

## Kriteria penerimaan
- [ ] `ssh <VPS_USER>@<VPS_HOST>` berhasil masuk dengan kunci deploy.
- [ ] Ketiga secret terpasang di repository.
- [ ] Domain mengarah ke server.

## Blocked by
- Tidak ada

# Tiket B: [Txx] Deploy otomatis ke server

## Yang dibangun
Setiap kali CI hijau di `main`, versi baru otomatis terpasang di server.

## Dalam scope
- **`Dockerfile`** produksi.
- **`compose.prod.yml`**, berisi aplikasi, PostgreSQL, dan proxy HTTPS (misalnya Caddy) dengan sertifikat otomatis.
- **`deploy/deploy.sh <commit>`.** Skrip ini dijalankan di server, dengan urutan:
  1. ambil commit itu;
  2. build;
  3. jalankan migrasi;
  4. nyalakan ulang aplikasi tanpa menghapus data;
  5. cek kesehatan.
- **Backup:** `pg_dump` harian ke volume terpisah, dengan masa simpan sesuai keputusan pemilik dan skrip restore.
- **`docs/DEPLOY.md`:** runbook untuk deploy pertama, pembaruan, cek kesehatan, backup, dan restore.
- **`.github/workflows/deploy.yml`** dari template kit, sebagai berkas terlindungi. Isi issue ini adalah instruksi eksplisit pemilik untuk menambahkannya, dan PR-nya membutuhkan label persetujuan pemilik.

## Kriteria penerimaan
- [ ] Merge ke `main` memicu deploy, dan halaman awal terbuka lewat HTTPS di domain produksi.
- [ ] Deploy kedua dengan commit yang sama tidak mengubah data.
- [ ] Backup harian tercipta, dan restore ke database kosong berhasil mengikuti `docs/DEPLOY.md`.

## Rujukan
ADR-0001 (Deploy), template `ci/deploy-ssh.yml` dari kit.

## Blocked by
- Tiket A
