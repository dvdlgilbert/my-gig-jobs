import React, { useState, useRef, useEffect } from 'react';
import type { Gig } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import TextIcon from './icons/TextIcon';
import EmailIcon from './icons/EmailIcon';
import LocationIcon from './icons/LocationIcon';

interface GigCardProps {
  gig: Gig;
  onDelete: (gigId: string) => void;
  onEdit: (gig: Gig) => void;
}

const statusColors: { [key in Gig['jobStatus']]: string } = {
  Scheduled: 'bg-blue-100 text-blue-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Working: 'bg-indigo-100 text-indigo-800',
  Complete: 'bg-green-100 text-green-800',
};

const GigCard: React.FC<GigCardProps> = ({ gig, onDelete, onEdit }) => {
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

  const handleDelete = () => {
    onDelete(gig.id);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit(gig);
    setMenuOpen(false);
  };

  const formattedDate = new Date(gig.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between h-full">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start">
          <div className="flex-grow min-w-0">
            <h2 className="text-xl font-bold text-gray-800 truncate" title={gig.jobTitle}>{gig.jobTitle}</h2>
            <p className="text-sm text-gray-500 truncate" title={gig.clientName}>{gig.clientName}</p>
          </div>
          <div className="relative flex-shrink-0 ml-2" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <MoreVertIcon className="w-6 h-6" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button onClick={handleEdit} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    Edit Gig
                  </button>
                  <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">
                    Delete Gig
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 h-10 overflow-hidden">{gig.description}</p>
        
        <div className="mt-4 space-y-3 text-sm text-gray-700">
           <div className="flex items-center">
             <LocationIcon className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
             <span className="truncate" title={gig.jobSite}>{gig.jobSite}</span>
           </div>
           <div className="flex items-center">
             <span className="w-5 h-5 mr-3 text-gray-400 font-bold text-center flex-shrink-0">@</span>
             <span>{formattedDate} at {gig.time}</span>
           </div>
        </div>

      </div>

      <div className="bg-gray-50 px-4 py-3 sm:px-5 flex justify-between items-center border-t mt-auto">
        <span className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${statusColors[gig.jobStatus]}`}>
          {gig.jobStatus}
        </span>
        <div className="flex space-x-2 text-gray-500">
            <a href={`sms:${gig.clientPhone}`} title="Send SMS" className="p-2 rounded-full hover:bg-gray-200"><TextIcon className="w-5 h-5"/></a>
            <a href={`tel:${gig.clientPhone}`} title="Call Client" className="p-2 rounded-full hover:bg-gray-200"><PhoneIcon className="w-5 h-5"/></a>
            <a href={`mailto:${gig.clientEmail}`} title="Email Client" className="p-2 rounded-full hover:bg-gray-200"><EmailIcon className="w-5 h-5"/></a>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(gig.clientAddress)}`} target="_blank" rel="noopener noreferrer" title="View on Map" className="p-2 rounded-full hover:bg-gray-200"><LocationIcon className="w-5 h-5"/></a>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
