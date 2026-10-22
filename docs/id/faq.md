# Tanya jawab dan masalah umum

**Perintah `/tiket:…` tidak muncul.**
Buka sesi baru atau ketik `/reload-plugins`. Lalu periksa `/plugin`: `tiket@jalankan-tiket` harus berstatus aktif.

**Plugin `tiket` gagal dimuat dengan pesan "dependency mattpocock-skills is not installed".**
Marketplace resmi Anthropic belum terdaftar. Ketik `/plugin marketplace add anthropics/claude-plugins-official`, lalu `/reload-plugins`.

**Skill Matt muncul dua kali.**
"Skills For Real Engineers" dari claude.ai adalah salinan lama mattpocock-skills. Matikan salinan itu di pengaturan plugin claude.ai.

**`/tiket:jalankan` langsung berhenti karena "coupling".**
Ada titik sambung dengan mattpocock-skills yang rusak, misalnya `GLOSSARY.md` tidak ditemukan. Jalankan `/tiket:cek-proyek` untuk melihat apa yang perlu diperbaiki.

**CI tidak mulai-mulai.**
- **Runner sendiri:** pastikan mesinnya menyala dan layanan runner berjalan.
- **Runner GitHub di repo privat:** periksa kuota menit dan batas pengeluaran di pengaturan tagihan GitHub.

**CI merah di `kebersihan-pr` karena berkas terlindungi.**
PR itu mengubah dokumen atau aturan yang dilindungi. Bila perubahannya memang Anda minta, pasang label `disetujui-pemilik`. CI akan berjalan ulang sendiri.

**Sebuah test kadang lulus, kadang gagal.**
Koordinator menjalankan ulang job yang gagal satu kali bila test itu tidak disentuh perubahan, lalu mencatatnya di laporan. Buat tiket kecil untuk memperbaikinya, karena test yang tidak stabil bisa membuat tiket diparkir.

**Di mode Auto, perintah merge PR perencanaan atau keputusan ditolak.**
Pengklasifikasi mode Auto hanya menerima izin yang Anda ketik sendiri di sesi itu. Izin yang diteruskan dari sesi lain tidak dihitung. Ada dua cara melanjutkannya:
- ketik izinnya langsung di sesi itu, misalnya "silakan merge";
- tekan **Squash and merge** di halaman PR di GitHub.

**Kuota Claude habis di tengah jalan.**
Tidak apa-apa. Keadaan pekerjaan tersimpan di GitHub. Ketik `/tiket:jalankan` lagi setelah kuota pulih.

**Dua orang ingin menjalankan tiket bersamaan.**
Jangan. Dua koordinator akan mengambil tiket yang sama. Sepakati satu orang per repo pada satu waktu.

**Claude bertanya terlalu banyak saat merencanakan.**
Itu disengaja. Setiap jawaban yang jelas sekarang mencegah tiket diparkir nanti. Anda bisa menjawab "setuju semua" untuk mengambil semua rekomendasi.
