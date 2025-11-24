import { useState, useEffect } from "react";
import api from "../api";
import { Trash2, RotateCcw, Save } from "lucide-react";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Fetch drafts from backend
  useEffect(() => {
    loadDrafts();
  }, []);

  async function loadDrafts() {
    try {
      const res = await api.get("/api/drafts");
      setDrafts(res.data);
      if (res.data.length > 0) setSelectedDraft(res.data[0]); 
    } catch (err) {
      console.error("Failed to load drafts", err);
    }
  }

  const handleSelectDraft = (draft) => {
    setSelectedDraft(draft);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      await api.delete(`/api/drafts/${id}`);
      loadDrafts();
    } catch (error) {
      alert("Failed to delete draft");
    }
  };

  const handleRegenerate = async () => {
    if (!selectedDraft?.fromEmailId) return;

    setIsRegenerating(true);
    try {
      const res = await api.post("/api/drafts/create", {
        emailId: selectedDraft.fromEmailId,
      });
      // Automatically replace current draft
      await api.delete(`/api/drafts/${selectedDraft.id}`);
      setSelectedDraft(res.data);
      loadDrafts();
    } catch (error) {
      alert("Failed to regenerate");
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

  if (!selectedDraft)
    return <div className="p-6 text-gray-500">No drafts available.</div>;

  return (
    <div className="flex h-full bg-gray-50">
      {/* LEFT – Draft list */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Saved Drafts
          </h1>
          <p className="text-gray-500 text-sm">{drafts.length} draft(s)</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              onClick={() => handleSelectDraft(draft)}
              className={`p-4 rounded-xl border cursor-pointer transition-all group relative ${
                selectedDraft?.id === draft.id
                  ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                  : "bg-white border-gray-200 hover:border-emerald-200 hover:shadow-sm"
              }`}
            >
              <div className="pr-8">
                <h3
                  className={`font-medium truncate mb-1 ${
                    selectedDraft?.id === draft.id
                      ? "text-emerald-900"
                      : "text-gray-800"
                  }`}
                >
                  {draft.subject}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  From email: {draft.fromEmailId}
                </p>
                <p className="text-xs text-gray-400">{draft.date}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(draft.id);
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
        {/* Header */}
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

        {/* Body */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drafts;
