# Cara kerja

## Dua peran

- **Anda: pemilik produk.** Anda memutuskan apa yang dibangun dan aturan bisnisnya. Anda juga menyetujui perubahan pada dokumen terlindungi dan melakukan UAT.
- **Claude: tim pembangun.** Satu koordinator memakai dua subagent:
  - `tiket:pelaksana` menulis kode;
  - `tiket:peninjau` meninjau hasilnya dengan konteks yang bersih.

## Alur besar

```
siapkan-proyek → rencanakan-produk → rencanakan-tahap → jalankan ⇄ catat-keputusan
                                           ↑                      │
                                           └── /retro ←── tahap selesai
                                                                  │
                                                       UAT → deploy
```

## Satu putaran `/tiket:jalankan`

1. **Pilih tiket.** Koordinator mengambil tiket bernomor terkecil yang memenuhi tiga syarat:
   - berlabel `ready-for-agent`;
   - tidak berlabel `needs-info`;
   - semua tiket di bagian "Blocked by"-nya sudah tertutup.
2. **Pelaksana menulis kode, test lebih dulu.** Setiap kriteria penerimaan dikerjakan dalam siklus merah → hijau. Pelaksana berhenti di commit, setelah perintah verify hijau.
3. **Peninjau memeriksa dua sumbu.**
   - Spec: apakah ini yang diminta?
   - Standards: apakah ditulis dengan benar?

   Hasilnya `PASS` atau `FIX`. Bila `FIX`, temuan dikirim ke pelaksana. Setelah tiga putaran yang masih `FIX`, tiket diparkir.
4. **PR dan CI.** Koordinator membuka PR, lalu menunggu CI.
   - Bila CI merah, pelaksana memperbaikinya, paling banyak dua putaran.
   - Bila yang gagal adalah test yang tidak disentuh perubahan itu, job yang gagal dijalankan ulang sekali dulu.
5. **Merge, lalu kembali ke langkah 1.**

Keadaan pekerjaan tersimpan di GitHub: issue, label, branch, dan PR. Kalau sesi terputus, `/tiket:jalankan` berikutnya melanjutkan dari situ.

## Dua jenis ketidakjelasan

Inilah inti cara kerja kit.

- **Teknis.** Contohnya nama berkas, pola kode, cara menguji, dan urutan tampil. Claude memutuskan sendiri, lalu mencatat keputusan, alasan, dan risikonya di PR.
- **Bisnis.** Contohnya rumus, angka, ambang, hak akses, dan apa yang dilihat pengguna. Claude tidak menebak. Tiketnya diparkir dengan label `needs-info`, dan Anda menerima pertanyaan beserta pilihan jawaban, salah satunya rekomendasi.

Hal yang belum Anda putuskan dicatat di `docs/OPEN-DECISIONS.md`, lengkap dengan nilai contoh. Claude boleh memakai nilai contoh itu, ditandai `[CONTOH]`, supaya pekerjaan tidak berhenti. Nilai contoh tidak pernah menjadi aturan tetap.

## Pagar

- **Berkas terlindungi.** PRD, glosarium, ADR, aturan agent, dan CI hanya berubah lewat PR. PR itu harus berlabel `disetujui-pemilik`, dan label itu hanya Anda yang memasang. CI menolak PR yang mengubah berkas terlindungi tanpa label itu.
- **Daftar izin dependency.** Library baru di luar daftar membuat CI merah, dan tiketnya diparkir sampai Anda memutuskan.
- **CI hijau wajib.** Perubahan masuk ke `main` hanya lewat PR yang CI-nya hijau.
- **Izin agent.** `.claude/settings.json` melarang beberapa perintah, misalnya force-push, push langsung ke `main`, mengubah label, dan perintah yang menyebut label persetujuan.
- **Satu koordinator per repo.** Hanya satu orang yang menjalankan `/tiket:jalankan` pada satu waktu.

## Kapan sebuah tiket dianggap selesai

Sebuah tiket selesai bila keempat syarat ini terpenuhi:
- semua kriteria penerimaan tercentang;
- perintah verify hijau;
- peninjau memberi `PASS`;
- CI hijau.

Setelah itu tidak ada tambahan lagi.
