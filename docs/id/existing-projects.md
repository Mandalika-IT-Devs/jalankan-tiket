# Memindahkan proyek lama ke kit

Kit bisa dipasang di repo yang sudah berjalan, tanpa menimpa berkas Anda.

## Langkah

1. **Buka sesi Claude Code di repo itu, lalu ketik `/tiket:siapkan-proyek`.** Claude membaca repo Anda, lalu mengusulkan stack dan perintah verify dari yang sudah ada.
2. **Claude bekerja di branch `adopsi-jalankan-tiket`:**
   - Berkas kit yang belum ada dibuat.
   - Berkas yang sudah ada dipertahankan. Claude hanya menambahkan bagian yang dibutuhkan kit, misalnya bagian sumber kebenaran dan blok "Agent skills" di `AGENTS.md`.
   - `CONTEXT.md` diganti nama menjadi `GLOSSARY.md`, karena mattpocock-skills 1.3 dan yang lebih baru hanya membaca `GLOSSARY.md`.
   - `.claude/settings.json` yang sudah ada digabung. Aturan lama Anda tidak dihapus.
   - CI yang sudah ada dipertahankan. Kit menambahkan job `kebersihan-pr`. Anda lalu memilih: mengganti nama job test yang sudah ada menjadi `verify` (rekomendasi), atau menambah job `verify` terpisah.
3. **Celah kontrak menjadi tiket pertama.** Contohnya: belum ada deteksi kode mati, belum ada pemeriksaan batas impor, atau aturan bisnis belum terkumpul di satu modul domain. Celah seperti itu tidak diperbaiki diam-diam. Semuanya menjadi tiket di milestone M1, mulai dari `[T00]`.
4. **Pasang label `disetujui-pemilik` pada PR adopsi, lalu merge.**
5. **Jalankan `/tiket:rencanakan-produk`.** Claude menyusun PRD dan glosarium dari perilaku kode saat ini, lalu menanyakan kepada Anda apa yang seharusnya. Yang memutuskan aturan tetap Anda, bukan kode.

Setelah itu alurnya sama seperti proyek baru: `/tiket:rencanakan-tahap`, lalu `/tiket:jalankan`.

## Tips

- Mulailah dari tahap kecil. Tiket pertama sebaiknya menutup celah kontrak dulu, baru kemudian fitur.
- Bila repo memakai salinan lama workflow ini, misalnya `.claude/skills/jalankan-tiket`, hapus salinan itu di PR adopsi, supaya hanya versi plugin yang dipakai.
