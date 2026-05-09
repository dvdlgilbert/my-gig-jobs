import React, { useState } from 'react';
import type { Language, UserSettings } from '../types';
import { currencies, translations } from '../translations';

interface OnboardingModalProps {
  onComplete: (settings: UserSettings) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const t = translations[selectedLanguage];

  const handleComplete = () => {
    onComplete({
      language: selectedLanguage,
      currencyCode: selectedCurrency,
      isOnboarded: true,
    });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 100, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      backdropFilter: 'blur(4px)', 
      padding: '1rem',
    }}>
      <style>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .onboarding-card {
          animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div 
        className="onboarding-card"
        style={{ 
          backgroundColor: 'white', 
          borderRadius: '1rem', 
          width: '100%', 
          maxWidth: '500px', 
          padding: '2rem', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#f3e8ff', width: '64px', height: '64px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#9333ea' }}>
            <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>{t.onboardingTitle}</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{t.onboardingSub}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Language Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              {t.language}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { code: 'en', label: 'English' },
                { code: 'es', label: 'Español' },
                { code: 'zh', label: '中文' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code as Language)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: selectedLanguage === lang.code ? '600' : '400',
                    border: selectedLanguage === lang.code ? '2px solid #9333ea' : '1px solid #e5e7eb',
                    backgroundColor: selectedLanguage === lang.code ? '#faf5ff' : 'white',
                    color: selectedLanguage === lang.code ? '#9333ea' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              {t.currency}
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                fontSize: '0.875rem',
                color: '#111827',
                outline: 'none'
              }}
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleComplete}
            style={{
              marginTop: '1rem',
              width: '100%',
              backgroundColor: '#9333ea',
              color: 'white',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(147, 51, 234, 0.4)',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7e22ce'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}
          >
            {t.getStarted}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
