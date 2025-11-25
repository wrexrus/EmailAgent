import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Send, User, Sparkles, Mail, CornerDownLeft } from 'lucide-react';
import api from '../api';

const AgentChat = () => {
  const location = useLocation();
  const contextEmail = location.state?.email;

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (contextEmail && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: `I see you're looking at the email from **${contextEmail.senderName || contextEmail.sender}** regarding "**${contextEmail.subject}**".\n\nHow can I help you with this?`,
          sender: 'agent'
        }
      ]);
    }
  }, [contextEmail, messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Backend call to agent
      const res = await api.post('/api/agent/query', {
        emailId: contextEmail?.id || null,
        userQuery: userMessage.text
      },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let responseText = res?.data?.response;

      // Handle Gemini structured format
      if (typeof responseText === 'object') {
        if (responseText.parts?.length) {
          responseText = responseText.parts.map(p => p.text).join('\n');
        } else {
          responseText = JSON.stringify(responseText, null, 2);
        }
      }

      const agentMessage = {
        id: Date.now() + 1,
        text: responseText || "I'm sorry, I couldn't generate a meaningful response.",
        sender: 'agent',
      };
      setMessages(prev => [...prev, agentMessage]);

    } catch (error) {
      let errMsg = "Agent failed to respond.";
      if (error.response?.data?.error) {
        errMsg += ` (${error.response.data.error})`;
      }
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: errMsg,
        sender: 'agent',
        isError: true
      }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-10 flex items-center gap-3 shadow-sm">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">Agent Assistant</h1>
          <p className="text-xs text-gray-500 font-medium">Powered by Gemini</p>
        </div>
      </div>

      {/* Context Email Banner */}
      {contextEmail && (
        <div className="mx-6 mt-6 mb-2">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Mail size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Context</span>
                <div className="h-px flex-1 bg-gray-100"></div>
              </div>
              <h3 className="font-semibold text-gray-900 truncate text-sm">{contextEmail.subject}</h3>
              <p className="text-xs text-gray-500 truncate">From: {contextEmail.senderName || contextEmail.sender}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60 pb-20">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <Bot size={40} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">How can I help you?</h2>
            <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
              I can summarize emails, draft replies, extract action items, or answer questions about your inbox.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${message.sender === 'user'
                    ? 'bg-gray-900 text-white'
                    : message.isError ? 'bg-red-100 text-red-500' : 'bg-white text-indigo-600 border border-indigo-100'
                  }`}>
                  {message.sender === 'user' ? (
                    <User size={14} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] shadow-sm text-sm leading-relaxed ${message.sender === 'user'
                  ? 'bg-gray-900 text-white rounded-br-none'
                  : message.isError
                    ? 'bg-red-50 text-red-800 border border-red-100 rounded-bl-none'
                    : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
                  }`}>
                  <div className="whitespace-pre-wrap markdown-body">
                    {/* Simple rendering for bold text */}
                    {typeof message.text === 'string'
                      ? message.text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={i}>{part.slice(2, -2)}</strong>
                          : part
                      )
                      : JSON.stringify(message.text, null, 2)
                    }
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative flex items-end gap-2 bg-white rounded-2xl border border-gray-200 p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask anything..."
                className="w-full bg-transparent border-none p-3 text-gray-700 placeholder:text-gray-400 focus:ring-0 outline-none resize-none max-h-32 min-h-[50px] text-sm"
                style={{ height: Math.max(50, Math.min(128, inputValue.split('\n').length * 20 + 20)) + 'px' }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5 ${!inputValue.trim() || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-black shadow-md transform hover:scale-105 active:scale-95'
                  }`}
              >
                <CornerDownLeft size={18} />
              </button>
            </div>
          </form>
          <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
            AI can make mistakes. Please review generated actions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
