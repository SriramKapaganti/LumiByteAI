const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  createNewSession,
  listSessions,
  getSession,
  addUserMessage,
  addBotResponse,
} = require("./mockData");

const { askGemini } = require("./geminiClient");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ------------------------ HEALTH CHECK ------------------------
app.get("/", (req, res) =>
  res.send({
    ok: true,
    service: "lumibyte-mock-api",
    geminiKey: !!process.env.GEMINI_API_KEY,
  })
);

// ------------------------ LIST SESSIONS ------------------------
app.get("/api/sessions", (req, res) => {
  res.json(listSessions());
});

// ------------------------ CREATE NEW CHAT ------------------------
app.get("/api/new-chat", (req, res) => {
  const s = createNewSession();
  res.json({ id: s.id, title: s.title });
});

// ------------------------ GET SESSION BY ID ------------------------
app.get("/api/session/:id", (req, res) => {
  const s = getSession(req.params.id);
  if (!s) return res.status(404).json({ error: "Session not found" });
  res.json(s);
});

// ------------------------ CHAT WITH GEMINI ------------------------
app.post("/api/chat/:id", async (req, res) => {
  const id = req.params.id;
  const { question } = req.body || {};

  if (!question)
    return res.status(400).json({ error: "question is required in body" });

  const session = getSession(id);
  if (!session) return res.status(404).json({ error: "Session not found" });

  // Save user message
  addUserMessage(id, question);

  try {
    // Ask Gemini
    const geminiResponse = await askGemini(question);

    const response = {
      text: geminiResponse,
      table: null, // optional table structure
    };

    // Save bot response history
    addBotResponse(id, response);

    res.json(response);
  } catch (err) {
    console.error("Gemini Error:", err);

    res.status(500).json({
      error: "Gemini API failed",
      details: err.message,
    });
  }
});

// ------------------------ START SERVER ------------------------
app.listen(PORT, () =>
  console.log(`Mock API server running at http://localhost:${PORT}`)
);
