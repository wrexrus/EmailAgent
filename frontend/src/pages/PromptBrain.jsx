// frontend/src/components/PromptBrain.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { Brain, ListChecks, MessageSquare, Save, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';

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
    <div className="h-full bg-gray-50/50 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2 text-indigo-600">
              <Brain size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Prompt Brain</h1>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl">
              Configure the cognitive instructions for your Email Agent. These prompts drive how emails are understood, categorized, and acted upon.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {status && (
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${status.includes("fail") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                {status}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-8">
          {/* Categorization Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <TagIcon />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Categorization Logic</h3>
                <p className="text-xs text-gray-500">Determines how incoming emails are labeled.</p>
              </div>
            </div>
            <div className="p-6">
              <textarea
                rows={6}
                value={prompts.categorizationPrompt}
                onChange={e => updateField('categorizationPrompt', e.target.value)}
                className="w-full p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-y"
                placeholder="Enter system prompt..."
              />
              <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <AlertCircle size={14} className="mt-0.5 text-gray-400" />
                <p>Expected output: A single category label (e.g., "Newsletter", "To-Do", "Meeting").</p>
              </div>
            </div>
          </div>

          {/* Action Item Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <ListChecks />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Action Extraction</h3>
                <p className="text-xs text-gray-500">Identifies tasks and deadlines from email content.</p>
              </div>
            </div>
            <div className="p-6">
              <textarea
                rows={6}
                value={prompts.actionItemPrompt}
                onChange={e => updateField('actionItemPrompt', e.target.value)}
                className="w-full p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-y"
              />
              <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <AlertCircle size={14} className="mt-0.5 text-gray-400" />
                <p>Expected output: JSON format <code>{"{\"task\":\"...\",\"deadline\":\"...\"}"}</code> or <code>null</code>.</p>
              </div>
            </div>
          </div>

          {/* Auto-Reply Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <MessageSquare />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Auto-Reply Personality</h3>
                <p className="text-xs text-gray-500">Controls the tone and structure of generated drafts.</p>
              </div>
            </div>
            <div className="p-6">
              <textarea
                rows={8}
                value={prompts.autoReplyPrompt}
                onChange={e => updateField('autoReplyPrompt', e.target.value)}
                className="w-full p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-y"
              />
              <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <AlertCircle size={14} className="mt-0.5 text-gray-400" />
                <p>Used when generating drafts. Be specific about tone (professional, casual) and signature.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-6 mt-8 p-4 bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl flex items-center justify-between">
          <button
            onClick={resetPrompts}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium text-sm"
          >
            <RotateCcw size={18} />
            Reset Defaults
          </button>

          <button
            onClick={savePrompts}
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-medium ${saving ? 'opacity-70 cursor-wait' : ''}`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Configuration
              </>
            )}
          </button>
        </div>

        <div className="h-12"></div> {/* Spacer */}
      </div>
    </div>
  );
}

function TagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
  )
}
