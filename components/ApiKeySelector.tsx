import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState(false);

  const checkKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const selected = await aistudio.hasSelectedApiKey();
      setHasKey(selected);
      if (selected) {
        onKeySelected();
      }
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      try {
        await aistudio.openSelectKey();
        // Assume success to avoid race conditions as per instructions
        setHasKey(true);
        onKeySelected();
      } catch (e) {
        console.error("Key selection failed", e);
        alert("Failed to select key. Please try again.");
      }
    } else {
      alert("AI Studio environment not detected.");
    }
  };

  if (hasKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/90 backdrop-blur-sm p-4">
      <div className="bg-emerald-900 border border-emerald-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Unlock Video Creation</h2>
        <p className="text-emerald-200 mb-6">
          To generate high-quality AI videos with Google Veo, you need to select a paid API key connected to a Google Cloud Project.
        </p>
        <Button onClick={handleSelectKey} className="w-full justify-center py-3 text-lg">
          Select API Key
        </Button>
        <p className="mt-4 text-xs text-emerald-400">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-300">
            Learn more about Gemini API billing
          </a>
        </p>
      </div>
    </div>
  );
};