/**
 * Props:
 * - emails: array of email objects
 * - selectedEmailId: id of currently selected email
 * - onSelectEmail: function(email) => void
 */
export function EmailList({ emails = [], selectedEmailId, onSelectEmail, filter }) {
  function formatRelative(date) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  }

  function handleKeyDown(e, email) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectEmail && onSelectEmail(email);
    }
  }

  return (
    <ul className="divide-y divide-gray-100">
      {emails.length === 0 && (
        <li className="p-8 text-center text-gray-500 flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-xl">📭</span>
          </div>
          <p className="text-sm font-medium">No emails found</p>
          <p className="text-xs text-gray-400 mt-1">Try changing the filter</p>
        </li>
      )}

      {emails.map((email) => {
        const selected = selectedEmailId === email.id;
        return (
          <li key={email.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectEmail && onSelectEmail(email)}
              onKeyDown={(e) => handleKeyDown(e, email)}
              className={`group relative flex items-start gap-4 p-5 cursor-pointer transition-all duration-200 border-l-4 ${selected
                  ? 'bg-blue-50/50 border-blue-600'
                  : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                }`}
              aria-pressed={selected}
            >
              <div className="shrink-0 pt-1">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${selected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                  {email.sender
                    .split(' ')
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className={`text-sm font-semibold truncate ${selected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {email.sender}
                  </span>
                  <span className={`text-xs whitespace-nowrap ${selected ? 'text-blue-600' : 'text-gray-400'}`}>
                    {formatRelative(email.timestamp)}
                  </span>
                </div>

                <div className="mb-1">
                  <h4 className={`text-sm font-medium truncate ${selected ? 'text-gray-900' : 'text-gray-800'}`}>
                    {email.subject}
                  </h4>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {email.preview || email.content}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {!email.read && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      New
                    </span>
                  )}
                  {email.category && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium border border-gray-200">
                      {email.category.charAt(0).toUpperCase() + email.category.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}