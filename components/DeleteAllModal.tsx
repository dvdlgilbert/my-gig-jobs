import React from 'react';
import type { Language } from '../types';
import { translations } from '../translations';

interface DeleteAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language: Language;
}

const DeleteAllModal: React.FC<DeleteAllModalProps> = ({ isOpen, onClose, onConfirm, language }) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '28rem', // max-w-md
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>{t.confirmDeleteAllTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
            <p style={{ fontWeight: 600, color: '#dc2626' }}>{t.confirmDeleteAllDescription}</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            onClick={onConfirm} 
            style={{ 
              backgroundColor: '#dc2626', 
              color: 'white', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '0.375rem', 
              fontWeight: 700, 
              fontSize: '0.875rem', 
              border: 'none', 
              cursor: 'pointer' 
            }}>
            {t.confirmDeleteAllButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllModal;
