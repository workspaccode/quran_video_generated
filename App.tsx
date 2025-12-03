import React, { useState } from 'react';
import { ApiKeySelector } from './components/ApiKeySelector';
import { Button } from './components/Button';
import { VideoResult } from './components/VideoResult';
import { GenerationStatus, VideoMetadata } from './types';
import { generateVideoPromptsAndMetadata, generateVeoVideo, fetchVideoBlob } from './services/geminiService';

const styles = [
    "Cinematic Nature",
    "Abstract Islamic Geometry",
    "Peaceful Mosque",
    "Flowing Water",
    "Starry Night",
    "Golden Hour Clouds"
];

export default function App() {
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [topic, setTopic] = useState("Surah Ar-Rahman");
  const [style, setStyle] = useState(styles[0]);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    
    setStatus(GenerationStatus.GENERATING_PROMPTS);
    setError(null);
    setVideoUrl(null);
    setMetadata(null);

    try {
      // 1. Generate Metadata & Visual Prompt
      const meta = await generateVideoPromptsAndMetadata(topic, style);
      setMetadata(meta);
      
      // 2. Generate Video with Veo
      setStatus(GenerationStatus.GENERATING_VIDEO);
      const uri = await generateVeoVideo(meta.visualPrompt);
      
      // 3. Fetch Blob for playback
      const blobUrl = await fetchVideoBlob(uri);
      setVideoUrl(blobUrl);

      setStatus(GenerationStatus.COMPLETED);
    } catch (e: any) {
      console.error(e);
      setStatus(GenerationStatus.FAILED);
      setError(e.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen font-sans text-emerald-50 bg-gradient-to-br from-emerald-950 via-emerald-900 to-black">
      <ApiKeySelector onKeySelected={() => setApiKeyReady(true)} />

      {/* Header */}
      <header className="border-b border-emerald-800 bg-emerald-950/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-lg flex items-center justify-center shadow-lg shadow-gold-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
             </div>
             <h1 className="text-2xl font-serif font-bold tracking-tight text-white">Noor<span className="text-gold-400">Clips</span></h1>
          </div>
          <div className="text-emerald-400 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            AI Powered
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Input Section - Only show if not complete or allowed to regenerate */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-emerald-900/30 p-6 rounded-2xl border border-emerald-800 shadow-xl">
            <div className="md:col-span-5 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-emerald-300 mb-2">Quran Topic or Surah</label>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Surah Al-Mulk, Patience, Forgiveness"
                        className="w-full bg-emerald-950 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-600 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
                        disabled={status === GenerationStatus.GENERATING_PROMPTS || status === GenerationStatus.GENERATING_VIDEO}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-emerald-300 mb-2">Visual Style</label>
                    <div className="grid grid-cols-2 gap-2">
                        {styles.map(s => (
                            <button 
                                key={s}
                                onClick={() => setStyle(s)}
                                className={`text-xs p-2 rounded border transition-all ${style === s ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-emerald-950/50 border-emerald-800 text-emerald-400 hover:bg-emerald-900'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-end">
                {status === GenerationStatus.FAILED && (
                    <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                        Error: {error}
                    </div>
                )}
                
                {status !== GenerationStatus.IDLE && status !== GenerationStatus.COMPLETED && status !== GenerationStatus.FAILED ? (
                    <div className="bg-emerald-950 rounded-lg p-6 border border-emerald-800 h-full flex flex-col items-center justify-center text-center">
                         <div className="w-12 h-12 border-4 border-emerald-800 border-t-gold-500 rounded-full animate-spin mb-4"></div>
                         <h3 className="text-lg font-medium text-white">
                             {status === GenerationStatus.GENERATING_PROMPTS && "Consulting Gemini for Scripts..."}
                             {status === GenerationStatus.GENERATING_VIDEO && "Dreaming up visuals with Veo..."}
                         </h3>
                         <p className="text-sm text-emerald-400 mt-2 max-w-sm">
                             Generating 1080p video frames. This usually takes about 30-60 seconds.
                         </p>
                    </div>
                ) : (
                    <div className="h-full flex items-end">
                         <Button 
                            onClick={handleGenerate} 
                            disabled={!apiKeyReady || !topic} 
                            className="w-full py-4 text-lg font-bold shadow-lg shadow-emerald-900/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            Generate Short Video
                        </Button>
                    </div>
                )}
            </div>
        </div>

        {/* Results Section */}
        {status === GenerationStatus.COMPLETED && videoUrl && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <VideoResult videoUrl={videoUrl} metadata={metadata} />
            </div>
        )}
        
        {/* Placeholder / Empty State */}
        {status === GenerationStatus.IDLE && (
            <div className="text-center py-20 opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-emerald-600"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="3" y2="21"/><path d="M7.5 3v18"/><path d="M16.5 3v18"/><path d="M3 7.5h18"/><path d="M3 16.5h18"/></svg>
                <h2 className="text-2xl font-serif text-emerald-300">Ready to Create</h2>
                <p className="max-w-md mx-auto mt-2 text-emerald-500">Enter a Surah or Topic above to generate a unique, copyright-free video background optimized for YouTube Shorts.</p>
            </div>
        )}

      </main>
    </div>
  );
}