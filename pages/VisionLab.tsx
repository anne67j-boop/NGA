import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Sparkles, AlertCircle, Film, PlayCircle, MonitorPlay, Key, ShieldCheck, Lightbulb } from 'lucide-react';

const VisionLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check for API key on mount using AI Studio helper
  useEffect(() => {
    const checkKey = async () => {
      try {
        if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
          const has = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(has);
        }
      } catch (e) {
        console.error("Error checking API key:", e);
      }
    };
    checkKey();
  }, []);

  const handleConnect = async () => {
    try {
      if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
        // Assume success to handle race condition as per instructions
        setHasApiKey(true);
      } else {
        console.warn("AI Studio client not found");
        // Fallback for dev environments where injection might happen differently
        if (process.env.API_KEY) setHasApiKey(true);
      }
    } catch (e) {
      console.error("Key selection error:", e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a descriptive prompt for the video generation.');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatusMessage('Initializing secure generative session...');

    try {
      // Use process.env.API_KEY which is populated after selection
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatusMessage('Sending prompt to Vision Model...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      setStatusMessage('Rendering video frames (this may take 1-2 minutes)...');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({operation: operation});
        setStatusMessage('Synthesizing high-fidelity textures...');
      }

      if (operation.error) {
        throw new Error((operation.error.message as string) || 'Generation failed');
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) {
        throw new Error('No video URI returned from the model.');
      }

      setStatusMessage('Downloading secure stream...');
      
      // Append key to download link
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) {
         throw new Error(`Failed to download video stream. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);

    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || "An unexpected error occurred.";
      
      if (errorMessage.includes("Requested entity was not found") || errorMessage.includes("404")) {
        errorMessage = "Model unavailable (404). Please ensure your API key is valid and has access to Veo.";
        // Reset key state if unauthorized
        setHasApiKey(false);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  const promptExamples = [
    { label: "Small Business", text: "Cinematic slow motion shot of a busy modern bakery kitchen, sunlight streaming through windows, a baker dusting flour onto artisanal bread, warm golden lighting, 4k highly detailed." },
    { label: "Community Park", text: "Drone view of a futuristic eco-friendly community center with a rooftop garden, people walking in a green park, solar panels reflecting the sun, blue sky, architectural visualization style." },
    { label: "Home Repair", text: "A bright, clean modern living room with freshly painted walls and new hardwood floors, comfortable furniture, sunlight coming through large windows, cozy atmosphere, photorealistic." },
    { label: "Abstract Concept", text: "A neon hologram of the United States map forming out of digital particles, spinning slowly on a dark background, data streams connecting cities, cybernetic style, 8k resolution." }
  ];

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-200">
       {/* Header */}
       <div className="bg-slate-900 py-12 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920')] opacity-5 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-2 bg-emerald-500/10 rounded-full mb-4 ring-1 ring-emerald-500/20">
            <MonitorPlay className="h-5 w-5 text-emerald-500 mr-2" />
            <span className="text-emerald-400 font-medium text-sm tracking-wide uppercase">Generative Media Engine</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Vision Innovation Studio</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Create AI-generated video concepts for your grant proposals.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Auth Gate */}
        {!hasApiKey ? (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-700 rounded-xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Authentication Required</h2>
            <p className="text-slate-400 mb-8">
              To access the Generative Video model, you must verify your session with a valid paid API key.
            </p>
            <button
              onClick={handleConnect}
              className="w-full flex items-center justify-center px-6 py-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20"
            >
              <ShieldCheck className="h-5 w-5 mr-2" /> Connect Secure Session
            </button>
            <p className="mt-6 text-xs text-slate-500">
               <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">
                 View Billing Documentation
               </a>
            </p>
            {error && <p className="mt-4 text-xs text-red-400">{error}</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-lg">
                <h3 className="text-white font-bold mb-4 flex items-center">
                  <Sparkles className="h-4 w-4 text-emerald-400 mr-2" /> Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                      Prompt
                    </label>
                    <textarea
                      rows={5}
                      className="w-full rounded bg-slate-950 border-slate-700 text-white border p-3 focus:ring-1 focus:ring-emerald-500 outline-none text-sm leading-relaxed mb-2"
                      placeholder="Describe your vision (e.g., A futuristic community park with solar panels...)"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={loading}
                    />
                    
                    {/* Prompt Helpers */}
                    <div>
                      <div className="flex items-center text-xs font-bold text-slate-500 uppercase mb-2">
                        <Lightbulb className="h-3 w-3 mr-1" /> Try an example:
                      </div>
                      <div className="space-y-2">
                        {promptExamples.map((ex, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPrompt(ex.text)}
                            className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded px-3 py-2 transition-all group"
                          >
                            <span className="block text-xs font-bold text-emerald-400 group-hover:text-emerald-300 mb-0.5">{ex.label}</span>
                            <span className="block text-[10px] text-slate-400 truncate leading-tight opacity-70 group-hover:opacity-100">{ex.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAspectRatio('16:9')}
                        className={`px-3 py-2 rounded text-sm font-medium border transition-colors ${
                          aspectRatio === '16:9'
                            ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        disabled={loading}
                      >
                        16:9 Landscape
                      </button>
                      <button
                        onClick={() => setAspectRatio('9:16')}
                        className={`px-3 py-2 rounded text-sm font-medium border transition-colors ${
                          aspectRatio === '9:16'
                            ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        disabled={loading}
                      >
                        9:16 Portrait
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                      loading
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Generate Video'}
                  </button>
                </div>
              </div>

              {/* Status Log */}
              {loading && (
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                   <div className="flex items-center text-emerald-400 mb-2">
                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
                     <span className="text-sm font-bold">System Status</span>
                   </div>
                   <p className="text-xs text-slate-400 font-mono">
                     {statusMessage}
                   </p>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-1 h-full min-h-[400px] flex flex-col">
                <div className="bg-black rounded-lg flex-grow flex items-center justify-center relative overflow-hidden">
                   {videoUrl ? (
                     <video 
                       src={videoUrl} 
                       controls 
                       autoPlay 
                       loop 
                       className="max-h-[600px] max-w-full shadow-2xl"
                     />
                   ) : (
                     <div className="text-center p-8">
                       <Film className="h-12 w-12 text-slate-800 mx-auto mb-4" />
                       <h3 className="text-slate-700 font-bold text-lg">No Output Generated</h3>
                       <p className="text-slate-800 text-sm mt-2">
                         Configure your prompt and settings on the left to begin.
                       </p>
                     </div>
                   )}
                </div>
                {videoUrl && (
                  <div className="p-4 flex justify-between items-center bg-slate-900">
                    <span className="text-xs text-slate-500 font-mono">Vision-Preview • 720p</span>
                    <a 
                      href={videoUrl} 
                      download="vision-concept.mp4"
                      className="text-emerald-400 text-sm font-bold hover:underline flex items-center"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" /> Download MP4
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionLab;