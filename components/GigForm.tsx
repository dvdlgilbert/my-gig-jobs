import React, { useState, useEffect } from 'react';
import type { Gig } from '../types';

interface GigFormProps {
  gig?: Gig;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} {...props} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
    </div>
);

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState<Gig>({
    id: gig?.id || Date.now(),
    jobTitle: gig?.jobTitle || '',
    clientName: gig?.clientName || '',
    jobDescription: gig?.jobDescription || '',
    clientPhone: gig?.clientPhone || '',
    clientEmail: gig?.clientEmail || '',
    date: gig?.date || new Date().toISOString().split('T')[0],
    time: gig?.time || '',
    clientAddress: gig?.clientAddress || '',
    jobCost: gig?.jobCost || '',
    hoursWorked: gig?.hoursWorked || '',
    jobLocation: gig?.jobLocation || '',
    jobStatus: gig?.jobStatus || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 text-white shadow-md">
        <div className="max-w-4xl mx-auto p-4 flex items-center">
            <button onClick={onCancel} className="mr-4 p-2 rounded-full hover:bg-purple-600" aria-label="Back">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-2xl font-bold">{gig ? 'Edit Gig' : 'Create New Gig'}</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Job Title" id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g., Wedding Photography" required />
                <InputField label="Client's Name" id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="e.g., Jane Doe" required />
            </div>
            
            <InputField label="Job Description" id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Briefly describe the work" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Client's Phone" id="clientPhone" name="clientPhone" type="tel" value={formData.clientPhone} onChange={handleChange} placeholder="e.g., 555-123-4567" />
                <InputField label="Client's Email" id="clientEmail" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleChange} placeholder="e.g., client@example.com" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Date" id="date" name="date" type="date" value={formData.date} onChange={handleChange} required/>
                <InputField label="Time" id="time" name="time" type="time" value={formData.time} onChange={handleChange} />
            </div>

            <InputField label="Client's Postal Address" id="clientAddress" name="clientAddress" value={formData.clientAddress} onChange={handleChange} placeholder="e.g., 123 Main St, Anytown, USA" />
            <InputField label="Job Site Location" id="jobLocation" name="jobLocation" value={formData.jobLocation} onChange={handleChange} placeholder="e.g., The Grand Ballroom" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <InputField label="Job Cost (USD)" id="jobCost" name="jobCost" type="number" step="0.01" value={formData.jobCost} onChange={handleChange} placeholder="e.g., 1500.00" />
                 <InputField label="Hours Worked" id="hoursWorked" name="hoursWorked" type="number" step="0.1" value={formData.hoursWorked} onChange={handleChange} placeholder="e.g., 8.5" />
                 <InputField label="Job Status" id="jobStatus" name="jobStatus" value={formData.jobStatus} onChange={handleChange} placeholder="e.g., Confirmed, In Progress, Completed" />
            </div>
          
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button type="submit" className="w-full sm:w-auto flex-grow justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Save Gig
              </button>
              <button type="button" onClick={onCancel} className="w-full sm:w-auto justify-center inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
              {gig && (
                <button type="button" onClick={() => onDelete(gig.id)} className="w-full sm:w-auto sm:ml-auto justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Delete
                </button>
              )}
            </div>
        </form>
      </main>
    </div>
  );
};

export default GigForm;
