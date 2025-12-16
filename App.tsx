import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ResultView } from './components/ResultView';
import { TranscriptionState } from './types';
import { fileToBase64, transcribeImage } from './services/geminiService';
import { Loader2 } from 'lucide-react';

// A placeholder base64 string or URL for the demo could be fetched, 
// but for this example we will fetch the image from the user's prompt URL and convert to blob.
const DEMO_IMAGE_URL = "https://picsum.photos/seed/manuscript/800/1000"; // Fallback if fetch fails, but logic below tries real URL

const App: React.FC = () => {
  const [fileData, setFileData] = useState<{ url: string; base64: string; mimeType: string } | null>(null);
  const [transcriptionState, setTranscriptionState] = useState<TranscriptionState>({
    status: 'idle',
    text: null,
    error: null,
  });

  const handleProcessImage = async (base64: string, mimeType: string, previewUrl: string) => {
    setFileData({ url: previewUrl, base64, mimeType });
    setTranscriptionState({ status: 'analyzing', text: null, error: null });

    try {
      const text = await transcribeImage({ base64Image: base64, mimeType });
      setTranscriptionState({ status: 'success', text: text, error: null });
    } catch (err: any) {
        let errorMessage = "An unexpected error occurred.";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        // Handle specific Gemini error structure if needed
      setTranscriptionState({ status: 'error', text: null, error: errorMessage });
    }
  };

  const onFileSelect = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const url = URL.createObjectURL(file);
      handleProcessImage(base64, file.type, url);
    } catch (e) {
      alert("Error processing file");
    }
  };

  const onDemoSelect = async () => {
    setTranscriptionState({ status: 'uploading', text: null, error: null });
    try {
        // Fetching the image provided in the prompt context to use as demo
        // Note: In a real CORS restricted environment this might fail, but for the demo logic:
        const response = await fetch("https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Carta_de_Juan_de_la_Cosa.jpg/800px-Carta_de_Juan_de_la_Cosa.jpg"); 
        // Using a Wikimedia commons historical map/letter as a reliable fallback or the actual URL if possible
        
        const blob = await response.blob();
        const base64 = await fileToBase64(new File([blob], "demo.jpg", { type: blob.type }));
        const url = URL.createObjectURL(blob);
        handleProcessImage(base64, blob.type, url);
    } catch (e) {
        console.error("Demo load failed", e);
        setTranscriptionState({ status: 'error', text: null, error: "Failed to load demo image. Please upload your own." });
    }
  };

  const handleReset = () => {
    setFileData(null);
    setTranscriptionState({ status: 'idle', text: null, error: null });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      
      <main className="flex-1">
        {transcriptionState.status === 'idle' && (
          <UploadZone onFileSelect={onFileSelect} onDemoSelect={onDemoSelect} />
        )}

        {(transcriptionState.status === 'uploading' || transcriptionState.status === 'analyzing') && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
             <div className="relative">
                <div className="absolute inset-0 bg-amber-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm text-center border border-stone-100">
                    <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
                    <h3 className="text-xl font-display font-bold text-stone-800 mb-2">
                        {transcriptionState.status === 'uploading' ? 'Preparing Image...' : 'Deciphering Text...'}
                    </h3>
                    <p className="text-stone-500 text-sm">
                        Consulting the digital archives and analyzing paleography patterns using Gemini 3.0 Pro.
                    </p>
                </div>
             </div>
          </div>
        )}

        {transcriptionState.status === 'error' && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-lg text-center">
                <h3 className="text-xl font-bold text-red-800 mb-2">Transcription Failed</h3>
                <p className="text-red-600 mb-6">{transcriptionState.error}</p>
                <button 
                    onClick={handleReset}
                    className="px-6 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Try Again
                </button>
            </div>
          </div>
        )}

        {transcriptionState.status === 'success' && fileData && transcriptionState.text && (
          <ResultView 
            imageSrc={fileData.url} 
            transcription={transcriptionState.text} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;