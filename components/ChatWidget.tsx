import React, { useState, useRef, useEffect } from 'react';
// Corrected import for the 2026 unified SDK
import { GoogleGenAI, Modality } from "@google/genai";
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles, Mic, Phone, PhoneOff, BarChart2 } from 'lucide-react';
import { GRANTS } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- AUDIO HELPERS ---
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Fixed: Added React.JSX.Element return type to satisfy TS2503
const ChatWidget = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  
  // Text Chat State
  const [input, setInput] = useState('');
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello. I am the National Grant Assistance automated agent. How can I help you find funding today?' }
  ]);
  
  // Voice Chat State
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Ready to connect');
  const [volumeLevel, setVolumeLevel] = useState(0); 

  // Refs - Updated types for 2026 SDK
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const liveSessionRef = useRef<any>(null); 
  const nextStartTimeRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mode === 'text') scrollToBottom();
  }, [messages, isOpen, mode]);

  // --- TEXT CHAT INIT ---
  useEffect(() => {
    // Note: Use REACT_APP_ prefix for client-side env vars in standard Create React App / Vite
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
    if (!apiKey) return;

    const ai = new GoogleGenAI({ apiKey });
    
    const contextData = JSON.stringify(GRANTS.map(g => ({
      title: g.title,
      category: g.category,
      amount: g.amount,
      deadline: g.deadline,
      desc: g.description,
      eligibility: g.eligibility
    })));

    // Initializing using the 2026 .chats property
    chatSessionRef.current = ai.chats.create({
      model: 'gemini-2.0-flash', 
      config: {
        systemInstruction: `You are the Official Virtual Assistant for the US National Grant Assistance Portal. Tone: Professional. Database: ${contextData}`,
      },
    });
  }, []);

  const handleTextSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTextLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, I am unable to process your request." }]);
    } finally {
      setIsTextLoading(false);
    }
  };

  // --- VOICE SESSION MANAGEMENT ---
  const startVoiceSession = async () => {
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
      if (!apiKey) {
        setVoiceStatus("API Key Error");
        return;
      }
      setVoiceStatus("Initializing Audio...");
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        channelCount: 1,
        sampleRate: 16000,
      }});

      setVoiceStatus("Connecting...");

      const ai = new GoogleGenAI({ apiKey });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp', // Standard 2026 live-capable model
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are a helpful government grant assistant.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        },
        callbacks: {
          onopen: () => {
            setVoiceStatus("Listening...");
            setIsVoiceConnected(true);
          },
          onmessage: async (message: any) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
                const audioData = base64ToUint8Array(base64Audio);
                const pcm16 = new Int16Array(audioData.buffer);
                const float32 = new Float32Array(pcm16.length);
                for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;
                
                const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
                buffer.getChannelData(0).set(float32);
                playAudioBuffer(buffer);
            }
          },
          onclose: () => stopVoiceSession(),
          onerror: (err) => {
            console.error(err);
            stopVoiceSession();
          }
        }
      });

      sessionPromise.then((session) => {
        liveSessionRef.current = session;
        if (!audioContextRef.current) return;

        inputSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        processorRef.current.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          let sum = 0;
          for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
          setVolumeLevel(sum / inputData.length);

          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
              pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
          }
          
          session.sendRealtimeInput({
            media: {
              mimeType: 'audio/pcm;rate=16000',
              data: arrayBufferToBase64(pcm16.buffer)
            }
          });
        };

        inputSourceRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);
      });

    } catch (e) {
      setVoiceStatus("Mic Access Denied");
    }
  };

  const playAudioBuffer = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;
    const currentTime = audioContextRef.current.currentTime;
    if (nextStartTimeRef.current < currentTime) nextStartTimeRef.current = currentTime;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
  };

  const stopVoiceSession = () => {
    setIsVoiceConnected(false);
    setVoiceStatus("Disconnected");
    setVolumeLevel(0);
    if (inputSourceRef.current) inputSourceRef.current.disconnect();
    if (processorRef.current) processorRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    liveSessionRef.current = null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[400px] h-[550px] rounded-lg shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <h3 className="font-bold text-sm">Grant Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMode(mode === 'text' ? 'voice' : 'text')} className="p-1.5 hover:bg-slate-800 rounded">
                {mode === 'text' ? <Mic className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-slate-800 p-1 rounded"><X className="h-5 w-5" /></button>
            </div>
          </div>

          {mode === 'text' ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleTextSend} className="p-3 border-t flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-grow border p-2 rounded text-sm" placeholder="Ask something..." />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded"><Send className="h-4 w-4" /></button>
              </form>
            </div>
          ) : (
            <div className="flex-grow bg-slate-900 flex flex-col items-center justify-center p-6 relative">
               <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-500 animate-pulse" style={{ transform: `scale(${1 + volumeLevel * 3})` }}>
                  <Mic className="h-8 w-8 text-blue-400" />
               </div>
               <p className="text-white mt-4 font-mono text-xs">{voiceStatus}</p>
               <button onClick={isVoiceConnected ? stopVoiceSession : startVoiceSession} className={`mt-8 px-6 py-2 rounded-full font-bold text-white ${isVoiceConnected ? 'bg-red-600' : 'bg-green-600'}`}>
                 {isVoiceConnected ? 'End Call' : 'Start Call'}
               </button>
            </div>
          )}
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-7 w-7" />}
      </button>
    </div>
  );
};

export default ChatWidget;
