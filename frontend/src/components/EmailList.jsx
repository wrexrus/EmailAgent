
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
    <ul className="divide-y">
      {emails.length === 0 && (
        <li className="p-6 text-center text-sm text-gray-500">No emails</li>
      )}

      {emails.map((email) => {
        const selected = selectedEmailId === email.id;
        return (
          <li key={email.id} className="first:pt-4 last:pb-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectEmail && onSelectEmail(email)}
              onKeyDown={(e) => handleKeyDown(e, email)}
              className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors rounded-md m-3 ${
                selected ? 'ring-1 ring-blue-200 border-l-4 border-blue-500 bg-white' : 'bg-white'
              }`}
              aria-pressed={selected}
            >
              <div className="shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {email.sender
                    .split(' ')
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-gray-900 truncate">{email.sender}</div>
                      <div className="ml-2 text-xs text-gray-400 truncate">{formatRelative(email.timestamp)}</div>
                    </div>

                    <div className="mt-1">
                      <div className="text-sm text-gray-900 truncate font-semibold">{email.subject}</div>
                    </div>

                    <div className="mt-1 text-xs text-gray-500 truncate">{email.preview || email.content}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {!email.read && <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mt-1" aria-hidden="true" />}
                    {email.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        {email.category.charAt(0).toUpperCase() + email.category.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}