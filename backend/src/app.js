const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());


const promptRoutes = require('./routes/prompts');
app.use('/api/prompts', promptRoutes);

const processRoutes = require('./routes/process');
app.use('/api/process-emails', processRoutes);

const agentRoutes = require("./routes/agent");
app.use("/api/agent", agentRoutes);

const draftRoutes = require("./routes/draft");
app.use("/api/drafts", draftRoutes);

const DATA_PATH = path.join(__dirname, 'models', 'inbox.json');

// helper: read file
function readInbox() {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  try { return JSON.parse(raw); } catch(e){ return []; }
}
app.get('/',(req,res)=>{
  console.log("Email App");
});

app.get('/api/emails', (req, res) => {
  const inbox = readInbox();
  res.json(inbox);
});

app.get('/api/emails/:id', (req, res) => {
  const inbox = readInbox();
  const email = inbox.find(e => e.id === req.params.id);
  if (!email) return res.status(404).json({error: "Email not found"});
  res.json(email);
});

app.post('/api/emails/upload', (req, res) => {
  const emails = req.body;
  if (!Array.isArray(emails)) return res.status(400).json({error: 'Expected JSON array'});
  for (const e of emails) {
    if (!e.id || !e.subject || !e.body) return res.status(400).json({error: 'Each email needs id, subject, body'});
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(emails, null, 2));
  res.json({ok:true, count: emails.length});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on', PORT));