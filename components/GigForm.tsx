import React, { useState, useEffect } from 'react';
import type { Gig, GigStatus } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const initialGigState: Omit<Gig, 'id'> = {
  jobTitle: '',
  description: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  jobCost: undefined,
  hoursWorked: undefined,
  jobSite: '',
  jobStatus: 'Scheduled',
};

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({ ...initialGigState });

  useEffect(() => {
    if (gig) {
      setFormData({
        ...gig,
        date: new Date(gig.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({ ...initialGigState });
    }
  }, [gig]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = value === '' ? undefined : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle) {
      alert('Job Title is required.');
      return;
    };

    const gigToSave: Gig = {
      ...formData,
      id: gig?.id || crypto.randomUUID(),
      date: new Date(formData.date).toISOString(),
    };
    onSave(gigToSave);
  };
  
  const statusOptions: GigStatus[] = ['Scheduled', 'Pending', 'Working', 'Complete'];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <header className="bg-brand-purple -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-6 p-4 rounded-t-lg flex items-center">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/20 text-white">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white ml-4">{gig ? 'Update GiG' : 'Add New Gig'}</h1>
      </header>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
          <InputField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} required />
        </div>
         <InputField label="Job Description" name="description" value={formData.description} onChange={handleChange} isTextArea />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Time" name="time" type="time" value={formData.time} onChange={handleChange} required />
          <div>
            <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Job Status</label>
            <select name="jobStatus" id="jobStatus" value={formData.jobStatus} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 focus:ring-brand-purple focus:border-brand-purple">
              {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Job Cost ($)" name="jobCost" type="number" value={formData.jobCost || ''} onChange={handleChange} />
          <InputField label="Hours Worked" name="hoursWorked" type="number" value={formData.hoursWorked || ''} onChange={handleChange} />
        </div>
        
        {/* Client Details */}
        <h3 className="text-lg font-medium text-gray-900 pt-4 border-t">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} required />
          <InputField label="Client Phone" name="clientPhone" type="tel" value={formData.clientPhone} onChange={handleChange} />
        </div>
        <InputField label="Client Email" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleChange} />
        <InputField label="Address" name="clientAddress" value={formData.clientAddress} onChange={handleChange} isTextArea />
        <InputField label="Job Site Location" name="jobSite" value={formData.jobSite} onChange={handleChange} isTextArea />

        <div className="pt-5 flex justify-center space-x-4">
           <button type="submit" className="px-10 py-3 bg-brand-purple text-white rounded-md hover:bg-purple-700 font-bold text-lg w-full md:w-auto">
            {gig ? 'UPDATE GIG' : 'ADD GIG'}
           </button>
           {gig && (
             <button type="button" onClick={() => onDelete(gig.id)} className="px-10 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-bold text-lg w-full md:w-auto">
               Delete GiG
             </button>
           )}
        </div>
      </form>
    </div>
  );
};

// Helper component for form fields
const InputField = ({ label, name, value, onChange, type = 'text', required = false, isTextArea = false }) => {
  const commonProps = {
    name,
    id: name,
    value,
    onChange,
    required,
    className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 focus:ring-brand-purple focus:border-brand-purple",
    placeholder: label
  };
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && ' *'}</label>
      {isTextArea ? (
        <textarea {...commonProps} rows={3}></textarea>
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};

export default GigForm;
