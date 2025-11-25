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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div style={{ width: 360, borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
        <InboxFetcher 
          key={reloadKey} 
          onSelectEmail={setSelected} 
        />

        <div>
          <button 
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-20' 
            onClick={processEmails}
          >
            Process Inbox
          </button>
          <span>{msg}</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {selected ? (
          <EmailViewer email={selected} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select an email
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
