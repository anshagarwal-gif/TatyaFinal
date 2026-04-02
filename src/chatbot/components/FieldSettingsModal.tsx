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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        {/* White Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          color: '#1f2937',
          borderRadius: '1.5rem 1.5rem 0 0',
          borderBottom: '1px solid #EDEDE7'
        }}>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 'bold', fontSize: '1.125rem', margin: '0', lineHeight: '1.2', color: '#1f2937' }}>क्षेत्राची माहिती (Field Info)</h3>
          <button onClick={onClose} style={{ 
            padding: '0.25rem',
            background: 'none',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <X size={20} />
          </button>
        </div>
        
        {/* Form Body */}
        <div style={{
          padding: '1.25rem',
          backgroundColor: '#fafaf8',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxHeight: '55vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {/* Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9b8b61', margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} />क्षेत्राचे ठिकाण (LOCATION)</label>
            <input 
              type="text" 
              value={localSettings.location}
              onChange={(e) => setLocalSettings({...localSettings, location: e.target.value})}
              placeholder="उदा. सातारा, महाराष्ट्र"
              style={{
                padding: '0.75rem',
                backgroundColor: '#FCFCFB',
                border: '1px solid #EDEDE7',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                color: '#1f2937',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#546c43';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(84, 108, 67, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#EDEDE7';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Crop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9b8b61', margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sprout size={14} />निवडलेले पीक (CROP)</label>
            <select 
              value={localSettings.crop}
              onChange={(e) => setLocalSettings({...localSettings, crop: e.target.value})}
              style={{
                padding: '0.75rem',
                backgroundColor: '#FCFCFB',
                border: '1px solid #EDEDE7',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                color: '#1f2937',
                fontFamily: 'inherit',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%239CA3AF\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#546c43';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(84, 108, 67, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#EDEDE7';
                e.currentTarget.style.boxShadow = 'none';
              }}
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

          {/* Planting Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9b8b61', margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} />लागवडीची तारीख (PLANTING DATE)</label>
            <input 
              type="date" 
              value={localSettings.plantingDate}
              onChange={(e) => setLocalSettings({...localSettings, plantingDate: e.target.value})}
              placeholder="dd-mm-yyyy"
              style={{
                padding: '0.75rem',
                backgroundColor: '#FCFCFB',
                border: '1px solid #EDEDE7',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                color: '#1f2937',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#546c43';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(84, 108, 67, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#EDEDE7';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid #F0F0F0',
          backgroundColor: 'white',
          display: 'flex',
          gap: '0.75rem',
          borderRadius: '0 0 1.5rem 1.5rem'
        }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              fontWeight: '600',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              border: '1px solid #EDEDE7',
              backgroundColor: 'white',
              color: '#9b8b61',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
          >
            रद्द करा (Cancel)
          </button>
          <button 
            onClick={() => { onSave(localSettings); onClose(); }}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              fontWeight: '600',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#546c43',
              color: 'white',
              fontSize: '0.95rem',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#435637'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#546c43'; }}
          >
            <Save size={18} /> माहिती जतन करा (Save)
          </button>
        </div>
      </div>
    </div>
  );
};
