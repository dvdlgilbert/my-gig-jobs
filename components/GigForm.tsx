import React, { useState, useEffect } from 'react';
import type { Gig, GigStatus } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const gigStatuses: GigStatus[] = ['Scheduled', 'Pending', 'Working', 'Complete'];

const EMPTY_GIG = {
    jobTitle: '',
    description: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    jobCost: undefined,
    hoursWorked: undefined,
    jobSite: '',
    jobStatus: 'Scheduled' as GigStatus,
};

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(EMPTY_GIG);

  useEffect(() => {
    if (gig) {
      setFormData({
        ...gig,
        date: new Date(gig.date).toISOString().split('T')[0],
      });
    } else {
      setFormData(EMPTY_GIG);
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
        setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value as GigStatus }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gigToSave: Gig = {
        ...(formData as Omit<Gig, 'id'>),
        id: gig?.id || new Date().toISOString(),
    };
    onSave(gigToSave);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{gig ? 'Edit Gig' : 'Add New Gig'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                <input type="text" name="jobTitle" id="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div>
                <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Status</label>
                <select name="jobStatus" id="jobStatus" value={formData.jobStatus} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm">
                    {gigStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
        </div>
        
        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Client Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                 <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
                    <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Client Phone</label>
                    <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email</label>
                    <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Client Address</label>
                    <input type="text" name="clientAddress" id="clientAddress" value={formData.clientAddress} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
            </div>
        </div>

        <div className="border-t pt-6">
             <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="jobSite" className="block text-sm font-medium text-gray-700">Job Site / Location</label>
                    <input type="text" name="jobSite" id="jobSite" value={formData.jobSite} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
            </div>
        </div>

        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Earnings (Optional)</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                 <div>
                    <label htmlFor="jobCost" className="block text-sm font-medium text-gray-700">Job Cost ($)</label>
                    <input type="number" name="jobCost" id="jobCost" value={formData.jobCost ?? ''} onChange={handleChange} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700">Hours Worked</label>
                    <input type="number" name="hoursWorked" id="hoursWorked" value={formData.hoursWorked ?? ''} onChange={handleChange} step="0.1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
                </div>
            </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {gig && (
                <button
                    type="button"
                    onClick={() => onDelete(gig.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                >
                    Delete Gig
                </button>
            )}
          </div>
          <div className="flex gap-4">
             <button
                type="button"
                onClick={onCancel}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Save Gig
              </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GigForm;
