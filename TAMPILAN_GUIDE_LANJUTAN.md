# 🎨 Panduan Tampilan Lanjutan Portfolio

Dokumen ini fokus pada implementasi visual untuk halaman utama dan dashboard admin agar tetap konsisten dengan desain website.

## 1. Halaman Utama (Portfolio)

### Tujuan tampilan
Memberikan kesan modern, bold, dan menarik dengan nuansa manga/neo-brutalist.

### Komponen utama
- Hero section
- About section
- Skills section
- Projects section
- Achievements section
- Education section
- Guestbook section

### Rekomendasi layout
- Gunakan latar berwarna `#F8F9FA`
- Pastikan setiap section memiliki jarak yang cukup
- Tambahkan border hitam tebal pada card dan elemen penting
- Gunakan accent cyan `#00C2FF` untuk heading, ikon, dan highlight

### Detail visual
- Hero: teks besar, bold, dengan accent cyan
- Card: background putih, border hitam, shadow tegas
- Badge skill: border hitam, background putih atau cyan
- Tombol: hitam untuk aksi utama, outline hitam untuk opsi lain

## 2. Dashboard Admin

### Tujuan tampilan
Membuat admin panel terasa rapi, profesional, dan tetap selaras dengan desain portfolio.

### Rekomendasi warna
- Background utama: `#F8F9FA`
- Panel/sidebar: putih atau warna netral terang
- Accent: `#00C2FF`
- Teks utama: `#000000`
- Border: `#000000`

### Komponen yang disarankan
- Sidebar dengan border hitam dan state aktif beraccent cyan
- Card form dengan background putih dan shadow tegas
- Tombol simpan/edit/hapus dengan warna yang konsisten
- Notifikasi success memakai border cyan dan teks cyan
- Notifikasi error memakai warna merah tegas

## 3. Sistem Warna yang Disarankan

### Warna utama
- `#F8F9FA` → background
- `#000000` → teks dan border
- `#00C2FF` → highlight utama
- `#FFFFFF` → elemen card/form

### Warna pendukung
- `#0090CC` → accent hover/tekanan
- `#E9ECEF` → area ringan
- `#6C757D` → teks sekunder

## 4. Elemen visual yang wajib dipertahankan

- Border tegas hitam
- Shadow brutalist
- Accent cyan yang konsisten
- Layout sederhana namun berani
- Tidak terlalu banyak warna agar tetap clean

## 5. Contoh penerapan

### Untuk card
```css
background: #FFFFFF;
border: 2px solid #000000;
box-shadow: 4px 4px 0px 0px #000000;
```

### Untuk accent
```css
background: #00C2FF;
color: #000000;
border: 2px solid #000000;
```

### Untuk heading
```css
color: #000000;
background: #00C2FF;
```

## 6. Kesimpulan

Tampilan portfolio ini paling cocok memakai pendekatan:
- clean background
- bold typography
- strong black borders
- cyan accent untuk fokus visual
- neo-brutalist shadow untuk kesan modern dan unik
