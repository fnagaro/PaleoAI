import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Copy, Download, RefreshCw, Maximize2, Minimize2, Columns, Image as ImageIcon, FileText } from 'lucide-react';
import { ViewMode } from '../types';
import ReactMarkdown from 'react-markdown';

interface ResultViewProps {
  imageSrc: string;
  transcription: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ imageSrc, transcription, onReset }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  
  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    // Could add toast notification here
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([transcription], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-2">
          <button onClick={onReset} className="flex items-center px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            New Upload
          </button>
          <div className="h-6 w-px bg-stone-300 mx-2"></div>
          
          <div className="flex bg-stone-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode(ViewMode.SPLIT)}
              className={`p-1.5 rounded-md transition-colors ${viewMode === ViewMode.SPLIT ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              title="Split View"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.IMAGE_ONLY)}
              className={`p-1.5 rounded-md transition-colors ${viewMode === ViewMode.IMAGE_ONLY ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              title="Image Only"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.TEXT_ONLY)}
              className={`p-1.5 rounded-md transition-colors ${viewMode === ViewMode.TEXT_ONLY ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              title="Text Only"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
           {viewMode !== ViewMode.TEXT_ONLY && (
            <div className="flex items-center bg-stone-100 rounded-md px-2 py-1 space-x-2 mr-2">
              <button onClick={handleZoomOut} className="p-1 text-stone-500 hover:text-stone-900"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-xs text-stone-500 font-mono w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={handleZoomIn} className="p-1 text-stone-500 hover:text-stone-900"><ZoomIn className="w-4 h-4" /></button>
            </div>
           )}
          <button onClick={handleCopy} className="p-2 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors" title="Copy Text">
            <Copy className="w-5 h-5" />
          </button>
          <button onClick={handleDownload} className="p-2 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors" title="Download Text">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex relative bg-stone-100">
        
        {/* Image Panel */}
        {viewMode !== ViewMode.TEXT_ONLY && (
          <div className={`${viewMode === ViewMode.SPLIT ? 'w-1/2 border-r border-stone-200' : 'w-full'} h-full relative overflow-auto bg-stone-200/50 flex items-center justify-center p-4`}>
            <div 
              style={{ 
                transform: `scale(${zoomLevel})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.1s ease-out'
              }}
              className="shadow-2xl"
            >
              <img src={imageSrc} alt="Manuscript" className="max-w-full h-auto object-contain" />
            </div>
          </div>
        )}

        {/* Text Panel */}
        {viewMode !== ViewMode.IMAGE_ONLY && (
          <div className={`${viewMode === ViewMode.SPLIT ? 'w-1/2' : 'w-full'} h-full bg-white overflow-y-auto`}>
            <div className="max-w-3xl mx-auto p-8 md:p-12">
              <div className="prose prose-stone prose-lg font-serif-old leading-relaxed text-stone-800">
                <ReactMarkdown>{transcription}</ReactMarkdown>
              </div>
              
              <div className="mt-12 pt-8 border-t border-stone-100 text-center">
                 <p className="text-xs text-stone-400 uppercase tracking-widest">End of Transcription</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};