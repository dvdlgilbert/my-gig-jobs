import React, { useState, useEffect, useRef } from 'react';
import type { Gig } from '../types';
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

  // FIX: Handle date parsing carefully to avoid timezone issues.
  // The date from the form is YYYY-MM-DD, which if parsed with new Date() can result in a day off due to UTC conversion.
  const parts = gig.date.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month, day);

  const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : 'Invalid date';


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-200 flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <h3 className="text-xl font-bold text-gray-800">{gig.jobTitle}</h3>
            <p className="text-sm text-gray-500">{gig.clientName}</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertIcon className="w-6 h-6 text-gray-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                <button onClick={() => { onEdit(gig); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                <button onClick={() => { onDelete(gig.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mt-3 text-sm">{gig.description}</p>

        <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center text-gray-700">
                <LocationIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{gig.jobSite}</span>
            </div>
             <p className="text-gray-700 font-medium">{formattedDate} at {gig.time}</p>
        </div>

      </div>

      <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(gig.jobStatus)}`}>
            {gig.jobStatus}
        </span>
        <div className="flex space-x-2">
            <a href={`sms:${gig.clientPhone}`} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-brand-purple" title="Send SMS">
                <TextIcon className="w-5 h-5"/>
            </a>
            <a href={`tel:${gig.clientPhone}`} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-brand-purple" title="Call Client">
                <PhoneIcon className="w-5 h-5"/>
            </a>
            <a href={`mailto:${gig.clientEmail}`} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-brand-purple" title="Email Client">
                <EmailIcon className="w-5 h-5"/>
            </a>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
