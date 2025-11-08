
import React, { useState, useEffect } from 'react';
import type { Gig } from '../types';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
}

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    date: '',
    time: '',
    jobLocation: '',
    jobCost: '' as number | '',
    hoursWorked: '' as number | '',
    jobStatus: 'Planned' as Gig['jobStatus'],
  });

  useEffect(() => {
    if (gig) {
      setFormData({
        jobTitle: gig.jobTitle || '',
        jobDescription: gig.jobDescription || '',
        clientName: gig.clientName || '',
        clientPhone: gig.clientPhone || '',
        clientEmail: gig.clientEmail || '',
        clientAddress: gig.clientAddress || '',
        date: gig.date ? new Date(gig.date).toISOString().split('T')[0] : '',
        time: gig.time || '',
        jobLocation: gig.jobLocation || '',
        jobCost: gig.jobCost ?? '',
        hoursWorked: gig.hoursWorked ?? '',
        jobStatus: gig.jobStatus || 'Planned',
      });
    } else {
        // Reset form for new gig
        setFormData({
            jobTitle: '',
            jobDescription: '',
            clientName: '',
            clientPhone: '',
            clientEmail: '',
            clientAddress: '',
            date: '',
            time: '',
            jobLocation: '',
            jobCost: '',
            hoursWorked: '',
            jobStatus: 'Planned',
        });
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.clientName || !formData.date) {
      alert('Please fill in Job Title, Client Name, and Date.');
      return;
    }
    
    const gigToSave: Gig = {
        id: gig?.id || 0, // App.tsx handles new ID generation
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone || undefined,
        clientEmail: formData.clientEmail || undefined,
        clientAddress: formData.clientAddress || undefined,
        date: formData.date,
        time: formData.time || undefined,
        jobLocation: formData.jobLocation || undefined,
        jobCost: formData.jobCost !== '' ? Number(formData.jobCost) : undefined,
        hoursWorked: formData.hoursWorked !== '' ? Number(formData.hoursWorked) : undefined,
        jobStatus: formData.jobStatus,
    };
    onSave(gigToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <div className="md:col-span-2">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title *</label>
          <input type="text" name="jobTitle" id="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Client Name */}
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name *</label>
          <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        {/* Job Status */}
        <div>
          <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Status</label>
          <select name="jobStatus" id="jobStatus" value={formData.jobStatus} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option>Planned</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
          <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
          <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        {/* Job Description */}
        <div className="md:col-span-2">
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea name="jobDescription" id="jobDescription" value={formData.jobDescription} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        {/* Client Phone */}
        <div>
          <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Client Phone</label>
          <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Client Email */}
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email</label>
          <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Job Location */}
        <div className="md:col-span-2">
            <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700">Job Location</label>
            <input type="text" name="jobLocation" id="jobLocation" value={formData.jobLocation} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Client Address */}
        <div className="md:col-span-2">
            <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Client Address</label>
            <input type="text" name="clientAddress" id="clientAddress" value={formData.clientAddress} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        {/* Job Cost */}
        <div>
          <label htmlFor="jobCost" className="block text-sm font-medium text-gray-700">Job Cost ($)</label>
          <input type="number" name="jobCost" id="jobCost" value={formData.jobCost} onChange={handleChange} step="0.01" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Hours Worked */}
        <div>
          <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700">Hours Worked</label>
          <input type="number" name="hoursWorked" id="hoursWorked" value={formData.hoursWorked} onChange={handleChange} step="0.1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
          {gig ? 'Save Changes' : 'Add Gig'}
        </button>
      </div>
    </form>
  );
};

export default GigForm;
