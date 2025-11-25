import InboxFetcher from '../components/InboxFetcher';
import EmailViewer from '../components/EmailViewer';
import { useState } from 'react';
import api from '../api';

const Dashboard = () => {
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");
  const [reloadKey, setReloadKey] = useState(0); // Trigger re-fetch of inbox

  async function processEmails() {
    setMsg("Processing...");
    try {
      const res = await api.post("/api/process-emails");
      setMsg(`Processed ${res.data.processedCount || "some"} emails`);

      // After processing → reload inbox
      setReloadKey(prev => prev + 1);
    } catch (err) {
      setMsg("Failed processing");
      console.log(err);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar / Inbox List */}
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col shadow-sm z-10">
        <InboxFetcher
          key={reloadKey}
          onSelectEmail={setSelected}
          onProcess={processEmails}
          processMsg={msg}
        />
      </div>

      {/* Main Content / Email Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {selected ? (
          <EmailViewer email={selected} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="text-4xl opacity-50">📬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Email Selected</h3>
            <p className="text-gray-400 max-w-xs text-center">Select an email from the list to view its contents and AI insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
