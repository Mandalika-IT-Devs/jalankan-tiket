# Dokumen proyek

Setiap proyek memakai nama berkas yang sama, apa pun bahasanya. Isinya mengikuti bahasa proyek.

| Berkas | Isi | Dibuat oleh | Terlindungi |
|---|---|---|---|
| `docs/input/` | Bahan mentah: catatan, dokumen, contoh berkas. Bukan aturan. | Anda | tidak |
| `docs/PRD.md` | Aturan bisnis, dengan bagian bernomor | `rencanakan-produk` | ya |
| `GLOSSARY.md` | Istilah beserta sinonim yang dihindari (_Avoid_) | `rencanakan-produk` | ya |
| `docs/adr/` | Keputusan teknis. ADR-0001 tentang stack, ADR-0002 tentang modul domain murni | `siapkan-proyek`, `rencanakan-produk` | ya |
| `docs/OPEN-DECISIONS.md` | Keputusan bisnis yang belum diambil, beserta nilai contohnya | `rencanakan-produk` | ya |
| `docs/UAT.md` | Skenario penerimaan untuk setiap bagian PRD | `rencanakan-produk` | ya |
| `tests/golden/` | Contoh hitungan yang benar, dalam format JSON | `rencanakan-produk` | ya |
| `docs/DESIGN.md` | Sistem desain, bila produk punya tampilan | `rencanakan-produk` atau `/impeccable` | ya |
| `AGENTS.md` + `CLAUDE.md` | Peta sumber kebenaran, pagar, dan perintah untuk agent | `siapkan-proyek` | ya |
| `CODING_STANDARDS.md` | Standar kode dan daftar periksa peninjau khusus proyek | `siapkan-proyek` | ya |
| `docs/agents/*.md` | Konfigurasi skill mattpocock-skills | `siapkan-proyek` | ya |
| `docs/GUIDE.md` | Panduan pemilik untuk proyek ini | `siapkan-proyek` | tidak |
| `.github/` | Template issue dan PR, CI, daftar berkas terlindungi, daftar izin dependency, konfigurasi kit | `siapkan-proyek` | ya |
| `.claude/settings.json` | Izin agent dan plugin proyek | `siapkan-proyek` | ya |
| `docs/DEPLOY.md` | Runbook deploy | Tiket deploy | tidak |

## Konvensi

- **▶ Keputusan.** Keputusan Anda ditulis di PRD sebagai blok `▶ Keputusan YYYY-MM-DD: …`, tepat di bawah teks yang diubah atau ditegaskannya. Blok ini mengalahkan teks di atasnya. Di proyek berbahasa Inggris, namanya `▶ Decision`.
- **OD-xx dan `[CONTOH]`.** Pertanyaan bisnis yang belum diputuskan diberi nomor OD. Nilai contohnya dipakai di seed dan test dengan tanda `[CONTOH]` (`[EXAMPLE]` di proyek berbahasa Inggris), dan disebut di PR.
- **Golden.** Setiap aturan yang punya angka atau rumus punya contoh hitungan di `tests/golden/`. Test mengambil ekspektasinya dari golden, bukan dari rumus yang sama dengan kode.
- **Glosarium.** Nama di kode, test, issue, dan PR memakai istilah `GLOSSARY.md` persis. Sinonim di daftar _Avoid_ tidak dipakai.
- **Daftar periksa peninjau.** Aturan khusus proyek yang harus diperiksa di setiap tiket ditulis di bagian akhir `CODING_STANDARDS.md`.
- **Berkas terlindungi.** Daftarnya ada di `.github/protected-paths.txt`, dan `.github/CODEOWNERS` dibuat dari daftar itu.
