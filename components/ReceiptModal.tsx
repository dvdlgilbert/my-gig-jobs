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

  const generateImage = async (callback: (blob: Blob) => void) => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher scale for better resolution
        backgroundColor: '#ffffff',
      });
      canvas.toBlob(blob => {
        if (blob) {
          callback(blob);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleDownload = () => {
    generateImage(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date(gig.date).toISOString().split('T')[0];
      link.download = `receipt-${gig.clientName.replace(/\s+/g, '-')}-${date}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const handleShare = () => {
    if (!navigator.share) {
      alert('Sharing is not supported on this browser.');
      return;
    }
    generateImage(blob => {
      const date = new Date(gig.date).toISOString().split('T')[0];
      const filename = `receipt-${gig.clientName.replace(/\s+/g, '-')}-${date}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg' });
      navigator.share({
        title: `Receipt for ${gig.jobTitle}`,
        text: `Here is the receipt for the recent job: ${gig.jobTitle}`,
        files: [file],
      }).catch(error => console.error('Error sharing:', error));
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-50 rounded-lg shadow-2xl max-w-md w-full max-h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div ref={receiptRef} className="p-8 bg-white">
          <header className="flex justify-between items-center border-b pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Receipt</h1>
              <p className="text-sm text-gray-500">My GiG Jobs</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">Date: {formatDate(gig.date)}</p>
              <p className="text-sm text-gray-500">Receipt #: {gig.id.slice(-8)}</p>
            </div>
          </header>
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</h2>
            <p className="text-gray-800 font-medium">{gig.clientName}</p>
            <p className="text-gray-600 text-sm">{gig.clientAddress}</p>
            <p className="text-gray-600 text-sm">{gig.clientEmail}</p>
            <p className="text-gray-600 text-sm">{gig.clientPhone}</p>
          </div>
          <table className="w-full text-left table-fixed mb-8">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-sm font-semibold text-gray-600 w-3/5">Description</th>
                <th className="p-2 text-sm font-semibold text-gray-600 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 align-top">
                  <p className="font-medium text-gray-800">{gig.jobTitle}</p>
                  <p className="text-xs text-gray-600 mt-1">{gig.description}</p>
                </td>
                <td className="p-2 text-right align-top font-medium text-gray-800">
                  {gig.jobCost != null ? `$${gig.jobCost.toFixed(2)}` : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal</span>
                <span>{gig.jobCost != null ? `$${gig.jobCost.toFixed(2)}` : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>{gig.jobCost != null ? `$${gig.jobCost.toFixed(2)}` : 'N/A'}</span>
              </div>
            </div>
          </div>
          <footer className="text-center text-xs text-gray-500 pt-8 mt-8 border-t">
            <p>Thank you for your business!</p>
            <p>This receipt is a Gigs and Side Hustles generated form: Copyright (c) 2025</p>
          </footer>
        </div>
        <div className="bg-gray-100 p-4 flex flex-wrap justify-end items-center gap-3">
          <button onClick={onClose} className="text-sm bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 font-medium">
            Close
          </button>
          {isSharingSupported && (
            <button onClick={handleShare} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
              Share
            </button>
          )}
          <button onClick={handleDownload} className="text-sm bg-brand-purple text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium">
            Download as JPG
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
