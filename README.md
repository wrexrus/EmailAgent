# 📧 Prompt-Driven Email Productivity Agent

An intelligent, AI-powered email automation system designed to revolutionize inbox management. This application leverages the power of **Google Gemini** to categorize emails, extract actionable tasks, generate draft replies, and provide a conversational interface for interacting with your inbox.

The core philosophy of this project is its **Prompt-Driven Architecture**. The agent's behavior—how it categorizes, what it extracts, and how it replies—is entirely dynamic and controlled by user-configurable system prompts.

---

## 🚀 Features

| Feature | Description |
| :--- | :--- |
| **📥 Smart Inbox** | Ingests emails from a mock source or JSON file. Displays them in a premium, intuitive interface. |
| **🏷️ AI Categorization** | Automatically labels emails (e.g., "Important", "Newsletter", "Spam") based on custom prompts. |
| **📌 Action Extraction** | Identifies tasks and deadlines within emails, presenting them as structured action items. |
| **🤖 Agent Chat** | A conversational interface to ask questions about specific emails ("Summarize this", "What's the deadline?"). |
| **✍️ Draft Generator** | Auto-generates high-quality reply drafts based on context and user-defined tone/style prompts. |
| **🧠 Prompt Brain** | A dedicated configuration panel to fine-tune the AI's instructions for categorization, extraction, and drafting. |
| **🔒 Privacy First** | No emails are ever sent automatically. All generated content is saved as drafts for review. |

---

## �️ Tech Stack

### **Frontend**
*   **React 18**: Core UI library.
*   **Vite**: Fast build tool and development server.
*   **Tailwind CSS**: Utility-first styling for a modern, responsive design.
*   **Lucide React**: Beautiful, consistent icon set.
*   **React Router**: Client-side routing.

### **Backend**
*   **Node.js**: Runtime environment.
*   **Express.js**: Web framework for API routes.
*   **Google Gemini API**: Large Language Model (LLM) for intelligence.
*   **File System (fs)**: JSON-based local storage for persistence (Inbox, Prompts, Drafts).

---

## 🏗️ Project Structure

```bash
email-agent/
├── frontend/                 # React Client
│   ├── src/
│   │   ├── components/       # Reusable UI components (InboxFetcher, EmailViewer, etc.)
│   │   ├── pages/            # Main application pages (Dashboard, AgentChat, PromptBrain, Drafts)
│   │   ├── api.js            # Axios instance for backend communication
│   │   ├── App.jsx           # Main layout and routing
│   │   └── index.css         # Global styles and Tailwind imports
│   ├── index.html
│   └── vite.config.js
│
├── backend/                  # Node.js Server
│   ├── routes/               # API Endpoints
│   │   ├── inbox.js          # Email retrieval and upload
│   │   ├── prompts.js        # Prompt configuration CRUD
│   │   ├── drafts.js         # Draft creation and management
│   │   └── chat.js           # Agent chat logic
│   ├── services/             # Business Logic
│   │   ├── llmService.js     # Gemini API integration
│   │   ├── emailService.js   # Email processing and categorization
│   │   └── draftService.js   # Draft generation logic
│   ├── models/               # Local Data Storage (JSON)
│   │   ├── inbox.json        # Mock email data
│   │   ├── prompts.json      # System prompts
│   │   └── drafts.json       # Saved drafts
│   ├── server.js             # Entry point
│   └── .env                  # Environment variables
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
*   Node.js (v16 or higher)
*   npm (Node Package Manager)
*   A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd email-agent
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
```

Start the backend server:
```bash
npm start
```
*The backend will run on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:5173`*

Create an env file:
```bash
Set VITE_BACKEND_URL as (http://localhost:5000)
```
---

## � Usage Guide

### 1. 📥 Dashboard & Inbox
*   **View Emails**: Browse your inbox with a clean, split-view interface.
*   **Process Inbox**: Click the "Process" button (refresh icon) to trigger AI analysis. This applies labels and extracts action items based on your current prompts.
*   **Upload**: You can upload a custom `.json` file of emails to test different scenarios.

### 2. 🧠 Prompt Brain
*   Navigate to the **Prompt Brain** page.
*   Here you can edit the "System Instructions" for the AI.
*   **Categorization Prompt**: Define how emails should be labeled (e.g., "Label as 'Urgent' if it mentions a deadline today").
*   **Auto-Reply Prompt**: Define the persona for draft generation (e.g., "Reply in a professional but friendly tone").
*   **Save**: Changes take effect immediately for all subsequent actions.

### 3. 🤖 Agent Chat
*   Select an email and click **"Ask AI Assistant"**.
*   This opens a context-aware chat where you can ask things like:
    *   "Summarize this thread."
    *   "What are the key takeaways?"
    *   "Draft a reply declining the offer politely."

### 4. ✍️ Drafts
*   Click **"Generate Draft"** on any email to create a reply.
*   Go to the **Drafts** page to view, edit, or regenerate these drafts.
*   **Regenerate**: If you don't like a draft, tweak the prompt in "Prompt Brain" and click "Regenerate" to see the difference.

---

## 🔐 Safety & Privacy
*   **No Auto-Send**: This agent is designed as a *copilot*. It prepares drafts but never sends emails on its own.
*   **Local Data**: For this demo version, all data (emails, drafts, prompts) is stored locally in JSON files within the `backend/models` directory.

---

## 🔮 Future Roadmap
*   [ ] **Gmail/Outlook Integration**: Connect to real email providers via OAuth.
*   [ ] **RAG (Retrieval-Augmented Generation)**: Allow the agent to search across the entire inbox history for context.
*   [ ] **Multi-Agent System**: Specialized agents for scheduling, newsletters, and support tickets.
*   [ ] **User Authentication**: Support for multiple users with private prompt configurations.
