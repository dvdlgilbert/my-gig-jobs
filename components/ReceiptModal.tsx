
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import type { Gig, Language } from '../types';
import { translations } from '../translations';

interface ReceiptModalProps {
  gig: Gig;
  onClose: () => void;
  currencySymbol: string;
  language: Language;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ gig, onClose, currencySymbol, language }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const t = translations[language] || translations.en;

  const laborCost = gig.jobCost || 0;
  const expensesTotal = (gig.expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const subtotal = laborCost + expensesTotal;
  const taxRate = gig.taxRate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleDownload = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, { scale: 3, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `receipt-${gig.clientName.replace(/\s+/g, '-')}-${gig.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', maxWidth: '600px', width: '100%', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '0', overflowY: 'auto', maxHeight: '85vh' }}>
          <div ref={receiptRef} style={{ padding: '2.5rem', color: '#111827', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #111827', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.025em' }}>{t.receipt.toUpperCase()}</h1>
                <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{t.appName} Official Document</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{t.date}: {new Date(gig.date.replace(/-/g, '/')).toLocaleDateString()}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>REF: {gig.id.substring(0,8).toUpperCase()}</p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t.billTo}:</p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{gig.clientName}</h2>
              <p style={{ margin: '0.25rem 0' }}>{gig.clientAddress}</p>
              <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#4b5563' }}>{gig.clientEmail}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0' }}>{t.description}</th>
                  <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>{t.amount}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ fontWeight: 700 }}>{gig.jobTitle}</div>
                    {gig.description && (
                      <div style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>
                        {gig.description}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem', fontStyle: 'italic' }}>{t.laborCharge}</div>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 700 }}>{currencySymbol}{laborCost.toFixed(2)}</td>
                </tr>
                {gig.expenses?.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '0.75rem 0', fontSize: '0.875rem' }}>{exp.description}</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'right', fontSize: '0.875rem' }}>{currencySymbol}{exp.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '240px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4b5563' }}>
                  <span>{t.subtotal}</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#4b5563' }}>
                  <span>{t.tax} ({taxRate}%)</span>
                  <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '2px solid #111827', fontWeight: 900, fontSize: '1.5rem', marginTop: '0.5rem' }}>
                  <span>{t.total.toUpperCase()}</span>
                  <span>{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <footer style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', borderTop: '1px dashed #e5e7eb', paddingTop: '1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#4b5563' }}>{t.thankYou}</p>
              <p style={{ margin: 0 }}>This receipt is a Gigs and Side Hustles generated form: Copyright (c) 2025</p>
            </footer>
          </div>
        </div>
        <div style={{ padding: '1.25rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '0.75rem', backgroundColor: '#f9fafb' }}>
          <button onClick={onClose} style={{ flexGrow: 1, padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #d1d5db', backgroundColor: 'white', fontWeight: 600, cursor: 'pointer' }}>{t.cancel}</button>
          <button onClick={handleDownload} style={{ flexGrow: 1, backgroundColor: '#9333ea', color: 'white', padding: '0.875rem', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px rgba(147, 51, 234, 0.2)' }}>{t.save}</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
