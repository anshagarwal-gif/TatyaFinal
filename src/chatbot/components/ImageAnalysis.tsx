import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Send } from 'lucide-react';
import { analyzeCropIssue } from '../services/geminiService';
import Markdown from 'react-markdown';

export const ImageAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const analysis = await analyzeCropIssue(base64Data, mimeType);
      setResult(analysis);
    } catch (error) {
      console.error(error);
      setResult("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-earth-200">
        <h2 className="text-2xl font-serif text-leaf-800 mb-4">Diagnose Crop Issue</h2>
        <p className="text-earth-600 mb-6">Upload a clear photo of the affected plant part (leaves, stem, fruit) for AI diagnosis.</p>
        
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-earth-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-earth-50 transition-colors"
          >
            <div className="w-16 h-16 bg-leaf-100 rounded-full flex items-center justify-center mb-4">
              <Camera className="text-leaf-600 w-8 h-8" />
            </div>
            <p className="text-earth-700 font-medium">Click to take a photo or upload</p>
            <p className="text-earth-400 text-sm mt-1">PNG, JPG up to 10MB</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-earth-100">
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <X size={20} />
              </button>
            </div>
            
            {!result && (
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-4 bg-leaf-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-leaf-700 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {loading ? "Analyzing..." : "Analyze Image"}
              </button>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-earth-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="markdown-body">
            <Markdown>{result}</Markdown>
          </div>
          <button 
            onClick={() => { setImage(null); setResult(null); }}
            className="mt-8 text-leaf-600 font-semibold hover:underline"
          >
            Analyze another photo
          </button>
        </div>
      )}
    </div>
  );
};
