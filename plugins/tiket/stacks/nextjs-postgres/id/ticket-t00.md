## Yang dibangun

Fondasi repo: aplikasi Next.js kosong yang lolos `pnpm verify` dan CI. Tiket ini belum membangun fitur bisnis apa pun.

## Dalam scope

- **Aplikasi:**
  - Next.js App Router, TypeScript strict, pnpm, dan Node.js versi LTS yang tercatat di ADR-0001. Tulis `packageManager` dan `engines` di `package.json`.
  - Satu halaman awal yang menampilkan nama produk.
- **Database:**
  - PostgreSQL lewat Drizzle ORM. `docker-compose.yml` dan `.env.example` sudah ada.
  - `drizzle.config.ts` dan migrasi pertama, yang masih kosong.
- **Tampilan:** Tailwind 4 dan shadcn/ui terpasang, dengan tema bawaan.
- **Skrip di `package.json`:** `typecheck`, `lint`, `knip`, `depcruise`, `test`, `test:e2e`, dan `verify`.
  - `verify` menjalankan `node scripts/verify.mjs`. Berkas itu sudah ada.
  - `depcruise` menjalankan dependency-cruiser dengan `.dependency-cruiser.cjs`. Berkas itu juga sudah ada.
- **Test:**
  - Vitest dengan satu test contoh di `src/domain/`.
  - Playwright dengan satu test e2e untuk halaman awal.
  - Server e2e memakai port dari variabel `E2E_PORT`; bila tidak diisi, pakai 3100.
  - Server e2e memuat `.env.ci` dengan override, supaya e2e tidak pernah memakai database pengembangan.
- **Konfigurasi alat:** ESLint, Prettier, dan knip dikonfigurasi supaya `pnpm verify` hijau.

## Di luar scope

- Fitur bisnis apa pun.
- Login atau autentikasi.
- Halaman selain halaman awal.

## Kriteria penerimaan

- [ ] `pnpm verify` hijau di lokal.
- [ ] Job `verify` di CI hijau, termasuk test e2e.
- [ ] Semua dependency ada di `.github/dependency-allowlist.txt`.
- [ ] Kode di `src/domain/` hanya mengimpor dari `src/domain/`. Bila tidak, `pnpm depcruise` gagal.

## Rujukan

ADR-0001, ADR-0002, AGENTS.md, CODING_STANDARDS.md.

## Blocked by

- Tidak ada
