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

// Clean Gemini Response
function cleanLLMResponse(result) {
  if (!result) return "";
  if (typeof result === "object" && result.parts) {
    return result.parts.map((p) => p.text).join(" ");
  }
  return String(result).trim();
}

async function processEmails() {
  const emails = loadInbox();
  const prompts = loadPrompts();

  for (let email of emails) {

    // Build categorization prompt
    const categorizationPrompt = `
${prompts.categorizationPrompt}

Email:
Subject: ${email.subject}
Body:
${email.body}
`;

    // Build action prompt
    const actionPrompt = `
${prompts.actionItemPrompt}

Email:
${email.body}
`;

    let categoryResult, actionResult;

    try {
      categoryResult = await runPrompt(categorizationPrompt);
      actionResult = await runPrompt(actionPrompt);
    } catch (err) {
      console.error("LLM Error:", err);
      email.labels = ["Uncategorized"];
      email.actionItem = null;
      email.processed = true;
      continue;
    }

    console.log("Categorization Prompt Sent:", categorizationPrompt);
    console.log("LLM Response Received for Category:", categoryResult);

    // Process Category
    let finalCategory = cleanLLMResponse(categoryResult);
    if (!finalCategory) finalCategory = "Uncategorized";
    email.labels = [finalCategory];

    // Process Action Item
    let finalAction = cleanLLMResponse(actionResult);
    try {
      if (finalAction && finalAction.startsWith("{")) {
        email.actionItem = JSON.parse(finalAction);
      } else {
        email.actionItem = finalAction || null;
      }
    } catch {
      email.actionItem = finalAction || null;
    }

    email.processed = true;
  }

  saveInbox(emails);
  return emails;
}

module.exports = { processEmails };
