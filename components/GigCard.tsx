// FIX: Implement the GigCard component to resolve module not found errors.
import React, { useState, useRef, useEffect } from 'react';
import type { Gig, GigStatus } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import TextIcon from './icons/TextIcon';
import LocationIcon from './icons/LocationIcon';

interface GigCardProps {
  gig: Gig;
  onEdit: (gig: Gig) => void;
  onDelete: (id: string) => void;
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
  }, []);

  const getStatusBadgeColor = (status: GigStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Working':
        return 'bg-green-100 text-green-800';
      case 'Complete':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
      // Appending T00:00:00 to avoid timezone issues.
      const dateObj = new Date(`${dateString}T00:00:00`);
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
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
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow min-w-0">
            <h3 className="text-xl font-bold text-gray-800 truncate pr-2" title={gig.jobTitle}>{gig.jobTitle}</h3>
            <p className="text-sm text-gray-500">{gig.clientName}</p>
          </div>
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-purple">
              <MoreVertIcon className="w-6 h-6 text-gray-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 ring-1 ring-black ring-opacity-5">
                <button onClick={() => { onEdit(gig); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Edit
                </button>
                <button onClick={() => { onDelete(gig.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p><span className="font-semibold">Date:</span> {formatDate(gig.date)} at {formatTime(gig.time)}</p>
          <p><span className="font-semibold">Location:</span> {gig.jobSite}</p>
          <p className="break-words"><span className="font-semibold">Description:</span> {gig.description}</p>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Status:</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(gig.jobStatus)}`}>
              {gig.jobStatus}
            </span>
          </div>
           {gig.jobCost != null && <p><span className="font-semibold">Job Cost:</span> ${gig.jobCost.toFixed(2)}</p>}
        </div>
      </div>
      
      <div className="border-t mt-4 pt-4 flex justify-around items-center">
        <a href={`tel:${gig.clientPhone}`} title="Call Client" className="text-gray-500 hover:text-brand-purple transition-colors p-2 rounded-full hover:bg-purple-50">
          <PhoneIcon className="w-5 h-5" />
        </a>
        <a href={`sms:${gig.clientPhone}`} title="Text Client" className="text-gray-500 hover:text-brand-purple transition-colors p-2 rounded-full hover:bg-purple-50">
          <TextIcon className="w-5 h-5" />
        </a>
        <a href={`mailto:${gig.clientEmail}`} title="Email Client" className="text-gray-500 hover:text-brand-purple transition-colors p-2 rounded-full hover:bg-purple-50">
          <EmailIcon className="w-5 h-5" />
        </a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gig.clientAddress)}`} target="_blank" rel="noopener noreferrer" title="Get Directions" className="text-gray-500 hover:text-brand-purple transition-colors p-2 rounded-full hover:bg-purple-50">
          <LocationIcon className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default GigCard;
