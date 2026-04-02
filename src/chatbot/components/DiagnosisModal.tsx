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
    gap: '0.14rem',
    margin: '0',
    lineHeight: '1.15',
    minHeight: '2.45rem',
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
        {/* Green Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem',
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#546c43',
          color: 'white',
          borderRadius: '1.5rem 1.5rem 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '0.5rem' }}>
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 'bold', fontSize: '1.125rem', margin: '0', lineHeight: '1.2' }}>पीक निदान (Diagnosis)</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.65rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.03em', margin: '0.25rem 0 0 0' }}>क्षेत्र विश्लेषण मोड</p>
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
            backgroundColor: '#f5f3f0',
            paddingTop: '0.875rem',
            paddingBottom: '0.875rem',
            paddingLeft: '0.875rem',
            paddingRight: '0.875rem',
            borderRadius: '0.625rem',
            border: '1px solid #e5d9ce',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <Info style={{ color: '#9b8b61', flexShrink: 0, marginTop: '0.125rem' }} size={16} />
            <p style={{ fontSize: '0.8rem', color: '#7a6f5a', lineHeight: '1.4', margin: '0' }}>
              तात्याला अचूक माहिती द्या म्हणजे तो तुम्हाला योग्य उपाय सांगेल.
            </p>
          </div>

          {/* Symptoms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={labelStyle}>काय लक्षणं दिसत आहेत? (SYMPTOMS)</label>
            <textarea 
              value={formData.symptoms}
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              placeholder="उदा. पानांवर पिवळे ठिपके, वाळलेली खोडं..."
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
                minHeight: '4.25rem',
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

          {/* Duration & Affected Part - Two Column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: 0 }}>
              <label style={stackedLabelStyle}>
                <span style={labelStyle}>किती दिवसांपासून?</span>
                <span style={stackedEnglishStyle}>(DURATION)</span>
              </label>
              <input 
                type="text" 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="उदा. २-३ दिवस"
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
                  minHeight: '3rem',
                  boxSizing: 'border-box',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: 0 }}>
              <label style={stackedLabelStyle}>
                <span style={labelStyle}>बाधित भाग</span>
                <span style={stackedEnglishStyle}>(AFFECTED PART)</span>
              </label>
              <select 
                value={formData.affectedPart}
                onChange={(e) => setFormData({...formData, affectedPart: e.target.value})}
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
                  minHeight: '3rem',
                  boxSizing: 'border-box',
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
                <option value="Leaves">पाने (Leaves)</option>
                <option value="Stem">खोड (Stem)</option>
                <option value="Roots">मुळे (Roots)</option>
                <option value="Fruit/Flower">फळ/फूल (Fruit/Flower)</option>
                <option value="Whole Plant">पूर्ण रोप (Whole Plant)</option>
              </select>
            </div>
          </div>

          {/* Previous Treatments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={labelStyle}>आधी काही फवारणी केली का? (PREVIOUS TREATMENTS)</label>
            <input 
              type="text" 
              value={formData.previousTreatments}
              onChange={(e) => setFormData({...formData, previousTreatments: e.target.value})}
              placeholder="औषधाचे नाव किंवा खत"
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
            onClick={() => { onStartDiagnosis(formData); onClose(); }}
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
            <Send size={18} /> निदान सुरू करा (Start)
          </button>
        </div>
      </div>
    </div>
  );
};
