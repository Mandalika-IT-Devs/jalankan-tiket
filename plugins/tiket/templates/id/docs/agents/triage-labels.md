# Label triase

Skill di mattpocock-skills memakai lima peran triase. Tabel ini memetakan setiap peran ke label yang benar-benar dipakai di repo ini. Sumber nama labelnya adalah bagian `labels` di `.github/jalankan-tiket.json`, dan `/tiket:cek-proyek` memeriksa bahwa kedua berkas itu sama.

| Label in mattpocock/skills | Label in our tracker | Arti |
|---|---|---|
| `needs-triage` | `{{LABEL_NEEDS_TRIAGE}}` | Pemilik perlu menilai issue ini |
| `needs-info` | `{{LABEL_NEEDS_INFO}}` | Menunggu jawaban pemilik. Koordinator melewatinya |
| `ready-for-agent` | `{{LABEL_READY_FOR_AGENT}}` | Spesifikasinya lengkap dan siap dikerjakan agent |
| `ready-for-human` | `{{LABEL_READY_FOR_HUMAN}}` | Perlu dikerjakan manusia, misalnya karena menyangkut kredensial atau domain |
| `wontfix` | `{{LABEL_WONTFIX}}` | Tidak akan dikerjakan |

Selain kelima label itu ada label `{{LABEL_OWNER_APPROVED}}`. Label ini dipasang pemilik pada PR yang mengubah berkas terlindungi. Agent tidak pernah memasangnya.
