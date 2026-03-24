import React, { useState } from 'react';
import { X, Camera, Upload, FileText, Send, Info } from 'lucide-react';

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDiagnosis: (data: any) => void;
}

export const DiagnosisModal = ({ isOpen, onClose, onStartDiagnosis }: DiagnosisModalProps) => {
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
    affectedPart: 'Leaves',
    previousTreatments: '',
    soilMoisture: 'Normal'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-leaf-100">
        <div className="p-8 border-b border-earth-100 flex items-center justify-between bg-leaf-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Camera size={24} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl">पीक निदान (Diagnosis)</h3>
              <p className="text-leaf-100 text-xs font-medium uppercase tracking-widest">क्षेत्र विश्लेषण मोड</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="bg-leaf-50 p-4 rounded-2xl border border-leaf-100 flex gap-3 items-start">
            <Info className="text-leaf-600 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-leaf-800 leading-relaxed">
              तात्याला अचूक माहिती द्या म्हणजे तो तुम्हाला योग्य उपाय सांगेल.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-earth-500 uppercase tracking-wider">काय लक्षणं दिसत आहेत? (Symptoms)</label>
            <textarea 
              value={formData.symptoms}
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              placeholder="उदा. पानांवर पिवळे ठिपके, वाळलेली खोडं..."
              className="w-full p-4 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-leaf-500 outline-none min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-500 uppercase tracking-wider">किती दिवसांपासून? (Duration)</label>
              <input 
                type="text" 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="उदा. २-३ दिवस"
                className="w-full p-4 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-leaf-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-500 uppercase tracking-wider">बाधित भाग (Affected Part)</label>
              <select 
                value={formData.affectedPart}
                onChange={(e) => setFormData({...formData, affectedPart: e.target.value})}
                className="w-full p-4 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-leaf-500 outline-none"
              >
                <option value="Leaves">पाने (Leaves)</option>
                <option value="Stem">खोड (Stem)</option>
                <option value="Roots">मुळे (Roots)</option>
                <option value="Fruit/Flower">फळ/फूल (Fruit/Flower)</option>
                <option value="Whole Plant">पूर्ण रोप (Whole Plant)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-earth-500 uppercase tracking-wider">आधी काही फवारणी केली का? (Previous Treatments)</label>
            <input 
              type="text" 
              value={formData.previousTreatments}
              onChange={(e) => setFormData({...formData, previousTreatments: e.target.value})}
              placeholder="औषधाचे नाव किंवा खत"
              className="w-full p-4 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-leaf-500 outline-none"
            />
          </div>
        </div>

        <div className="p-8 bg-earth-50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 border border-earth-200 text-earth-600 font-bold rounded-2xl hover:bg-white transition-all active:scale-95"
          >
            रद्द करा (Cancel)
          </button>
          <button 
            onClick={() => onStartDiagnosis(formData)}
            className="flex-[2] py-4 bg-leaf-600 text-white font-bold rounded-2xl hover:bg-leaf-700 shadow-lg shadow-leaf-200 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Send size={20} /> निदान सुरू करा (Start)
          </button>
        </div>
      </div>
    </div>
  );
};
