import React, { useState, useEffect } from 'react';
import api from '../api';

export default function PromptBrain() {
  const [prompts, setPrompts] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => { loadPrompts(); }, []);

  async function loadPrompts() {
    const res = await api.get("/api/prompts");
    setPrompts(res.data);
  }

  async function savePrompts() {
    try {
      await api.post("/api/prompts/update", prompts);
      setStatus("Saved successfully ✔");
    } catch {
      setStatus("Error saving ❌");
    }
  }

  async function resetPrompts() {
    const res = await api.post("/api/prompts/reset");
    loadPrompts();
    setStatus("Reset to Default");
  }

  const updateField = (key, value) => {
    setPrompts(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2>Prompt Brain Configuration</h2>
      {Object.keys(prompts).map(key => (
        <div key={key}>
          <label>{key}:</label>
          <textarea
            rows="3"
            value={prompts[key]}
            onChange={e => updateField(key, e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />
        </div>
      ))}
      <button onClick={savePrompts}>Save</button>
      <button onClick={resetPrompts} style={{ marginLeft: 10 }}>Reset</button>
      <p>{status}</p>
    </div>
  );
}


