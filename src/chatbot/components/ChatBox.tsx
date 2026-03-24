import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Camera, X, Plus, Settings, MapPin, ClipboardCheck, Sparkles, FileText, Database } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { FieldSettingsModal } from './FieldSettingsModal';
import { DiagnosisModal } from './DiagnosisModal';
import { AdvisoryModal } from './AdvisoryModal';
import { AnimatePresence, motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { FiCamera, FiX, FiRefreshCw, FiCheck } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

interface ChatBoxProps {
  onNavigateToUserData: () => void;
  onClose?: () => void;
  initialMessage?: string; // Ensure this is inside the interface
  startWithCamera?: boolean;
} 

export const ChatBox = ({ onNavigateToUserData, onClose, initialMessage, startWithCamera }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'नमस्कार 🙏\nतात्या बोलतोय. काय मदत करू?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState(false);
  
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasSentInitial = useRef(false);

  const [fieldSettings, setFieldSettings] = useState({
    location: '',
    crop: '',
    plantingDate: ''
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const genericFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const isEmpty = !fieldSettings.location || !fieldSettings.crop || !fieldSettings.plantingDate;
    if (isEmpty && !isSettingsOpen && !isDiagnosisOpen && !isAdvisoryOpen) {
      const timer = setTimeout(() => setIsSettingsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [fieldSettings, isDiagnosisOpen, isAdvisoryOpen]);

  useEffect(() => {
  // Only run if there is a message AND we haven't sent it yet
    if (initialMessage && initialMessage.trim() !== "" && !hasSentInitial.current) {
      handleSend(initialMessage);
      hasSentInitial.current = true; 
    }
  }, [initialMessage]);

  useEffect(() => {
    if (startWithCamera) {
      startCamera();
    }
  }, [startWithCamera]);

  const startCamera = async () => {
    setIsPlusMenuOpen(false);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setShowCamera(false);
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const usePhoto = () => {
    if (capturedImage) {
      setSelectedImage(capturedImage);
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsPlusMenuOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentClick = (mode: 'camera' | 'gallery') => {
    if (mode === 'camera') {
      startCamera();
    } else if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
      setIsPlusMenuOpen(false);
    }
  };

  const handleSend = async (overrideMessage?: string, additionalContext?: any) => {
    if ((!input.trim() && !selectedImage && !overrideMessage) || loading) return;
    const userMessage = overrideMessage || input.trim();
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage || (currentImage ? "Analyze this image." : ""), 
      image: currentImage || undefined 
    }]);
    setLoading(true);
    try {
      let imagePayload;
      if (currentImage) {
        imagePayload = {
          data: currentImage.split(',')[1],
          mimeType: currentImage.split(';')[0].split(':')[1]
        };
      }
      const combinedContext = { ...fieldSettings, ...(additionalContext || {}) };
      const response = await chatWithAssistant(userMessage || "Analyze this image.", imagePayload, combinedContext);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'काय तरी चुकलंय. पुन्हा प्रयत्न कर.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startDiagnosis = (data: any) => {
    setIsDiagnosisOpen(false);
    const msg = `DIAGNOSIS REQUEST: Symptoms: ${data.symptoms}, Duration: ${data.duration}, Affected Part: ${data.affectedPart}, Previous Treatments: ${data.previousTreatments}`;
    handleSend(msg);
  };

  const startAdvisory = (data: any) => {
    setIsAdvisoryOpen(false);
    const msg = `ADVISORY REQUEST: Soil: ${data.soilType}, Water: ${data.waterSource}, Stage: ${data.currentStage}, Goal: ${data.specificGoal}`;
    handleSend(msg);
  };

  return (
    <div 
      className="flex flex-col h-[750px] rounded-[2.5rem] overflow-hidden relative"
      style={{ 
        backgroundColor: '#FCFCFB', // The beautiful Earth Cream Background
        border: '1px solid #EDEDE7',
        boxShadow: '0 20px 80px -15px rgba(0, 0, 0, 0.15)'
      }}
    >
      {showCamera && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '360px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111' }}>शेत स्थान कॅप्चर करा</h3>
              <button onClick={stopCamera} style={{ color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', backgroundColor: '#000' }}>
              {capturedImage ? (
                <div style={{ width: '100%', height: '100%' }}>
                  <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 15, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button onClick={() => setCapturedImage(null)} style={{ padding: '8px 16px', backgroundColor: '#333', color: 'white', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', border: 'none' }}>
                      <FiRefreshCw /> Retake
                    </button>
                    <button onClick={usePhoto} style={{ padding: '8px 16px', backgroundColor: '#546c43', color: 'white', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', border: 'none' }}>
                      <FiCheck /> Use Photo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 15, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                    <button onClick={capturePhoto} style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                       <div style={{ width: '46px', height: '46px', borderRadius: '50%', border: '2px solid #546c43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiCamera style={{ color: '#546c43' }} size={24} />
                       </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div 
        className="p-5 border-b flex items-center justify-between z-10" 
        style={{ backgroundColor: '#FCFCFB', borderBottom: '1px solid #EDEDE7' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: '#546c43' }}>
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg" style={{ color: '#546c43' }}>तात्या (Tatya)</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#546c43' }}></span>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#546c43' }}>शेती तज्ज्ञ</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={onNavigateToUserData} className="p-3 hover:bg-leaf-100 rounded-2xl transition-all" style={{ color: '#546c43' }}><Database size={22} /></button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-3 hover:bg-earth-100 rounded-2xl transition-all" style={{ color: '#826554' }}><Settings size={22} /></button>
          <button onClick={onClose} className="p-3 hover:bg-red-50 rounded-2xl transition-all" style={{ color: '#D1D1CB' }}><X size={22} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth" style={{ backgroundColor: '#FCFCFB' }}>
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-4 max-w-[90%] md:max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
            <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm")} style={{ backgroundColor: msg.role === 'user' ? '#546c43' : '#F1F1E8', color: msg.role === 'user' ? 'white' : '#546c43' }}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={cn("p-5 rounded-[1.5rem] shadow-sm leading-relaxed border")} style={{
                backgroundColor: msg.role === 'user' ? '#F9FAF6' : '#FFFFFF',
                border: `1px solid ${msg.role === 'user' ? '#F1F1E8' : '#EDEDE7'}`,
                borderRadius: msg.role === 'user' ? '1.5rem 0 1.5rem 1.5rem' : '0 1.5rem 1.5rem 1.5rem',
                color: '#1f2937',
                boxShadow: '0 2px 5px -1px rgba(0, 0, 0, 0.05)'
            }}>
              {msg.image && <img src={msg.image} alt="User upload" className="max-w-full rounded-xl mb-4 border shadow-sm" style={{ borderColor: '#EDEDE7' }} />}
              <div className="markdown-body"><Markdown>{msg.content}</Markdown></div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 mr-auto animate-pulse">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F1F1E8', color: '#546c43' }}><Bot size={18} /></div>
            <div className="bg-white border p-5 rounded-[1.5rem] rounded-tl-none shadow-sm" style={{ border: '1px solid #EDEDE7' }}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#546c43' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: '#546c43' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: '#546c43' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F9FAF6' }}>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative flex items-end gap-3 p-2 rounded-[2rem] border transition-all" style={{ backgroundColor: '#F9FAF6', border: '1px solid #F1F1E8' }}>
            <div className="relative">
              <button onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)} className={cn("p-3 rounded-full transition-all duration-300", isPlusMenuOpen ? "text-white rotate-45" : "text-gray-400")} style={isPlusMenuOpen ? {backgroundColor: '#546c43'} : {}}>
                <Plus size={24} />
              </button>
              
              <AnimatePresence>
                {isPlusMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                    className="absolute bottom-16 left-0 bg-white border p-3 min-w-[210px] space-y-1 z-50 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)] rounded-[1.5rem]"
                    style={{ borderColor: '#EDEDE7' }}>
                    <button onClick={() => handleAttachmentClick('camera')} className="w-full flex items-center gap-4 p-3 hover:bg-earth-50 rounded-2xl transition-colors">
                      <Camera size={20} className="shrink-0" style={{ color: '#546c43' }} /> {/* Earthy Brown Bronze */}
                      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#826554' }}>कॅमेरा उघडा</span>
                    </button>
                    <button onClick={() => handleAttachmentClick('gallery')} className="w-full flex items-center gap-4 p-3 hover:bg-earth-50 rounded-2xl transition-colors">
                      <ImageIconBronze size={20} className="shrink-0" /> {/* Earthy Brown Bronze */}
                      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#826554' }}>फोटो अपलोड करा</span>
                    </button>
                    <button onClick={() => genericFileInputRef.current?.click()} className="w-full flex items-center gap-4 p-3 hover:bg-earth-50 rounded-2xl transition-colors">
                      <FileText size={20} className="shrink-0" style={{ color: '#546c43' }} /> {/* Earthy Brown Bronze */}
                      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#826554' }}>फाईल्स जोडा</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="तात्याला काहीतरी गंभीर विचारा..." className="flex-1 bg-transparent border-none outline-none p-3 resize-none max-h-32 min-h-[48px] font-medium" style={{ color: '#1f2937' }} rows={1} />
            
            <button onClick={() => handleSend()} disabled={(!input.trim() && !selectedImage) || loading} className="p-3 text-white rounded-full transition-all disabled:opacity-30" style={{ backgroundColor: '#546c43' }}>
              <Send size={24} />
            </button>
          </div>

          <div className="flex items-center justify-start gap-2 overflow-x-auto pb-4 px-4 no-scrollbar">
            <button onClick={() => setIsDiagnosisOpen(true)} className="whitespace-nowrap flex items-center shrink-0 gap-2 px-3 py-2 border rounded-full text-[11px] font-bold text-white shadow-md" style={{ backgroundColor: '#546c43', borderColor: '#435637' }}>
              <Sparkles size={16} /> निदान मोड (Diagnosis)
            </button>
            <button onClick={() => setIsAdvisoryOpen(true)} className="whitespace-nowrap flex items-center shrink-0 gap-2 px-3 py-2 border rounded-full text-[11px] font-bold text-white shadow-md" style={{ backgroundColor: '#4F46E5', borderColor: '#4338ca' }}>
              <ClipboardCheck size={16} /> सल्लागार मोड (Advisory)
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="whitespace-nowrap flex items-center shrink-0 gap-2 px-3 py-2 bg-white border rounded-full text-[11px] font-bold shadow-sm" style={{ borderColor: '#F1F1E8', color: '#6B7280' }}>
              <MapPin size={18} style={{ color: '#546c43' }} /> क्षेत्र माहिती
            </button>
          </div>
        </div>
      </div>

      <FieldSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={fieldSettings} onSave={setFieldSettings} />
      <DiagnosisModal isOpen={isDiagnosisOpen} onClose={() => setIsDiagnosisOpen(false)} onStartDiagnosis={startDiagnosis} />
      <AdvisoryModal isOpen={isAdvisoryOpen} onClose={() => setIsAdvisoryOpen(false)} onStartAdvisory={startAdvisory} />
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <input type="file" ref={genericFileInputRef} onChange={() => setIsPlusMenuOpen(false)} className="hidden" />
    </div>
  );
};

// Helper for Bronze Gallery Icon
const ImageIconBronze = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#546c43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

export default ChatBox;