# Questions

This format applies to every question the qa plugin asks: the setup questions, and the questions in a readiness audit or a test plan that the QA engineer forwards to the product team.

Write each question in the workspace language, in plain words. Use that one language for the whole message.

## Each question carries

- **Answer options.** Exactly one option is marked as the recommendation, chosen by best practice: `(rekomendasi)` or `(recommended)`.
- **One sentence of reason** for the recommendation.
- **Who can answer**, when it is not the QA engineer: the developers, the product owner, or the app owner.

Number the questions. End a list for the QA engineer with this line in the workspace language:
- Indonesian: "Jawab 'setuju semua' atau sebut nomor yang berbeda."
- English: "Answer 'agree to all' or name the numbers that differ."

## Example (Indonesian workspace)

```
1. Apakah staging mengirim email sungguhan saat pelanggan mendaftar?
   - a) Tidak, staging memakai layanan email uji (rekomendasi)
   - b) Ya, email terkirim ke alamat sungguhan
   - c) Belum tahu
   Alasan: test pendaftaran hanya aman dijalankan bila email tidak sampai ke orang sungguhan.
   Yang bisa menjawab: developer.

Jawab 'setuju semua' atau sebut nomor yang berbeda.
```
