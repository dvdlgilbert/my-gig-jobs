import React from 'react';
import type { Language } from '../../types';
import { translations } from '../../translations';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import { Users, TrendingUp, DollarSign } from 'lucide-react';

interface ReportsHubProps {
  onSelectReport: (report: 'client-list' | 'income-statement' | 'cash-flow') => void;
  onBack: () => void;
  language: Language;
}

const ReportsHub: React.FC<ReportsHubProps> = ({ onSelectReport, onBack, language }) => {
  const t = translations[language] || translations.en;

  const reportItems = [
    {
      id: 'client-list' as const,
      title: t.clientListReport,
      description: t.clientListReportDesc,
      icon: Users,
      badge: 'Client History',
      badgeColor: '#3b82f6',
      bgColor: '#eff6ff',
      iconColor: '#2563eb',
      buttonBg: '#2563eb',
    },
    {
      id: 'income-statement' as const,
      title: t.incomeStatement,
      description: t.incomeStatementDesc,
      icon: TrendingUp,
      badge: 'P&L Statement',
      badgeColor: '#10b981',
      bgColor: '#ecfdf5',
      iconColor: '#059669',
      buttonBg: '#059669',
    },
    {
      id: 'cash-flow' as const,
      title: t.cashFlowStatement,
      description: t.cashFlowStatementDesc,
      icon: DollarSign,
      badge: 'Cash Tracking',
      badgeColor: '#8b5cf6',
      bgColor: '#f5f3ff',
      iconColor: '#7c3aed',
      buttonBg: '#7c3aed',
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'background-color 0.2s',
            }}
            aria-label={t.back}
          >
            <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              {t.reportsTitle}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              {t.reportsSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Main Report Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {reportItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectReport(item.id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                padding: '1.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="hover:shadow-lg hover:-translate-y-1 hover:border-purple-300"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      backgroundColor: item.bgColor,
                      color: item.iconColor,
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComponent size={28} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      backgroundColor: item.bgColor,
                      color: item.badgeColor,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                  {item.title}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                  {item.description}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectReport(item.id);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.625rem',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 4px rgba(147, 51, 234, 0.2)',
                  transition: 'background-color 0.2s',
                }}
                className="hover:bg-purple-700"
              >
                <span>{item.title}</span>
                <span style={{ fontSize: '1rem' }}>&rarr;</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsHub;
