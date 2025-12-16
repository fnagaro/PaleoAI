import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, BookOpen } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onDemoSelect: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, onDemoSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const validateAndPassFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert("Please upload an image file (JPG, PNG, WEBP).");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 animate-fade-in">
      <div 
        className={`
          w-full max-w-2xl p-12 rounded-3xl border-4 border-dashed transition-all duration-300
          flex flex-col items-center text-center cursor-pointer bg-white shadow-xl
          ${isDragging 
            ? 'border-amber-500 bg-amber-50 scale-[1.02]' 
            : 'border-stone-300 hover:border-amber-400 hover:shadow-2xl'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-400">
          <UploadCloud className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-stone-800 mb-2">
          Upload Manuscript
        </h2>
        <p className="text-stone-500 mb-8 max-w-md">
          Drag and drop your historical document image here, or click to browse.
          Supported formats: JPG, PNG, WEBP.
        </p>

        <button className="px-8 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors shadow-lg flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Select Image
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileInput}
        />
      </div>

      <div className="mt-8 flex flex-col items-center">
        <p className="text-stone-400 text-sm mb-4 font-medium uppercase tracking-widest">Or try an example</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDemoSelect();
          }}
          className="group flex items-center px-6 py-3 bg-white border border-stone-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all text-stone-600 hover:text-amber-700"
        >
          <BookOpen className="w-5 h-5 mr-3 text-stone-400 group-hover:text-amber-600" />
          <span className="font-serif-old italic">Load "Carta de Indias 1543" Demo</span>
        </button>
      </div>
    </div>
  );
};