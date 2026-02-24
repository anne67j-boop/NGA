import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles, Mic, Phone, PhoneOff, BarChart2 } from 'lucide-react';

const ChatWidget = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'model', text: 'Hello. How can I help you today?' }]);
  const [input, setInput] = useState('');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[400px] h-[550px] rounded-lg shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <h3 className="font-bold text-sm">Automated Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-slate-800 p-1 rounded transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form className="p-3 bg-white border-t border-slate-200 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..." 
              className="flex-grow px-3 py-2 border rounded text-sm focus:outline-none"
            />
            <button className="bg-slate-900 text-white p-2 rounded hover:bg-slate-800">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center border-2 border-white transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-7 w-7" />}
      </button>
    </div>
  );
};

export default ChatWidget;
