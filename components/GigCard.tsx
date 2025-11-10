import React from 'react';
import type { Gig } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import LocationIcon from './icons/LocationIcon';
import PhoneIcon from './icons/PhoneIcon';

interface GigCardProps {
  gig: Gig;
  onSelect: (gig: Gig) => void;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onSelect }) => {
  const getStatusColor = (status: Gig['status']) => {
    switch (status) {
      case 'Booked':
        return 'bg-green-100 text-green-800';
      case 'Lead':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect(gig)}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold">{gig.title}</h2>
          <p className="text-gray-600">{gig.company}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(gig.status)}`}>
            {gig.status}
          </span>
          <button className="text-gray-500 hover:text-gray-700" onClick={(e) => e.stopPropagation()}>
            <MoreVertIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-700 space-y-2">
        <div className="flex items-center">
            <LocationIcon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
            <span>{gig.location || 'No location specified'}</span>
        </div>
        <div className="flex items-center">
            <PhoneIcon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
            <span>{gig.contactName || 'No contact'} - {gig.contactPhone || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
