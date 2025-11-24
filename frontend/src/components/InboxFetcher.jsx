import { useEffect, useState } from "react";
import api from "../api";

export default function InboxFetcher({ onSelectEmail }) {
  const [emails, setEmails] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get('/api/emails');
      setEmails(res.data);
    } catch (err) {
      setStatus("Failed to load inbox");
    }
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileContent(reader.result);
    reader.readAsText(file);
  }

  async function upload() {
    if (!fileContent) return setStatus("Choose a JSON file first");
    try {
      const parsed = JSON.parse(fileContent);
      const res = await api.post('/api/emails/upload', parsed);
      setStatus(`Uploaded ${res.data.count} emails`);
      load();
    } catch (err) {
      setStatus("Upload failed: " + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div>
      <div style={{marginBottom:12}}>
        <input type="file" accept=".json,application/json" onChange={handleFile} />
        <button onClick={upload}>Upload Mock Inbox</button>
        <span style={{marginLeft:8}}>{status}</span>
      </div>
      <ul>
        {emails.map(e => (
          <li key={e.id} onClick={() => onSelectEmail(e)}>
            <strong>{e.senderName}</strong> — {e.subject}
          </li>
        ))}
      </ul>
    </div>
  );
}
