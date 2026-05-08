import React from 'react';
import type { Language, UserSettings } from '../types';
import { currencies, translations } from '../translations';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings, onBack }) => {
  const t = translations[settings.language];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({ ...settings, language: e.target.value as Language });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({ ...settings, currencyCode: e.target.value });
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.125rem', fontWeight: 700, color: '#581c87', marginBottom: '1.25rem', marginTop: '1.5rem', borderLeft: '4px solid #9333ea', paddingLeft: '0.75rem'
  };

  const selectStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '0.875rem 1rem', marginBottom: '1.25rem',
    borderRadius: '0.75rem', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', backgroundColor: 'white'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.375rem', fontWeight: 600
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#9333ea', color: 'white', padding: '1rem', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}>
          <ArrowLeftIcon style={{ width: '24px', height: '24px' }} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginLeft: '0.5rem' }}>{t.settingsTitle}</h2>
      </header>

      <div style={{ flexGrow: 1, padding: '2rem 1.25rem' }}>
        <div style={{ maxWidth: '34rem', margin: '0 auto' }}>
          <h3 style={sectionTitleStyle}>{t.settings}</h3>
          
          <div>
            <label style={labelStyle}>{t.language}</label>
            <select value={settings.language} onChange={handleLanguageChange} style={selectStyle}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>{t.currency}</label>
            <select value={settings.currencyCode} onChange={handleCurrencyChange} style={selectStyle}>
              {currencies.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
