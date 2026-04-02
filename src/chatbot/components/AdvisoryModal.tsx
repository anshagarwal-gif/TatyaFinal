import React, { useState } from 'react';
import { X, Clipboard, Send, Info } from 'lucide-react';

interface AdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAdvisory: (data: any) => void;
}

export const AdvisoryModal = ({ isOpen, onClose, onStartAdvisory }: AdvisoryModalProps) => {
  const [formData, setFormData] = useState({
    soilType: 'Black Soil',
    waterSource: 'Bore Well',
    currentStage: 'Seedling',
    goal: ''
  });

  if (!isOpen) return null;

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#9b8b61',
    margin: '0',
    lineHeight: '1.3'
  };

  const stackedLabelStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: '0.08rem',
    margin: '0',
    lineHeight: '1.15',
    minHeight: '2rem',
    justifyContent: 'flex-end' as const
  };

  const stackedEnglishStyle = {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#b6a27d',
    letterSpacing: '0.03em'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        {/* Purple Header */}
        <div style={{ 
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#6366f1',
          color: 'white',
          borderRadius: '1.5rem 1.5rem 0 0',
          borderBottom: '1px solid #6366f1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem' }}>
              <Clipboard size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 'bold', fontSize: '1.125rem', margin: '0', lineHeight: '1.2' }}>स्मार्ट सल्ला (Advisory)</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.65rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.03em', margin: '0.25rem 0 0 0' }}>नियोजन मोड</p>
            </div>
          </div>
          <button onClick={onClose} style={{ 
            padding: '0.25rem',
            background: 'none',
            border: 'none',
            color: 'white',
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
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          backgroundColor: 'white',
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

          {/* Info Box */}
          <div style={{
            backgroundColor: '#e0e7ff',
            paddingTop: '0.875rem',
            paddingBottom: '0.875rem',
            paddingLeft: '0.875rem',
            paddingRight: '0.875rem',
            borderRadius: '0.625rem',
            border: '1px solid #c7d2fe',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <Info style={{ color: '#6366f1', flexShrink: 0, marginTop: '0.125rem' }} size={16} />
            <p style={{ fontSize: '0.8rem', color: '#4f46e5', lineHeight: '1.4', margin: '0' }}>
              तुमच्या शेतीचं नियोजन तात्याकडून करून घ्या.
            </p>
          </div>

          {/* Soil Type & Water Source - Two Column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={stackedLabelStyle}>
                <span style={labelStyle}>मातीचा प्रकार</span>
                <span style={stackedEnglishStyle}>(SOIL TYPE)</span>
              </label>
              <select 
                value={formData.soilType}
                onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                style={{
                  paddingTop: '0.875rem',
                  paddingBottom: '0.875rem',
                  paddingLeft: '0.875rem',
                  paddingRight: '2.5rem',
                  backgroundColor: '#fafaf8',
                  border: '1px solid #e5e0d8',
                  borderRadius: '0.625rem',
                  fontSize: '0.9rem',
                  color: '#2d2d2d',
                  fontFamily: 'inherit',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%239b8b61\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#9b8b61';
                  e.currentTarget.style.backgroundColor = '#fffbf7';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e0d8';
                  e.currentTarget.style.backgroundColor = '#fafaf8';
                }}
              >
                <option value="Black Soil">काळी माती (Black)</option>
                <option value="Red Soil">लाल माती (Red)</option>
                <option value="Loamy Soil">दोमट माती (Loamy)</option>
                <option value="Sandy Soil">वाळूचीमाती (Sandy)</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={stackedLabelStyle}>
                <span style={labelStyle}>पाण्याचा स्रोत</span>
                <span style={stackedEnglishStyle}>(WATER SOURCE)</span>
              </label>
              <select 
                value={formData.waterSource}
                onChange={(e) => setFormData({...formData, waterSource: e.target.value})}
                style={{
                  paddingTop: '0.875rem',
                  paddingBottom: '0.875rem',
                  paddingLeft: '0.875rem',
                  paddingRight: '2.5rem',
                  backgroundColor: '#fafaf8',
                  border: '1px solid #e5e0d8',
                  borderRadius: '0.625rem',
                  fontSize: '0.9rem',
                  color: '#2d2d2d',
                  fontFamily: 'inherit',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%239b8b61\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#9b8b61';
                  e.currentTarget.style.backgroundColor = '#fffbf7';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e0d8';
                  e.currentTarget.style.backgroundColor = '#fafaf8';
                }}
              >
                <option value="Bore Well">बोरवेल (Bore Well)</option>
                <option value="Canal">कालवा (Canal)</option>
                <option value="Drip">ड्रिप (Drip)</option>
                <option value="Rainfall">पाऊस (Rainfall)</option>
              </select>
            </div>
          </div>

          {/* Current Stage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={labelStyle}>सध्याचा टप्पा (CURRENT STAGE)</label>
            <select 
              value={formData.currentStage}
              onChange={(e) => setFormData({...formData, currentStage: e.target.value})}
              style={{
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                paddingLeft: '0.875rem',
                paddingRight: '2.5rem',
                backgroundColor: '#fafaf8',
                border: '1px solid #e5e0d8',
                borderRadius: '0.625rem',
                fontSize: '0.9rem',
                color: '#2d2d2d',
                fontFamily: 'inherit',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%239b8b61\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#9b8b61';
                e.currentTarget.style.backgroundColor = '#fffbf7';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e0d8';
                e.currentTarget.style.backgroundColor = '#fafaf8';
              }}
            >
              <option value="Seedling">बीज पडणे (Seedling)</option>
              <option value="Vegetative">वनस्पती वृद्धी (Vegetative)</option>
              <option value="Flowering">फूल येणे (Flowering)</option>
              <option value="Fruiting">फळ येणे (Fruiting)</option>
              <option value="Maturity">परिपक्कता (Maturity)</option>
            </select>
          </div>

          {/* Goal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={labelStyle}>लक्ष्य (GOAL)</label>
            <textarea 
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              placeholder="तुमचे लक्ष्य हे काय आहे? उदा. उच्च उपजी, जैव पद्धत..."
              style={{
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                paddingLeft: '0.875rem',
                paddingRight: '0.875rem',
                backgroundColor: '#fafaf8',
                border: '1px solid #e5e0d8',
                borderRadius: '0.625rem',
                fontSize: '0.9rem',
                color: '#2d2d2d',
                fontFamily: 'inherit',
                outline: 'none',
                minHeight: '3.5rem',
                resize: 'vertical',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#9b8b61';
                e.currentTarget.style.backgroundColor = '#fffbf7';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e0d8';
                e.currentTarget.style.backgroundColor = '#fafaf8';
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: 'white',
          display: 'flex',
          gap: '0.75rem',
          borderRadius: '0 0 1.5rem 1.5rem'
        }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              fontWeight: '600',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              border: '1px solid #e5e0d8',
              backgroundColor: 'white',
              color: '#9b8b61',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fafaf8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
          >
            रद्द करा (Cancel)
          </button>
          <button 
            onClick={() => { onStartAdvisory(formData); onClose(); }}
            style={{
              flex: 1,
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              fontWeight: '600',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#6366f1',
              color: 'white',
              fontSize: '0.95rem',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4f46e5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#6366f1'; }}
          >
            <Send size={18} /> सल्ला मिळवा (Get Advice)
          </button>
        </div>
      </div>
    </div>
  );
};
