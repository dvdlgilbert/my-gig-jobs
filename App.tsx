import React, { useState, useEffect } from 'react';
import { getGigs, saveGigs } from './services/storageService';
import type { Gig } from './types';
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';

const App: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadedGigs = getGigs();
    setGigs(loadedGigs);
  }, []);

  useEffect(() => {
    saveGigs(gigs);
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = gigs.filter(gig =>
      gig.title.toLowerCase().includes(lowercasedFilter) ||
      gig.company.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredGigs(filtered);
  }, [gigs, searchTerm]);

  const handleSaveGig = (gigToSave: Gig) => {
    if (gigToSave.id) {
      setGigs(gigs.map(gig => (gig.id === gigToSave.id ? gigToSave : gig)));
    } else {
      setGigs([...gigs, { ...gigToSave, id: Date.now().toString() }]);
    }
    setIsFormVisible(false);
    setSelectedGig(null);
  };

  const handleSelectGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsFormVisible(true);
  };

  const handleAddNewGig = () => {
    setSelectedGig(null);
    setIsFormVisible(true);
  };

  const handleDeleteGig = (gigId: string) => {
    setGigs(gigs.filter(gig => gig.id !== gigId));
    setIsFormVisible(false);
    setSelectedGig(null);
  };

  const handleBack = () => {
    setIsFormVisible(false);
    setSelectedGig(null);
  };
  
  if (isFormVisible) {
    return <GigForm gig={selectedGig} onSave={handleSaveGig} onDelete={handleDeleteGig} onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto p-4 font-sans max-w-2xl">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Gigs</h1>
      </header>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search gigs by title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {filteredGigs.length > 0 ? filteredGigs.map(gig => (
          <GigCard key={gig.id} gig={gig} onSelect={() => handleSelectGig(gig)} />
        )) : (
          <p className="text-center text-gray-500 mt-8">No gigs found. Add one!</p>
        )}
      </div>
      <button
        onClick={handleAddNewGig}
        aria-label="Add new gig"
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default App;
