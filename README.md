# AyamKu — Next.js Ecommerce Prototype

Prototype toko ayam online menggunakan Next.js + React + localStorage.

## Role

### Buyer
- Login dengan nama lengkap, alias, dan WhatsApp.
- Mengelola alamat.
- Membuat pesanan.
- COD atau QRIS.
- QRIS wajib upload bukti pembayaran.
- Dapat meminta pembatalan sebelum admin mengonfirmasi.
- Dapat melihat status pesanan dan pengantar.
- Dapat menyelesaikan pesanan setelah pengantar mengunggah bukti serah terima.
- Dapat chat dengan admin.

### Admin
- Login admin.
- Konfirmasi pesanan.
- Menyetujui/menolak permintaan pembatalan.
- Menentukan pengantar sebelum pesanan dikirim.
- Melihat detail pembeli, alamat, pembayaran, dan bukti.
- Membalas chat pembeli.
- Membuat akses pengantar dengan kode.
- Mencabut/aktifkan kembali akses pengantar.
- Melihat status kerja pengantar.
- Melihat statistik penjualan harian, bulanan, dan tahunan.

### Pengantar
- Login menggunakan nomor WhatsApp + kode dari admin.
- Melihat pesanan yang ditugaskan.
- Mengubah status menjadi Pesanan Sampai.
- Wajib upload foto bukti serah terima.
- Setelah bukti diupload, buyer dapat menekan Pesanan Selesai.
- Jika akses dicabut admin, sesi pengantar otomatis logout.

## Demo

Admin:
- Email: `admin@ayamku.id`
- Password: `admin123`

Pengantar demo:
- WhatsApp: `081298765432`
- Kode: `AYAM-1234`

## Catatan penting

Project ini masih prototype lokal. Data pesanan, akun, dan pengantar disimpan di browser localStorage.

Foto bukti pembayaran dan bukti serah terima dikompres sebelum disimpan agar tidak cepat memenuhi quota localStorage. Untuk production, gunakan database + object storage seperti Supabase Storage, Cloudinary, Firebase Storage, atau Vercel Blob dan simpan URL file di database.

Jika sebelumnya browser sudah penuh, hapus data `ayamku_orders_v4` dan `ayamku_couriers_v4` dari Local Storage browser sebelum menjalankan prototype versi terbaru.

## Jalankan

```bash
npm install
npm run dev
```
