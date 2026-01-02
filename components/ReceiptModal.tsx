
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import type { Gig } from '../types';

interface ReceiptModalProps {
  gig: Gig;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ gig, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isSharingSupported, setIsSharingSupported] = useState(false);

  useEffect(() => {
    setIsSharingSupported(!!navigator.share);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString.replace(/-/g, '\/'));
    return date.toLocaleDateString(undefined, options);
  };

  const getSafeFilename = (ext: string = 'png') => {
    const date = new Date(gig.date).toISOString().split('T')[0];
    const safeClientName = gig.clientName.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'client';
    return `receipt-${safeClientName}-${date}.${ext}`;
  };

  const generateImage = async (callback: (blob: Blob) => void) => {
    if (receiptRef.current) {
      // Wait a tick to ensure layout is stable
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      
      // Switched to PNG for better compatibility with Windows share targets
      canvas.toBlob(blob => {
        if (blob) {
          callback(blob);
        }
      }, 'image/png');
    }
  };

  const handleDownload = () => {
    generateImage(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getSafeFilename('png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  // Separate Email Handler for "To" field support
  const handleEmailText = () => {
    const subject = encodeURIComponent(`Receipt for ${gig.jobTitle}`);
    const body = encodeURIComponent(`Please find attached the receipt for: ${gig.jobTitle}.\n\n(Note: Please attach the downloaded receipt image manually)`);
    window.location.href = `mailto:${gig.clientEmail}?subject=${subject}&body=${body}`;
  };

  const handleShare = () => {
    if (!navigator.share) {
      alert('Sharing is not supported on this browser.');
      return;
    }

    generateImage(blob => {
      const filename = getSafeFilename('png');
      // Using PNG and lastModified for Windows compatibility
      const file = new File([blob], filename, { type: 'image/png', lastModified: new Date().getTime() });
      
      if (file.size === 0) {
        alert("Error generating receipt file.");
        return;
      }

      const shareData = {
        title: `Receipt for ${gig.jobTitle}`,
        text: `Please find attached the receipt for: ${gig.jobTitle}`,
        files: [file],
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share(shareData)
          .catch(error => {
            console.error('Error sharing:', error);
          });
      } else {
        alert("Your system does not support sharing files directly.");
      }
    });
  };

  const subtotal = gig.jobCost || 0;
  const taxRate = gig.taxRate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50,
      padding: '1rem'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: '#f3f4f6',
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Scrollable Content */}
        <div style={{ overflowY: 'auto', padding: '1.5rem', flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          
          {/* Document Container */}
          <div ref={receiptRef} style={{
            backgroundColor: 'white',
            padding: '2rem',
            width: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            color: '#1f2937',
            fontFamily: 'sans-serif',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>RECEIPT</h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>My GiG Jobs Tracker</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 600, color: '#374151' }}>Date: {formatDate(gig.date)}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'monospace' }}>#{gig.id.slice(-8).toUpperCase()}</p>
              </div>
            </header>

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Bill To:</h2>
              <div style={{ paddingLeft: '0.5rem', borderLeft: '4px solid #e5e7eb' }}>
                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>{gig.clientName}</p>
                <p style={{ color: '#4b5563' }}>{gig.clientAddress}</p>
                <p style={{ color: '#4b5563' }}>{gig.clientEmail}</p>
                <p style={{ color: '#4b5563' }}>{gig.clientPhone}</p>
              </div>
            </div>

            {/* Table Container - Removed flexGrow to allow natural height and prevent overlap */}
            <div style={{ marginBottom: '2rem', minHeight: '100px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Description</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem 0.75rem', verticalAlign: 'top' }}>
                      <p style={{ fontWeight: 600, color: '#111827' }}>{gig.jobTitle}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{gig.description}</p>
                      {gig.jobSite && <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Location: {gig.jobSite}</p>}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'right', verticalAlign: 'top', fontWeight: 600, color: '#111827' }}>
                      {gig.jobCost != null ? `$${subtotal.toFixed(2)}` : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid transparent' }}>
              <div style={{ width: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563' }}>
                  <span>Subtotal</span>
                  <span>{gig.jobCost != null ? `$${subtotal.toFixed(2)}` : 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563' }}>
                  <span>Tax ({taxRate}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '2px solid #111827', fontWeight: 800, fontSize: '1.125rem', color: '#111827' }}>
                  <span>Total</span>
                  <span>{gig.jobCost != null ? `$${total.toFixed(2)}` : 'N/A'}</span>
                </div>
              </div>
            </div>

            <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px dashed #d1d5db', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem' }}>
              <p>Thank you for your business!</p>
              <p>This receipt is a Gigs and Side Hustles generated form: Copyright (c) 2025</p>
            </footer>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '1rem', 
          borderTop: '1px solid #e5e7eb', 
          display: 'grid', 
          gridTemplateColumns: isSharingSupported ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr',
          gap: '0.5rem'
        }}>
          <button 
            onClick={onClose} 
            style={{ 
              backgroundColor: '#f3f4f6', 
              color: '#1f2937', 
              padding: '0.75rem 0', 
              borderRadius: '0.5rem', 
              fontWeight: 600, 
              border: 'none', 
              cursor: 'pointer',
              textAlign: 'center'
            }}>
            Close
          </button>
          
          {/* Dedicated Email Button */}
          <button 
            onClick={handleEmailText} 
            style={{ 
              backgroundColor: '#1e40af', // Darker blue
              color: 'white', 
              padding: '0.75rem 0', 
              borderRadius: '0.5rem', 
              fontWeight: 600, 
              border: 'none', 
              cursor: 'pointer',
              textAlign: 'center'
            }}
            title="Send email to client"
          >
            Email
          </button>

          {isSharingSupported && (
            <button 
              onClick={handleShare} 
              style={{ 
                backgroundColor: '#2563eb', // Blue
                color: 'white', 
                padding: '0.75rem 0', 
                borderRadius: '0.5rem', 
                fontWeight: 600, 
                border: 'none', 
                cursor: 'pointer',
                textAlign: 'center'
              }}>
              Share File
            </button>
          )}
          
          <button 
            onClick={handleDownload} 
            style={{ 
              backgroundColor: '#9333ea', // Brand Purple
              color: 'white', 
              padding: '0.75rem 0', 
              borderRadius: '0.5rem', 
              fontWeight: 600, 
              border: 'none', 
              cursor: 'pointer',
              textAlign: 'center'
            }}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
