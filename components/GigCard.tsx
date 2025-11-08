import React, { useState, useRef, useEffect } from 'react';
import type { Gig } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import LocationIcon from './icons/LocationIcon';

interface GigCardProps {
  gig: Gig;
  onEdit: (gig: Gig) => void;
  onDelete: (id: number) => void;
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

  const getStatusColor = (status: Gig['jobStatus']) => {
    switch (status) {
      case 'Planned': return 'bg-gray-200 text-gray-800';
      case 'Confirmed': return 'bg-blue-200 text-blue-800';
      case 'Completed': return 'bg-green-200 text-green-800';
      case 'Cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{gig.jobTitle}</h3>
          <div className="relative" ref={menuRef}>
            <button onClick={handleMenuToggle} className="p-1 rounded-full hover:bg-gray-200">
              <MoreVertIcon className="h-6 w-6 text-gray-600" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <ul className="py-1">
                  <li>
                    <button onClick={() => { onEdit(gig); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Edit
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { onDelete(gig.id); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <p className="text-md font-semibold text-gray-600 mb-3">{gig.clientName}</p>
        
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          {gig.clientPhone && (
            <div className="flex items-center">
              <PhoneIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span>{gig.clientPhone}</span>
            </div>
          )}
          {gig.clientEmail && (
            <div className="flex items-center">
              <EmailIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span className="truncate">{gig.clientEmail}</span>
            </div>
          )}
          {gig.jobLocation && (
            <div className="flex items-center">
              <LocationIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span>{gig.jobLocation}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(gig.jobStatus)}`}>
            {gig.jobStatus}
          </span>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{new Date(gig.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          {gig.time && <p className="text-xs text-gray-500">{gig.time}</p>}
        </div>
      </div>
    </div>
  );
};

export default GigCard;
