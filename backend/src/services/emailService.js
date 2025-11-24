const fs = require("fs");
const path = require("path");
const { runPrompt } = require("./llmService");

const INBOX_PATH = path.join(__dirname, "..", "models", "inbox.json");
const PROMPT_PATH = path.join(__dirname, "..", "models", "prompts.json");

function loadInbox() {
  return JSON.parse(fs.readFileSync(INBOX_PATH, "utf8"));
}

function saveInbox(data) {
  fs.writeFileSync(INBOX_PATH, JSON.stringify(data, null, 2));
}

function loadPrompts() {
  return JSON.parse(fs.readFileSync(PROMPT_PATH, "utf8"));
}

async function processEmails() {
  const emails = loadInbox();
  const prompts = loadPrompts();

  for (let email of emails) {
    if (email.processed) continue;

    const categorizationPrompt = `
${prompts.categorizationPrompt}

Email:
Subject: ${email.subject}
Body:
${email.body}
    `;

    const actionPrompt = `
${prompts.actionItemPrompt}

Email:
${email.body}
    `;

    const categoryResult = await runPrompt(categorizationPrompt);
    const actionResult = await runPrompt(actionPrompt);

    email.labels = categoryResult ? categoryResult.split(",").map(c => c.trim()) : [];
    email.actionItem = actionResult ? actionResult : null;
    email.processed = true;
  }

  saveInbox(emails);
  return emails;
}

module.exports = { processEmails };
