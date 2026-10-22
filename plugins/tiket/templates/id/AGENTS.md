# AGENTS.md: {{PROJECT_NAME}}

{{PROJECT_SUMMARY}}

## Bahasa

Semua yang ditulis untuk pemilik memakai bahasa Indonesia: setiap pesan di percakapan, termasuk baris status singkat di sela perintah seperti "Sekarang CI: …", juga issue, PR, komentar, dan commit. Satu pesan memakai satu bahasa saja.

## Sumber kebenaran

- **Aturan bisnis:** `docs/PRD.md`. Blok `▶ Keputusan` mengalahkan teks di atasnya. Bahan di `docs/input/` bukan aturan.
- **Istilah** untuk nama kode, test, issue, dan PR: `GLOSSARY.md`, termasuk daftar _Avoid_-nya.
- **Keputusan teknis per area:** `docs/adr/`. Stack dicatat di ADR-0001. Aturan bisnis hanya boleh ada di modul domain murni (ADR-0002).
- **Hal yang belum diputuskan pemilik:** `docs/OPEN-DECISIONS.md`. Nilai contohnya dipakai di seed dan test dengan tanda `{{EXAMPLE_MARKER}}`, bukan sebagai aturan.
- **Menulis kode:** `CODING_STANDARDS.md`. Modul domain punya aturannya sendiri di `{{DOMAIN_MODULE_PATH}}AGENTS.md`.
- **Membuat atau mengubah tampilan:** `docs/DESIGN.md`. <!-- ui -->
- **Contoh hitungan yang benar:** `tests/golden/` (hanya-baca).
- **Skenario penerimaan** per bagian PRD: `docs/UAT.md`.
- **Konfigurasi kit jalankan-tiket:** `.github/jalankan-tiket.json`.

## Cara kerja: otomatis

Tiket dikerjakan tanpa menunggu manusia oleh plugin `tiket` dari kit jalankan-tiket, dengan urutan ini:

```
/tiket:jalankan → subagent tiket:pelaksana → subagent tiket:peninjau → PR → CI → merge
```

Pemilik produk hanya menjawab tiket yang diparkir dan melakukan UAT. Panduan pemilik ada di `docs/GUIDE.md`.

Satu tiket dianggap selesai bila keempat syarat ini terpenuhi:
- semua kriteria penerimaan tercentang;
- `{{VERIFY_COMMAND}}` hijau;
- peninjau memberi `PASS`;
- CI hijau.

### Dua jenis ketidakjelasan

- **Teknis** — putuskan sendiri, lalu catat di PR sebagai keputusan teknis beserta alasan dan risikonya. Contohnya:
  - struktur kode, nama berkas, pola, dan cara menguji;
  - urutan tampil daftar yang tidak diatur PRD;
  - detail visual kecil yang tidak diatur `docs/DESIGN.md`.
- **Bisnis** — jangan menebak, karena menebak dianggap gagal. Parkir tiket dengan label `{{LABEL_NEEDS_INFO}}`, tulis pertanyaan beserta pilihan jawabannya untuk pemilik, lalu lanjut ke tiket lain. Contohnya:
  - rumus, angka, dan ambang;
  - siapa boleh melakukan apa, dan apa yang dilihat pengguna;
  - perilaku di luar issue atau PRD;
  - aturan yang saling bertentangan.

Nilai di `docs/OPEN-DECISIONS.md` adalah pertanyaan bisnis yang sudah punya nilai contoh, jadi tiket tidak perlu diparkir. Pakai nilai contohnya dengan tanda `{{EXAMPLE_MARKER}}`, sebut OD-nya di PR, lalu lanjutkan.

## Pagar scope

Hasil kerja harus persis sama dengan isi "Dalam scope" di issue.

- Fitur, halaman, tabel, kolom, env var, opsi, dan abstraksi hanya ditambah bila issue menyebutnya.
- Dependency hanya boleh dari `.github/dependency-allowlist.txt`. Bila butuh dependency di luar daftar itu, parkir tiketnya.
- Refactor hanya menyentuh berkas yang memang diperlukan issue.
- Rumus dan ambang diimplementasikan persis seperti di PRD dan `tests/golden/`.
- Test yang merah diperbaiki di kode, bukan di fixture golden.
- Perubahan masuk ke `main` hanya lewat PR dengan CI hijau. Force-push hanya boleh dilakukan manusia.

### Berkas terlindungi

Daftar berkas terlindungi ada di `.github/protected-paths.txt`. Aturannya:
- Berkas itu hanya diubah atas instruksi eksplisit pemilik, di issue atau di komentar.
- PR yang mengubahnya wajib berlabel `{{LABEL_OWNER_APPROVED}}`, dan CI menolak PR tanpa label itu.
- Hanya pemilik yang memasang label itu.

## Lingkungan

{{ENVIRONMENT}}

## Perintah

`{{VERIFY_COMMAND}}` adalah gerbang wajib sebelum commit dan di CI. Perintah lain ada di {{COMMANDS_SOURCE}}.

## Agent skills

### Issue tracker

GitHub Issues lewat `gh`. Lihat `docs/agents/issue-tracker.md`.

### Triage labels

Lima peran triase bawaan. Lihat `docs/agents/triage-labels.md`.

### Domain docs

Satu konteks: `GLOSSARY.md` dan `docs/adr/` di root. Lihat `docs/agents/domain.md`.
