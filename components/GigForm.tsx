
import React, { useState, useEffect } from 'react';
import type { Gig, GigStatus } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
  onDelete: (gigId: string) => void;
}

const emptyFormState = {
    jobTitle: '',
    description: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    jobCost: '',
    taxRate: '',
    hoursWorked: '',
    jobSite: '',
    jobStatus: 'Scheduled' as GigStatus,
};

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(emptyFormState);

  useEffect(() => {
    if (gig) {
      setFormData({
        jobTitle: gig.jobTitle,
        description: gig.description,
        clientName: gig.clientName,
        clientPhone: gig.clientPhone,
        clientEmail: gig.clientEmail,
        clientAddress: gig.clientAddress,
        date: gig.date ? new Date(gig.date).toISOString().split('T')[0] : '',
        time: gig.time,
        jobCost: gig.jobCost?.toString() ?? '',
        taxRate: gig.taxRate?.toString() ?? '',
        hoursWorked: gig.hoursWorked?.toString() ?? '',
        jobSite: gig.jobSite,
        jobStatus: gig.jobStatus,
      });
    } else {
      setFormData(emptyFormState);
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
      id: gig?.id || new Date().toISOString() + Math.random(), // Simple ID generation
      jobCost: formData.jobCost ? parseFloat(formData.jobCost) : undefined,
      taxRate: formData.taxRate ? parseFloat(formData.taxRate) : undefined,
      hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : undefined,
      jobStatus: formData.jobStatus,
    };
    onSave(gigToSave);
  };

  const handleDelete = () => {
    if (gig) {
      onDelete(gig.id);
    }
  }

  const gigStatuses: GigStatus[] = ['Scheduled', 'Pending', 'Working', 'Complete'];
  
  // Inline styles to guarantee appearance regardless of CSS build status
  const commonInputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    borderRadius: '0.75rem', // rounded-xl
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const sectionTitleStyle: React.CSSProperties = {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#581c87', // purple-900
      marginBottom: '1rem',
      paddingLeft: '0.25rem'
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#9333ea', color: 'white', padding: '1rem', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <button onClick={onCancel} style={{ padding: '0.5rem', borderRadius: '9999px', marginRight: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
          <ArrowLeftIcon style={{ width: '24px', height: '24px' }} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{gig ? 'Edit Gig' : 'Add New Gig'}</h2>
      </header>

      {/* Form Content - Scrolling, Stacked Layout */}
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '28rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
          
          {/* Job Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={sectionTitleStyle}>Job Information</h3>
            
            <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required style={commonInputStyle} />
            
            <input type="text" name="jobSite" placeholder="Job Site / Location" value={formData.jobSite} onChange={handleChange} required style={commonInputStyle} />
            
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={4} required style={{ ...commonInputStyle, resize: 'none' }}></textarea>
            
            <select name="jobStatus" value={formData.jobStatus} onChange={handleChange} style={commonInputStyle}>
                {gigStatuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          {/* Client Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={sectionTitleStyle}>Client Details</h3>
            
            <input type="text" name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleChange} required style={commonInputStyle} />
            
            <input type="tel" name="clientPhone" placeholder="Client Phone" value={formData.clientPhone} onChange={handleChange} required style={commonInputStyle} />
            
            <input type="email" name="clientEmail" placeholder="Client Email" value={formData.clientEmail} onChange={handleChange} required style={commonInputStyle} />
            
            <input type="text" name="clientAddress" placeholder="Client Address" value={formData.clientAddress} onChange={handleChange} required style={commonInputStyle} />
          </div>
          
          {/* Schedule & Pay */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={sectionTitleStyle}>Schedule & Pay</h3>
            
            <div style={{ marginBottom: '1rem' }}>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', marginLeft: '0.25rem' }}>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ ...commonInputStyle, marginBottom: 0 }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', marginLeft: '0.25rem' }}>Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required style={{ ...commonInputStyle, marginBottom: 0 }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="number" name="jobCost" placeholder="Job Cost ($)" value={formData.jobCost} onChange={handleChange} step="0.01" min="0" style={commonInputStyle} />
              <input type="number" name="taxRate" placeholder="Tax (%)" value={formData.taxRate} onChange={handleChange} step="0.01" min="0" style={commonInputStyle} />
            </div>
            
            <input type="number" name="hoursWorked" placeholder="Hours Worked" value={formData.hoursWorked} onChange={handleChange} step="0.1" min="0" style={commonInputStyle} />
          </div>

          {/* Actions - Spaced Apart */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', marginTop: '1rem', paddingBottom: '3rem' }}>
             {gig ? (
               <button type="button" onClick={handleDelete} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                 Delete
               </button>
             ) : (
                <button type="button" onClick={onCancel} style={{ backgroundColor: '#d1d5db', color: '#1f2937', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 500, fontSize: '1.125rem', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
             )}
            
            <button type="submit" style={{ backgroundColor: '#9333ea', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 500, fontSize: '1.125rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              {gig ? 'Save Changes' : 'Add Gig'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GigForm;
