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
    <div className="chatbot-container">
      {showCamera && (
        <div className="camera-overlay">
          <div className="camera-modal">
            <div className="camera-modal-header">
              <h3 className="camera-modal-title">शेत स्थान कॅप्चर करा</h3>
              <button onClick={stopCamera} className="camera-modal-close"><FiX size={24} /></button>
            </div>
            <div className="camera-video-container">
              {capturedImage ? (
                <div style={{ width: '100%', height: '100%' }}>
                  <img src={capturedImage} alt="Captured" className="camera-video" />
                  <div className="camera-button-group">
                    <button onClick={() => setCapturedImage(null)} className="camera-retake-button">
                      <FiRefreshCw /> Retake
                    </button>
                    <button onClick={usePhoto} className="camera-use-button">
                      <FiCheck /> Use Photo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline className="camera-video" />
                  <div className="camera-button-group">
                    <button onClick={capturePhoto} className="camera-capture-button">
                       <div className="camera-capture-inner">
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
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <div className="chatbot-avatar">
            <Bot size={24} />
          </div>
          <div className="chatbot-header-text">
            <h3 className="chatbot-header-title">तात्या (Tatya)</h3>
            <span className="chatbot-header-subtitle">शेती तज्ज्ञ</span>
          </div>
        </div>
        
        <div className="chatbot-header-actions">
          <button onClick={onNavigateToUserData} className="chatbot-header-icon-button database" aria-label="Open saved data">
            <Database size={22} />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="chatbot-header-icon-button settings" aria-label="Open settings">
            <Settings size={22} />
          </button>
          <button onClick={onClose} className="chatbot-header-icon-button close" aria-label="Close chatbot">
            <X size={22} strokeWidth={2.1} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={cn("message-row", msg.role === 'user' && "user")}>
            <div className={cn("message-avatar", msg.role === 'user' ? "user" : "assistant")}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={cn("message-bubble", msg.role === 'user' ? "user" : "assistant")}>
              {msg.image && <img src={msg.image} alt="User upload" className="message-image" />}
              <div className="markdown-body"><Markdown>{msg.content}</Markdown></div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 mr-auto animate-pulse">
            <div className="message-avatar assistant"><Bot size={18} /></div>
            <div style={{ paddingTop: '0.5rem' }}>
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chatbot-input-section">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="chatbot-input-wrapper relative">
            <div className="relative">
              <button onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)} className={cn("chatbot-plus-button", isPlusMenuOpen && "active")}>
                <Plus size={24} />
              </button>
              
              <AnimatePresence>
                {isPlusMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                    className="plus-menu-modal">
                    <button onClick={() => handleAttachmentClick('camera')} className="menu-action-item">
                      <Camera size={20} className="menu-action-item-icon" />
                      <span className="menu-action-item-text">कॅमेरा उघडा</span>
                    </button>
                    <button onClick={() => handleAttachmentClick('gallery')} className="menu-action-item">
                      <ImageIconBronze size={20} className="menu-action-item-icon" />
                      <span className="menu-action-item-text">फोटो अपलोड करा</span>
                    </button>
                    <button onClick={() => genericFileInputRef.current?.click()} className="menu-action-item">
                      <FileText size={20} className="menu-action-item-icon" />
                      <span className="menu-action-item-text">फाईल्स जोडा</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="तात्याला काहीतरी गंभीर विचारा..." className="chatbot-textarea" rows={1} />
            
            <button onClick={() => handleSend()} disabled={(!input.trim() && !selectedImage) || loading} className="chatbot-send-button">
              <Send size={24} />
            </button>
          </div>

          <div className="buttons-horizontal-scroll">
            <button onClick={() => setIsDiagnosisOpen(true)} className="quick-action-button quick-action-diagnosis">
              <Sparkles size={16} /> निदान मोड (Diagnosis)
            </button>
            <button onClick={() => setIsAdvisoryOpen(true)} className="quick-action-button quick-action-advisory">
              <ClipboardCheck size={16} /> सल्लागार मोड (Advisory)
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="quick-action-button quick-action-settings">
              <MapPin size={18} style={{ color: '#546c43' }} /> क्षेत्र माहिती
            </button>
          </div>
        </div>
      </div>

      <FieldSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={fieldSettings} onSave={setFieldSettings} />
      <DiagnosisModal isOpen={isDiagnosisOpen} onClose={() => setIsDiagnosisOpen(false)} onStartDiagnosis={startDiagnosis} />
      <AdvisoryModal isOpen={isAdvisoryOpen} onClose={() => setIsAdvisoryOpen(false)} onStartAdvisory={startAdvisory} />
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
      <input type="file" ref={genericFileInputRef} onChange={() => setIsPlusMenuOpen(false)} style={{ display: 'none' }} />
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
