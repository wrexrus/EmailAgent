const fs = require("fs");
const path = require("path");
const { runPrompt } = require("./llmService");

const INBOX_PATH = path.join(__dirname, "..", "models", "inbox.json");
const PROMPT_PATH = path.join(__dirname, "..", "models", "prompts.json");

function getEmailById(id) {
    const inbox = JSON.parse(fs.readFileSync(INBOX_PATH, "utf8"));
    return inbox.find(e => e.id === id);
}

function loadPrompts() {
    return JSON.parse(fs.readFileSync(PROMPT_PATH, "utf8"));
}

function buildAgentPrompt(email, userQuery, prompts) {
    return `
You are an advanced email assistant.

ONLY use the stored prompts when relevant:
- For categorization → "${prompts.categorizationPrompt}"
- For action items → "${prompts.actionItemPrompt}"
- For reply drafting → "${prompts.autoReplyPrompt}"

When responding:
- If the user asks to summarize → give a short summary.
- If extracting actions → return JSON.
- If drafting reply → write a proper email format.
- If unsure → state what information is missing.

EMAIL CONTEXT:
Sender: ${email.senderName} <${email.senderEmail}>
Subject: ${email.subject}
Body:
${email.body}

USER QUESTION: "${userQuery}"

Now respond accordingly. Be concise and avoid unnecessary text.
`;
}


async function handleAgentQuery(emailId, userQuery) {
    const email = getEmailById(emailId);
    if (!email) return { error: "Email not found" };

    const prompts = loadPrompts();

    const finalPrompt = buildAgentPrompt(email, userQuery, prompts);

    const result = await runPrompt(finalPrompt);
    return { response: result };
}

module.exports = { handleAgentQuery };
