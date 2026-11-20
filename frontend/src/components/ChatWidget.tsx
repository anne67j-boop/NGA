import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

const ChatWidget = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "model", text: "Automated support is not connected yet. Please use verified official resources." }]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setMessages((current) => [...current, { role: "user", text: value }, { role: "model", text: "This chat is currently a local demo and cannot send your message to a support team." }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && <section className="mb-4 flex h-[420px] w-[min(90vw,380px)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-slate-900 p-4 text-white">
          <span className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4" /> Support information</span>
          <button type="button" aria-label="Close chat" onClick={() => setIsOpen(false)}><X className="h-5 w-5" /></button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
          {messages.map((message, index) => <div key={index} className={`rounded-lg p-3 text-sm ${message.role === "user" ? "ml-8 bg-blue-600 text-white" : "mr-8 border bg-white text-slate-800"}`}>{message.text}</div>)}
        </div>
        <form className="flex gap-2 border-t bg-white p-3" onSubmit={sendMessage}>
          <input aria-label="Message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type a message..." className="min-w-0 flex-1 rounded border px-3 py-2 text-sm" />
          <button type="submit" aria-label="Send message" className="rounded bg-slate-900 p-2 text-white"><Send className="h-4 w-4" /></button>
        </form>
      </section>}
      <button type="button" aria-label={isOpen ? "Close support information" : "Open support information"} onClick={() => setIsOpen((open) => !open)} className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg">
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-7 w-7" />}
      </button>
    </div>
  );
};
export default ChatWidget;
