
import React from 'react';
import type { Gig } from '../types';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import LocationIcon from './icons/LocationIcon';
import TextIcon from './icons/TextIcon';

interface GigCardProps {
  gig: Gig;
  onEdit: () => void;
}

const InfoItem: React.FC<{ label: string; value?: string; className?: string }> = ({ label, value, className }) => (
    value ? <div className={className}><span className="font-semibold text-gray-600">{label}:</span> <span className="text-gray-800">{value}</span></div> : null
);

const GigCard: React.FC<GigCardProps> = ({ gig, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl animate-fade-in">
        <div onClick={onEdit} className="p-4 cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <div className="text-lg font-bold text-purple-800">
                    <span className="text-sm font-normal text-gray-500 mr-2">#{gig.id.toString().slice(-6)}</span>
                    {gig.jobTitle}
                </div>
                <div className="text-right text-sm text-gray-700">{gig.clientName}</div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{gig.jobDescription}</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-3">
                <InfoItem label="Phone" value={gig.clientPhone} />
                <InfoItem label="Email" value={gig.clientEmail} />
                <InfoItem label="Date" value={gig.date} />
                <InfoItem label="Time" value={gig.time} />
                <InfoItem label="Address" value={gig.clientAddress} className="col-span-2" />
                <InfoItem label="Cost" value={gig.jobCost ? `$${gig.jobCost}`: ''} />
                {/* FIX: Converted `gig.hoursWorked` to a string to match the `InfoItem` component's `value` prop type. */}
                <InfoItem label="Hours" value={gig.hoursWorked?.toString()} />
                <InfoItem label="Location" value={gig.jobLocation} />
                <InfoItem label="Status" value={gig.jobStatus} />
            </div>
        </div>
        
        <div className="bg-purple-700 p-2 flex justify-around items-center">
            <a href={`sms:${gig.clientPhone}`} className="text-black p-2 rounded-full hover:bg-purple-600" aria-label="Text client">
                <TextIcon className="h-5 w-5" />
            </a>
            <a href={`tel:${gig.clientPhone}`} className="text-black p-2 rounded-full hover:bg-purple-600" aria-label="Call client">
                <PhoneIcon className="h-5 w-5" />
            </a>
            <a href={`mailto:${gig.clientEmail}`} className="text-black p-2 rounded-full hover:bg-purple-600" aria-label="Email client">
                <EmailIcon className="h-5 w-5" />
            </a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gig.jobLocation || gig.clientAddress || '')}`} target="_blank" rel="noopener noreferrer" className="text-black p-2 rounded-full hover:bg-purple-600" aria-label="Navigate to location">
                <LocationIcon className="h-5 w-5" />
            </a>
        </div>
    </div>
  );
};

export default GigCard;
