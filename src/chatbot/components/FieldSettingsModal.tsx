import React from 'react';
import { X, MapPin, Sprout, Calendar, Save } from 'lucide-react';

interface FieldSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    location: string;
    crop: string;
    plantingDate: string;
  };
  onSave: (settings: any) => void;
}

export const FieldSettingsModal = ({ isOpen, onClose, settings, onSave }: FieldSettingsModalProps) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-earth-100 flex items-center justify-between bg-leaf-50">
          <h3 className="font-serif font-bold text-leaf-900 text-xl">क्षेत्राची माहिती (Field Info)</h3>
          <button onClick={onClose} className="p-2 hover:bg-leaf-100 rounded-full transition-colors">
            <X size={20} className="text-leaf-700" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-earth-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} /> क्षेत्राचे ठिकाण (Location)
            </label>
            <input 
              type="text" 
              value={localSettings.location}
              onChange={(e) => setLocalSettings({...localSettings, location: e.target.value})}
              placeholder="उदा. सातारा, महाराष्ट्र"
              className="w-full p-3 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-leaf-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-earth-500 uppercase tracking-wider flex items-center gap-2">
              <Sprout size={14} /> निवडलेले पीक (Crop)
            </label>
            <select 
              value={localSettings.crop}
              onChange={(e) => setLocalSettings({...localSettings, crop: e.target.value})}
              className="w-full p-3 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-leaf-500 outline-none"
            >
              <option value="">पीक निवडा</option>
              <option value="Sugarcane">ऊस (Sugarcane)</option>
              <option value="Cotton">कापूस (Cotton)</option>
              <option value="Soybean">सोयाबीन (Soybean)</option>
              <option value="Wheat">गहू (Wheat)</option>
              <option value="Rice">भात (Rice)</option>
              <option value="Onion">कांदा (Onion)</option>
              <option value="Grapes">द्राक्षे (Grapes)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-earth-500 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} /> लागवडीची तारीख (Planting Date)
            </label>
            <input 
              type="date" 
              value={localSettings.plantingDate}
              onChange={(e) => setLocalSettings({...localSettings, plantingDate: e.target.value})}
              className="w-full p-3 bg-earth-50 border border-earth-200 rounded-2xl focus:ring-2 focus:ring-leaf-500 outline-none"
            />
          </div>
        </div>

        <div className="p-6 bg-earth-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-earth-200 text-earth-600 font-semibold rounded-2xl hover:bg-white transition-colors"
          >
            रद्द करा (Cancel)
          </button>
          <button 
            onClick={() => { onSave(localSettings); onClose(); }}
            className="flex-1 py-3 bg-leaf-600 text-white font-semibold rounded-2xl hover:bg-leaf-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} /> माहिती जतन करा (Save)
          </button>
        </div>
      </div>
    </div>
  );
};
