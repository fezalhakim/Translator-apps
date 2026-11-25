# AI Translator Perbualan

App web untuk terjemahan perbualan **antara 2 orang** secara bersemuka, dikuasakan oleh Claude (Anthropic).

## Ciri-ciri
- **Skrin terbahagi dua** — Orang A di atas (diterbalikkan 180° supaya boleh dibaca dari seberang meja), Orang B di bawah. Boleh tukar ke mod biasa.
- **Cakap atau taip** — tekan butang mikrofon, cakap, dan terjemahan muncul di skrin orang yang satu lagi.
- **Suara (TTS)** — terjemahan dibacakan dalam bahasa pendengar (boleh dimatikan).
- **20 bahasa** — Melayu, English, 中文, Tamil, Indonesia, Arab, Thai, Vietnam, Jepun, Korea, Hindi, dll.
- **Sedar konteks** — AI guna beberapa ayat terakhir perbualan untuk terjemahan yang lebih tepat.

## Cara jalankan
Perlu Node.js 18+ dan API key Anthropic (https://console.anthropic.com).

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...
npm start
```
Buka http://localhost:3000.

> Mikrofon dalam pelayar hanya berfungsi melalui `https://` atau `localhost`. Pengecaman suara paling baik di **Chrome / Edge** (Android & desktop) dan Safari (iOS).
> Untuk guna di telefon, deploy ke hos yang ada HTTPS (cth. Render, Railway, Fly.io) dan tetapkan `ANTHROPIC_API_KEY` di sana.

## Deploy ke internet (Render — percuma)
1. Daftar / log masuk di https://render.com menggunakan akaun GitHub anda.
2. Klik **New → Web Service**, pilih repo `Translator-apps`, dan pilih branch yang mengandungi kod ini.
3. Render akan baca `render.yaml` secara automatik. Jika diminta, isi:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Di bahagian **Environment Variables**, tambah:
   - `ANTHROPIC_API_KEY` = API key anda (`sk-ant-...`)
   - `ACCESS_CODE` = kod rahsia pilihan anda (cth. `kopi123`) — **sangat disyorkan**, supaya orang lain tidak boleh guna API key anda.
5. Klik **Deploy**. Selepas beberapa minit anda akan dapat URL seperti `https://ai-translator-perbualan.onrender.com`.
6. Buka URL itu di telefon (Chrome/Safari), masukkan kod akses sekali, dan benarkan mikrofon.

> Pelan percuma Render "tidur" selepas 15 minit tidak digunakan — bukaan pertama selepas itu mungkin ambil ~30–60 saat.

## Tetapan pilihan
| Pemboleh ubah | Lalai | Keterangan |
|---|---|---|
| `PORT` | `3000` | Port pelayan |
| `ACCESS_CODE` | (tiada) | Jika ditetapkan, pengguna perlu masukkan kod ini sebelum boleh terjemah |
| `CLAUDE_MODEL` | `claude-opus-5-5` | Model Claude yang digunakan |

## Struktur
- `server.js` — pelayan Express; endpoint `POST /api/translate` memanggil Claude.
- `public/index.html` — antara muka (pengecaman suara & TTS guna Web Speech API pelayar).
