import React, { useState, useEffect } from 'react';
import type { Gig } from '../types';

interface GigFormProps {
  gig?: Gig;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
}

// Helper component for form fields to reduce repetition
const InputField: React.FC<{
  name: string;
  label: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
}> = ({ name, label, value, onChange, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} step="any" className="mt-1 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
    </div>
);


const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel, onDelete }) => {
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
    jobCost: '',
    hoursWorked: '',
    jobStatus: 'Planned' as Gig['jobStatus'],
  });

  useEffect(() => {
    if (gig) {
      setFormData({
        jobTitle: gig.jobTitle,
        jobDescription: gig.jobDescription,
        clientName: gig.clientName,
        clientPhone: gig.clientPhone || '',
        clientEmail: gig.clientEmail || '',
        clientAddress: gig.clientAddress || '',
        date: gig.date,
        time: gig.time || '',
        jobLocation: gig.jobLocation || '',
        jobCost: gig.jobCost?.toString() ?? '',
        hoursWorked: gig.hoursWorked?.toString() ?? '',
        jobStatus: gig.jobStatus || 'Planned',
      });
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
      id: gig?.id ?? Date.now(),
      jobCost: formData.jobCost ? parseFloat(formData.jobCost) : undefined,
      hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : undefined,
      jobStatus: formData.jobStatus,
    };
    onSave(gigToSave);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
        <header className="bg-purple-700 text-white shadow-md sticky top-0 z-10">
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">{gig ? 'Edit Gig' : 'Add New Gig'}</h1>
                <button onClick={onCancel} className="text-sm font-medium hover:underline">Cancel</button>
            </div>
        </header>

        <main className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gig Details */}
                    <InputField name="jobTitle" label="Job Title / Event Name" value={formData.jobTitle} onChange={handleChange} required />
                    <InputField name="jobLocation" label="Venue / Location" value={formData.jobLocation} onChange={handleChange} />
                    <InputField name="date" label="Date" type="date" value={formData.date} onChange={handleChange} required />
                    <InputField name="time" label="Time" type="time" value={formData.time} onChange={handleChange} />
                    <InputField name="jobCost" label="Payment ($)" type="number" value={formData.jobCost} onChange={handleChange} />
                    <InputField name="hoursWorked" label="Hours" type="number" value={formData.hoursWorked} onChange={handleChange} />
                    <div>
                        <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Status</label>
                        <select id="jobStatus" name="jobStatus" value={formData.jobStatus} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
                            <option>Planned</option>
                            <option>Confirmed</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Description / Notes</label>
                        <textarea id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleChange} rows={3} className="mt-1 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                    </div>

                    {/* Client Details */}
                    <h3 className="text-lg font-semibold text-gray-800 md:col-span-2 border-b pb-2 mt-4">Client Information</h3>
                    <InputField name="clientName" label="Client Name" value={formData.clientName} onChange={handleChange} required />
                    <InputField name="clientPhone" label="Phone" type="tel" value={formData.clientPhone} onChange={handleChange} />
                    <InputField name="clientEmail" label="Email" type="email" value={formData.clientEmail} onChange={handleChange} />
                    <div className="md:col-span-2">
                         <InputField name="clientAddress" label="Client/Venue Address" value={formData.clientAddress} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    {gig && <button type="button" onClick={() => onDelete(gig.id)} className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Delete</button>}
                    <button type="submit" className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Save Gig</button>
                </div>
            </form>
        </main>
    </div>
  );
};

export default GigForm;
