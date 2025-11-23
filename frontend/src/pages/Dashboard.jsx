import { useMemo, useState } from 'react';
import { EmailList } from '../components/EmailList';
import { mockEmails } from '../data/mockEmail';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatDistanceToNow(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const categories = ['all', 'important', 'newsletter', 'todo', 'spam', 'general'];

const Dashboard = () => {
  const [filter, setFilter] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(mockEmails[0]); // Default to first email
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return filter === 'all' ? mockEmails : mockEmails.filter(e => e.category === filter);
  }, [filter]);

  function onSelectEmail(email) {
    setSelectedEmail(email);
    setShowDetailOnMobile(true);
  }

  return (
    <div className="w-full h-full flex bg-white-100 overflow-hidden pt-14">
      {/* List column */}
      <div className={`w-full md:w-[450px] flex-shrink-0 flex flex-col bg-white border-r border-gray-200 h-full ${showDetailOnMobile ? 'hidden md:flex' : 'flex'}`}>
        {/* Header - Aligned with Detail Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Inbox</h2>
            <div className="text-sm text-gray-500">Your recent messages</div>
          </div>

          <button
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
            aria-label="Process inbox"
          >
            <Play size={16} fill="currentColor" />
            <span>Process Inbox</span>
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap text-xs font-medium px-4 py-1.5 rounded-full transition-all ${filter === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <EmailList
            emails={filtered}
            selectedEmailId={selectedEmail?.id}
            onSelectEmail={onSelectEmail}
            filter={filter}
          />
        </div>
      </div>

      {/* Detail column */}
      <div className={`flex-1 flex flex-col h-full bg-white transition-all duration-300 ${showDetailOnMobile ? 'fixed inset-0 z-50 md:static md:z-auto' : 'hidden'} md:flex`}>
        {/* Header - Aligned with List Header */}
        <div className="h-20 px-8 flex items-center border-b border-gray-200 flex-shrink-0 bg-white">
          <button
            onClick={() => setShowDetailOnMobile(false)}
            className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>

          {selectedEmail ? (
            <div className="flex-1 min-w-0 ">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-bold text-gray-900 truncate pr-4">
                  {selectedEmail.subject}
                </h1>
                {selectedEmail.category && (
                  <span className="flex-shrink-0 inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100">
                    {selectedEmail.category.charAt(0).toUpperCase() + selectedEmail.category.slice(1)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-900">{selectedEmail.sender}</span>
                <span>&bull;</span>
                <span>{selectedEmail.senderEmail}</span>
                <span>&bull;</span>
                <span>{formatDistanceToNow(selectedEmail.timestamp)}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 italic">Select an email to view details</div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
          {selectedEmail ? (
            <div className="max-w-4xl mx-auto">
              {selectedEmail.actionItems && selectedEmail.actionItems.length > 0 && (
                <div className="mb-8 rounded-xl bg-emerald-50 border border-emerald-100 p-6">
                  <div className="flex items-center gap-3 text-emerald-800 font-semibold mb-3">
                    <Sparkles size={18} />
                    <h3>Action Items Detected</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedEmail.actionItems.map((ai, i) => (
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
                  {selectedEmail.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ArrowLeft size={24} className="text-gray-300 md:hidden" />
                <div className="hidden md:block w-8 h-8 bg-gray-300 rounded-sm" />
              </div>
              <p>Select an email from the list to view details</p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        {selectedEmail && (
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="max-w-4xl mx-auto flex justify-center">
              <button
                type="button"
                onClick={() => navigate('/chat', { state: { email: selectedEmail } })}
                className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 w-full md:w-auto md:min-w-[300px]"
              >
                <Sparkles size={20} className="text-blue-200 group-hover:text-white transition-colors" />
                <span>Ask the agent</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;