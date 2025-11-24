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

async function generateDraft(emailId) {
    const emails = loadInbox();
    const email = emails.find(e => e.id === emailId);
    if (!email) return { error: "Email not found" };

    const prompts = loadPrompts();

    const prompt = `
    Using the AUTO REPLY PROMPT:
    "${prompts.autoReplyPrompt}"

    Email context:
    Subject: ${email.subject}
    Body:
    ${email.body}

    + If the email is a meeting request → apply the auto-reply prompt strictly.
    + If it's not a meeting request → generate a polite acknowledgment reply asking for clarification or sharing next steps.
    + Always format like this:

    Subject: <reply subject>
    Body:
    <reply body>

    + Strictly output only the above format.
    + Do NOT explain conditions or internal logic.
    + If unsure, generate a polite follow-up response requesting more details.
    + Provide 1-2 bullet-point follow-up suggestions if useful.
    `;


    const response = await runPrompt(prompt);
    let textResponse = response;

    // If response is Gemini structured format
    if (typeof textResponse === 'object') {
        if (textResponse.parts) {
            textResponse = textResponse.parts.map(p => p.text).join('\n');
        } else {
            textResponse = JSON.stringify(textResponse);
        }
    }

    // Now extract draft content safely
    // Expect format:
    // Subject: <subject>
    // Body:
    // <body>

    let subject = "Draft Response";
    let body = textResponse;

    // Try to split if Gemini respects prompt format
    try {
        const parts = textResponse.split(/Body:/i);
        subject = parts[0].replace(/Subject:/i, "").trim() || subject;
        body = parts[1]?.trim() || body;
    } catch (err) {
        console.warn("Could not extract subject/body properly. Using full response as body.");
    }

    const draft = {
        id: `draft-${Date.now()}`,
        subject,
        body,
        createdAt: new Date().toISOString(),
        fromEmailId: email.id
    };


    const drafts = loadDrafts();
    drafts.push(draft);
    saveDrafts(drafts);

    return draft;
}

module.exports = { generateDraft, loadDrafts, saveDrafts };
