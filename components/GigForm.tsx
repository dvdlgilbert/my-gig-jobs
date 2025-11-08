import React, { useState, useEffect } from 'react';
import type { Gig, GigDetails, GigPlan } from '../types';
import { generateGigPlan } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import IdeaCard from './IdeaCard';
import SparklesIcon from './icons/SparklesIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import ShareIcon from './icons/ShareIcon';

interface GigFormProps {
  gig?: Gig;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
}

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState<Omit<Gig, 'id' | 'jobCost' | 'hoursWorked'> & {jobCost: string | number, hoursWorked: string | number}>({
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
    jobStatus: 'Planned',
  });

  const [gigDetails, setGigDetails] = useState<GigDetails>({
    artistName: '',
    venue: '',
    eventType: '',
    genre: '',
    audienceVibe: 'energetic and dancing',
  });

  const [gigPlan, setGigPlan] = useState<GigPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gig) {
      setFormData({
        ...gig,
        jobCost: gig.jobCost?.toString() ?? '',
        hoursWorked: gig.hoursWorked?.toString() ?? '',
      });
      setGigDetails(prev => ({
        ...prev,
        venue: gig.jobLocation || gig.clientAddress || '',
        eventType: gig.jobTitle || '',
      }));
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGigDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gigToSave: Gig = {
      ...formData,
      id: gig?.id ?? Date.now(),
      jobCost: formData.jobCost ? parseFloat(formData.jobCost as string) : undefined,
      hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked as string) : undefined,
    };
    onSave(gigToSave);
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError(null);
    setGigPlan(null);
    try {
      const plan = await generateGigPlan(gigDetails);
      setGigPlan(plan);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const isGeneratorDisabled = Object.values(gigDetails).some(v => v.trim() === '');

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

            {/* AI Gig Planner */}
            <div className="mt-8 bg-gray-900 text-white p-6 rounded-2xl shadow-2xl border border-purple-800/50">
                <div className="flex items-center gap-3 mb-4">
                    <SparklesIcon className="h-8 w-8 text-purple-400" />
                    <h2 className="text-2xl font-bold">AI Gig Planner</h2>
                </div>
                <p className="text-gray-400 mb-6">Fill in the details below to generate a custom-tailored gig plan, including setlist ideas, stage banter, and a promotional social media post.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <AIField name="artistName" label="Artist/Band Name" value={gigDetails.artistName} onChange={handleDetailsChange} placeholder="e.g., The Cosmic Keys" />
                    <AIField name="genre" label="Music Genre" value={gigDetails.genre} onChange={handleDetailsChange} placeholder="e.g., Indie Rock, Jazz Fusion" />
                    <AIField name="venue" label="Venue Type" value={gigDetails.venue} onChange={handleDetailsChange} placeholder="e.g., Coffee Shop, Music Hall" />
                    <AIField name="eventType" label="Event Type" value={gigDetails.eventType} onChange={handleDetailsChange} placeholder="e.g., Wedding, Corporate Event" />
                    <div className="md:col-span-2">
                        <label htmlFor="audienceVibe" className="block text-sm font-medium text-gray-400 mb-1">Desired Audience Vibe</label>
                        <textarea id="audienceVibe" name="audienceVibe" value={gigDetails.audienceVibe} onChange={handleDetailsChange} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                </div>

                <button 
                    onClick={handleGeneratePlan} 
                    disabled={isLoading || isGeneratorDisabled}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Generating...' : 'Generate Gig Plan'}
                </button>

                {isLoading && <LoadingSpinner />}
                {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}

                {gigPlan && (
                    <div className="mt-8 space-y-6 animate-fade-in">
                        <IdeaCard title="Setlist Idea" icon={<MusicNoteIcon className="h-6 w-6" />} >
                            <ol className="list-decimal list-inside space-y-1">
                                {gigPlan.setlist.map((song, index) => <li key={index}>{song}</li>)}
                            </ol>
                        </IdeaCard>
                        <IdeaCard title="Stage Banter" icon={<MicrophoneIcon className="h-6 w-6" />} >
                             <ul className="list-disc list-inside space-y-2">
                                {gigPlan.banter.map((line, index) => <li key={index}>{line}</li>)}
                            </ul>
                        </IdeaCard>
                        <IdeaCard title="Social Media Post" icon={<ShareIcon className="h-6 w-6" />} >
                            <p className="whitespace-pre-wrap font-mono text-sm bg-gray-900/70 p-3 rounded-md">{gigPlan.socialMediaPost}</p>
                        </IdeaCard>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};

// Helper components for form fields to reduce repetition
const InputField: React.FC<{name: string, label: string, value?: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, type?: string, required?: boolean}> = 
({name, label, value, onChange, type = 'text', required = false}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} className="mt-1 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
    </div>
);

const AIField: React.FC<{name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string}> = 
({name, label, value, onChange, placeholder}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
    </div>
);


export default GigForm;
