import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const client = new Anthropic(); // baca ANTHROPIC_API_KEY dari environment
const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";

app.use(express.json({ limit: "100kb" }));

// Kod akses pilihan: jika ACCESS_CODE ditetapkan, hanya pengguna yang tahu kod boleh terjemah.
const ACCESS_CODE = process.env.ACCESS_CODE || "";
app.get("/api/config", (req, res) => res.json({ needsCode: Boolean(ACCESS_CODE) }));
app.get("/healthz", (req, res) => res.send("ok"));
app.use(express.static("public"));

const SYSTEM_PROMPT = `You are a real-time interpreter for a face-to-face conversation between two people who speak different languages.
Translate the latest utterance from the source language into the target language.
Rules:
- Output ONLY the translated text. No quotes, notes, explanations, or romanization.
- Keep the speaker's tone, register and intent. Spoken input may come from speech recognition and contain small errors or missing punctuation; infer the intended meaning and translate naturally.
- Use the recent conversation (if given) only to resolve ambiguity, pronouns and names. Do not translate it.
- If the utterance is already in the target language, return it unchanged.`;

app.post("/api/translate", async (req, res) => {
  if (ACCESS_CODE && req.get("x-access-code") !== ACCESS_CODE) {
    return res.status(401).json({ error: "Kod akses salah.", code: "bad_access_code" });
  }

  const { text, from, to, history } = req.body ?? {};
  if (typeof text !== "string" || !text.trim() || !from || !to) {
    return res.status(400).json({ error: "Perlu 'text', 'from' dan 'to'." });
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: "Teks terlalu panjang (maks 2000 aksara)." });
  }

  const recent = Array.isArray(history)
    ? history
        .slice(-6)
        .map((h) => `${h.speaker}: ${String(h.text).slice(0, 500)}`)
        .join("\n")
    : "";

  const userContent =
    (recent ? `Recent conversation:\n${recent}\n\n` : "") +
    `Source language: ${from}\nTarget language: ${to}\n\nUtterance to translate:\n${text.trim()}`;

  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY belum ditetapkan pada pelayan." });
  }

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" }, // terjemahan perlu pantas
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    if (response.stop_reason === "refusal") {
      return res.status(422).json({ error: "Permintaan ini tidak dapat diterjemah." });
    }

    const translation = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    res.json({ translation });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY tidak sah atau tiada." });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: "Terlalu banyak permintaan, cuba sebentar lagi." });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("API error:", err.status, err.message);
      return res.status(502).json({ error: "Ralat dari perkhidmatan AI." });
    }
    console.error(err);
    res.status(500).json({ error: "Ralat pelayan." });
  }
});

app.listen(PORT, () => {
  console.log(`AI Translator berjalan di http://localhost:${PORT}`);
});
