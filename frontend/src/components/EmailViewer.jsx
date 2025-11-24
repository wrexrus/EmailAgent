import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    if (!email) return <div className="text-gray-400 italic">Select an email to view details</div>;

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="h-20 px-8 flex items-center border-b border-gray-200 flex-shrink-0 bg-white">
                <div className="flex-1 min-w-0 ">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-lg font-bold text-gray-900 truncate pr-4">
                            {email.subject}
                        </h1>
                        {email.category && (
                            <span className="flex-shrink-0 inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100">
                                {email.category.charAt(0).toUpperCase() + email.category.slice(1)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="font-medium text-gray-900">{email.sender || email.senderName}</span>
                        <span>&bull;</span>
                        <span>{email.senderEmail}</span>
                        <span>&bull;</span>
                        <span>{formatDistanceToNow(email.timestamp)}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
                <div className="max-w-4xl mx-auto">
                    {email.actionItems && email.actionItems.length > 0 && (
                        <div className="mb-8 rounded-xl bg-emerald-50 border border-emerald-100 p-6">
                            <div className="flex items-center gap-3 text-emerald-800 font-semibold mb-3">
                                <Sparkles size={18} />
                                <h3>Action Items Detected</h3>
                            </div>
                            <ul className="space-y-2">
                                {email.actionItems.map((ai, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-900">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <span className="leading-relaxed">{ai}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                            {email.content || email.body}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="max-w-4xl mx-auto flex justify-center">
                    <button
                        type="button"
                        onClick={() => navigate('/chat', { state: { email } })}
                        className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 w-full md:w-auto md:min-w-[300px]"
                    >
                        <Sparkles size={20} className="text-blue-200 group-hover:text-white transition-colors" />
                        <span>Ask the agent</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
