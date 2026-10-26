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
Pengklasifikasi mode Auto bisa menolak izin yang tidak Anda ketik sendiri di sesi itu, misalnya izin yang diteruskan dari sesi lain. Ada dua cara melanjutkannya:
- ketik izinnya langsung di sesi itu, misalnya "silakan merge";
- tekan **Squash and merge** di halaman PR di GitHub.

**Kuota Claude habis di tengah jalan.**
Tidak apa-apa. Keadaan pekerjaan tersimpan di GitHub. Ketik `/tiket:jalankan` lagi setelah kuota pulih.

**Skill berhenti karena `gh` memakai akun pemilik, atau karena remote memakai SSH.**
Agent menulis ke GitHub lewat akunnya sendiri. Siapkan akun agen dengan langkah di [Akun agen](agent-account.md), lalu jalankan skill itu lagi.

**`/tiket:jalankan` berhenti karena koordinator lain masih berjalan di repo lain.**
Tunggu sampai koordinator itu selesai. Bila sesinya sudah tidak ada, hapus `~/.cache/jalankan-tiket/koordinator.lock`. Berkas itu juga dianggap kedaluwarsa setelah 3 jam tanpa pembaruan.

**GitHub menjawab 403 atau 429, menyebut batas laju, atau akun disuspend.**
Agent berhenti tanpa mencoba ulang dan melaporkan keadaan terakhir. Jangan langsung menjalankan skill lagi berulang-ulang.
- **Batas laju:** tunggu sekitar satu jam, lalu jalankan `/tiket:jalankan` lagi.
- **Akun disuspend:** ajukan banding ke GitHub Support dan jelaskan otomasinya. Jangan membuat akun baru selama banding berjalan.

**Dua orang ingin menjalankan tiket bersamaan.**
Jangan. Dua koordinator akan mengambil tiket yang sama. Sepakati satu orang per repo pada satu waktu.

**Claude bertanya terlalu banyak saat merencanakan.**
Itu disengaja. Setiap jawaban yang jelas sekarang mencegah tiket diparkir nanti. Anda bisa menjawab "setuju semua" untuk mengambil semua rekomendasi.
