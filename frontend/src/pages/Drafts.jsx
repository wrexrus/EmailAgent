import React, { useState } from 'react';
import { Trash2, RotateCcw, Save } from 'lucide-react';

const MOCK_DRAFTS = [
  {
    id: 1,
    subject: "Re: Q4 Project Deadline - Action Required",
    context: "Reply to Sarah Chen",
    date: "Nov 22, 2025, 6:12 PM",
    body: `Hi Sarah,

Thank you for the update. I've reviewed the deliverables and my section is complete. I'll have the budget review done by tomorrow.

Regarding the presentation slides, I can take the lead on that. When would you like to schedule a quick sync to discuss the structure?

Best regards`
  },
  {
    id: 2,
    subject: "Re: Client Meeting Notes & Follow-up",
    context: "Reply to Marcus Johnson",
    date: "Nov 22, 2025, 5:12 PM",
    body: `Hi Marcus,

Thanks for sending over the notes. I agree with the points raised during the meeting.

I'll proceed with the initial draft of the proposal and share it with the team by Wednesday.

Best,`
  }
];

const Drafts = () => {
  const [selectedDraftId, setSelectedDraftId] = useState(1);
  const [drafts, setDrafts] = useState(MOCK_DRAFTS);

  const selectedDraft = drafts.find(d => d.id === selectedDraftId) || drafts[0];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Draft List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Saved Drafts</h1>
          <p className="text-gray-500 text-sm">{drafts.length} draft(s)</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              onClick={() => setSelectedDraftId(draft.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all group relative ${selectedDraftId === draft.id
                  ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                  : 'bg-white border-gray-200 hover:border-emerald-200 hover:shadow-sm'
                }`}
            >
              <div className="pr-8">
                <h3 className={`font-medium truncate mb-1 ${selectedDraftId === draft.id ? 'text-emerald-900' : 'text-gray-800'
                  }`}>
                  {draft.subject}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{draft.context}</p>
                <p className="text-xs text-gray-400">{draft.date}</p>
              </div>

              <button className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${selectedDraftId === draft.id
                  ? 'text-emerald-700 hover:bg-emerald-100'
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                }`}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Editor */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Edit Draft</h2>
            <p className="text-gray-500 text-sm">Context: {selectedDraft?.context}</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors bg-white font-medium">
              <RotateCcw size={18} />
              Regenerate
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium shadow-sm">
              <Save size={18} />
              Save Draft
            </button>
          </div>
        </div>

        {/* Editor Form */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={selectedDraft?.subject || ''}
                readOnly
                className="w-full border border-gray-200 rounded-lg p-4 text-gray-700 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
              <textarea
                value={selectedDraft?.body || ''}
                readOnly
                className="w-full h-[calc(100vh-340px)] min-h-[400px] border border-gray-200 rounded-lg p-6 text-gray-700 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drafts;
