📧 Prompt-Driven Email Productivity Agent

An intelligent email automation system powered by user-configurable prompts.
It supports email ingestion, AI-driven categorization, action-item extraction, auto-reply draft generation, and chat-based inbox interaction.

Built with React (frontend), Node.js + Express (backend), Google Gemini API (LLM).
The application strictly maintains prompt-driven architecture — behavior dynamically adapts based on user-defined prompts.

🚀 Features Overview
Feature	Description
📥 Inbox Ingestion	Load mock inbox or email service
🏷 Email Categorization	Labels generated via LLM prompts
📌 Action Extraction	Extract structured tasks
🤖 Chat-Based Agent	Ask questions about emails
✍ Draft Generator	Auto-generate reply drafts using prompts
🔁 Regeneration Support	Regenerate drafts based on updated prompts
📚 Prompt Configuration	User can modify categorization, action-item, and reply prompts
🔒 Safe Drafting	Emails are never sent, stored only as drafts
🏗️ Architecture Overview
frontend/
  ├── pages/
  │   ├── Dashboard.jsx     → Inbox viewer
  │   ├── AgentChat.jsx     → Chat interface
  │   ├── PromptBrain.jsx   → Prompt configuration
  │   ├── Drafts.jsx        → View/Edit drafts
backend/
  ├── routes/
  │   ├── inbox.js
  │   ├── prompts.js
  │   ├── drafts.js
  │   ├── chat.js
  ├── services/
  │   ├── llmService.js     → Gemini integration
  │   ├── emailService.js   → Email processing
  │   ├── draftService.js   → Draft generation
  ├── models/
      ├── inbox.json        → Mock inbox (sample emails)
      ├── prompts.json      → Configurable prompts
      ├── drafts.json       → Stored drafts

⚙️ Setup Instructions
1️⃣ Clone repository

git clone <repo-url>
cd email-agent

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

GEMINI_API_KEY=your_api_key_here
PORT=5000


Run backend:

npm start

3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev


The app should be live at:
👉 Frontend: http://localhost:5173
👉 Backend: http://localhost:5000

📥 Loading the Mock Inbox

Check the file:
backend/models/inbox.json

Emails are preloaded.

In dashboard, click Process Inbox to apply categorization and action extraction using the current prompt.

🧠 Configuring Prompts (Prompt Brain)

Go to Prompt Configuration tab.

You can edit:

Categorization Prompt
“Categorize emails into: Important, Newsletter, Spam, To-Do.”

Action-Item Prompt
“Extract tasks from the email. Respond in JSON: { 'task': '...', 'deadline': '...' }.”

Auto-Reply Prompt
“If it's a meeting request, draft a polite reply asking for agenda.”

⚠️ After editing prompts, click Save Prompt, then Process Inbox to see the new effect.

💬 Usage Examples
🔎 1. Process Inbox

Click Process Inbox
➡ Emails get categorized and action items extracted.

💡 2. Chat with Email Agent

Click any email → “Ask Agent”
Example prompts:

“Summarize this email”
“What tasks are required?”
“Reply in friendly tone”

📝 3. Generate Draft

Inside any email:
Click Generate Draft
➡ Draft created using auto-reply prompt.

Change prompt and click Regenerate to see behavior change.

🔐 Safety Features

✔ No emails are sent automatically.
✔ Drafts stored locally in models/drafts.json.
✔ LLM errors handled gracefully with fallback text.

🔄 Demo Flow (Suggested)

Load Mock Inbox

Process Emails

Modify prompt → Process Inbox again (shows behavior change)

Open chat → ask “Summarize”

Change prompt → ask again (see difference)

Generate Draft → Regenerate after editing prompt

Show draft metadata & suggested follow-ups

Confirm drafts are just stored, not sent

📦 Deployment Notes

To stay under 500 MB (Render free tier):

Avoid heavy dependencies.

Use Gemini API instead of OpenAI.

Use JSON-based local data instead of database.

Build front-end using npm run build before deployment.

📌 Future Enhancements

Authentication for storing personal prompts

Email service integration (Gmail API)

RAG support for thread history

Email scheduling