import React from 'react';
import type { Gig, GigStatus } from '../types';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import LocationIcon from './icons/LocationIcon';
import TextIcon from './icons/TextIcon';

interface GigCardProps {
  gig: Gig;
  onDelete: (gigId: string) => void;
  onEdit: (gig: Gig) => void;
}

const statusColors: Record<GigStatus, string> = {
  Scheduled: 'bg-blue-100 text-blue-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Working: 'bg-green-100 text-green-800',
  Complete: 'bg-gray-100 text-gray-800',
};

const GigCard: React.FC<GigCardProps> = ({ gig, onDelete, onEdit }) => {
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col" onClick={() => onEdit(gig)}>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">#{gig.id.substring(0, 6)}</p>
            <h3 className="text-xl font-bold text-gray-900">{gig.jobTitle}</h3>
            <p className="text-md text-gray-700">{gig.clientName}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[gig.jobStatus]}`}>
            {gig.jobStatus}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{gig.description}</p>
        
        <div className="mt-4 border-t pt-4 space-y-2 text-sm text-gray-800">
           <InfoItem label="Date:" value={`${new Date(gig.date).toLocaleDateString()} at ${gig.time}`} />
           <InfoItem label="Phone:" value={gig.clientPhone} />
           <InfoItem label="Email:" value={gig.clientEmail} />
           <InfoItem label="Address:" value={gig.clientAddress} />
           <InfoItem label="Location:" value={gig.jobSite} />
           <InfoItem label="Cost:" value={gig.jobCost ? `$${gig.jobCost.toFixed(2)}` : 'N/A'} />
           <InfoItem label="Hours:" value={gig.hoursWorked ? `${gig.hoursWorked}` : 'N/A'} />
        </div>
      </div>

      <div className="bg-brand-purple p-2 grid grid-cols-4 gap-1">
        <ActionButton href={`sms:${gig.clientPhone}`} icon={<TextIcon className="w-6 h-6" />} />
        <ActionButton href={`tel:${gig.clientPhone}`} icon={<PhoneIcon className="w-6 h-6" />} />
        <ActionButton href={`mailto:${gig.clientEmail}`} icon={<EmailIcon className="w-6 h-6" />} />
        <ActionButton href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gig.jobSite)}`} icon={<LocationIcon className="w-6 h-6" />} />
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  value ? <p><span className="font-semibold">{label}</span> {value}</p> : null
);

const ActionButton = ({ href, icon }) => (
  <a 
    href={href} 
    onClick={(e) => e.stopPropagation()} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="flex justify-center items-center p-2 text-white rounded-md hover:bg-white/20 transition-colors"
  >
    {icon}
  </a>
);

export default GigCard;
