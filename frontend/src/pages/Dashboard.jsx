import { useMemo, useState } from 'react';
import { EmailList } from '../components/EmailList';
import { mockEmails } from '../data/mockEmail';
import { ArrowLeft, Play } from 'lucide-react';

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
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  const filtered = useMemo(() => {
    return filter === 'all' ? mockEmails : mockEmails.filter(e => e.category === filter);
  }, [filter]);

  function onSelectEmail(email) {
    setSelectedEmail(email);
    setShowDetailOnMobile(true);
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-gray-50">
      {/* List column (wider) */}
      <aside className="w-full md:w-3/5 lg:w-2/5 border-r border-gray-200 flex flex-col bg-transparent">
        <div className="px-5 py-4 flex items-center gap-4 border-b bg-white">
          <div>
            <h2 className="text-lg font-semibold">Inbox</h2>
            <div className="text-xs text-gray-500">Your recent messages</div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 py-2 rounded shadow"
              aria-label="Process inbox"
            >
              <Play size={14} />
              <span>Process Inbox</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-3 bg-white border-b">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs px-3 py-1 rounded-full transition-border ${
                  filter === cat
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* list container: rounded, subtle bg, scroll inside */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow-sm divide-y border">
            <EmailList
              emails={filtered}
              selectedEmailId={selectedEmail?.id}
              onSelectEmail={onSelectEmail}
              filter={filter}
            />
          </div>
        </div>
      </aside>

      {/* Detail column (narrower) */}
      <section
        className={`w-full md:w-2/5 transition-all duration-200 flex flex-col ${
          showDetailOnMobile ? 'block' : 'hidden md:flex'
        } bg-white`}
      >
        <div className="px-6 py-5 border-b flex items-start gap-4">
          <button
            onClick={() => setShowDetailOnMobile(false)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Back to list"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-tight truncate">
              {selectedEmail ? selectedEmail.subject : 'Select an email'}
            </h1>

            <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
              {selectedEmail ? (
                <>
                  <div className="font-medium text-gray-800">{selectedEmail.sender}</div>
                  <div className="text-gray-400">·</div>
                  <div className="text-gray-500">{selectedEmail.senderEmail}</div>
                  <div className="text-gray-400">·</div>
                  <div className="text-gray-400">{selectedEmail ? formatDistanceToNow(selectedEmail.timestamp) : ''}</div>
                </>
              ) : (
                <div className="text-gray-500">No message selected</div>
              )}
            </div>
          </div>

          <div className="ml-auto">
            {selectedEmail && selectedEmail.category && (
              <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                {selectedEmail.category.charAt(0).toUpperCase() + selectedEmail.category.slice(1)}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 overflow-auto">
          {selectedEmail ? (
            <>
              {selectedEmail.actionItems && selectedEmail.actionItems.length > 0 && (
                <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-100 p-4">
                  <div className="flex items-center gap-3 text-emerald-700 font-medium">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path></svg>
                    <div>Action Items Detected</div>
                  </div>
                  <ul className="mt-3 list-disc list-inside text-sm text-emerald-800">
                    {selectedEmail.actionItems.map((ai, i) => <li key={i}>{ai}</li>)}
                  </ul>
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedEmail.content}</p>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 mt-24">
              No email selected. Choose an email from the list.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;