import React, { useState, useEffect, useMemo } from 'react';
import type { Gig } from './types';
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import { getGigs, saveGigs } from './services/storageService';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import DatabaseIcon from './components/icons/DatabaseIcon';

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
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = gigs.filter(item => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredGigs(filteredData);
  }, [gigs, searchTerm]);

  const sortedGigs = useMemo(() => {
    return [...filteredGigs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredGigs]);

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

  const handleSaveGig = (gigToSave: Omit<Gig, 'id'> & { id?: number }) => {
    if (gigToSave.id) {
      setGigs(gigs.map(g => (g.id === gigToSave.id ? { ...g, ...gigToSave } as Gig : g)));
    } else {
      const newGig: Gig = {
        ...gigToSave,
        id: Date.now(),
      };
      setGigs([newGig, ...gigs]);
    }
    setIsFormOpen(false);
    setSelectedGig(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedGig(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-purple-700 text-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">My Gig Jobs</h1>
          <div className="mt-4 md:mt-0 relative">
            <input
              type="text"
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-full bg-purple-600 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <SearchIcon className="h-5 w-5 text-purple-300" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {isFormOpen ? (
          <GigForm
            gig={selectedGig}
            onSave={handleSaveGig}
            onCancel={handleCancel}
          />
        ) : (
          <>
            {sortedGigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedGigs.map(gig => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onEdit={handleEditGig}
                    onDelete={handleDeleteGig}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <DatabaseIcon className="h-16 w-16 mx-auto text-gray-400" />
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Gigs Found</h2>
                <p className="mt-2 text-gray-500">
                  {searchTerm ? `No gigs match your search for "${searchTerm}".` : "You haven't added any gigs yet."}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleAddGig}
                    className="mt-6 px-6 py-2 bg-purple-700 text-white rounded-full font-semibold hover:bg-purple-800 transition-colors"
                  >
                    Add Your First Gig
                  </button>
                )}
              </div>
            )}
            <button
              onClick={handleAddGig}
              className="fixed bottom-6 right-6 bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700 transition-transform transform hover:scale-110"
              aria-label="Add new gig"
            >
              <PlusIcon className="h-8 w-8" />
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
