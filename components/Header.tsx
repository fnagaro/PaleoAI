import React from 'react';
import { ScrollText, Feather } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-stone-900 text-stone-100 p-4 shadow-lg border-b border-stone-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-700 rounded-lg">
            <ScrollText className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-wide text-amber-50">
              PaleoAI
            </h1>
            <p className="text-xs text-stone-400 font-light tracking-wider uppercase">
              Archivo de Indias Transcriber
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 text-sm text-stone-400">
          <span className="flex items-center">
            <Feather className="w-4 h-4 mr-2" />
            Powered by Gemini 3.0 Pro
          </span>
        </div>
      </div>
    </header>
  );
};