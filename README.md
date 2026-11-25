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

## Tetapan pilihan
| Pemboleh ubah | Lalai | Keterangan |
|---|---|---|
| `PORT` | `3000` | Port pelayan |
| `CLAUDE_MODEL` | `claude-opus-5-5` | Model Claude yang digunakan |

## Struktur
- `server.js` — pelayan Express; endpoint `POST /api/translate` memanggil Claude.
- `public/index.html` — antara muka (pengecaman suara & TTS guna Web Speech API pelayar).
