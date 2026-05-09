# IPTV Web

Aplikasi web modern untuk menonton siaran TV dari seluruh dunia secara gratis. Dibangun dengan React, Vite, dan TailwindCSS, aplikasi ini menyajikan ribuan channel IPTV yang bersumber dari database [IPTV-org](https://github.com/iptv-org/iptv).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.2-61DAFB.svg)
![Vite](https://img.shields.io/badge/vite-5.1-646CFF.svg)

---

## Fitur

### Streaming & Pemutaran
- **Ribuan Channel**: Akses channel TV dari berbagai negara dan kategori yang diambil dari API IPTV-org.
- **HLS.js & Native HLS**: Dukungan pemutaran stream HLS/.m3u8 dengan fallback otomatis.
- **Picture-in-Picture (PiP)**: Tonton channel dalam jendela mengambang sambil menjelajah channel lain.
- **Stream Stats Overlay**: Tampilkan statistik real-time (bitrate, resolusi, FPS, buffer) dengan menekan `I`.
- **Auto-Play Next**: Jika stream gagal, otomatis beralih ke channel berikutnya dalam daftar.

### Navigasi & Pencarian
- **Command Palette** (`Ctrl/Cmd + K`): Pencarian channel instan dengan navigasi keyboard (panah, Enter, Esc).
- **Sidebar Kategori**: Filter channel berdasarkan kategori (News, Sports, Music, Entertainment, dll.).
- **Tab All / Recent / Favorites**: Lihat semua channel, yang baru ditonton, atau favorit Anda.
- **Pencarian Teks**: Cari channel berdasarkan nama secara real-time.

### Personalisasi
- **Favorites**: Tandai channel favorit dengan klik ikon hati, tersimpan di `localStorage`.
- **Recently Watched**: Riwayat channel yang pernah ditonton, lengkap dengan tombol hapus.
- **Accent Color Switcher**: Pilih tema warna aksen (Mint, Cyan, Magenta, Amber), disimpan persisten.

### Ekspor & Visual
- **Export M3U Playlist**: Unduh daftar channel yang sedang difilter sebagai file `.m3u8` untuk digunakan di player IPTV eksternal.
- **Audio Equalizer Animation**: Indikator visual bar equalizer pada kartu channel yang sedang aktif diputar.
- **Clock Widget**: Jam digital real-time di header sidebar.

### Keyboard Shortcuts
| Tombol | Fungsi |
|---|---|
| `Ctrl/Cmd + K` | Buka Command Palette |
| `?` | Tampilkan bantuan shortcut |
| `Esc` | Tutup overlay / modal |
| `F` | Toggle fullscreen |
| `M` | Mute / unmute |
| `P` | Picture-in-Picture |
| `I` | Toggle stream stats overlay |
| `← / →` | Volume turun / naik |

---

## Teknologi

| Teknologi | Keterangan |
|---|---|
| [React 18](https://react.dev) | Library UI |
| [Vite 5](https://vitejs.dev) | Build tool & dev server |
| [TailwindCSS 3](https://tailwindcss.com) | Utility-first CSS framework |
| [HLS.js](https://github.com/video-dev/hls.js) | Pemutar stream HLS di browser |
| [Lucide React](https://lucide.dev) | Ikon SVG |
| [IPTV-org API](https://github.com/iptv-org/api) | Sumber data channel & stream |

---

## Instalasi & Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org) versi 18 atau lebih baru
- npm (termasuk dalam Node.js)

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/maxnmrantau/iptv.git
cd iptv

# 2. Install dependensi
npm install

# 3. Jalankan mode pengembangan
npm run dev

# 4. Buka browser di http://localhost:5173
```

### Build Produksi

```bash
# Build untuk production
npm run build

# Preview hasil build secara lokal
npm run preview
```

Output build ada di folder `dist/`, siap di-deploy ke Vercel, Netlify, atau hosting statis lainnya.

---

## Struktur Proyek

```
iptv/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AccentSwitcher.jsx    # Pemilih tema warna aksen
│   │   ├── ChannelCard.jsx       # Kartu channel individual
│   │   ├── ChannelList.jsx       # Daftar channel + ekspor M3U
│   │   ├── Clock.jsx             # Widget jam digital
│   │   ├── CommandPalette.jsx    # Pencarian channel cepat
│   │   ├── KeyboardHelp.jsx      # Modal bantuan shortcut
│   │   ├── Layout.jsx            # Layout utama (sidebar + konten)
│   │   ├── Sidebar.jsx           # Sidebar navigasi & filter
│   │   ├── StreamStatus.jsx      # Indikator status stream
│   │   └── VideoPlayer.jsx       # Pemutar video + kontrol
│   ├── hooks/
│   │   └── useIptvData.js        # Custom hook data IPTV
│   ├── utils/
│   │   ├── api.js                # Fetch API IPTV-org + caching
│   │   ├── storage.js            # localStorage helpers
│   │   ├── streamChecker.js      # Pengecekan status stream
│   │   └── theme.js              # Manajemen tema aksen
│   ├── App.jsx                   # Komponen root aplikasi
│   ├── index.css                 # Global styles + CSS variables
│   └── main.jsx                  # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── README.md
```

---

## Sumber Data IPTV

Data channel, kategori, dan stream berasal dari proyek open-source **[IPTV-org](https://github.com/iptv-org/iptv)** melalui API publik mereka:

- **API Endpoint**: `https://iptv-org.github.io/api/`
- **Repository**: [github.com/iptv-org/iptv](https://github.com/iptv-org/iptv)
- **API Repository**: [github.com/iptv-org/api](https://github.com/iptv-org/api)

> **Catatan**: Aplikasi ini hanya menampilkan data yang disediakan oleh IPTV-org. Kami tidak menyimpan, menghosting, atau mendistribusikan konten streaming apa pun. Semua stream berasal dari sumber publik yang dikurasi oleh komunitas IPTV-org.

---

## Lisensi

### Kode Aplikasi
Kode sumber aplikasi ini dilisensikan di bawah [MIT License](https://opensource.org/licenses/MIT).

```
MIT License

Copyright (c) 2025 maxnmrantau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Data IPTV
Data channel dan stream yang digunakan berasal dari [IPTV-org/iptv](https://github.com/iptv-org/iptv) yang dirilis di bawah [The Unlicense](https://unlicense.org) — pada dasarnya public domain. Silakan merujuk ke repository tersebut untuk detail lebih lanjut.

---

## Deployment

Aplikasi ini siap di-deploy ke **Vercel** dengan konfigurasi yang sudah disertakan (`vercel.json`). Cukup hubungkan repository GitHub ke Vercel dan deploy otomatis akan berjalan.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## Kontribusi

Kontribusi selalu diterima! Silakan buka issue atau pull request di [repository GitHub](https://github.com/maxnmrantau/iptv).

---

Dibuat oleh [maxnmrantau](https://github.com/maxnmrantau)
