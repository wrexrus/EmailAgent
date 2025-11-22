import { Link } from 'react-router-dom';
import Logo from './Logo';
import { House,Brain,MessageCircleMore,NotebookPen,Settings  } from 'lucide-react'

const NavigationBar = ({ isOpen = true, onToggle }) => {
  return (
    <aside className={`${isOpen ? 'w-64' : 'w-16'} h-full bg-blue-950 text-white transition-all duration-300 flex flex-col`}>
      <div className='flex items-center justify-between p-3'>

        <div className="flex items-center">
          <Logo isOpen={isOpen} />
          <span className={`${isOpen ? 'ml-2 inline' : 'hidden'}`}></span>
        </div>

      </div>

      <nav className="flex flex-col mt-4 gap-3 px-2">
        <Link className="flex items-center p-2 rounded hover:bg-blue-800" to="/">
          <span><House /></span>
          <span className={`${isOpen ? 'ml-2' : 'sr-only'}`}>Dashboard</span>
        </Link>

        <Link className="flex items-center p-2 rounded hover:bg-blue-800" to="/prompts">
          <span><Brain /></span>
          <span className={`${isOpen ? 'ml-2' : 'sr-only'}`}>Prompt Brain</span>
        </Link>

        <Link className="flex items-center p-2 rounded hover:bg-blue-800" to="/chat">
          <span><MessageCircleMore /></span>
          <span className={`${isOpen ? 'ml-2' : 'sr-only'}`}>Agent Chat</span>
        </Link>

        <Link className="flex items-center p-2 rounded hover:bg-blue-800" to="/drafts">
          <span><NotebookPen /></span>
          <span className={`${isOpen ? 'ml-2' : 'sr-only'}`}>Drafts</span>
        </Link>

        <Link className="flex items-center p-2 rounded hover:bg-blue-800" to="/settings">
          <span><Settings /></span>
          <span className={`${isOpen ? 'ml-2' : 'sr-only'}`}>Settings</span>
        </Link>
      </nav>
    </aside >
  )
}

export default NavigationBar
