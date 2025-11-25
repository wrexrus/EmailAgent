import { useEffect, useState, useMemo } from "react";
import api from "../api";
import { Upload, RefreshCw, Inbox as InboxIcon, Search, Tag } from 'lucide-react';

export default function InboxFetcher({ onSelectEmail, onProcess, processMsg }) {
  const [emails, setEmails] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get('/api/emails');
      setEmails(res.data);
    } catch (err) {
      setStatus("Failed to load inbox");
    }
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(reader.result);
      // Auto upload after read
      upload(reader.result);
    };
    reader.readAsText(file);
  }

  async function upload(content) {
    if (!content) return setStatus("Choose a JSON file first");
    try {
      const parsed = JSON.parse(content);
      const res = await api.post('/api/emails/upload', parsed);
      setStatus(`Uploaded ${res.data.count} emails`);
      load();
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("Upload failed: " + (err.response?.data?.error || err.message));
    }
  }

  // Extract unique labels
  const uniqueLabels = useMemo(() => {
    const labels = new Set();
    emails.forEach(email => {
      if (email.labels && Array.isArray(email.labels)) {
        email.labels.forEach(labelStr => {
          labelStr.split(',').forEach(l => labels.add(l.trim()));
        });
      }
    });
    return Array.from(labels).sort();
  }, [emails]);

  // Filter emails
  const filteredEmails = useMemo(() => {
    let result = emails;

    // Label Filter
    if (selectedFilter !== "All") {
      result = result.filter(email => {
        if (!email.labels) return false;
        return email.labels.some(labelStr =>
          labelStr.split(',').map(l => l.trim()).includes(selectedFilter)
        );
      });
    }

    // Search Filter
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(e =>
        (e.subject && e.subject.toLowerCase().includes(lower)) ||
        (e.senderName && e.senderName.toLowerCase().includes(lower)) ||
        (e.body && e.body.toLowerCase().includes(lower))
      );
    }

    return result;
  }, [emails, selectedFilter, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2.5 text-gray-800">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <InboxIcon size={20} strokeWidth={2.5} />
          </div>
          <h2 className="font-bold text-xl tracking-tight">Inbox</h2>
        </div>
        <div className="flex items-center gap-1">
          <label className="cursor-pointer p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-all duration-200 group relative" title="Upload JSON">
            <Upload size={20} />
            <input type="file" accept=".json,application/json" onChange={handleFile} className="hidden" />
          </label>
          <button
            onClick={onProcess}
            className={`p-2 text-gray-400 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-all duration-200 ${processMsg === "Processing..." ? "text-blue-600 bg-blue-50" : ""}`}
            title="Process Inbox"
          >
            <RefreshCw size={20} className={processMsg === "Processing..." ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Status / Search Bar */}
      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/30">
        {(status || processMsg) ? (
          <div className="mb-2 px-3 py-2 bg-blue-50/50 text-xs text-blue-600 font-medium rounded-lg border border-blue-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            {processMsg || status}
          </div>
        ) : null}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Filter Bar */}
      {uniqueLabels.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-50 overflow-x-auto hide-scrollbar bg-white">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${selectedFilter === "All"
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              All
            </button>
            {uniqueLabels.map(label => (
              <button
                key={label}
                onClick={() => setSelectedFilter(label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${selectedFilter === label
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Email List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
        <ul className="divide-y divide-gray-100">
          {filteredEmails.map((email) => (
            <li
              key={email.id}
              onClick={() => onSelectEmail(email)}
              className="p-4 cursor-pointer hover:bg-white hover:shadow-sm transition-all duration-200 group border-l-4 border-transparent hover:border-blue-500 bg-white/50"
            >
              <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
                    {(email.senderName || "?").charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-900 truncate text-sm">
                    {email.senderName}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium ml-2">
                  {new Date(email.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <p className="font-medium text-gray-800 text-sm mb-1 truncate group-hover:text-blue-700 transition-colors">
                {email.subject}
              </p>

              <p className="text-xs text-gray-500 mb-2.5 line-clamp-2 leading-relaxed">
                {email.body || "No content preview available."}
              </p>

              {/* Labels */}
              {email.labels?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {email.labels.flatMap(l => l.split(',')).map((label, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium border border-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors"
                    >
                      <Tag size={8} />
                      {label.trim()}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}

          {filteredEmails.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400 h-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="opacity-50" />
              </div>
              <p className="text-sm font-medium">No emails found</p>
              <p className="text-xs mt-1 opacity-70">Try adjusting your filters or search</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
