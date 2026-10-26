# jalankan-tiket

> **Status: v1.0.** Sudah divalidasi dari awal sampai akhir di proyek baru dan di proyek lama; jalur yang sudah tervalidasi ada di [Versi teruji](docs/id/versions.md). Contoh: [mandalikadev/contoh-perpustakaan](https://github.com/mandalikadev/contoh-perpustakaan), aplikasi perpustakaan kecil yang dibangun dengan kit ini, lengkap dengan tiket dan PR-nya.

Plugin Claude Code untuk menjalankan seluruh proyek perangkat lunak dari tiket GitHub. Anda cukup merencanakan produk bersama Claude satu kali. Setelah itu Claude mengerjakan setiap tiket yang siap, sendiri dan satu per satu:

```
pelaksana (test lebih dulu) → peninjau independen → pull request → CI → merge
```

Bila sebuah tiket membutuhkan keputusan bisnis, Claude memarkirnya. Lalu Claude mengajukan pertanyaan yang jelas kepada Anda, lengkap dengan jawaban yang direkomendasikan. Claude tidak pernah menebak.

[Read in English →](README.md)

## Kenapa

Agent pemrograman biasanya gagal dengan tiga cara yang bisa ditebak:
- membangun hal yang salah;
- menebak aturan bisnis;
- membiarkan kualitas menurun.

Kit ini memasang pagar untuk masing-masing:
- **Perencanaan lewat grilling.** Claude menanyai Anda sampai setiap aturan, angka, dan rumus tertulis. Hasilnya PRD, glosarium, keputusan terbuka, skenario UAT, dan contoh hitungan yang benar.
- **Dua jenis ketidakjelasan.**
  - Ketidakjelasan teknis: Claude memutuskan sendiri dan mencatat keputusannya.
  - Ketidakjelasan bisnis: Claude memarkir tiketnya dan bertanya kepada Anda.
- **Pagar yang ditegakkan GitHub.**
  - Dokumen terlindungi hanya berubah lewat PR yang memakai label persetujuan Anda.
  - Library harus ada di daftar izin.
  - Tidak ada perubahan yang masuk ke `main` tanpa CI hijau.

## Pasang

Di sesi Claude Code (CLI atau tab Code di Claude Desktop):

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add mandalikadev/jalankan-tiket
/plugin install tiket@jalankan-tiket
```

[mattpocock-skills](https://github.com/mattpocock/skills) ikut terpasang sebagai dependensi.

## Pakai

| Langkah | Perintah |
|---|---|
| 1. Siapkan proyek baru atau proyek lama | `/tiket:siapkan-proyek` |
| 2. Rencanakan produk bersama Claude | `/tiket:rencanakan-produk` |
| 3. Pecah satu tahap menjadi tiket | `/tiket:rencanakan-tahap` |
| 4. Biarkan Claude mengerjakan tiket | `/tiket:jalankan` |
| 5. Jawab pertanyaan dari tiket yang diparkir | `/tiket:catat-keputusan` |
| Ragu langkah berikutnya? | `/tiket:cek-proyek` |

## Panduan

| Bahasa Indonesia | English |
|---|---|
| [Mulai cepat](docs/id/quickstart.md) | [Quickstart](docs/en/quickstart.md) |
| [Cara kerja](docs/id/how-it-works.md) | [How it works](docs/en/how-it-works.md) |
| [Daftar perintah](docs/id/commands.md) | [Commands](docs/en/commands.md) |
| [Dokumen proyek](docs/id/documents.md) | [Project documents](docs/en/documents.md) |
| [Menyesuaikan stack](docs/id/adapting-your-stack.md) | [Adapting your stack](docs/en/adapting-your-stack.md) |
| [CI dan runner](docs/id/ci-and-runners.md) | [CI and runners](docs/en/ci-and-runners.md) |
| [Proyek lama](docs/id/existing-projects.md) | [Existing projects](docs/en/existing-projects.md) |
| [Pembaruan](docs/id/updates.md) | [Updates](docs/en/updates.md) |
| [Keamanan dan pagar](docs/id/security.md) | [Security and guardrails](docs/en/security.md) |
| [Akun agen](docs/id/agent-account.md) | [Agent account](docs/en/agent-account.md) |
| [Tanya jawab](docs/id/faq.md) | [FAQ](docs/en/faq.md) |
| [Versi teruji](docs/id/versions.md) | [Tested versions](docs/en/versions.md) |

## Kebutuhan

- Claude Code 2.1.299 atau lebih baru.
- `git`, GitHub CLI `gh` yang sudah login dengan izin `repo` dan `workflow`, serta `jq`.
- Akun GitHub terpisah untuk agent, misalnya akun mesin. Lihat [Akun agen](docs/id/agent-account.md).
- Untuk stack bawaan Next.js + PostgreSQL, tambahkan:
  - Node.js 22 atau 24 (LTS);
  - pnpm;
  - Docker.

## Kredit dan lisensi

- Workflow ini dibangun di atas [mattpocock/skills](https://github.com/mattpocock/skills) (MIT): grilling, pemodelan domain, TDD, dan konvensi issue tracker. Template yang diadaptasi dari skill tersebut tetap mencantumkan atribusinya.
- Kit ini dirilis dengan [lisensi MIT](LICENSE).
