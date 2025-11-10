import React, { useState, useEffect } from 'react';
import type { Gig } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onDelete: (gigId: string) => void;
  onBack: () => void;
}

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onDelete, onBack }) => {
  const [formData, setFormData] = useState<Omit<Gig, 'id'>>({
    title: '',
    company: '',
    location: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    status: 'Lead',
    date: new Date().toISOString().split('T')[0], // Default to today
    notes: '',
  });

  useEffect(() => {
    if (gig) {
      setFormData(gig);
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gig) {
        onSave({ ...formData, id: gig.id });
    } else {
        // id will be assigned in App.tsx
        onSave(formData as Gig);
    }
  };
  
  const handleDelete = () => {
    if (gig && window.confirm('Are you sure you want to delete this gig?')) {
        onDelete(gig.id);
    }
  }

  const formInputStyle = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500";
  const formLabelStyle = "block text-sm font-medium text-gray-700";

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <header className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{gig ? 'Edit Gig' : 'Add New Gig'}</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className={formLabelStyle}>Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={formInputStyle} />
        </div>
        <div>
          <label htmlFor="company" className={formLabelStyle}>Company</label>
          <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} required className={formInputStyle} />
        </div>
        <div>
          <label htmlFor="location" className={formLabelStyle}>Location</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={formInputStyle} />
        </div>
        <div>
          <label htmlFor="date" className={formLabelStyle}>Date</label>
          <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className={formInputStyle} />
        </div>
        <div>
          <label htmlFor="status" className={formLabelStyle}>Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className={formInputStyle}>
            <option>Lead</option>
            <option>Booked</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <h2 className="text-xl font-semibold pt-4 border-t mt-6">Contact Info</h2>
        <div>
          <label htmlFor="contactName" className={formLabelStyle}>Name</label>
          <input type="text" name="contactName" id="contactName" value={formData.contactName} onChange={handleChange} className={formInputStyle} />
        </div>
        <div>
          <label htmlFor="contactPhone" className={formLabelStyle}>Phone</label>
          <input type="tel" name="contactPhone" id="contactPhone" value={formData.contactPhone} onChange={handleChange} className={formInputStyle} />
        </div>
        <div>
          <label htmlFor="contactEmail" className={formLabelStyle}>Email</label>
          <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleChange} className={formInputStyle} />
        </div>
        <div>
          <label htmlFor="notes" className={formLabelStyle}>Notes</label>
          <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={4} className={formInputStyle} />
        </div>
        <div className="flex justify-between items-center pt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Gig</button>
            {gig && <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Delete Gig</button>}
        </div>
      </form>
    </div>
  );
};

export default GigForm;
