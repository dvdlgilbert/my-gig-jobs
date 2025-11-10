import React, { useState } from 'react';
import type { Gig, GigStatus } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import LocationIcon from './icons/LocationIcon';
import TextIcon from './icons/TextIcon';

interface GigCardProps {
  gig: Gig;
  onUpdateStatus: (gigId: string, newStatus: GigStatus) => void;
  onDelete: (gigId: string) => void;
  onEdit: (gig: Gig) => void;
}

const statusColors: Record<GigStatus, string> = {
  Wishlist: 'bg-gray-200 text-gray-800',
  Applied: 'bg-blue-200 text-blue-800',
  Interviewing: 'bg-yellow-200 text-yellow-800',
  Offer: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
};

const GigCard: React.FC<GigCardProps> = ({ gig, onUpdateStatus, onDelete, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStatusChange = (newStatus: GigStatus) => {
    onUpdateStatus(gig.id, newStatus);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 transition-transform duration-200 ease-in-out hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{gig.role}</h3>
          <p className="text-md text-gray-600">{gig.company}</p>
          {gig.location && (
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <LocationIcon className="w-4 h-4 mr-1" />
              <span>{gig.location}</span>
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full hover:bg-gray-200">
            <MoreVertIcon className="w-6 h-6 text-gray-500" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
              <div className="py-1">
                <p className="px-4 py-2 text-sm text-gray-500">Change Status:</p>
                {Object.keys(statusColors).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as GigStatus)}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {status}
                  </button>
                ))}
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => { onEdit(gig); setIsMenuOpen(false); }}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(gig.id); setIsMenuOpen(false); }}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[gig.status]}`}>
          {gig.status}
        </span>
        <span className="text-sm text-gray-500">
          Applied: {new Date(gig.dateApplied).toLocaleDateString()}
        </span>
      </div>

      {(gig.contactName || gig.contactEmail || gig.contactPhone) && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold text-gray-700">Contact</h4>
          {gig.contactName && <p className="text-sm text-gray-600">{gig.contactName}</p>}
          <div className="flex items-center space-x-4 mt-2">
            {gig.contactEmail && (
              <a href={`mailto:${gig.contactEmail}`} className="text-blue-500 hover:text-blue-700" title={gig.contactEmail}>
                <EmailIcon className="w-5 h-5" />
              </a>
            )}
            {gig.contactPhone && (
              <a href={`tel:${gig.contactPhone}`} className="text-blue-500 hover:text-blue-700" title={gig.contactPhone}>
                <PhoneIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      )}

      {gig.notes && (
         <div className="mt-4 border-t pt-4">
           <h4 className="font-semibold text-gray-700 flex items-center">
             <TextIcon className="w-5 h-5 mr-2"/> Notes
           </h4>
           <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{gig.notes}</p>
         </div>
      )}
      
      {gig.url && (
        <div className="mt-4 text-right">
          <a href={gig.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
            View Job Posting
          </a>
        </div>
      )}

    </div>
  );
};

export default GigCard;
