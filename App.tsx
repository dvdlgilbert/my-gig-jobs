
// FIX: Implemented the main App component to manage and display gigs.
// This resolves the parsing errors caused by placeholder content and the 'not a module' error.
import React, { useState, useEffect } from 'react';
import type { Gig } from './types';
import { getGigs, saveGigs } from './services/storageService';
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import DatabaseIcon from './components/icons/DatabaseIcon';

function App() {
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
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = gigs.filter(item => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredGigs(filteredData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [gigs, searchTerm]);

  const handleAddGig = () => {
    setSelectedGig(null);
    setIsFormOpen(true);
  };

  const handleEditGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsFormOpen(true);
  };

  const handleDeleteGig = (id: number) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      setGigs(gigs.filter(gig => gig.id !== id));
    }
  };

  const handleSaveGig = (gig: Gig) => {
    if (gig.id) {
      setGigs(gigs.map(g => (g.id === gig.id ? gig : g)));
    } else {
      const newGig = { ...gig, id: Date.now() };
      setGigs([...gigs, newGig]);
    }
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedGig(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-purple-700 text-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Gig Jobs</h1>
          <button
            onClick={handleAddGig}
            className="bg-white text-purple-700 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-purple-100 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Gig
          </button>
        </div>
        {!isFormOpen && <div className="container mx-auto px-4 pb-4">
           <div className="relative">
            <input
              type="text"
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 border-2 border-transparent focus:outline-none focus:border-purple-300"
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>}
      </header>

      <main className="container mx-auto p-4">
        {isFormOpen ? (
          <GigForm
            gig={selectedGig}
            onSave={handleSaveGig}
            onClose={handleCloseForm}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.length > 0 ? (
                filteredGigs.map(gig => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  onEdit={handleEditGig}
                  onDelete={handleDeleteGig}
                />
              ))
            ) : (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <DatabaseIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Gigs Yet</h2>
                    <p>Click the "New Gig" button to add your first job.</p>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
