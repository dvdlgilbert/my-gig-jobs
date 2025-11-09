import React, { useState, useEffect } from 'react';
import type { Gig } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Omit<Gig, 'id'> & { id?: number }) => void;
  onCancel: () => void;
}

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Gig, 'id'>>({
    jobTitle: '',
    jobDescription: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    jobLocation: '',
    jobCost: 0,
    hoursWorked: 0,
    jobStatus: 'Planned',
  });

  useEffect(() => {
    if (gig) {
      setFormData({
        ...gig,
        date: gig.date ? new Date(gig.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;

    if (type === 'number') {
      processedValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(processedValue as number)) {
        processedValue = 0;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.clientName || !formData.date) {
      alert('Please fill in Job Title, Client Name, and Date.');
      return;
    }
    onSave({ ...formData, id: gig?.id });
  };

  const formTitle = gig ? 'Edit Gig' : 'Add a New Gig';

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="mr-4 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{formTitle}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title <span className="text-red-500">*</span></label>
            <input type="text" name="jobTitle" id="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="jobStatus" id="jobStatus" value={formData.jobStatus} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm">
              <option>Planned</option>
              <option>Confirmed</option>
              <option>Working</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
          <textarea name="jobDescription" id="jobDescription" value={formData.jobDescription} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"></textarea>
        </div>

        {/* Client Details */}
        <h3 className="text-lg font-semibold text-gray-800 border-t pt-6">Client Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name <span className="text-red-500">*</span></label>
            <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Client Address</label>
            <input type="text" name="clientAddress" id="clientAddress" value={formData.clientAddress || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
        </div>

        {/* Date, Time & Location */}
        <h3 className="text-lg font-semibold text-gray-800 border-t pt-6">Date, Time & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
            <input type="time" name="time" id="time" value={formData.time || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
           <div>
            <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700">Job Location</label>
            <input type="text" name="jobLocation" id="jobLocation" value={formData.jobLocation || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
        </div>

        {/* Financials */}
        <h3 className="text-lg font-semibold text-gray-800 border-t pt-6">Financials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="jobCost" className="block text-sm font-medium text-gray-700">Job Cost ($)</label>
            <input type="number" name="jobCost" id="jobCost" value={formData.jobCost || ''} onChange={handleChange} step="0.01" min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700">Hours Worked</label>
            <input type="number" name="hoursWorked" id="hoursWorked" value={formData.hoursWorked || ''} onChange={handleChange} step="0.1" min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            {gig ? 'Save Changes' : 'Add Gig'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GigForm;
