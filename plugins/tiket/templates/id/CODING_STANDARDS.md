# Standar Kode

Dokumen ini dipakai oleh dua subagent:
- `tiket:pelaksana`, saat menulis kode;
- `tiket:peninjau`, pada sumbu Standards.

Aturan yang sudah ditegakkan alat lewat `{{VERIFY_COMMAND}}` tidak perlu diulang di sini. Stack dicatat di ADR-0001.

## Bahasa dan penamaan

- Konsep domain memakai istilah `GLOSSARY.md` persis. Konsep pemrograman umum memakai bahasa Inggris, misalnya `parse`, `result`, dan `handler`.
- Teks antarmuka, pesan kesalahan, pesan commit, dan isi PR memakai bahasa Indonesia.
- Setiap pesan kesalahan menyebut sebabnya dan langkah berikutnya.
- Data dari luar (form, request, berkas impor) divalidasi di batas sistem sebelum dipakai.

## Batas modul

- `{{DOMAIN_MODULE_PATH}}` berisi aturan bisnis murni (ADR-0002). Isinya fungsi input → output yang deterministik: tanpa database, I/O, framework, dan jam sistem.
- Lapisan lain memanggil domain, tidak sebaliknya. Aturan impor ini ditegakkan alat di `{{VERIFY_COMMAND}}`.

{{STACK_STANDARDS}}

## Test

- Test ditulis di seam yang disebut issue.
- Tiket yang menyentuh aturan bisnis wajib menambah unit test di modul domain.
- Ekspektasi test diambil dari `tests/golden/`, dari PRD, atau dari contoh literal di issue. Ekspektasi tidak boleh dihitung dengan rumus yang sama seperti di kode.
- Data nyata tidak di-commit. Seed dan test memakai data sintetis, dan nilai dari `docs/OPEN-DECISIONS.md` diberi tanda `{{EXAMPLE_MARKER}}`.

## Dependency

- Dependency baru hanya boleh dari `.github/dependency-allowlist.txt`. Selain itu harus disetujui pemilik.
- Tidak boleh ada berkas, export, atau dependency yang tidak dipakai.

## Daftar periksa peninjau (review checklist)

<!-- Aturan khusus proyek ini, yang diperiksa tiket:peninjau di setiap tiket.
Tulis satu butir per baris, dan setiap butir harus bisa dicek lulus/gagal.
Contoh: "Setiap perubahan stok menulis satu baris riwayat beserta pelakunya."
Butir bisa ditambah lewat keputusan pemilik atau dari hasil /retro. -->

- (belum ada)
