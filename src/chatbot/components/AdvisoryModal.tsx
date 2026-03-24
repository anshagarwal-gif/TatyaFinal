import React, { useState } from 'react';
import { X, ClipboardCheck, Thermometer, Droplets, Wind, Send, Info, CloudRain } from 'lucide-react';

interface AdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAdvisory: (data: any) => void;
}

export const AdvisoryModal = ({ isOpen, onClose, onStartAdvisory }: AdvisoryModalProps) => {
  const [formData, setFormData] = useState({
    soilType: 'Black Soil',
    waterSource: 'Well',
    currentStage: 'Vegetative',
    budget: '',
    specificGoal: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-indigo-100">
        <div className="p-8 border-b border-earth-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl">स्मार्ट सल्ला (Advisory)</h3>
              <p className="text-indigo-100 text-xs font-medium uppercase tracking-widest">नियोजन मोड</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex gap-3 items-start">
            <Info className="text-indigo-600 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-indigo-800 leading-relaxed">
              तुमच्या शेतीचं नियोजन तात्याकडून करून घ्या.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-500 uppercase tracking-wider">जमिनीचा प्रकार (Soil Type)</label>
              <select 
                value={formData.soilType}
                onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                className="w-full p-4 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Black Soil">काळी माती (Black Soil)</option>
                <option value="Red Soil">लाल माती (Red Soil)</option>
                <option value="Sandy Soil">रेताड माती (Sandy Soil)</option>
                <option value="Clay">चिकन माती (Clay)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-500 uppercase tracking-wider">पाण्याचा स्रोत (Water Source)</label>
              <select 
                value={formData.waterSource}
                onChange={(e) => setFormData({...formData, waterSource: e.target.value})}
                className="w-full p-4 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Well">विहीर (Well)</option>
                <option value="Borewell">बोअरवेल (Borewell)</option>
                <option value="River/Canal">नदी/कालवा (River/Canal)</option>
                <option value="Rainfed">पावसावर अवलंबून (Rainfed)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-earth-500 uppercase tracking-wider">पिकाची सद्यस्थिती (Current Stage)</label>
            <select 
              value={formData.currentStage}
              onChange={(e) => setFormData({...formData, currentStage: e.target.value})}
              className="w-full p-4 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Sowing">पेरणी (Sowing)</option>
              <option value="Vegetative">वाढीची अवस्था (Vegetative)</option>
              <option value="Flowering">फुलोरा (Flowering)</option>
              <option value="Fruiting">फळधारणा (Fruiting)</option>
              <option value="Harvesting">काढणी (Harvesting)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-earth-500 uppercase tracking-wider">काय सल्ला हवा आहे? (Specific Goal)</label>
            <textarea 
              value={formData.specificGoal}
              onChange={(e) => setFormData({...formData, specificGoal: e.target.value})}
              placeholder="उदा. खतांचे नियोजन, उत्पन्न वाढवण्यासाठी काय करावे..."
              className="w-full p-4 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
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
            onClick={() => onStartAdvisory(formData)}
            className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Send size={20} /> सल्ला मिळवा (Get Advisory)
          </button>
        </div>
      </div>
    </div>
  );
};
