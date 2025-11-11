// FIX: Replaced invalid HTML content with a valid React component.
import React, { useState, useRef, useEffect } from 'react';
import type { Gig } from '../types';
import MoreVertIcon from './icons/MoreVertIcon';
import PhoneIcon from './icons/PhoneIcon';
import EmailIcon from './icons/EmailIcon';
import LocationIcon from './icons/LocationIcon';
import TextIcon from './icons/TextIcon';

interface GigCardProps {
  gig: Gig;
  onDelete: (id: string) => void;
  onEdit: (gig: Gig) => void;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onDelete, onEdit }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const statusColor = {
        Scheduled: 'bg-blue-100 text-blue-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Working: 'bg-indigo-100 text-indigo-800',
        Complete: 'bg-green-100 text-green-800',
    };

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

    const formatCurrency = (amount?: number) => {
      if (typeof amount !== 'number') return 'N/A';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{gig.jobTitle}</h2>
                        <p className="text-sm text-gray-500">{gig.jobSite}</p>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100">
                            <MoreVertIcon className="w-6 h-6 text-gray-600" />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                <a onClick={(e) => { e.preventDefault(); onEdit(gig); setMenuOpen(false); }} href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
                                <a onClick={(e) => { e.preventDefault(); onDelete(gig.id); setMenuOpen(false); }} href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</a>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-gray-600 mb-4">{gig.description}</p>
                
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Client: {gig.clientName}</h3>
                    <div className="flex flex-col space-y-2 text-sm">
                       <div className="flex items-center text-gray-600">
                            <LocationIcon className="w-4 h-4 mr-2" />
                            <span>{gig.clientAddress}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p className="font-semibold text-gray-700">Date & Time</p>
                        <p className="text-gray-600">{formatDate(gig.date)} at {gig.time}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-700">Status</p>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[gig.jobStatus]}`}>
                            {gig.jobStatus}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Job Cost</p>
                        <p className="text-gray-600">{formatCurrency(gig.jobCost)}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Hours Worked</p>
                        <p className="text-gray-600">{gig.hoursWorked ?? 'N/A'}</p>
                    </div>
                </div>
            </div>
            
            <div className="border-t pt-4 mt-auto">
                <p className="font-semibold text-gray-700 mb-2 text-sm">Contact Client</p>
                <div className="flex items-center space-x-3">
                    <a href={`tel:${gig.clientPhone}`} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Call">
                       <PhoneIcon className="w-5 h-5 text-gray-700"/>
                    </a>
                    <a href={`sms:${gig.clientPhone}`} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Text">
                       <TextIcon className="w-5 h-5 text-gray-700"/>
                    </a>
                    <a href={`mailto:${gig.clientEmail}`} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Email">
                       <EmailIcon className="w-5 h-5 text-gray-700"/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default GigCard;
