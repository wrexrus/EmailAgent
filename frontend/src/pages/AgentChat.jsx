import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Send, User } from 'lucide-react';
import api from '../api'; // Make sure this path is correct

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
          text: `You're asking about the email from ${contextEmail.senderName || contextEmail.sender} regarding "${contextEmail.subject}". How can I assist you with this email?`,
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
        text: responseText || "No meaningful response from the agent",
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
        sender: 'agent'
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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Agent Chat</h1>
        <p className="text-gray-500 text-sm">Ask questions about this email</p>
      </div>

      {/* Context Email Section */}
      {contextEmail && (
        <div className="bg-blue-50/50 border-b border-blue-100 px-8 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Context Email:</h3>
                <p className="text-sm text-gray-700 font-medium">{contextEmail.subject}</p>
                <p className="text-xs text-gray-500 mt-0.5">From: {contextEmail.senderName || contextEmail.sender}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <Bot size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Start chatting with the Email Agent</h2>
            <p className="text-gray-500 max-w-md">Ask questions, summarize email content, extract tasks, or request reply drafting.</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-gray-200' : 'bg-emerald-500'
                  }`}>
                  {message.sender === 'user' ? (
                    <User size={20} className="text-gray-600" />
                  ) : (
                    <Bot size={20} className="text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl max-w-[80%] ${message.sender === 'user'
                  ? 'bg-emerald-500 text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                  }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {typeof message.text === 'string' ? message.text : JSON.stringify(message.text, null, 2)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Example: 'Summarize this email' or 'Draft a reply asking for an agenda'"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none h-[60px] min-h-[60px] max-h-32 transition-all"
                style={{ height: Math.max(60, Math.min(128, inputValue.split('\n').length * 24 + 24)) + 'px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className={`p-4 rounded-xl transition-all duration-200 flex-shrink-0 ${!inputValue.trim() || loading
                ? 'bg-emerald-200 text-white cursor-not-allowed'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md transform hover:scale-105'
                }`}
            >
              {loading ? "..." : <Send size={20} />}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3 ml-1">
            Press <b>Enter</b> to send • <b>Shift+Enter</b> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
