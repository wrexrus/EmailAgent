import { ArrowLeft, Sparkles, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from "../api";

function formatDistanceToNow(date) {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function EmailViewer({ email }) {
    const navigate = useNavigate();

    if (!email) return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <span className="text-2xl">✉️</span>
            </div>
            <p className="font-medium">Select an email to view details</p>
        </div>
    );

    // Parse action item if it's a JSON string
    let actionItemData = null;
    if (email.actionItem) {
        try {
            actionItemData = typeof email.actionItem === 'string'
                ? JSON.parse(email.actionItem)
                : email.actionItem;
        } catch (e) {
            actionItemData = { task: email.actionItem };
        }
    }

    return (
        <div className="h-full flex flex-col bg-white/50 backdrop-blur-xl">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                            {email.subject}
                        </h1>
                        {email.labels && email.labels.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-end">
                                {email.labels.flatMap(l => l.split(',')).map((label, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                                        <Tag size={12} />
                                        {label.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                {(email.senderName || email.sender || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900 block">
                                    {email.senderName || email.sender}
                                </span>
                                <span className="text-xs text-gray-400">{email.senderEmail}</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <Calendar size={14} />
                            <span>{new Date(email.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            <span className="text-gray-400 text-xs">({formatDistanceToNow(email.timestamp)})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                <div className="max-w-4xl mx-auto p-8">

                    {/* Action Item Card */}
                    {actionItemData && (
                        <div className="mb-8 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={100} className="text-emerald-600 transform rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-emerald-800 font-bold mb-3 uppercase tracking-wider text-xs">
                                    <Sparkles size={14} />
                                    <span>AI Suggested Action</span>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="mt-1 p-2 bg-white rounded-xl shadow-sm border border-emerald-100 text-emerald-600">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {actionItemData.task || "Action required"}
                                        </h3>
                                        {actionItemData.deadline && (
                                            <p className="text-sm text-emerald-700 font-medium flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                Due: {actionItemData.deadline}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email Body */}
                    <div className="prose prose-lg prose-gray max-w-none">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[200px]">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed font-sans text-[15px]">
                                {email.body || email.content}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-gray-100 bg-white/80 backdrop-blur-md z-20">
                <div className="max-w-4xl mx-auto flex justify-center">
                    <button
                        type="button"
                        onClick={() => navigate('/chat', { state: { email } })}
                        className="group relative inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white text-base font-medium px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto min-w-[240px]"
                    >
                        <Sparkles size={18} className="text-yellow-300 group-hover:scale-110 transition-transform" />
                        <span>Ask AI Assistant</span>
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const res = await api.post("/api/drafts/create", { emailId: email.id });
                                const newDraftId = res.data.id;

                                // Redirect with ID
                                window.location.href = `/drafts?draftId=${newDraftId}`;
                            } catch(err) {
                                alert("Failed to generate draft");
                                console.log("Failed to generate draft",err);
                            }
                        }}
                        className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
                    >
                        Generate Draft
                    </button>

                </div>
            </div>
        </div>
    );
}
