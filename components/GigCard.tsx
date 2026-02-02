
import React, { useState } from 'react';
import type { Gig } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import TextIcon from './icons/TextIcon';
import LocationIcon from './icons/LocationIcon';
import ReceiptIcon from './icons/ReceiptIcon';

interface GigCardProps {
  gig: Gig;
  onEdit: (gig: Gig) => void;
  onManageExpenses: (gig: Gig) => void;
  onDelete: (gigId: string) => void;
  onShowReceipt: (gig: Gig) => void;
}

const InfoItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  if (!value && typeof value !== 'number') return null;
  return (
    <div style={{ marginTop: '0.625rem' }}>
      <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '0.9375rem', color: '#1f2937', margin: '0.125rem 0 0 0', fontWeight: 600 }}>{value}</p>
    </div>
  );
};

const GigCard: React.FC<GigCardProps> = ({ gig, onEdit, onManageExpenses, onDelete, onShowReceipt }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    const base = { padding: '0.25rem 0.875rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' as const };
    switch (status) {
      case 'Scheduled': return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'Pending': return { ...base, backgroundColor: '#fef9c3', color: '#854d0e' };
      case 'Working': return { ...base, backgroundColor: '#e0e7ff', color: '#3730a3' };
      case 'Complete': return { ...base, backgroundColor: '#dcfce7', color: '#166534' };
      default: return { ...base, backgroundColor: '#f3f4f6', color: '#1f2937' };
    }
  };

  const formatDate = (ds: string) => {
    try {
        return new Date(ds.replace(/-/g, '/')).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return ds;
    }
  };

  const formatTime = (ts: string) => {
    if (!ts) return 'Not set';
    try {
        const [h, m] = ts.split(':');
        const d = new Date(); d.setHours(parseInt(h), parseInt(m));
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return ts;
    }
  };

  const expensesTotal = (gig.expenses || []).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flexGrow: 1, overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{gig.jobTitle}</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0.75rem 0', fontWeight: 500 }}>{gig.clientName}</p>
            <span style={getStatusStyle(gig.jobStatus)}>{gig.jobStatus}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ padding: '0.5rem', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }} className="hover:bg-gray-100">
              <MoreVertIcon style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 15 }}></div>
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 20, width: '13rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <button onClick={() => { onEdit(gig); setMenuOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.875rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }} className="hover:bg-gray-50">Edit Full Record</button>
                  <button onClick={() => { onManageExpenses(gig); setMenuOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.875rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }} className="hover:bg-gray-50">Manage Expenses</button>
                  <hr style={{ border: 0, borderTop: '1px solid #f3f4f6', margin: 0 }} />
                  <button onClick={() => { onDelete(gig.id); setMenuOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.875rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: '#dc2626', fontWeight: 600 }} className="hover:bg-gray-50">Delete Gig</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <InfoItem label="Date" value={formatDate(gig.date)} />
            <InfoItem label="Start Time" value={formatTime(gig.time)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <InfoItem label="Labor" value={`$${(gig.jobCost || 0).toFixed(2)}`} />
            <InfoItem label="Expenses" value={expensesTotal > 0 ? `$${expensesTotal.toFixed(2)}` : 'None'} />
          </div>
          <InfoItem label="Job Site" value={gig.jobSite} />
        </div>
      </div>
      
      {/* Communication & Actions Footer */}
      <div style={{ backgroundColor: '#fcfcfd', padding: '1rem 1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href={`tel:${gig.clientPhone}`} style={{ color: '#6b7280', padding: '0.25rem' }} title="Call Client"><PhoneIcon style={{ width: '22px' }} /></a>
        <a href={`sms:${gig.clientPhone}`} style={{ color: '#6b7280', padding: '0.25rem' }} title="Text Client"><TextIcon style={{ width: '22px' }} /></a>
        <a href={`mailto:${gig.clientEmail}`} style={{ color: '#6b7280', padding: '0.25rem' }} title="Email Client"><EmailIcon style={{ width: '22px' }} /></a>
        <a href={`https://maps.google.com/?q=${encodeURIComponent(gig.jobSite)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', padding: '0.25rem' }} title="Open in Maps"><LocationIcon style={{ width: '22px' }} /></a>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }}></div>
        
        <button onClick={() => onShowReceipt(gig)} style={{ background: 'none', border: 'none', color: '#9333ea', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="Create Invoice/Receipt">
          <ReceiptIcon style={{ width: '22px' }} />
        </button>
      </div>
    </div>
  );
};

export default GigCard;
