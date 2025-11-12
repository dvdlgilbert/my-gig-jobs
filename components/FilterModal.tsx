import React, { useState, useEffect } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (month: string, year: string) => void;
  onClear: () => void;
  initialMonth: string;
  initialYear: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, onClear, initialMonth, initialYear }) => {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    setMonth(initialMonth);
    setYear(initialYear);
  }, [initialMonth, initialYear, isOpen]);
  
  if (!isOpen) return null;

  const handleApply = () => {
    onApply(month, year);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Gigs by Date</h2>
          <p className="text-sm text-gray-600 mb-6">Enter a month, year, or both to filter your gigs. Leave fields blank to ignore them.</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="filterMonth" className="block text-sm font-medium text-gray-700">Month (MM)</label>
              <input 
                type="text" 
                name="filterMonth" 
                id="filterMonth" 
                value={month}
                onChange={e => setMonth(e.target.value)}
                placeholder="e.g., 07 for July"
                maxLength={2}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="filterYear" className="block text-sm font-medium text-gray-700">Year (YYYY)</label>
              <input 
                type="text" 
                name="filterYear" 
                id="filterYear" 
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="e.g., 2025"
                maxLength={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 flex flex-wrap justify-between items-center gap-2">
           <button onClick={onClear} className="text-sm text-brand-purple hover:underline font-medium">
            Clear Filter
          </button>
          <div className="flex gap-2">
             <button onClick={onClose} className="text-sm bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 font-medium">
              Cancel
            </button>
            <button onClick={handleApply} className="text-sm bg-brand-purple text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
