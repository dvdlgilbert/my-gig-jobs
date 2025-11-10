import React, { useState, useRef, useEffect } from 'react';
import type { Gig } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import TextIcon from './icons/TextIcon';
import LocationIcon from './icons/LocationIcon';

interface GigCardProps {
  gig: Gig;
  onEdit: (gig: Gig) => void;
  onDelete: (gigId: string) => void;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Working':
        return 'bg-yellow-100 text-yellow-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedDate = new Date(gig.date).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });

  const formattedTime = gig.time ? new Date(`1970-01-01T${gig.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{gig.jobTitle}</h3>
            <p className="text-sm text-gray-500">{gig.clientName}</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 hover:text-gray-800 p-1 rounded-full">
              <MoreVertIcon className="w-6 h-6" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                <button
                  onClick={() => { onEdit(gig); setMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Gig
                </button>
                <button
                  onClick={() => { onDelete(gig.id); setMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete Gig
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 space-y-2 text-gray-600 text-sm">
            <p><span className="font-semibold">Date:</span> {formattedDate}</p>
            <p><span className="font-semibold">Time:</span> {formattedTime}</p>
            {gig.jobCost != null && <p><span className="font-semibold">Cost:</span> ${gig.jobCost.toFixed(2)}</p>}
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <span className={`text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full ${getStatusColor(gig.jobStatus)}`}>
            {gig.jobStatus}
        </span>
        <div className="flex space-x-3">
          <a href={`tel:${gig.clientPhone}`} title="Call Client" className="text-gray-400 hover:text-brand-purple"><PhoneIcon className="w-5 h-5" /></a>
          <a href={`sms:${gig.clientPhone}`} title="Text Client" className="text-gray-400 hover:text-brand-purple"><TextIcon className="w-5 h-5" /></a>
          <a href={`mailto:${gig.clientEmail}`} title="Email Client" className="text-gray-400 hover:text-brand-purple"><EmailIcon className="w-5 h-5" /></a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gig.clientAddress)}`} target="_blank" rel="noopener noreferrer" title="Get Directions" className="text-gray-400 hover:text-brand-purple"><LocationIcon className="w-5 h-5" /></a>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
