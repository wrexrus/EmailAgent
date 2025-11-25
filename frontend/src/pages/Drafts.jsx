import { useState, useEffect } from "react";
import api from "../api";
import { Trash2, RotateCcw, Save, Mail, FileEdit } from "lucide-react";
import { useLocation } from "react-router-dom";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const location = useLocation();
  const queryDraftId = new URLSearchParams(location.search).get("draftId");

  useEffect(() => {
    loadDrafts();
  }, []);

  async function loadDrafts() {
    try {
      const res = await api.get("/api/drafts");
      setDrafts(res.data);

      if (queryDraftId) {
        const found = res.data.find(d => d.id === queryDraftId);
        if (found) return setSelectedDraft(found);
      }

      if (res.data.length > 0) setSelectedDraft(res.data[0]);
    } catch (err) {
      console.error("Failed to load drafts", err);
    }
  }


  const handleSelectDraft = (draft) => setSelectedDraft(draft);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      await api.delete(`/api/drafts/${id}`);
      loadDrafts();
      if (selectedDraft?.id === id) setSelectedDraft(null);
    } catch {
      alert("Failed to delete draft");
    }
  };

  const handleRegenerate = async () => {
    if (!selectedDraft?.emailId) {
      alert("No linked email found for regeneration");
      return;
    }

    setIsRegenerating(true);

    try {
      // 1. Create new draft using original email
      const res = await api.post("/api/drafts/create", {
        emailId: selectedDraft.emailId,
      });

      const newDraft = res.data;

      // 2. Delete old draft only if creation succeeded
      await api.delete(`/api/drafts/${selectedDraft.id}`);

      // 3. Load and select new draft
      setSelectedDraft(newDraft);
      loadDrafts();

      alert("Draft regenerated successfully using updated prompt.");
    } catch (error) {
      console.error(error);
      alert("Failed to regenerate draft.");
    }

    setIsRegenerating(false);
  };


  const handleSave = async () => {
    if (!selectedDraft?.id) return;
    setIsSaving(true);
    try {
      await api.post("/api/drafts/update", {
        id: selectedDraft.id,
        subject: selectedDraft.subject,
        body: selectedDraft.body,
      });
      alert("Draft saved successfully!");
    } catch {
      alert("Failed to save draft");
    }
    setIsSaving(false);
  };

  if (!selectedDraft && drafts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
          <FileEdit size={40} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Drafts Yet</h3>
        <p className="text-gray-400 max-w-xs text-center mb-6">Generate drafts from emails in your inbox to see them here.</p>
        <button
          onClick={() => window.location.href = "/"} // redirect back to inbox
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all font-medium"
        >
          Go to Inbox
        </button>
      </div>
    );
  }


  return (
    <div className="flex h-full bg-gray-50">
      {/* LEFT – Draft list */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Saved Drafts</h1>
          <p className="text-gray-500 text-sm font-medium">{drafts.length} draft(s)</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50/30">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              onClick={() => handleSelectDraft(draft)}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${selectedDraft?.id === draft.id
                ? "bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-md"
                : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                }`}
            >
              <div className="pr-8">
                <h3
                  className={`font-semibold truncate mb-1 text-sm ${selectedDraft?.id === draft.id ? "text-indigo-900" : "text-gray-800"
                    }`}
                >
                  {draft.subject || "(No Subject)"}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                  <Mail size={12} />
                  <span className="truncate max-w-[180px]">From: {draft.fromEmailId}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium bg-gray-50 inline-block px-2 py-1 rounded-md border border-gray-100">
                  {new Date(draft.date).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(draft.id);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Draft"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT – Editor */}
      {selectedDraft ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Edit Draft</h2>
              <p className="text-gray-500 text-xs font-medium flex items-center gap-1">
                <Mail size={12} />
                Replying to email {selectedDraft.fromEmailId}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                <RotateCcw size={16} className={isRegenerating ? "animate-spin" : ""} />
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm font-medium"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={selectedDraft.subject}
                  onChange={(e) =>
                    setSelectedDraft({ ...selectedDraft, subject: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Email Body
                </label>
                <textarea
                  value={selectedDraft.body}
                  onChange={(e) =>
                    setSelectedDraft({ ...selectedDraft, body: e.target.value })
                  }
                  className="w-full h-[calc(100vh-400px)] min-h-[400px] bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-800 leading-relaxed focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none font-sans"
                />
              </div>

              {/* 🔹 Suggested Follow-ups */}
              {selectedDraft.suggested_followups?.length > 0 && (
                <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                  <strong className="text-indigo-900 text-sm block mb-2">Suggested Follow-ups</strong>
                  <ul className="space-y-1">
                    {selectedDraft.suggested_followups.map((item, i) => (
                      <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 🔹 Metadata */}
              {(selectedDraft.metadata?.category || selectedDraft.metadata?.action_item) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedDraft.metadata?.category && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <strong className="text-gray-500 text-xs uppercase block mb-1">Category</strong>
                      <span className="text-gray-900 font-medium text-sm">{selectedDraft.metadata.category}</span>
                    </div>
                  )}

                  {selectedDraft.metadata?.action_item && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 col-span-2">
                      <strong className="text-gray-500 text-xs uppercase block mb-1">Action Item</strong>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                        {JSON.stringify(selectedDraft.metadata.action_item, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
          <p>Select a draft to edit</p>
        </div>
      )}
    </div>
  );
};

export default Drafts;
