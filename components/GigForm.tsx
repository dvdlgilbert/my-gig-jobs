import React, { useState, useEffect } from 'react';
import type { Gig, GigStatus } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
  onDelete: (gigId: string) => void;
}

const initialFormData: Omit<Gig, 'id' | 'date'> & { date: string } = {
  jobTitle: '',
  description: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  jobCost: undefined,
  hoursWorked: undefined,
  jobSite: '',
  jobStatus: 'Scheduled',
};

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (gig) {
      setFormData({
        jobTitle: gig.jobTitle,
        description: gig.description,
        clientName: gig.clientName,
        clientPhone: gig.clientPhone,
        clientEmail: gig.clientEmail,
        clientAddress: gig.clientAddress,
        date: new Date(gig.date).toISOString().split('T')[0],
        time: gig.time,
        jobCost: gig.jobCost,
        hoursWorked: gig.hoursWorked,
        jobSite: gig.jobSite,
        jobStatus: gig.jobStatus,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gigToSave: Gig = {
      id: gig?.id || crypto.randomUUID(),
      ...formData,
      date: new Date(`${formData.date}T${formData.time}`).toISOString(),
    };
    onSave(gigToSave);
  };
  
  const isEditing = !!gig;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto">
       <header className="flex items-center mb-6">
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 mr-4">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Gig' : 'Add New Gig'}</h2>
      </header>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
          <input type="text" name="jobTitle" id="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm"></textarea>
        </div>
        
        <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-medium text-gray-900">Client Details</legend>
          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
             <div>
               <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
               <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
             </div>
             <div>
                <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Client Phone</label>
                <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
             </div>
              <div className="sm:col-span-2">
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email</label>
                <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
             </div>
             <div className="sm:col-span-2">
                <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Client Address</label>
                <input type="text" name="clientAddress" id="clientAddress" value={formData.clientAddress} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
             </div>
          </div>
        </fieldset>
        
        <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-medium text-gray-900">Job Details</legend>
          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>
             <div className="sm:col-span-2">
                <label htmlFor="jobSite" className="block text-sm font-medium text-gray-700">Job Site / Location</label>
                <input type="text" name="jobSite" id="jobSite" value={formData.jobSite} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
             </div>
          </div>
        </fieldset>

         <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-medium text-gray-900">Financials & Status</legend>
          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label htmlFor="jobCost" className="block text-sm font-medium text-gray-700">Job Cost ($)</label>
              <input type="number" name="jobCost" id="jobCost" value={formData.jobCost ?? ''} onChange={handleNumberChange} min="0" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>

            <div>
              <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700">Hours Worked</label>
              <input type="number" name="hoursWorked" id="hoursWorked" value={formData.hoursWorked ?? ''} onChange={handleNumberChange} min="0" step="0.1" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Job Status</label>
              <select id="jobStatus" name="jobStatus" value={formData.jobStatus} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm rounded-md">
                <option>Scheduled</option>
                <option>Pending</option>
                <option>Working</option>
                <option>Complete</option>
              </select>
            </div>
          </div>
        </fieldset>
        
        <div className="pt-5">
            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                {isEditing && (
                     <button type="button" onClick={() => gig && onDelete(gig.id)} className="w-full sm:w-auto bg-red-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Delete
                    </button>
                )}
                <div className="flex w-full sm:w-auto justify-end space-x-3">
                  <button type="button" onClick={onCancel} className="flex-1 sm:flex-none bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple">
                      Cancel
                  </button>
                  <button type="submit" className="flex-1 sm:flex-none bg-brand-purple text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple">
                      Save Gig
                  </button>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
};

export default GigForm;
