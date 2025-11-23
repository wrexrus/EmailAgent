import React, { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';

const PromptBrain = () => {
  const [prompts, setPrompts] = useState({
    categorization: `Analyze the email and categorize it into one of the following:
- important: Emails requiring urgent attention or from key stakeholders
- marketing: Promotional emails, newsletters, and automated notifications
- social: Social media notifications and updates
- general: Personal emails and general correspondence

Output only the category name (lowercase).`,
    extraction: `Extract actionable tasks from the email. For each action item:
1. Identify specific tasks that require completion
2. Note any deadlines or time-sensitive information
3. Identify the person responsible (if mentioned)

Format as a bulleted list. If no action items are found, return "No action items".`,
    reply: `Generate a professional email response that:
1. Acknowledges the main points of the original email
2. Maintains a polite and helpful tone
3. Addresses any specific questions asked
4. Keeps the response concise

Do not include placeholders like "[Your Name]" unless necessary for context.`
  });

  const handlePromptChange = (key, value) => {
    setPrompts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">Prompt Brain</h1>
          <p className="text-gray-500">Configure how your AI agent processes and responds to emails</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors bg-white font-medium">
            <RotateCcw size={18} />
            Reset
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium shadow-sm">
            <Save size={18} />
            Save Prompts
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {/* Email Categorization */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Email Categorization</h2>
            <p className="text-sm text-gray-500">Customize how the AI handles this task</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Instructions</label>
            <textarea
              value={prompts.categorization}
              onChange={(e) => handlePromptChange('categorization', e.target.value)}
              className="w-full h-32 border border-gray-200 rounded-lg p-4 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-y bg-gray-50 font-mono text-sm leading-relaxed"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Action Item Extraction */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Action Item Extraction</h2>
            <p className="text-sm text-gray-500">Customize how the AI handles this task</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Instructions</label>
            <textarea
              value={prompts.extraction}
              onChange={(e) => handlePromptChange('extraction', e.target.value)}
              className="w-full h-32 border border-gray-200 rounded-lg p-4 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-y bg-gray-50 font-mono text-sm leading-relaxed"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Auto-Reply Generation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Auto-Reply Generation</h2>
            <p className="text-sm text-gray-500">Customize how the AI handles this task</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Instructions</label>
            <textarea
              value={prompts.reply}
              onChange={(e) => handlePromptChange('reply', e.target.value)}
              className="w-full h-32 border border-gray-200 rounded-lg p-4 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-y bg-gray-50 font-mono text-sm leading-relaxed"
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      {/* Footer Tip */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600 text-sm">
        <span className="font-semibold text-gray-800">Tip:</span> Effective prompts are specific, clear, and include examples. Test your changes by processing emails from the Dashboard.
      </div>
    </div>
  );
};

export default PromptBrain;
