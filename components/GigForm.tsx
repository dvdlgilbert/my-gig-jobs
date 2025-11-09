import React, { useState, useEffect } from 'react';
import type { Gig } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
}

// FIX: Implemented the full GigForm component to handle creating and editing gigs.
const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Gig, 'id'> & { id?: number }>({
    jobTitle: '',
    jobDescription: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    jobLocation: '',
    jobCost: undefined,
    hoursWorked: undefined,
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
    
    let processedValue: string | number | undefined = value;
    if (type === 'number') {
        processedValue = value === '' ? undefined : parseFloat(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.clientName || !formData.date) {
        alert("Please fill in Job Title, Client Name, and Date.");
        return;
    }
    onSave(formData as Gig);
  };

  const InputField = ({ name, label, type = 'text', required = false, value, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            step={type === 'number' ? 'any' : undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
    </div>
  );
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
            <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 mr-4" aria-label="Go back">
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{gig ? 'Edit Gig' : 'Add New Gig'}</h2>
        </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="jobTitle" label="Job Title" required value={formData.jobTitle} placeholder="e.g., Garden Maintenance" />
            <InputField name="clientName" label="Client Name" required value={formData.clientName} placeholder="e.g., John Doe" />
        </div>

        <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
                id="jobDescription"
                name="jobDescription"
                rows={4}
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Details about the job..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="clientPhone" label="Client Phone" type="tel" value={formData.clientPhone} placeholder="e.g., (555) 123-4567" />
            <InputField name="clientEmail" label="Client Email" type="email" value={formData.clientEmail} placeholder="e.g., john.doe@example.com" />
        </div>

        <InputField name="clientAddress" label="Client Address" value={formData.clientAddress} placeholder="e.g., 123 Main St, Anytown" />
        <InputField name="jobLocation" label="Job Location (if different)" value={formData.jobLocation} placeholder="e.g., 456 Oak Ave, Othertown" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="date" label="Date" type="date" required value={formData.date} />
            <InputField name="time" label="Time" type="time" value={formData.time} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="jobCost" label="Job Cost ($)" type="number" value={formData.jobCost} />
            <InputField name="hoursWorked" label="Hours Worked" type="number" value={formData.hoursWorked} />
        </div>

        <div>
          <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700 mb-1">Job Status</label>
          <select
            id="jobStatus"
            name="jobStatus"
            value={formData.jobStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option>Planned</option>
            <option>Confirmed</option>
            <option>Working</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            {gig ? 'Save Changes' : 'Create Gig'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GigForm;
