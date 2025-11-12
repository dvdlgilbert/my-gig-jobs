// FIX: Removed invalid CDATA wrapper from file content.
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
    <div className={`mt-2 ${className}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
};

const GigCard: React.FC<GigCardProps> = ({ gig, onEdit, onDelete, onShowReceipt }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Working': return 'bg-indigo-100 text-indigo-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col justify-between">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{gig.jobTitle}</h3>
            <p className="text-sm text-gray-500 font-medium">{gig.clientName}</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)} 
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple"
            >
              <MoreVertIcon className="w-6 h-6 text-gray-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <ul className="py-1">
                  <li><button onClick={() => { onEdit(gig); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button></li>
                  <li><button onClick={() => { onDelete(gig.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(gig.jobStatus)}`}>
            {gig.jobStatus}
          </span>
        </div>
        
        <div className="border-t pt-4 space-y-3 text-sm">
            <InfoItem label="Description" value={gig.description} />
            <div className="grid grid-cols-2 gap-x-4">
              <InfoItem label="Date" value={formatDate(gig.date)} />
              <InfoItem label="Time" value={formatTime(gig.time)} />
            </div>
             <div className="grid grid-cols-2 gap-x-4">
                <InfoItem label="Job Cost" value={gig.jobCost != null ? `$${gig.jobCost.toFixed(2)}` : 'N/A'} />
                <InfoItem label="Hours Worked" value={gig.hoursWorked} />
            </div>
            <InfoItem label="Job Site / Location" value={gig.jobSite} />
            <InfoItem label="Client Phone" value={gig.clientPhone} />
            <InfoItem label="Client Email" value={gig.clientEmail} />
            <InfoItem label="Client Address" value={gig.clientAddress} />
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 flex justify-around border-t">
        <a href={`tel:${gig.clientPhone}`} className="text-gray-600 hover:text-brand-purple p-2 rounded-full hover:bg-gray-200 transition-colors" title="Call Client"><PhoneIcon className="w-6 h-6" /></a>
        <a href={`sms:${gig.clientPhone}`} className="text-gray-600 hover:text-brand-purple p-2 rounded-full hover:bg-gray-200 transition-colors" title="Text Client"><TextIcon className="w-6 h-6" /></a>
        <a href={`mailto:${gig.clientEmail}`} className="text-gray-600 hover:text-brand-purple p-2 rounded-full hover:bg-gray-200 transition-colors" title="Email Client"><EmailIcon className="w-6 h-6" /></a>
        {/* Navigation now points to the job site address */}
        <a href={`https://maps.google.com/?q=${encodeURIComponent(gig.jobSite)}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-purple p-2 rounded-full hover:bg-gray-200 transition-colors" title="Navigate to Job Site"><LocationIcon className="w-6 h-6" /></a>
        <button onClick={() => onShowReceipt(gig)} className="text-gray-600 hover:text-brand-purple p-2 rounded-full hover:bg-gray-200 transition-colors" title="Generate Receipt"><ReceiptIcon className="w-6 h-6" /></button>
      </div>
    </div>
  );
};

export default GigCard;
