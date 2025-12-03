import React, { useState } from 'react';
import { VideoMetadata, UploadStatus } from '../types';
import { Button } from './Button';

interface VideoResultProps {
  videoUrl: string;
  metadata: VideoMetadata | null;
}

export const VideoResult: React.FC<VideoResultProps> = ({ videoUrl, metadata }) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.IDLE);

  const handleUpload = () => {
    // This simulates the upload process
    setUploadStatus(UploadStatus.CONNECTING);
    
    setTimeout(() => {
        setUploadStatus(UploadStatus.UPLOADING);
        setTimeout(() => {
            setUploadStatus(UploadStatus.SUCCESS);
        }, 3000);
    }, 1500);
  };

  const resetUpload = () => {
    setUploadStatus(UploadStatus.IDLE);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Video Preview Column */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black/40 rounded-xl border border-emerald-800 p-4">
        <h3 className="text-emerald-400 font-serif mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
            Generated Short
        </h3>
        <div className="relative aspect-[9/16] w-full max-w-sm rounded-lg overflow-hidden shadow-2xl border-4 border-emerald-900 bg-black">
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            loop 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-4 flex gap-3">
             <a href={videoUrl} download="quran-short.mp4" className="inline-flex">
                <Button variant="secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download MP4
                </Button>
             </a>
        </div>
      </div>

      {/* Metadata & Upload Column */}
      <div className="flex-1 bg-emerald-900/20 rounded-xl border border-emerald-800 p-6 flex flex-col gap-6 overflow-y-auto">
        
        {uploadStatus === UploadStatus.SUCCESS ? (
             <div className="bg-green-900/50 border border-green-600 rounded-lg p-8 text-center animate-pulse">
                <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Upload Successful!</h3>
                <p className="text-emerald-200 mb-6">Your Quran Short has been pushed to your YouTube channel queue.</p>
                <Button onClick={resetUpload} variant="secondary">Upload Another</Button>
            </div>
        ) : uploadStatus === UploadStatus.CONNECTING || uploadStatus === UploadStatus.UPLOADING ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-emerald-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="red" stroke="currentColor" strokeWidth="0"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.04 29.04 0 0 0 1 11.75a29.05 29.05 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29.04 29.04 0 0 0 .46-5.25 29.05 29.05 0 0 0-.46-5.33z"/><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white">
                    {uploadStatus === UploadStatus.CONNECTING ? "Connecting to YouTube..." : "Uploading Video..."}
                </h3>
                <p className="text-emerald-400 text-sm mt-2">Please do not close this tab.</p>
            </div>
        ) : (
            <>
                <div>
                    <h3 className="text-gold-400 text-sm uppercase tracking-wider font-semibold mb-2">Title</h3>
                    <div className="bg-emerald-950/50 p-3 rounded border border-emerald-800 text-lg font-medium">
                        {metadata?.title || "..."}
                    </div>
                </div>

                <div>
                    <h3 className="text-gold-400 text-sm uppercase tracking-wider font-semibold mb-2">Description</h3>
                    <div className="bg-emerald-950/50 p-3 rounded border border-emerald-800 text-emerald-100 whitespace-pre-wrap h-32 overflow-y-auto text-sm">
                        {metadata?.description || "..."}
                    </div>
                </div>
                
                {metadata?.quranTranslation && (
                     <div>
                        <h3 className="text-gold-400 text-sm uppercase tracking-wider font-semibold mb-2">Quran Verse</h3>
                        <div className="bg-emerald-900/30 p-4 rounded-r-lg border-l-4 border-gold-500 italic text-emerald-100 font-serif text-lg">
                            "{metadata.quranTranslation}"
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-gold-400 text-sm uppercase tracking-wider font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {metadata?.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-800 text-emerald-200 text-xs rounded-full">#{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-emerald-800">
                    <p className="text-xs text-emerald-500 mb-4 italic text-center">
                        *Automated uploads require backend OAuth authentication. This button simulates the workflow for demonstration.*
                    </p>
                    <Button variant="youtube" onClick={handleUpload} className="w-full justify-center py-4 text-lg font-bold tracking-wide">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.04 29.04 0 0 0 1 11.75a29.05 29.05 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29.04 29.04 0 0 0 .46-5.25 29.05 29.05 0 0 0-.46-5.33z"/><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                        Auto-Push to YouTube
                    </Button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};