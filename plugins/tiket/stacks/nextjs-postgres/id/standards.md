## Stack: Next.js + PostgreSQL

### Bahasa

- TypeScript `strict`, tanpa `any`.
- Data dari luar bertipe `unknown`, lalu divalidasi dengan Zod.

### Struktur folder

- `src/domain/` berisi aturan bisnis murni.
- `src/server/` berisi database, berkas, email, waktu, dan pekerjaan latar.
- `src/app/` berisi rute, Server Action, dan komponen.

Arah impornya satu jalan:
- `src/domain/` tidak mengimpor `src/server/` maupun `src/app/`;
- `src/server/` tidak mengimpor `src/app/`.

Aturan impor ini ditegakkan dependency-cruiser.

### Server Action dan route handler

Server Action dan route handler dibuat tipis. Urutannya selalu:
1. baca sesi;
2. validasi input dengan Zod;
3. periksa kewenangan di server;
4. panggil domain atau server;
5. kembalikan hasil.

Menyembunyikan tombol di tampilan bukan pemeriksaan kewenangan.

### Komponen

- Komponen tampilan tidak menghitung aturan bisnis. Komponen menampilkan hasil beserta bahan hitungnya.
- Komponen shadcn/ui ada di `src/components/ui/`. Komponen baru hanya dibuat bila issue menyebutnya.

### Database dan waktu

- Database diakses lewat Drizzle ORM, dan migrasinya dibuat dengan Drizzle Kit.
- Migrasi yang sudah di-merge tidak diubah. Setiap perubahan dibuat sebagai migrasi baru.
- Instan waktu disimpan sebagai `timestamptz` (UTC).
- Konversi zona waktu hanya dilakukan di satu modul di `src/server/`.
