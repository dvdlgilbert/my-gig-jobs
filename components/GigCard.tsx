import React, { useState, useRef, useEffect } from 'react';
import type { Gig, GigStatus } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import LocationIcon from './icons/LocationIcon';
import TextIcon from './icons/TextIcon';

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
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC', // To prevent off-by-one day errors
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
  
  const statusColors: Record<GigStatus, string> = {
    Scheduled: 'bg-purple-100 text-purple-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Working: 'bg-blue-100 text-blue-800',
    Complete: 'bg-green-100 text-green-800',
  };

  const handleEdit = () => {
    onEdit(gig);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(gig.id);
    setMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between transition-shadow duration-300 hover:shadow-xl">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[gig.jobStatus]}`}>
              {gig.jobStatus}
            </span>
            <h3 className="text-xl font-bold text-gray-800 mt-2">{gig.jobTitle}</h3>
            <p className="text-sm text-gray-500">{gig.clientName}</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <MoreVertIcon className="w-6 h-6" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button onClick={handleEdit} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Edit Gig
                  </button>
                  <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Delete Gig
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Date:</span> {formatDate(gig.date)}</p>
          <p><span className="font-semibold">Time:</span> {formatTime(gig.time)}</p>
          <p><span className="font-semibold">Location:</span> {gig.jobSite}</p>
          {gig.jobCost != null && (
            <p className="text-lg font-bold text-green-600 mt-2">
              ${gig.jobCost.toFixed(2)}
            </p>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 border-t border-gray-200">
        <div className="flex justify-around items-center">
            <a href={`tel:${gig.clientPhone}`} title="Call Client" className="text-gray-500 hover:text-brand-purple transition-colors">
                <PhoneIcon className="w-6 h-6" />
            </a>
            <a href={`sms:${gig.clientPhone}`} title="Text Client" className="text-gray-500 hover:text-brand-purple transition-colors">
                <TextIcon className="w-6 h-6" />
            </a>
            <a href={`mailto:${gig.clientEmail}`} title="Email Client" className="text-gray-500 hover:text-brand-purple transition-colors">
                <EmailIcon className="w-6 h-6" />
            </a>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(gig.clientAddress)}`} target="_blank" rel="noopener noreferrer" title="Get Directions" className="text-gray-500 hover:text-brand-purple transition-colors">
                <LocationIcon className="w-6 h-6" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
