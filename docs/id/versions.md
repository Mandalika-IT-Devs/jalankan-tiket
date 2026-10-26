# Versi yang sudah diuji

| Komponen | Versi |
|---|---|
| Kit (plugin `tiket`) | 1.0.0 |
| Claude Code | 2.1.299 |
| mattpocock-skills | 1.3.1 |
| GitHub Actions | `actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6` |
| Profil `nextjs-postgres` | Node.js 22 atau 24 (LTS yang terpasang), PostgreSQL 17 |

## Jalur yang sudah tervalidasi

| Jalur | Status |
|---|---|
| Proyek baru, runner GitHub | Tervalidasi dari setup sampai tiket merged, termasuk tiket yang diparkir dan keputusan pemilik |
| Proyek lama yang sudah memakai salinan lama workflow ini, runner GitHub | Tervalidasi dari adopsi sampai pembaruan versi kit |
| Runner sendiri (self-hosted) | Belum tervalidasi lewat kit |
| Akun agen dan laju kerja (1.1.0) | Belum tervalidasi lewat kit |
| Stack selain `nextjs-postgres` | Lewat [Menyesuaikan stack](adapting-your-stack.md), belum ada profil yang teruji |

Versi mattpocock-skills yang sudah diuji juga tercatat di `plugins/tiket/reference/tested-versions.json`. `/tiket:cek-proyek` membaca berkas itu.
