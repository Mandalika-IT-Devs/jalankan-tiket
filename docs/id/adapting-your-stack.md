# Menyesuaikan stack

Kit tidak terikat pada satu teknologi. Yang wajib adalah **kontrak stack**: tujuh hal yang harus disediakan stack apa pun, supaya koordinator, pelaksana, dan CI bisa bekerja.

## Kontrak

1. **Satu perintah verify.** Perintah ini menjalankan, berurutan:
   - analisis statis atau typecheck;
   - lint dan format;
   - deteksi kode mati;
   - pemeriksaan batas impor modul domain;
   - test.

   Perintah berhenti di langkah pertama yang gagal.
2. **Test end-to-end** (opsional), dijalankan CI setelah verify.
3. **Daftar izin dependency** di `.github/dependency-allowlist.txt`, yang dicek CI terhadap manifest stack.
4. **Modul domain murni**, dengan aturan impor yang ditegakkan alat.
5. **Contoh hitungan golden** di `tests/golden/`.
6. **CI di GitHub Actions** dengan dua job:
   - `kebersihan-pr`: PR menutup issue, berkas terlindungi butuh label, dependency ada di daftar izin;
   - `verify`.
7. **Lingkungan lokal yang bisa diulang**, misalnya Docker Compose, dan `.env.ci` tanpa rahasia asli.

## Profil bawaan: Next.js + PostgreSQL

Profil ini sudah teruji. Isinya:
- Next.js App Router, TypeScript strict, pnpm, dan Node.js 24;
- PostgreSQL dengan Drizzle;
- Tailwind dan shadcn/ui;
- Vitest dan Playwright.

Perintah verify-nya `pnpm verify`. Perintah ini menjalankan typecheck, lint, knip, dependency-cruiser, dan test. Tiket `[T00]` membangun aplikasi kosongnya.

## Stack lain

Saat `/tiket:siapkan-proyek` bertanya soal stack, pilih "stack lain". Claude lalu bekerja dalam empat langkah:

1. **Menanyai Anda** soal bahasa pemrograman, framework, database, alat test, dan target deploy. Ini memakai skill `grilling`.
2. **Memeriksa alat dan versinya** dari sumber resmi, dengan skill `research`.
3. **Memilih alat untuk setiap butir kontrak**, lalu mencatatnya di `docs/adr/0001-stack.md`.
4. **Menulis berkas stack:**
   - perintah verify;
   - daftar izin dependency;
   - CI dengan pemeriksaan dependency yang membaca manifest stack Anda;
   - tiket `[T00]` fondasi.

## Padanan alat

Tabel ini titik awal, bukan profil yang sudah teruji.

| Butir kontrak | Node / TypeScript | Python | PHP / Laravel | Go |
|---|---|---|---|---|
| Analisis statis / tipe | `tsc --noEmit` | mypy atau pyright | PHPStan / Larastan | `go vet` |
| Lint dan format | ESLint, Prettier | ruff | Pint | golangci-lint, gofmt |
| Kode mati | knip | vulture, deptry | aturan PHPStan | staticcheck |
| Batas impor | dependency-cruiser | import-linter | deptrac | depguard |
| Test | Vitest | pytest | Pest atau PHPUnit | `go test` |
| End-to-end | Playwright | Playwright untuk Python | Laravel Dusk atau Playwright | Playwright |
| Manifest untuk daftar izin | `package.json` | `pyproject.toml` | `composer.json` | `go.mod` |
