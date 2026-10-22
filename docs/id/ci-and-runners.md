# CI dan runner

Koordinator membaca hasil CI lewat `gh pr checks`. Karena itu CI kit selalu berjalan di **GitHub Actions**. Yang bisa Anda pilih adalah mesin yang menjalankannya.

## Dua pilihan runner

| | Runner GitHub (bawaan) | Runner sendiri (self-hosted) |
|---|---|---|
| Mesin | Mesin baru dari GitHub di setiap run | Laptop atau server Linux Anda |
| Biaya | Gratis di repo publik. Di repo privat ada kuota menit per bulan sesuai paket akun. | Gratis, tetapi mesin harus menyala |
| Persiapan | Tidak ada | Daftarkan runner satu kali (lihat di bawah) |
| Cocok untuk | Kebanyakan proyek | Repo privat yang kuota menitnya habis, atau ingin CI di mesin sendiri |

Runner sendiri tetap GitHub Actions, dan koordinator membacanya dengan cara yang sama. CI di luar GitHub, seperti GitLab CI atau Jenkins, tidak didukung, karena koordinator bergantung pada `gh` untuk issue, PR, pemeriksaan CI, dan merge.

## Yang diperiksa CI

- **`kebersihan-pr`**, khusus PR:
  - deskripsi memuat `Closes #n`;
  - peringatan bila PR lebih dari 400 baris;
  - berkas terlindungi butuh label persetujuan;
  - dependency ada di daftar izin.

  Daftar berkas terlindungi dan nama label dibaca dari branch tujuan. Dengan begitu, sebuah PR tidak bisa melonggarkan pemeriksaan untuk dirinya sendiri.
- **`verify`**: menjalankan perintah verify, lalu test end-to-end bila ada. Sebelum tiket `[T00]` selesai, job ini hanya memberi catatan "menunggu tiket fondasi".

## Memasang runner sendiri

Syaratnya: Linux, dan Docker yang bisa dipakai tanpa `sudo`. GitHub hanya menjalankan container layanan, seperti database untuk test, di runner Linux.

1. Saat `/tiket:siapkan-proyek`, pilih runner self-hosted. Claude memilih port CI yang tidak bentrok dengan proyek lain di mesin ini, lalu menyalin skrip pemasang ke repo.
2. Buka terminal di folder repo, lalu jalankan:

   ```
   bash .github/runner/pasang-runner.sh
   ```

   Skrip ini mengunduh runner resmi GitHub, mendaftarkannya khusus untuk repo ini, dan menjalankannya sebagai layanan. Skrip akan meminta kata sandi `sudo` sekali.
3. Untuk test browser, pasang pustaka sistem satu kali per mesin:

   ```
   sudo npx playwright install-deps chromium
   ```

Selama runner mati, job CI menunggu di antrean. Itu wajar, bukan galat.

## Beberapa proyek di satu mesin

Setiap proyek mendapat port sendiri:
- PostgreSQL pengembangan;
- PostgreSQL untuk CI;
- server end-to-end.

Setiap proyek juga mendapat folder pnpm sendiri. Daftar port tersimpan di data plugin. Dengan begitu, CI dua proyek bisa berjalan bersamaan tanpa saling menimpa.

## Melindungi `main`

Di repo publik, dan di akun GitHub berbayar, `/tiket:siapkan-proyek` menyiapkan *ruleset* yang:
- mewajibkan PR;
- mewajibkan `kebersihan-pr` dan `verify` hijau;
- melarang force-push.

Anda memasang ruleset itu dengan satu perintah yang diberikan Claude. Di repo privat dengan akun gratis, GitHub tidak menyediakan fitur ini. Di sana aturan yang sama dijaga oleh izin agent dan CI.
