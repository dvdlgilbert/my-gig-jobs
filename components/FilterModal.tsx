
import React, { useState, useEffect } from 'react';
import type { Language } from '../types';
import { translations } from '../translations';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (month: string, year: string) => void;
  onClear: () => void;
  initialMonth: string;
  initialYear: string;
  language: Language;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, onClear, initialMonth, initialYear, language }) => {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const t = translations[language];

  useEffect(() => {
    setMonth(initialMonth);
    setYear(initialYear);
  }, [initialMonth, initialYear, isOpen]);
  
  if (!isOpen) return null;

  const handleApply = () => {
    onApply(month, year);
  };

  // Inline styles to guarantee appearance regardless of Tailwind build status
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: '1rem',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '24rem', // equivalent to max-w-sm
    overflow: 'hidden',
  };

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    marginTop: '0.25rem',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>{t.filterByDate}</h2>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1.5rem' }}>{t.filterDescription}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="filterMonth" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{t.monthLabel}</label>
              <input 
                type="text" 
                name="filterMonth" 
                id="filterMonth" 
                value={month}
                onChange={e => setMonth(e.target.value)}
                placeholder="e.g., 07"
                maxLength={2}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="filterYear" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{t.yearLabel}</label>
              <input 
                type="text" 
                name="filterYear" 
                id="filterYear" 
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="e.g., 2025"
                maxLength={4}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Button Footer - Spaced Evenly */}
        <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <button 
             onClick={onClear} 
             style={{ 
               color: '#dc2626', 
               fontWeight: 600, 
               fontSize: '0.875rem', 
               background: 'none', 
               border: 'none', 
               cursor: 'pointer',
               padding: '0.5rem 0',
               textAlign: 'center'
             }}>
            {t.clearFilter}
          </button>
          
          <button 
            onClick={onClose} 
            style={{ 
              backgroundColor: '#e5e7eb', 
              color: '#1f2937', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '0.375rem', 
              fontWeight: 500, 
              fontSize: '0.875rem', 
              border: 'none', 
              cursor: 'pointer' 
            }}>
            {t.cancel}
          </button>
          
          <button 
            onClick={handleApply} 
            style={{ 
              backgroundColor: '#9333ea', 
              color: 'white', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '0.375rem', 
              fontWeight: 500, 
              fontSize: '0.875rem', 
              border: 'none', 
              cursor: 'pointer' 
            }}>
            {t.apply}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
