import { useState, useEffect } from "react";
import api from "../api";
import { Trash2, RotateCcw, Save } from "lucide-react";
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

  if (!selectedDraft) {
    return (
      <div className="p-6 text-gray-500 flex flex-col gap-4 items-center mt-10 text-lg">
        <span>No drafts available.</span>
        <button
          onClick={() => window.location.href = "/"} // redirect back to inbox
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
        >
          Go to Inbox to Generate Draft
        </button>
      </div>
    );
  }


  return (
    <div className="flex h-full bg-gray-50">
      {/* LEFT – Draft list */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Saved Drafts</h1>
          <p className="text-gray-500 text-sm">{drafts.length} draft(s)</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {drafts.map(({ id, subject, fromEmailId, date }) => (
            <div
              key={id}
              onClick={() => handleSelectDraft({ id, subject, fromEmailId, date })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedDraft?.id === id
                ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                : "bg-white border-gray-200 hover:border-emerald-200 hover:shadow-sm"
                }`}
            >
              <div className="pr-8">
                <h3
                  className={`font-medium truncate mb-1 ${selectedDraft?.id === id ? "text-emerald-900" : "text-gray-800"
                    }`}
                >
                  {subject}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  From email: {fromEmailId}
                </p>
                <p className="text-xs text-gray-400">{date}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(id);
                }}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT – Editor */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Edit Draft</h2>
            <p className="text-gray-500 text-sm">
              Based on email: {selectedDraft?.fromEmailId}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <RotateCcw size={18} />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={selectedDraft.subject}
                onChange={(e) =>
                  setSelectedDraft({ ...selectedDraft, subject: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg p-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body
              </label>
              <textarea
                value={selectedDraft.body}
                onChange={(e) =>
                  setSelectedDraft({ ...selectedDraft, body: e.target.value })
                }
                className="w-full h-[calc(100vh-340px)] min-h-[400px] border border-gray-200 rounded-lg p-6 leading-relaxed"
              />
            </div>

            {/* 🔹 Suggested Follow-ups */}
            {selectedDraft.suggested_followups?.length > 0 && (
              <div className="text-sm">
                <strong>Suggested Follow-ups:</strong>
                <ul className="list-disc ml-6 mt-1 text-gray-700">
                  {selectedDraft.suggested_followups.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🔹 Metadata */}
            {selectedDraft.metadata?.category && (
              <div className="text-sm mt-2">
                <strong>Category:</strong> {selectedDraft.metadata.category}
              </div>
            )}

            {selectedDraft.metadata?.action_item && (
              <pre className="bg-gray-100 mt-2 p-3 rounded text-sm">
                {JSON.stringify(selectedDraft.metadata.action_item, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drafts;
