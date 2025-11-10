import React, { useState, useEffect } from 'react';
import type { Gig, GigStatus } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
}

const initialGigState: Omit<Gig, 'id' | 'dateApplied'> & { dateApplied: string } = {
  company: '',
  role: '',
  status: 'Wishlist',
  dateApplied: new Date().toISOString().split('T')[0],
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  location: '',
  notes: '',
  url: ''
};

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...initialGigState });

  useEffect(() => {
    if (gig) {
      setFormData({
        ...gig,
        dateApplied: new Date(gig.dateApplied).toISOString().split('T')[0],
      });
    } else {
      setFormData({ ...initialGigState });
    }
  }, [gig]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    // Convert date string back to ISO string for storage
    const gigToSave = {
      ...formData,
      id: gig?.id || crypto.randomUUID(), // Use existing id or generate a new one
      dateApplied: new Date(formData.dateApplied).toISOString(),
    };
    onSave(gigToSave as Gig);
  };
  
  const statusOptions: GigStatus[] = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  return (
    <div className="p-4 md:p-6">
       <div className="flex items-center mb-6">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-200 mr-4">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">{gig ? 'Edit Gig' : 'Add New Gig'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role *</label>
            <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company *</label>
            <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
              {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700">Date Applied *</label>
            <input type="date" name="dateApplied" id="dateApplied" value={formData.dateApplied} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
         <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">Job Posting URL</label>
            <input type="url" name="url" id="url" value={formData.url || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" id="location" value={formData.location || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 pt-4 border-t">Contact Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="contactName" id="contactName" value={formData.contactName || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" name="contactPhone" id="contactPhone" value={formData.contactPhone || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
        <div className="pt-5 flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">Save Gig</button>
        </div>
      </form>
    </div>
  );
};

export default GigForm;
