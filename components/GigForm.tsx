
import React, { useState, useEffect, useRef } from 'react';
import type { Gig, GigStatus, Expense } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface GigFormProps {
  gig: Gig | null;
  initialSection?: 'top' | 'expenses';
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
    taxRate: '0',
    hoursWorked: '',
    jobSite: '',
    jobStatus: 'Scheduled' as GigStatus,
};

const GigForm: React.FC<GigFormProps> = ({ gig, initialSection = 'top', onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(emptyFormState);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmt, setNewExpenseAmt] = useState('');
  
  const expensesRef = useRef<HTMLDivElement>(null);

  // Sync state when editing an existing gig
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
        taxRate: gig.taxRate?.toString() ?? '0',
        hoursWorked: gig.hoursWorked?.toString() ?? '',
        jobSite: gig.jobSite,
        jobStatus: gig.jobStatus,
      });
      setExpenses(gig.expenses || []);
      
      // Mirror Android behavior: Jump to expenses if user selected "Manage Expenses"
      if (initialSection === 'expenses') {
        setTimeout(() => {
          expensesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      setFormData(emptyFormState);
      setExpenses([]);
    }
  }, [gig, initialSection]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = () => {
    if (!newExpenseDesc || !newExpenseAmt) return;
    const expense: Expense = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      description: newExpenseDesc,
      amount: parseFloat(newExpenseAmt) || 0
    };
    setExpenses([...expenses, expense]);
    setNewExpenseDesc('');
    setNewExpenseAmt('');
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: gig?.id || Date.now().toString(),
      jobCost: formData.jobCost ? parseFloat(formData.jobCost) : undefined,
      taxRate: formData.taxRate ? parseFloat(formData.taxRate) : undefined,
      hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : undefined,
      expenses: expenses,
    });
  };

  const sectionTitleStyle: React.CSSProperties = {
      fontSize: '1.125rem', fontWeight: 700, color: '#581c87', marginBottom: '1.25rem', marginTop: '1.5rem', borderLeft: '4px solid #9333ea', paddingLeft: '0.75rem'
  };

  const commonInputStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '0.875rem 1rem', marginBottom: '1.25rem',
    borderRadius: '0.75rem', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', backgroundColor: 'white'
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#9333ea', color: 'white', padding: '1rem', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}>
          <ArrowLeftIcon style={{ width: '24px', height: '24px' }} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginLeft: '0.5rem' }}>{gig ? 'Update Gig Details' : 'Create New Job Record'}</h2>
      </header>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '34rem', margin: '0 auto', padding: '2rem 1.25rem' }}>
          
          <h3 style={sectionTitleStyle}>General Information</h3>
          <input type="text" name="jobTitle" placeholder="What is the job called?" value={formData.jobTitle} onChange={handleChange} required style={commonInputStyle} />
          <input type="text" name="jobSite" placeholder="Where is the site located?" value={formData.jobSite} onChange={handleChange} required style={commonInputStyle} />
          <textarea name="description" placeholder="Provide a brief scope of work..." value={formData.description} onChange={handleChange} rows={3} required style={{ ...commonInputStyle, resize: 'none' }}></textarea>
          
          <h3 style={sectionTitleStyle}>Client Connection</h3>
          <input type="text" name="clientName" placeholder="Client Contact Name" value={formData.clientName} onChange={handleChange} required style={commonInputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="tel" name="clientPhone" placeholder="Phone Number" value={formData.clientPhone} onChange={handleChange} required style={commonInputStyle} />
            <input type="email" name="clientEmail" placeholder="Email Address" value={formData.clientEmail} onChange={handleChange} required style={commonInputStyle} />
          </div>
          <input type="text" name="clientAddress" placeholder="Full Billing/Mailing Address" value={formData.clientAddress} onChange={handleChange} required style={commonInputStyle} />

          <h3 style={sectionTitleStyle}>Timing & Financials</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.375rem', fontWeight: 600 }}>Scheduled Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ ...commonInputStyle, marginBottom: 0 }} />
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.375rem', fontWeight: 600 }}>Arrival Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required style={{ ...commonInputStyle, marginBottom: 0 }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
            <input type="number" name="jobCost" placeholder="Labor Charge ($)" value={formData.jobCost} onChange={handleChange} step="0.01" style={commonInputStyle} />
            <input type="number" name="taxRate" placeholder="Tax Rate (%)" value={formData.taxRate} onChange={handleChange} step="0.01" style={commonInputStyle} />
          </div>
          <input type="number" name="hoursWorked" placeholder="Estimated Hours" value={formData.hoursWorked} onChange={handleChange} step="0.1" style={commonInputStyle} />
          
          <div style={{ margin: '1rem 0 2rem 0' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 600 }}>Project Lifecycle Status</label>
            <select name="jobStatus" value={formData.jobStatus} onChange={handleChange} style={commonInputStyle}>
                {['Scheduled', 'Pending', 'Working', 'Complete'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Itemized Expenses Section */}
          <div ref={expensesRef} style={{ marginTop: '2.5rem', backgroundColor: 'white', padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Expenses & Materials
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <input type="text" placeholder="Item/Material Name" value={newExpenseDesc} onChange={e => setNewExpenseDesc(e.target.value)} style={{ ...commonInputStyle, marginBottom: 0, flexGrow: 1 }} />
              <input type="number" placeholder="$" value={newExpenseAmt} onChange={e => setNewExpenseAmt(e.target.value)} style={{ ...commonInputStyle, marginBottom: 0, width: '110px' }} />
              <button type="button" onClick={handleAddExpense} style={{ backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <PlusIcon style={{ width: '24px' }} />
              </button>
            </div>
            
            {expenses.length > 0 ? (
              <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: '1.25rem' }}>
                {expenses.map(exp => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f9fafb' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#374151' }}>{exp.description}</div>
                      <div style={{ fontSize: '0.875rem', color: '#9333ea', fontWeight: 500 }}>${exp.amount.toFixed(2)}</div>
                    </div>
                    <button type="button" onClick={() => handleRemoveExpense(exp.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                      <TrashIcon style={{ width: '20px' }} />
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem', textAlign: 'right', fontWeight: 800, color: '#1f2937', fontSize: '1.125rem' }}>
                  Total Materials: ${expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', border: '2px dashed #f3f4f6', borderRadius: '1rem' }}>
                No materials or expenses added yet.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3rem 0 5rem 0' }}>
            {gig ? (
               <button type="button" onClick={() => onDelete(gig.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem' }}>Delete Entire Gig</button>
            ) : (
               <button type="button" onClick={onCancel} style={{ color: '#6b7280', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem' }}>Discard Draft</button>
            )}
            <button type="submit" style={{ backgroundColor: '#9333ea', color: 'white', padding: '1rem 3rem', borderRadius: '1rem', border: 'none', fontWeight: 800, fontSize: '1.0625rem', cursor: 'pointer', boxShadow: '0 10px 15px rgba(147, 51, 234, 0.25)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              {gig ? 'Update Gig' : 'Save & Create Gig'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GigForm;
