import React from 'react'
import { Zap } from 'lucide-react'

const Logo = ({ isOpen = true }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex-shrink-0">
        <Zap className="text-white fill-white" size={20} />
        <div className="absolute inset-0 rounded-xl bg-white opacity-20 blur-sm"></div>
      </div>

      {isOpen && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-tight leading-none">
            Email Agent
          </span>
          <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
            Workspace
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
