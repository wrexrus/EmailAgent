import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { House, Brain, MessageCircleMore, NotebookPen, Settings } from 'lucide-react'

const NavigationBar = ({ isOpen = true, onToggle }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} h-full bg-gray-900 text-gray-300 transition-all duration-300 flex flex-col shadow-xl z-50`}>
      <div className={`flex items-center ${isOpen ? 'justify-start px-6' : 'justify-center'} h-20 border-b border-gray-800`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <Logo isOpen={isOpen} />
        </div>
      </div>

      <nav className="flex flex-col mt-6 gap-2 px-3">
        <NavItem to="/" icon={<House size={20} />} label="Dashboard" isOpen={isOpen} active={isActive('/')} />
        <NavItem to="/prompts" icon={<Brain size={20} />} label="Prompt Brain" isOpen={isOpen} active={isActive('/prompts')} />
        <NavItem to="/chat" icon={<MessageCircleMore size={20} />} label="Agent Chat" isOpen={isOpen} active={isActive('/chat')} />
        <NavItem to="/drafts" icon={<NotebookPen size={20} />} label="Drafts" isOpen={isOpen} active={isActive('/drafts')} />

        <div className="my-2 border-t border-gray-800 mx-2"></div>

        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" isOpen={isOpen} active={isActive('/settings')} />
      </nav>

      <div className="mt-auto p-4 border-t border-gray-800">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
              US
            </div>
            <div>
              <p className="text-sm font-medium text-white">User</p>
              <p className="text-xs text-gray-500">Pro Plan</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mx-auto"></div>
        )}
      </div>
    </aside >
  )
}

const NavItem = ({ to, icon, label, isOpen, active }) => (
  <Link
    to={to}
    className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative ${active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
        : 'hover:bg-gray-800 hover:text-white'
      } ${isOpen ? '' : 'justify-center'}`}
  >
    <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
      {icon}
    </span>

    {isOpen && (
      <span className="ml-3 font-medium text-sm tracking-wide">{label}</span>
    )}

    {!isOpen && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {label}
      </div>
    )}
  </Link>
)

export default NavigationBar
