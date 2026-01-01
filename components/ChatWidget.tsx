import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, LiveServerMessage, Modality } from "@google/genai";
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

const ChatWidget: React.FC = () => {
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
  const [volumeLevel, setVolumeLevel] = useState(0); // For visualizer

  // Refs
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const liveSessionRef = useRef<any>(null); // To store the active live session
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);

  // --- SCROLL HELPERS ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mode === 'text') scrollToBottom();
  }, [messages, isOpen, mode]);

  // --- TEXT CHAT INIT ---
  useEffect(() => {
    if (!process.env.API_KEY) return;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contextData = JSON.stringify(GRANTS.map(g => ({
      title: g.title,
      category: g.category,
      amount: g.amount,
      deadline: g.deadline,
      desc: g.description,
      eligibility: g.eligibility
    })));

    // Using gemini-3-flash-preview for basic text tasks
    chatSessionRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are the Official Virtual Assistant for the US National Grant Assistance Portal. 
        Your tone must be professional, authoritative, yet helpful and empathetic (government official style).
        
        Here is the database of currently available grants:
        ${contextData}

        Rules:
        1. Only answer questions based on the grants listed above or general application inquiries.
        2. Keep answers concise (under 3 sentences) unless asked for details.
        `,
      },
    });
  }, []);

  // --- TEXT SEND ---
  const handleTextSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTextLoading(true);

    try {
      if (!chatSessionRef.current) throw new Error("Chat session not initialized");

      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      const responseText = result.text;

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, but I am currently unable to process your request." }]);
    } finally {
      setIsTextLoading(false);
    }
  };

  // --- VOICE SESSION MANAGEMENT ---
  const startVoiceSession = async () => {
    try {
      if (!process.env.API_KEY) {
        setVoiceStatus("API Key Error");
        return;
      }
      setVoiceStatus("Initializing Audio...");
      
      // 1. Setup Audio Context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 16000 }); // 16kHz for input
      
      // 2. Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        channelCount: 1,
        sampleRate: 16000,
      }});

      setVoiceStatus("Connecting to Secure Agent...");

      // 3. Init Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 4. Connect Live Session
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are a helpful government grant assistant. Speak clearly and professionally.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        },
        callbacks: {
          onopen: () => {
            console.log("Voice Session Opened");
            setVoiceStatus("Listening...");
            setIsVoiceConnected(true);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output from Model
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const audioData = base64ToUint8Array(base64Audio);
              // Decode logic
              if (audioContextRef.current) {
                // Helper to convert Int16 PCM to Float32
                const pcm16 = new Int16Array(audioData.buffer);
                const float32 = new Float32Array(pcm16.length);
                for (let i = 0; i < pcm16.length; i++) {
                   float32[i] = pcm16[i] / 32768;
                }
                
                const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
                buffer.getChannelData(0).set(float32);
                
                playAudioBuffer(buffer);
              }
            }
            
            // Handle Turn Complete (optional logic)
            if (message.serverContent?.turnComplete) {
              setVoiceStatus("Listening...");
            }
          },
          onclose: () => {
            console.log("Voice Session Closed");
            stopVoiceSession();
          },
          onerror: (err) => {
            console.error("Voice Error", err);
            setVoiceStatus("Connection Error");
            stopVoiceSession();
          }
        }
      });

      // 5. Setup Audio Processing (Mic -> Model)
      // Wait for connection
      sessionPromise.then((session) => {
        liveSessionRef.current = session;
        
        if (!audioContextRef.current) return;

        inputSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        // Buffer size 4096, 1 input, 1 output
        processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        processorRef.current.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          
          // Visualizer calculation
          let sum = 0;
          for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
          setVolumeLevel(sum / inputData.length);

          // Convert Float32 to Int16 PCM for API
          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
             pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
          }
          
          // Send to Gemini
          const base64Data = arrayBufferToBase64(pcm16.buffer);
          session.sendRealtimeInput({
            media: {
              mimeType: 'audio/pcm;rate=16000',
              data: base64Data
            }
          });
        };

        inputSourceRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);
      });

    } catch (e) {
      console.error(e);
      setVoiceStatus("Failed to access microphone");
    }
  };

  const playAudioBuffer = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;
    
    // Scheduling
    const currentTime = audioContextRef.current.currentTime;
    // If next start time is in the past, reset it to now
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }

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

    // Stop tracks
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    // Note: session.close() not explicitly available on the interface, relying on disconnect logic/garbage collection or checking API docs.
    // Assuming simple disconnect for this demo.
    liveSessionRef.current = null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[400px] h-[550px] rounded-lg shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-brand-900 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-full">
                <Sparkles className="h-4 w-4 text-brand-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Automated Support</h3>
                <p className="text-xs text-brand-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (mode === 'voice') stopVoiceSession();
                  setMode(mode === 'text' ? 'voice' : 'text');
                }}
                className={`p-1.5 rounded transition-colors text-xs font-bold uppercase tracking-wider ${
                  mode === 'voice' ? 'bg-white text-brand-900' : 'bg-brand-800 text-brand-200 hover:text-white'
                }`}
                title={mode === 'text' ? "Switch to Voice" : "Switch to Text"}
              >
                {mode === 'text' ? <Mic className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => {
                  stopVoiceSession();
                  setIsOpen(false);
                }}
                className="hover:bg-brand-800 p-1 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* CONTENT AREA */}
          {mode === 'text' ? (
            <>
              {/* Text Messages Area */}
              <div className="flex-grow overflow-y-auto p-4 bg-slate-50 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                      
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-slate-200' : 'bg-brand-100'
                      }`}>
                        {msg.role === 'user' ? <User className="h-4 w-4 text-slate-600" /> : <Bot className="h-4 w-4 text-brand-700" />}
                      </div>

                      {/* Bubble */}
                      <div className={`p-3 rounded-lg text-sm shadow-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-brand-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTextLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-brand-700" />
                      </div>
                      <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none shadow-sm">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Text Input Area */}
              <form onSubmit={handleTextSend} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about grants..."
                  className="flex-grow px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
                <button 
                  type="submit"
                  disabled={isTextLoading || !input.trim()}
                  className="bg-brand-700 text-white p-2 rounded hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            /* VOICE MODE INTERFACE */
            <div className="flex-grow bg-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
               {/* Background Effects */}
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-900 to-slate-900 opacity-50 z-0"></div>
               
               <div className="z-10 relative w-full h-full flex flex-col items-center justify-center">
                 
                 {/* Visualizer Circle */}
                 <div className="relative mb-8">
                   <div 
                      className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-100 ${
                        isVoiceConnected ? 'bg-brand-500/20 border-2 border-brand-400' : 'bg-slate-800 border-2 border-slate-700'
                      }`}
                      style={{
                        transform: isVoiceConnected ? `scale(${1 + volumeLevel * 5})` : 'scale(1)',
                        boxShadow: isVoiceConnected ? `0 0 ${20 + volumeLevel * 100}px rgba(56, 189, 248, 0.5)` : 'none'
                      }}
                   >
                     {isVoiceConnected ? (
                       <BarChart2 className="h-12 w-12 text-brand-400 animate-pulse" />
                     ) : (
                       <Mic className="h-12 w-12 text-slate-500" />
                     )}
                   </div>
                   
                   {/* Ripple effect */}
                   {isVoiceConnected && (
                     <div className="absolute inset-0 rounded-full border border-brand-500/30 animate-ping"></div>
                   )}
                 </div>

                 <h3 className="text-white font-bold text-xl mb-2">Live Agent</h3>
                 <p className="text-brand-200 text-sm mb-8 font-mono h-6">{voiceStatus}</p>

                 {!isVoiceConnected ? (
                   <button
                     onClick={startVoiceSession}
                     className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-transform transform hover:scale-105"
                   >
                     <Phone className="h-5 w-5" /> Start Call
                   </button>
                 ) : (
                   <button
                     onClick={stopVoiceSession}
                     className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-transform transform hover:scale-105"
                   >
                     <PhoneOff className="h-5 w-5" /> End Call
                   </button>
                 )}
               </div>
            </div>
          )}
          
          <div className="bg-slate-50 text-center py-1 border-t border-slate-200 shrink-0">
            <p className="text-[10px] text-slate-400">Official Automated Response System</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-700' : 'bg-brand-600 animate-bounce-subtle'} hover:bg-brand-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border-2 border-white`}
        aria-label="Toggle Help Chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-7 w-7" />}
      </button>
    </div>
  );
};

export default ChatWidget;