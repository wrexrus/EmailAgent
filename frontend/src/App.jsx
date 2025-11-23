import { Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard';
import PromptBrain from './pages/PromptBrain';
import AgentChat from './pages/AgentChat';
import Drafts from './pages/Drafts';
import Settings from './pages/Settings';
import { useState } from 'react';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react'
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className='flex h-screen'>
      <NavigationBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(s => !s)} />

      <button
        onClick={() => setSidebarOpen(s => !s)}
        aria-label="Toggle sidebar"
        className="cursor-pointer fixed top-4 z-40 p-1 rounded bg-white text-blue-950 shadow hover:bg-gray-300 ml-3"
        style={{
          left: sidebarOpen ? '16rem' : '4rem', 
          transition: 'left 300ms'
        }}
      >
        {sidebarOpen ? <PanelRightOpen /> : <PanelLeftOpen />}
      </button>

      <main className='flex-1 overflow-auto'>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/prompts' element={<PromptBrain />} />
          <Route path='/chat' element={<AgentChat />} />
          <Route path='/drafts' element={<Drafts />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
