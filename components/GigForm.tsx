
// FIX: Implemented the GigForm component for creating and editing gigs.
// This resolves parsing errors caused by placeholder content.
import React, { useState, useEffect } from 'react';
import type { Gig } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onClose: () => void;
}

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Gig, 'id'> & { id?: number }>({
    jobTitle: '',
    jobDescription: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    date: '',
    time: '',
    jobLocation: '',
    jobCost: undefined,
    hoursWorked: undefined,
    jobStatus: 'Planned',
  });

  useEffect(() => {
    if (gig) {
      setFormData(gig);
    } else {
      // Reset form for new gig
      setFormData({
        jobTitle: '',
        jobDescription: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        date: new Date().toISOString().split('T')[0], // Default to today
        time: '',
        jobLocation: '',
        jobCost: undefined,
        hoursWorked: undefined,
        jobStatus: 'Planned',
      });
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | undefined = value;

    if (type === 'number') {
        if(value === '') {
            processedValue = undefined;
        } else {
            const num = parseFloat(value);
            processedValue = isNaN(num) ? undefined : num;
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
    onSave(formData as Gig);
  };
  
  const InputField = ({ label, name, type = "text", value, required = false, step = "any" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={handleChange}
            required={required}
            step={step}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
       <div className="flex items-center mb-6">
         <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 mr-4">
           <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
         </button>
         <h2 className="text-2xl font-bold text-gray-800">{gig ? 'Edit Gig Details' : 'Create New Gig'}</h2>
       </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Job Title" name="jobTitle" value={formData.jobTitle} required />
          <InputField label="Client Name" name="clientName" value={formData.clientName} required />
        </div>

        <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription || ''}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
        </div>

        <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-900 px-2">Client Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <InputField label="Phone" name="clientPhone" type="tel" value={formData.clientPhone} />
                <InputField label="Email" name="clientEmail" type="email" value={formData.clientEmail} />
                <div className="md:col-span-2">
                    <InputField label="Address" name="clientAddress" value={formData.clientAddress} />
                </div>
            </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-900 px-2">Job Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <InputField label="Date" name="date" type="date" value={formData.date} required />
                <InputField label="Time" name="time" type="time" value={formData.time} />
                <InputField label="Location (if different from client address)" name="jobLocation" value={formData.jobLocation} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <InputField label="Job Cost ($)" name="jobCost" type="number" value={formData.jobCost} step="0.01" />
                <InputField label="Hours Worked" name="hoursWorked" type="number" value={formData.hoursWorked} step="0.1" />
                <div>
                  <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Job Status</label>
                  <select
                      id="jobStatus"
                      name="jobStatus"
                      value={formData.jobStatus}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                      <option>Planned</option>
                      <option>Confirmed</option>
                      <option>Working</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                  </select>
                </div>
            </div>
        </fieldset>

        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
            Save Gig
          </button>
        </div>
      </form>
    </div>
  );
};

export default GigForm;
