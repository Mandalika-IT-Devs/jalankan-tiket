# AGENTS.md: workspace QA

Repo ini adalah workspace QA, dibuat oleh plugin `qa` dari kit jalankan-tiket. Isinya pekerjaan QA untuk aplikasi web buatan tim lain, satu folder per produk di `products/<slug>/`. Aturan di bawah berlaku untuk setiap agen yang bekerja di sini.

## Isi workspace

- `qa-workspace.json`: bahasa workspace dan versi kit.
- `products/<slug>/product.json`: repo produk, URL staging, host yang diizinkan, peran, efek samping, serta ID Trello dan Google Drive.
- `products/<slug>/.env.local`: akun uji. Hanya QA engineer yang mengisinya. Tidak pernah di-commit.
- `products/<slug>/source/`: clone repo produk, hanya untuk dibaca. Tidak pernah di-commit.
- `products/<slug>/tests/`: suite Playwright. `auth.setup.ts` login sekali per peran dan menyimpan sesinya di `.auth/`.
- `products/<slug>/readiness.md`: hasil audit kesiapan terakhir.

## Aturan

1. **Repo produk hanya dibaca.** Jangan push, jangan buka issue, PR, atau komentar di repo produk, dan jangan memperbaiki kodenya. Temuan dilaporkan lewat Trello dan laporan uji.
2. **Hanya host di `allowedHosts`.** Jangan membuka atau menguji host lain, terutama production. `playwright.config.ts` menghentikan test bila host-nya tidak terdaftar.
3. **Kata sandi tidak pernah lewat agen.** Jangan membaca `.env.local` atau `.auth/`, dan jangan mencetak isinya. Login memakai sesi dari `auth.setup.ts`. Kata sandi tidak boleh muncul di laporan, kartu, commit, atau screenshot.
4. **Data uji diberi penanda.** Setiap data yang dibuat test diawali `testDataPrefix` dari `product.json`. Jangan mengubah atau menghapus data yang tidak dibuat oleh QA.
5. **Efek samping.** Selama `sideEffects` sebuah kanal (email, SMS, WhatsApp, pembayaran) bernilai `unknown` atau `real`, test yang memicunya berstatus TERBLOKIR.
6. **Di luar cakupan tanpa izin tertulis:** uji beban, scanner keamanan, brute force, dan apa pun terhadap production.
7. **Hasil adalah bukti.** Setiap pemeriksaan berakhir sebagai LULUS (hanya dengan bukti), GAGAL, TERBLOKIR, TIDAK DIJALANKAN, atau TIDAK MEYAKINKAN. Jangan pernah melaporkan LULUS karena "tidak ada yang salah".
8. **Bahasa.** Semua yang ditulis untuk QA engineer dan developer memakai bahasa di `qa-workspace.json`.

## Perintah

| Perintah | Gunanya |
|---|---|
| `/qa:siapkan-produk` | Membuat workspace bila belum ada, lalu menambahkan satu produk |
| `/qa:audit-kesiapan` | Memeriksa apakah produk siap diuji, dengan hasil SIAP atau TERBLOKIR |

Menjalankan suite sebuah produk dari root workspace: `npx playwright test -c products/<slug>`.
