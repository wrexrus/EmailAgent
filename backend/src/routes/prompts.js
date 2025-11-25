const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PROMPT_PATH = path.join(__dirname, '..', 'models', 'prompts.json');

function readPrompts() {
  try {
    const raw = fs.readFileSync(PROMPT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {
      categorizationPrompt: "Categorize the email into exactly one of: Important, Meeting Request, Newsletter, Spam, To-Do, Project Update. Only respond with the label.",
      actionItemPrompt: "Extract action items as JSON: {\"task\":\"...\",\"deadline\":\"...\"}. If none, return null.",
      autoReplyPrompt: "Draft a professional reply. Format:\nSubject: <subject>\nBody:\n<message>"
    };
  }
}

function writePrompts(obj) {
  fs.writeFileSync(PROMPT_PATH, JSON.stringify(obj, null, 2));
}

// Read prompts
router.get('/', (req, res) => {
  try {
    const data = readPrompts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Cannot read prompts" });
  }
});

// Save (partial or full) prompts - merges into existing
router.post('/update', (req, res) => {
  try {
    const existing = readPrompts();
    const incoming = req.body || {};

    // Validate that incoming fields are strings if present
    const allowedKeys = ['categorizationPrompt', 'actionItemPrompt', 'autoReplyPrompt'];
    for (const k of Object.keys(incoming)) {
      if (!allowedKeys.includes(k)) {
        return res.status(400).json({ error: `Unknown prompt key: ${k}` });
      }
      if (typeof incoming[k] !== 'string') {
        return res.status(400).json({ error: `${k} must be a string` });
      }
    }

    const merged = { ...existing, ...incoming };
    writePrompts(merged);
    res.json({ ok: true, message: "Prompts updated", prompts: merged });
  } catch (err) {
    res.status(500).json({ error: "Failed to update prompts" });
  }
});

// Reset to default
router.post('/reset', (req, res) => {
  const defaultPrompts = {
    categorizationPrompt:
      "Categorize the email into exactly one of: Important, Meeting Request, Newsletter, Spam, To-Do, Project Update. Only respond with the label.",
    actionItemPrompt:
      "Extract action items from the email. Respond ONLY with valid JSON: {\"task\":\"<action>\",\"deadline\":\"<optional>\"}. If there are no action items, return null.",
    autoReplyPrompt:
      "Draft a professional reply using the provided EMAIL CONTEXT. If the email is a meeting request, ask for agenda or confirm availability. If it is a task request, confirm receipt and provide next steps. Output EXACTLY in this format:\nSubject: <reply subject>\nBody:\n<reply body>"
  };
  try {
    writePrompts(defaultPrompts);
    res.json({ ok: true, message: "Prompts reset to default", prompts: defaultPrompts });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset prompts" });
  }
});

module.exports = router;
