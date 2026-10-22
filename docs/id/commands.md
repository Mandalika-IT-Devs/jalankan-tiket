# Daftar perintah

## Perintah kit

| Perintah | Kapan | Anda perlu aktif? | Hasil |
|---|---|---|---|
| `/tiket:siapkan-proyek` | Sekali per proyek | Ya, satu putaran pertanyaan | Repo, label, milestone, CI, dokumen awal |
| `/tiket:rencanakan-produk` | Di awal proyek, atau saat produk berubah besar | Ya, ini sesi terpanjang | PRD, glosarium, ADR, keputusan terbuka, UAT, contoh hitungan (lewat PR) |
| `/tiket:rencanakan-tahap` | Sekali per tahap | Ya | Tiket di milestone tahap itu |
| `/tiket:jalankan` | Kapan saja ada tiket siap | Tidak | PR yang di-merge dan laporan akhir |
| `/tiket:catat-keputusan` | Setelah ada laporan berisi pertanyaan | Ya, singkat | PR keputusan dan tiket yang bisa dilanjutkan |
| `/tiket:cek-proyek` | Kapan saja Anda ragu | Tidak | Daftar masalah dan langkah berikutnya |

`/tiket:jalankan` mengerjakan semua tiket yang siap. Untuk membatasinya, tulis nomor issue atau nama milestone di belakang perintah, misalnya `/tiket:jalankan #12 #15` atau `/tiket:jalankan M2`.

Di Claude Desktop, ketik `/tiket` lalu pilih perintahnya dari menu.

## Skill mattpocock-skills yang dipakai kit

| Skill | Dipakai oleh | Gunanya |
|---|---|---|
| `grilling` | `rencanakan-produk`, `rencanakan-tahap`, penyesuaian stack | Tanya-jawab sampai keputusan jelas, dengan jawaban rekomendasi |
| `domain-modeling` | `rencanakan-produk` | Menulis glosarium (`GLOSSARY.md`) dan ADR |
| `tdd` | `tiket:pelaksana` | Siklus test merah → hijau |
| `research` | Penyesuaian stack lain | Memeriksa alat dan versi dari sumber resmi |
| `wizard` | Tiket deploy | Skrip panduan untuk langkah yang hanya bisa dikerjakan manusia |
| `/retro` | Anda, setelah satu tahap selesai | Usulan perbaikan aturan, CI, dan dokumen dari pengalaman tahap itu |

## Skill mattpocock-skills yang tidak dipakai di alur ini

| Skill | Alasan |
|---|---|
| `/to-tickets` | Menghapus bagian "Blocked by" berbentuk teks, padahal koordinator membacanya. Pakai `/tiket:rencanakan-tahap`. |
| `pr` | Format PR-nya tidak memuat `Closes #n`, padahal CI mewajibkannya. Koordinator memakai template PR proyek. |
| `implement-spec` | Mengerjakan banyak tiket sekaligus. Kit sengaja mengerjakan satu tiket per putaran, supaya `main` bergerak lurus. |
| `/setup-matt-pocock-skills` | Sudah dikerjakan oleh `/tiket:siapkan-proyek`. |
