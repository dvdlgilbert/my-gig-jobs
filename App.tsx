import React, { useState, useEffect } from 'react';
import type { Gig } from './types';
import { getGigs, saveGigs } from './services/storageService';
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';

const App: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setGigs(getGigs());
  }, []);

  useEffect(() => {
    saveGigs(gigs);
    const sortedGigs = [...gigs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const filtered = sortedGigs.filter(gig =>
      gig.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGigs(filtered);
  }, [gigs, searchTerm]);

  const handleSaveGig = (gig: Gig) => {
    if (gig.id) {
      setGigs(gigs.map(g => (g.id === gig.id ? gig : g)));
    } else {
      setGigs([...gigs, { ...gig, id: Date.now() }]);
    }
    setIsFormOpen(false);
    setSelectedGig(null);
  };

  const handleDeleteGig = (id: number) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      setGigs(gigs.filter(gig => gig.id !== id));
    }
  };

  const handleEditGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsFormOpen(true);
  };

  const openFormForNewGig = () => {
    setSelectedGig(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedGig(null);
  }

  if (isFormOpen) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <header className="flex items-center mb-4">
          <button onClick={closeForm} className="mr-4 p-2 rounded-full hover:bg-gray-200">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{selectedGig ? 'Edit Gig' : 'Add New Gig'}</h1>
        </header>
        <GigForm gig={selectedGig} onSave={handleSaveGig} onCancel={closeForm} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Gigs</h1>
        <button
          onClick={openFormForNewGig}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-lg"
        >
          <PlusIcon className="h-6 w-6 mr-2" />
          Add Gig
        </button>
      </header>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search gigs by title or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map(gig => (
            <GigCard key={gig.id} gig={gig} onEdit={handleEditGig} onDelete={handleDeleteGig} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">{searchTerm ? `No gigs found for "${searchTerm}"` : "No gigs found. Add one to get started!"}</p>
        </div>
      )}
    </div>
  );
};

export default App;
