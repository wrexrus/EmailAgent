import React from 'react'
import { Settings as SettingsIcon, Construction } from 'lucide-react'

const Settings = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <SettingsIcon size={48} className="text-gray-300 animate-spin-slow" />
      </div>
      <h1 className="text-2xl font-bold text-gray-700 mb-2">Settings</h1>
      <p className="text-gray-500">Configuration options coming soon.</p>
    </div>
  )
}

export default Settings
