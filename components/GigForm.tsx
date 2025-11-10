import React, { useState, useEffect } from 'react';
import type { Gig, GigStatus } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
  onDelete: (gigId: string) => void;
}

const emptyFormState = {
    jobTitle: '',
    description: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    jobCost: '',
    hoursWorked: '',
    jobSite: '',
    jobStatus: 'Scheduled' as GigStatus,
};

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(emptyFormState);

  useEffect(() => {
    if (gig) {
      setFormData({
        jobTitle: gig.jobTitle,
        description: gig.description,
        clientName: gig.clientName,
        clientPhone: gig.clientPhone,
        clientEmail: gig.clientEmail,
        clientAddress: gig.clientAddress,
        date: gig.date ? new Date(gig.date).toISOString().split('T')[0] : '',
        time: gig.time,
        jobCost: gig.jobCost?.toString() ?? '',
        hoursWorked: gig.hoursWorked?.toString() ?? '',
        jobSite: gig.jobSite,
        jobStatus: gig.jobStatus,
      });
    } else {
      setFormData(emptyFormState);
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gigToSave: Gig = {
      ...formData,
      id: gig?.id || new Date().toISOString() + Math.random(), // Simple ID generation
      jobCost: formData.jobCost ? parseFloat(formData.jobCost) : undefined,
      hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : undefined,
      jobStatus: formData.jobStatus,
    };
    onSave(gigToSave);
  };

  const handleDelete = () => {
    if (gig) {
      onDelete(gig.id);
    }
  }

  const gigStatuses: GigStatus[] = ['Scheduled', 'Pending', 'Working', 'Complete'];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <header className="flex items-center mb-6">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 mr-2 sm:mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{gig ? 'Edit Gig' : 'Add New Gig'}</h2>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Details */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Job Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
              <input type="text" name="jobTitle" id="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div>
              <label htmlFor="jobSite" className="block text-sm font-medium text-gray-700">Job Site / Location</label>
              <input type="text" name="jobSite" id="jobSite" value={formData.jobSite} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm"></textarea>
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Client Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
              <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div>
              <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Client Phone</label>
              <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div>
              <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email</label>
              <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div>
              <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Client Address</label>
              <input type="text" name="clientAddress" id="clientAddress" value={formData.clientAddress} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
          </div>
        </div>
        
        {/* Schedule & Pay */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Schedule & Pay</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
             <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div>
              <label htmlFor="jobCost" className="block text-sm font-medium text-gray-700">Job Cost ($)</label>
              <input type="number" name="jobCost" id="jobCost" value={formData.jobCost} onChange={handleChange} step="0.01" min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div>
              <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700">Hours Worked</label>
              <input type="number" name="hoursWorked" id="hoursWorked" value={formData.hoursWorked} onChange={handleChange} step="0.1" min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Status</label>
              <select name="jobStatus" id="jobStatus" value={formData.jobStatus} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm">
                {gigStatuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end space-x-4 pt-4">
          {gig && (
            <button type="button" onClick={handleDelete} className="text-red-600 hover:text-red-800 font-medium mr-auto">
              Delete Gig
            </button>
          )}
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium">
            Cancel
          </button>
          <button type="submit" className="bg-brand-purple text-white px-6 py-2 rounded-md hover:bg-purple-700 font-medium">
            {gig ? 'Save Changes' : 'Add Gig'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GigForm;
