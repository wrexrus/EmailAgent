import { Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard';
import PromptBrain from './pages/PromptBrain';
import AgentChat from './pages/AgentChat';
import Drafts from './pages/Drafts';
import Settings from './pages/Settings';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900'>
      <NavigationBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(s => !s)} />

      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Sidebar Toggle - Floating on the edge */}
        <button
          onClick={() => setSidebarOpen(s => !s)}
          className="absolute top-6 z-50 p-1.5 rounded-full bg-white text-gray-500 shadow-md border border-gray-200 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200 transform hover:scale-110 focus:outline-none"
          style={{
            left: '-12px',
          }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <main className='flex-1 overflow-hidden'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/prompts' element={<PromptBrain />} />
            <Route path='/chat' element={<AgentChat />} />
            <Route path='/drafts' element={<Drafts />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
