
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
  onDelete: (gigId: string) => void;
  onShowReceipt: (gig: Gig) => void;
}

// Helper component for displaying individual info items
const InfoItem: React.FC<{ label: string; value?: string | number | null; className?: string }> = ({ label, value, className = '' }) => {
  if (!value && typeof value !== 'number') return null;
  return (
    <div className={`mt-2 ${className}`} style={{ marginTop: '0.5rem' }}>
      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '0.875rem', color: '#1f2937', margin: 0 }}>{value}</p>
    </div>
  );
};

const GigCard: React.FC<GigCardProps> = ({ gig, onEdit, onDelete, onShowReceipt }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    const baseStyle = { padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 };
    switch (status) {
      case 'Scheduled': return { ...baseStyle, backgroundColor: '#dbeafe', color: '#1e40af' }; // blue
      case 'Pending': return { ...baseStyle, backgroundColor: '#fef9c3', color: '#854d0e' }; // yellow
      case 'Working': return { ...baseStyle, backgroundColor: '#e0e7ff', color: '#3730a3' }; // indigo
      case 'Complete': return { ...baseStyle, backgroundColor: '#dcfce7', color: '#166534' }; // green
      default: return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#1f2937' }; // gray
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString.replace(/-/g, '\/'));
    return date.toLocaleDateString(undefined, options);
  };
  
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(gig);
    setMenuOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(gig.id);
    setMenuOpen(false);
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>{gig.jobTitle}</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0 }}>{gig.clientName}</p>
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              style={{ padding: '0.5rem', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              className="hover:bg-gray-100"
              aria-label="Gig options"
            >
              <MoreVertIcon style={{ width: '24px', height: '24px', color: '#6b7280' }} />
            </button>
            
            {menuOpen && (
              <>
                {/* Overlay to close menu when clicking outside */}
                <div 
                  onClick={() => setMenuOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 15, cursor: 'default' }}
                ></div>
                
                <div style={{ 
                  position: 'absolute', 
                  right: 0, 
                  marginTop: '0.5rem', 
                  width: '12rem', 
                  backgroundColor: 'white', 
                  borderRadius: '0.375rem', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                  zIndex: 20,
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb'
                }}>
                  <ul style={{ padding: '0.25rem 0', margin: 0, listStyle: 'none' }}>
                    <li>
                      <button 
                        onClick={handleEditClick} 
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }} 
                        className="hover:bg-gray-100"
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={handleDeleteClick} 
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }} 
                        className="hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <span style={getStatusStyle(gig.jobStatus)}>
            {gig.jobStatus}
          </span>
        </div>
        
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <InfoItem label="Description" value={gig.description} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InfoItem label="Date" value={formatDate(gig.date)} />
              <InfoItem label="Time" value={formatTime(gig.time)} />
            </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InfoItem label="Job Cost" value={gig.jobCost != null ? `$${gig.jobCost.toFixed(2)}` : 'N/A'} />
                <InfoItem label="Hours Worked" value={gig.hoursWorked} />
            </div>
            <InfoItem label="Job Site / Location" value={gig.jobSite} />
            <InfoItem label="Client Phone" value={gig.clientPhone} />
            <InfoItem label="Client Email" value={gig.clientEmail} />
            <InfoItem label="Client Address" value={gig.clientAddress} />
        </div>
      </div>
      
      <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #e5e7eb' }}>
        <a href={`tel:${gig.clientPhone}`} style={{ color: '#4b5563', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Call Client"><PhoneIcon style={{ width: '24px', height: '24px' }} /></a>
        <a href={`sms:${gig.clientPhone}`} style={{ color: '#4b5563', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Text Client"><TextIcon style={{ width: '24px', height: '24px' }} /></a>
        <a href={`mailto:${gig.clientEmail}`} style={{ color: '#4b5563', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Email Client"><EmailIcon style={{ width: '24px', height: '24px' }} /></a>
        <a href={`https://maps.google.com/?q=${encodeURIComponent(gig.jobSite)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4b5563', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Navigate to Job Site"><LocationIcon style={{ width: '24px', height: '24px' }} /></a>
        <button onClick={() => onShowReceipt(gig)} style={{ color: '#4b5563', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }} title="Generate Receipt"><ReceiptIcon style={{ width: '24px', height: '24px' }} /></button>
      </div>
    </div>
  );
};

export default GigCard;
