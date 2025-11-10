import React, { useState, useEffect, useMemo } from 'react';
import { getGigs, saveGigs } from './services/storageService';
import type { Gig } from './types';
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import DatabaseIcon from './components/icons/DatabaseIcon';

const App: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setGigs(getGigs());
  }, []);

  const handleSaveGig = (gig: Gig) => {
    let updatedGigs;
    if (gigs.some(g => g.id === gig.id)) {
      // Update existing gig
      updatedGigs = gigs.map(g => g.id === gig.id ? gig : g);
    } else {
      // Add new gig
      updatedGigs = [...gigs, gig];
    }
    setGigs(updatedGigs);
    saveGigs(updatedGigs);
    setIsFormVisible(false);
    setSelectedGig(null);
  };

  const handleDeleteGig = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      const updatedGigs = gigs.filter(g => g.id !== id);
      setGigs(updatedGigs);
      saveGigs(updatedGigs);
    }
  };

  const handleEditGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsFormVisible(true);
  };
  
  const handleAddNewGig = () => {
    setSelectedGig(null);
    setIsFormVisible(true);
  }

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedGig(null);
  };

  const filteredGigs = useMemo(() => {
    return gigs.filter(gig => 
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [gigs, searchTerm]);

  if (isFormVisible) {
    return <GigForm gig={selectedGig} onSave={handleSaveGig} onCancel={handleCancelForm} />;
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">My Gig Jobs</h1>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search by title, company, location..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map(gig => (
              <GigCard key={gig.id} gig={gig} onEdit={handleEditGig} onDelete={handleDeleteGig} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <DatabaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-xl font-semibold text-gray-700">No Gigs Found</h2>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'Try adjusting your search.' : 'Get started by adding a new gig.'}
            </p>
          </div>
        )}
      </main>

      <button
        onClick={handleAddNewGig}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110"
        aria-label="Add new gig"
      >
        <PlusIcon className="h-8 w-8" />
      </button>
    </div>
  );
};

export default App;
