import React, { useState, useEffect } from 'react';
import type { Gig } from './types';
import { getGigs, saveGigs } from './services/storageService';
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';

// FIX: Implemented the full App component to manage state and render UI.
function App() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setGigs(getGigs());
  }, []);

  useEffect(() => {
    saveGigs(gigs);
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = gigs.filter(gig => {
      return (
        gig.jobTitle.toLowerCase().includes(lowercasedFilter) ||
        gig.clientName.toLowerCase().includes(lowercasedFilter) ||
        (gig.jobDescription && gig.jobDescription.toLowerCase().includes(lowercasedFilter))
      );
    });
    setFilteredGigs(filtered);
  }, [gigs, searchTerm]);

  const handleAddGig = () => {
    setSelectedGig(null);
    setIsFormVisible(true);
  };

  const handleEditGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsFormVisible(true);
  };

  const handleDeleteGig = (id: number) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
        setGigs(gigs.filter(g => g.id !== id));
    }
  };

  const handleSaveGig = (gig: Gig) => {
    if (gig.id) {
      setGigs(gigs.map(g => g.id === gig.id ? gig : g));
    } else {
      const newGig = { ...gig, id: Date.now() };
      setGigs([...gigs, newGig]);
    }
    setIsFormVisible(false);
    setSelectedGig(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedGig(null);
  };

  const sortedGigs = [...filteredGigs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-purple-800 text-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Gig Jobs</h1>
          {!isFormVisible && (
            <button
              onClick={handleAddGig}
              className="bg-white text-purple-800 font-semibold py-2 px-4 rounded-full shadow hover:bg-gray-200 transition-colors flex items-center"
              aria-label="Add new gig"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Gig
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        {isFormVisible ? (
          <GigForm
            gig={selectedGig}
            onSave={handleSaveGig}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Search by title, client, description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
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
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {gigs.length === 0 ? "You haven't added any gigs yet." : "No gigs match your search."}
                    </p>
                    {gigs.length === 0 && (
                        <button
                            onClick={handleAddGig}
                            className="mt-4 bg-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow hover:bg-purple-800 transition-colors flex items-center mx-auto"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Your First Gig
                        </button>
                    )}
                </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
