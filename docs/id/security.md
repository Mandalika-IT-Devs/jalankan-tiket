# Keamanan dan pagar

## Mode izin

- **Pakai mode Auto.** Mode ini berjalan tanpa banyak konfirmasi, tetapi setiap tindakan tetap diperiksa pengklasifikasi Claude Code, dan aturan *deny* proyek tetap berlaku.
- **Jangan memakai mode Bypass**, kecuali di mesin terisolasi seperti container atau VM. Itu juga saran resmi Claude Code.

## Yang dijaga dan caranya

| Pagar | Penjaganya |
|---|---|
| Berkas terlindungi hanya berubah dengan persetujuan Anda | CI `kebersihan-pr` dan label `disetujui-pemilik`. Daftar berkas dibaca dari branch tujuan. |
| Library baru butuh persetujuan | CI memeriksa daftar izin dependency |
| `main` hanya berubah lewat PR yang CI-nya hijau | Ruleset GitHub (bila tersedia), aturan *deny* untuk push ke `main` dan force-push, serta instruksi koordinator |
| Agent tidak mengubah label, repo, atau API GitHub | Aturan *deny* di `.claude/settings.json` |
| Agent tidak menyentuh label persetujuan | Aturan *deny* untuk setiap perintah yang menyebut nama label itu |

## Batasan yang perlu Anda ketahui

- **Agent memakai login `gh` Anda sendiri.** Bagi GitHub, label yang dipasang agent sama dengan label yang Anda pasang. Larangan memasang label persetujuan dijaga oleh aturan izin dan instruksi, bukan oleh GitHub.
- **Aturan izin tidak kebal.** Aturan itu mencocokkan teks perintah, jadi bukan batas keamanan mutlak. Bentuk perintah yang tidak lazim bisa lolos. Fungsinya pagar terhadap kesalahan, bukan terhadap niat jahat.
- **CI berjalan dari isi PR.** Untuk PR dari repo yang sama, GitHub menjalankan workflow dari isi PR itu. PR yang mengubah workflow CI bisa saja melewati pemeriksaannya. Itulah sebabnya `.github/` termasuk berkas terlindungi, dan peninjau menandai setiap perubahan di sana.

## Rahasia

- `.env` tidak di-commit.
- `.env.ci` hanya berisi nilai palsu untuk test.
- Rahasia untuk deploy disimpan sebagai *secret* repository, dan hanya Anda yang memasangnya.
- Data pribadi asli tidak pernah ditaruh di `docs/input/`, di seed, atau di test.
