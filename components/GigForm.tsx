import React, { useState, useEffect } from 'react';
// FIX: Correctly import GoogleGenAI and Type from @google/genai
import { GoogleGenAI, Type } from '@google/genai';
import type { Gig } from '../types';
import TextIcon from './icons/TextIcon';

interface GigFormProps {
  gig: Gig | null;
  onSave: (gig: Gig) => void;
  onCancel: () => void;
}

const GigForm: React.FC<GigFormProps> = ({ gig, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Gig>>({
    jobTitle: '',
    jobDescription: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    date: '',
    time: '',
    jobLocation: '',
    jobCost: 0,
    hoursWorked: 0,
    jobStatus: 'Planned',
  });
  const [textInput, setTextInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    if (gig) {
      setFormData(gig);
    }
  }, [gig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const valueToSet = e.target.type === 'number' && value !== '' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: valueToSet }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.clientName || !formData.date) {
      alert('Please fill in at least Job Title, Client Name, and Date.');
      return;
    }
    onSave(formData as Gig);
  };
  
  const parseWithAI = async () => {
    if (!textInput.trim()) return;
    setIsParsing(true);
    try {
      // FIX: Use new GoogleGenAI with named apiKey parameter
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      
      const prompt = `Parse the following text and extract gig details. Today's date is ${new Date().toLocaleDateString()}.
      Text: "${textInput}"
      
      Extract the following fields:
      - jobTitle: string
      - jobDescription: string
      - clientName: string
      - clientPhone: string (if present)
      - clientEmail: string (if present)
      - clientAddress: string (if present)
      - date: string (in YYYY-MM-DD format)
      - time: string (in HH:MM 24-hour format, if present)
      - jobLocation: string (if present, can be same as clientAddress)
      - jobCost: number (if present)
      - hoursWorked: number (if present)
      - jobStatus: 'Planned', 'Confirmed', 'Completed', or 'Cancelled'. Default to 'Planned'.
      `;

      // FIX: Use ai.models.generateContent with responseSchema for JSON output.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              jobTitle: { type: Type.STRING },
              jobDescription: { type: Type.STRING, description: 'A brief summary of the job.' },
              clientName: { type: Type.STRING },
              clientPhone: { type: Type.STRING },
              clientEmail: { type: Type.STRING },
              clientAddress: { type: Type.STRING },
              date: { type: Type.STRING, description: 'The date of the gig in YYYY-MM-DD format.' },
              time: { type: Type.STRING, description: 'The time of the gig in HH:MM 24-hour format.' },
              jobLocation: { type: Type.STRING },
              jobCost: { type: Type.NUMBER },
              hoursWorked: { type: Type.NUMBER },
              jobStatus: { type: Type.STRING, description: "Can be 'Planned', 'Confirmed', 'Completed', or 'Cancelled'." },
            },
          },
        },
      });

      // FIX: Correctly access the text response
      const jsonText = response.text;
      const parsedData = JSON.parse(jsonText);
      
      setFormData(prev => ({
        ...prev,
        ...Object.fromEntries(Object.entries(parsedData).filter(([, v]) => v !== null && v !== undefined && v !== ''))
      }));

    } catch (error) {
      console.error('Error parsing with AI:', error);
      alert('Failed to parse text with AI. Please check your API key and try again.');
    } finally {
      setIsParsing(false);
    }
  };
  
  const formattedDate = formData.date ? new Date(formData.date).toISOString().split('T')[0] : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
       <div className="p-4 border rounded-lg bg-gray-50">
          <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-2">
              Describe the gig in plain text (and let AI fill the form):
          </label>
          <textarea
              id="textInput"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Photoshoot for John Doe's wedding tomorrow at 2 PM at 123 Main St. It will take 4 hours and pay $500. His number is 555-1234."
          />
          <button
              type="button"
              onClick={parseWithAI}
              disabled={isParsing || !textInput}
              className="mt-2 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
              {isParsing ? 'Parsing...' : 'Parse with AI'}
              <TextIcon className="ml-2 h-5 w-5" />
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title *</label>
          <input type="text" name="jobTitle" id="jobTitle" value={formData.jobTitle || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name *</label>
          <input type="text" name="clientName" id="clientName" value={formData.clientName || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
        <textarea name="jobDescription" id="jobDescription" value={formData.jobDescription || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Client Phone</label>
          <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email</label>
          <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      
      <div>
        <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700">Location</label>
        <input type="text" name="jobLocation" id="jobLocation" value={formData.jobLocation || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
          <input type="date" name="date" id="date" value={formattedDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
          <input type="time" name="time" id="time" value={formData.time || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="jobCost" className="block text-sm font-medium text-gray-700">Cost ($)</label>
          <input type="number" name="jobCost" id="jobCost" value={formData.jobCost || 0} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700">Hours</label>
          <input type="number" name="hoursWorked" id="hoursWorked" value={formData.hoursWorked || 0} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="jobStatus" className="block text-sm font-medium text-gray-700">Status</label>
        <select name="jobStatus" id="jobStatus" value={formData.jobStatus} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option>Planned</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save Gig
        </button>
      </div>
    </form>
  );
};

export default GigForm;
