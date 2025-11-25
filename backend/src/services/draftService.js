const fs = require("fs");
const path = require("path");
const { runPrompt } = require("./llmService");

const INBOX_PATH = path.join(__dirname, "..", "models", "inbox.json");
const PROMPT_PATH = path.join(__dirname, "..", "models", "prompts.json");
const DRAFT_PATH = path.join(__dirname, "..", "models", "drafts.json");

function loadInbox() {
  return JSON.parse(fs.readFileSync(INBOX_PATH, "utf8"));
}

function loadPrompts() {
  return JSON.parse(fs.readFileSync(PROMPT_PATH, "utf8"));
}

function loadDrafts() {
  return JSON.parse(fs.readFileSync(DRAFT_PATH, "utf8"));
}

function saveDrafts(data) {
  fs.writeFileSync(DRAFT_PATH, JSON.stringify(data, null, 2));
}

async function createCustomDraft() {
  const draft = {
    id: `draft-${Date.now()}`,
    emailId: null, // since it's custom
    subject: "New Draft",
    body: "",
    suggested_followups: [],
    metadata: {},
    createdAt: new Date().toISOString()
  };

  const drafts = loadDrafts();
  drafts.push(draft);
  saveDrafts(drafts);

  return draft;
}

async function generateDraft(emailId) {
  const emails = loadInbox();
  const email = emails.find(e => e.id === emailId);
  if (!email) return { error: "Email not found" };

  const prompts = loadPrompts();

  const prompt = `
You are an AI email drafting agent.

Follow these rules:
- Use the user's auto-reply prompt below.
- Use the full email context provided.
- Respond ONLY with a JSON object. No reasoning, no markdown.

AUTO-REPLY PROMPT:
"${prompts.autoReplyPrompt}"

EMAIL CONTEXT:
From: ${email.senderName} <${email.senderEmail}>
Subject: ${email.subject}
Body:
${email.body}

OUTPUT FORMAT:
{
  "subject": "<reply subject>",
  "body": "<reply body>",
  "suggested_followups": ["<optional>", "<optional>"],
  "metadata": {
    "category": "${email.labels?.[0] || ""}",
    "action_item": ${email.actionItem ? JSON.stringify(email.actionItem) : "null"}
  }
}
`;

  let response = await runPrompt(prompt);

  // Handle Gemini structured responses
  if (typeof response === "object" && response.parts) {
    response = response.parts.map(p => p.text).join(" ");
  }

  // Convert to string and fully clean anything resembling markdown/code fences
  response = String(response)
    .replace(/```json|```|\u200B/g, "") // remove all code blocks and zero-width chars
    .replace(/^\s+|\s+$/g, "")           // trim leading/trailing whitespace
    .trim();

  let parsedDraft;
  try {
    parsedDraft = JSON.parse(response);

    // Handle nested JSON string for action_item, if needed
    if (parsedDraft?.metadata?.action_item && typeof parsedDraft.metadata.action_item === "string") {
      try {
        parsedDraft.metadata.action_item = JSON.parse(
          parsedDraft.metadata.action_item
            .replace(/```json|```|\u200B/g, "")
            .trim()
        );
      } catch {
        // If parsing fails, fallback silently
      }
    }
  } catch (err) {
    console.error("❌ Draft JSON parsing failed:", err);
    console.error("⚠ Raw response was:", response);

    parsedDraft = {
      subject: `Re: ${email.subject}`,
      body: response,
      suggested_followups: [],
      metadata: {
        category: email.labels?.[0] || null,
        action_item: email.actionItem || null
      }
    };
  }

  const finalDraft = {
    id: `draft-${Date.now()}`,
    emailId,
    subject: parsedDraft.subject,
    body: parsedDraft.body,
    suggested_followups: parsedDraft.suggested_followups || [],
    metadata: parsedDraft.metadata || {},
    createdAt: new Date().toISOString()
  };

  const drafts = loadDrafts();
  drafts.push(finalDraft);
  saveDrafts(drafts);

  return finalDraft;
}

module.exports = { generateDraft,createCustomDraft, loadDrafts, saveDrafts };
