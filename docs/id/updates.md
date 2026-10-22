# Pembaruan

Ada tiga hal yang bisa diperbarui. Cara memperbaruinya berbeda-beda.

| Yang diperbarui | Sumbernya | Otomatis? |
|---|---|---|
| mattpocock-skills | Marketplace resmi Anthropic | Ya, bawaan Claude Code |
| Plugin `tiket` | Marketplace `jalankan-tiket` | Ya, bila auto-update menyala |
| Berkas di setiap proyek | Template kit | Tidak, sengaja. Lewat PR yang Anda setujui. |

## mattpocock-skills

Kit menyatakan "butuh mattpocock-skills" tanpa mengunci versinya. Versi Matt yang baru sampai ke laptop Anda saat Anthropic memperbaruinya di marketplace resmi.

Versi Matt yang baru kadang mengubah hal yang dipakai kit. Contohnya, versi 1.3 mengganti `CONTEXT.md` menjadi `GLOSSARY.md`. Karena itu kit punya tiga penjaga:
- **Pemantau rilis.** Repo kit memantau rilis Matt setiap hari dan menguji kecocokannya sebelum versi itu sampai ke pengguna.
- **`/tiket:cek-proyek`.** Perintah ini memberi peringatan bila versi Matt yang terpasang belum diuji kit.
- **`/tiket:jalankan`.** Sebelum mulai, koordinator memeriksa titik sambung dengan skill Matt. Bila ada yang rusak, koordinator berhenti dengan pesan jelas. Ia tidak menebak.

## Plugin `tiket`

- Kit dirilis bertahap dengan nomor versi. Anda tidak menerima perubahan yang setengah jadi.
- Proyek yang disiapkan dengan `/tiket:siapkan-proyek` otomatis menyalakan auto-update untuk kit, lewat `.claude/settings.json`.
- Untuk menyalakan auto-update secara manual: `/plugin` → Marketplaces → `jalankan-tiket` → Enable auto-update.
- Untuk memperbarui sekarang juga, jalankan:

  ```
  claude plugin marketplace update jalankan-tiket
  claude plugin update tiket@jalankan-tiket
  ```

  Lalu ketik `/reload-plugins` di sesi yang sedang terbuka.

## Berkas proyek

Berkas yang ditulis kit ke proyek Anda tidak berubah otomatis, karena berkas itu milik proyek dan terlindungi. Contohnya CI, template, dan aturan agent.

Bila sebuah rilis kit mengubah berkas-berkas itu, `/tiket:cek-proyek` akan memberi tahu. Claude lalu menyiapkan satu PR pembaruan, dan Anda tinggal memasang label `disetujui-pemilik` di PR itu.

Versi yang sudah diuji tercatat di [Versi](versions.md).
