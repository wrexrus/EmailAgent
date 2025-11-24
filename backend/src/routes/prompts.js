const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PROMPT_PATH = path.join(__dirname, '..', 'models', 'prompts.json');

// Read prompts
router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(PROMPT_PATH, 'utf8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: "Cannot read prompts" });
  }
});

// Save prompts
router.post('/update', (req, res) => {
  const { categorizationPrompt, actionItemPrompt, autoReplyPrompt } = req.body;
  if (!categorizationPrompt || !actionItemPrompt || !autoReplyPrompt) {
    return res.status(400).json({ error: "All prompts required" });
  }
  fs.writeFileSync(PROMPT_PATH, JSON.stringify(req.body, null, 2));
  res.json({ ok: true, message: "Prompts updated successfully" });
});

// Reset to default
router.post('/reset', (req, res) => {
  const defaultPrompts = {
    categorizationPrompt: "Categorize emails into: Important, Newsletter, Spam, To-Do. To-Do emails must include a direct request requiring user action.",
    actionItemPrompt: "Extract tasks from the email. Respond in JSON: { \"task\": \"...\", \"deadline\": \"...\" }.",
    autoReplyPrompt: "If an email is a meeting request, draft a polite reply asking for an agenda."
  };
  fs.writeFileSync(PROMPT_PATH, JSON.stringify(defaultPrompts, null, 2));
  res.json({ ok: true, message: "Prompts reset to default" });
});

module.exports = router;
