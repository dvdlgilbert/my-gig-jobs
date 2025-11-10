import React, { useState } from 'react';
import type { Gig, GigStatus } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import LocationIcon from './icons/LocationIcon';
import TextIcon from './icons/TextIcon';

interface GigCardProps {
  gig: Gig;
  onEdit: (gig: Gig) => void;
  onDelete: (id: string) => void;
}

const statusColors: { [key in GigStatus]: string } = {
  Interested: 'bg-blue-100 text-blue-800',
  Applied: 'bg-indigo-100 text-indigo-800',
  Interviewing: 'bg-yellow-100 text-yellow-800',
  Offer: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Declined: 'bg-gray-100 text-gray-800',
};

const GigCard: React.FC<GigCardProps> = ({ gig, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleEdit = () => {
    onEdit(gig);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(gig.id);
    setMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{gig.title}</h2>
            <p className="text-md text-gray-600">{gig.company}</p>
          </div>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100">
              <MoreVertIcon className="h-6 w-6" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                <ul className="py-1">
                  <li>
                    <button onClick={handleEdit} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Edit
                    </button>
                  </li>
                  <li>
                    <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[gig.status]}`}>
            {gig.status}
          </span>
        </div>

        <div className="mt-6 space-y-3 text-gray-700">
          <div className="flex items-center">
            <LocationIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
            <span>{gig.location || 'N/A'}</span>
          </div>
           <div className="flex items-center">
            <span className="text-lg font-bold mr-3 text-gray-400 flex-shrink-0">$</span>
            <span>{gig.pay || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <EmailIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
            <span>{gig.contact.email || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
            <span>{gig.contact.phone || 'N/A'}</span>
          </div>
        </div>
        
        {gig.notes && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <TextIcon className="h-5 w-5 mr-2 text-gray-400"/>
              Notes
            </h4>
            <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{gig.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigCard;
