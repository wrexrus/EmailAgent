import { useEffect, useState, useMemo } from "react";
import api from "../api";

export default function InboxFetcher({ onSelectEmail }) {
  const [emails, setEmails] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

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
    reader.onload = () => setFileContent(reader.result);
    reader.readAsText(file);
  }

  async function upload() {
    if (!fileContent) return setStatus("Choose a JSON file first");
    try {
      const parsed = JSON.parse(fileContent);
      const res = await api.post('/api/emails/upload', parsed);
      setStatus(`Uploaded ${res.data.count} emails`);
      load();
    } catch (err) {
      setStatus("Upload failed: " + (err.response?.data?.error || err.message));
    }
  }

  // Extract unique labels from all emails
  const uniqueLabels = useMemo(() => {
    const labels = new Set();
    emails.forEach(email => {
      if (email.labels && Array.isArray(email.labels)) {
        email.labels.forEach(labelStr => {
          // Split by comma to handle combined labels like "Meeting, Important"
          labelStr.split(',').forEach(l => labels.add(l.trim()));
        });
      }
    });
    return Array.from(labels).sort();
  }, [emails]);

  // Filter emails based on the selected filter
  const filteredEmails = useMemo(() => {
    if (selectedFilter === "All") return emails;
    return emails.filter(email => {
      if (!email.labels) return false;
      return email.labels.some(labelStr =>
        labelStr.split(',').map(l => l.trim()).includes(selectedFilter)
      );
    });
  }, [emails, selectedFilter]);

  return (
    <div className="relative">
      {/* Upload Section */}
      <div className="p-4 border-b bg-gray-50 mt-16">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-50 transition shadow-sm">
              Choose File
              <input type="file" accept=".json,application/json" onChange={handleFile} className="hidden" />
            </label>
            <button
              onClick={upload}
              className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Upload
            </button>
          </div>
          {status && <span className="text-xs text-blue-600 font-medium animate-pulse">{status}</span>}
        </div>
      </div>

      {/* Sticky Filter Bar */}
      {uniqueLabels.length > 0 && (
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b px-4 py-3 shadow-sm">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedFilter("All")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${selectedFilter === "All"
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
            >
              All
            </button>
            {uniqueLabels.map(label => (
              <button
                key={label}
                onClick={() => setSelectedFilter(label)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200  ${selectedFilter === label
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Email List */}
      <ul className="divide-y divide-gray-100">
        {filteredEmails.map((email) => (
          <li
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className="p-4 cursor-pointer hover:bg-blue-50/50 transition-colors group"
          >
            <div className="flex justify-between items-start mb-1">
              <p className="font-semibold text-gray-900 truncate pr-2 text-sm group-hover:text-blue-700 transition-colors">
                {email.subject}
              </p>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                {new Date(email.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2 truncate">{email.senderName}</p>

            {/* Labels */}
            {email.labels?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {email.labels.flatMap(l => l.split(',')).map((label, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-100"
                  >
                    {label.trim()}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}

        {filteredEmails.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">No emails found.</p>
          </div>
        )}
      </ul>
    </div>
  );
}
