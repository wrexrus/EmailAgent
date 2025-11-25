// frontend/src/components/PromptBrain.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function PromptBrain() {
  const [prompts, setPrompts] = useState({
    categorizationPrompt: "",
    actionItemPrompt: "",
    autoReplyPrompt: ""
  });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    try {
      const res = await api.get("/api/prompts");
      setPrompts(res.data);
      setStatus("");
    } catch (err) {
      console.error("Failed to load prompts", err);
      setStatus("Failed to load prompts");
    }
  }

  // Partial update: send only changed fields
  async function savePrompts() {
    setSaving(true);
    setStatus("Saving...");
    try {
      const res = await api.post("/api/prompts/update", prompts);
      setPrompts(res.data.prompts || prompts);
      setStatus("Saved successfully");
    } catch (err) {
      console.error("Save failed", err);
      setStatus("Save failed");
    }
    setSaving(false);
    setTimeout(() => setStatus(""), 2000);
  }

  async function resetPrompts() {
    if (!window.confirm("Reset prompts to defaults?")) return;
    setStatus("Resetting...");
    try {
      const res = await api.post("/api/prompts/reset");
      setPrompts(res.data.prompts || prompts);
      setStatus("Reset to default prompts");
    } catch (err) {
      console.error("Reset failed", err);
      setStatus("Reset failed");
    }
    setTimeout(() => setStatus(""), 2000);
  }

  const updateField = (key, value) => setPrompts(prev => ({ ...prev, [key]: value }));

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-semibold mt-10 mb-4">Prompt Brain</h2>
      <p className="text-sm text-gray-600 mb-4">
        Edit prompts to control the agent's behavior. Changes take effect immediately for subsequent processing and agent queries.
      </p>

      <div className="mb-4">
        <label className="block font-medium">Categorization Prompt</label>
        <textarea
          rows={4}
          value={prompts.categorizationPrompt}
          onChange={e => updateField('categorizationPrompt', e.target.value)}
          className="w-full p-3 border rounded mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">Output must be a single category label (e.g., "Newsletter", "To-Do").</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Action Item Prompt</label>
        <textarea
          rows={4}
          value={prompts.actionItemPrompt}
          onChange={e => updateField('actionItemPrompt', e.target.value)}
          className="w-full p-3 border rounded mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">Return JSON like {"{\"task\":\"...\",\"deadline\":\"...\"}"} or null.</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Auto-Reply Prompt</label>
        <textarea
          rows={6}
          value={prompts.autoReplyPrompt}
          onChange={e => updateField('autoReplyPrompt', e.target.value)}
          className="w-full p-3 border rounded mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">Used when generating drafts. Specify expected output format.</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={savePrompts}
          disabled={saving}
          className={`px-4 py-2 rounded bg-emerald-600 text-white ${saving ? 'opacity-70' : ''}`}
        >
          {saving ? 'Saving...' : 'Save Prompts'}
        </button>

        <button
          onClick={resetPrompts}
          className="px-4 py-2 rounded border"
        >
          Reset to Default
        </button>

        <span className="text-sm text-gray-500 ml-3">{status}</span>
      </div>
    </div>
  );
}
