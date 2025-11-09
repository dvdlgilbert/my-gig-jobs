import React, { useState, useEffect } from 'react';
import type { Gig } from './types';
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import { getGigs, saveGigs } from './services/storageService';
import PlusIcon from './components/icons/PlusIcon';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';
import SearchIcon from './components/icons/SearchIcon';
import DatabaseIcon from './components/icons/DatabaseIcon';

function App() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setGigs(getGigs());
  }, []);

  useEffect(() => {
    saveGigs(gigs);
  }, [gigs]);

  const handleSaveGig = (gig: Gig) => {
    if (gig.id) { // Update
      setGigs(gigs.map(g => g.id === gig.id ? gig : g));
    } else { // Create
      const newGig = { ...gig, id: Date.now() };
      setGigs([newGig, ...gigs]);
    }
    setIsFormVisible(false);
    setSelectedGig(null);
  };

  const handleDeleteGig = (id: number) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      setGigs(gigs.filter(g => g.id !== id));
      setIsFormVisible(false);
      setSelectedGig(null);
    }
  };

  const handleEditGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsFormVisible(true);
  };

  const handleAddNewGig = () => {
    setSelectedGig(null);
    setIsFormVisible(true);
  };
  
  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedGig(null);
  };

  const filteredGigs = gigs.filter(gig => 
    (gig.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (gig.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (gig.jobDescription?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-purple-700 text-white p-4 shadow-md sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          {isFormVisible ? (
            <button onClick={handleCancel} className="p-2 rounded-full hover:bg-purple-600 transition-colors" aria-label="Back">
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
          ) : (
            <h1 className="text-2xl font-bold">MyGigJobs</h1>
          )}
          
          <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
            {isFormVisible ? (selectedGig ? 'Edit Gig' : 'Add Gig') : ''}
          </h1>

          {!isFormVisible && (
            <button onClick={handleAddNewGig} className="p-2 rounded-full hover:bg-purple-600 transition-colors" aria-label="Add new gig">
              <PlusIcon className="h-6 w-6" />
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
            onDelete={handleDeleteGig}
          />
        ) : (
          <>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            
            {filteredGigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGigs.map(gig => (
                        <GigCard key={gig.id} gig={gig} onEdit={handleEditGig} onDelete={handleDeleteGig} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 px-4">
                    <DatabaseIcon className="h-16 w-16 mx-auto text-gray-400" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-600">No gigs found.</h2>
                    <p className="mt-2 text-gray-500">
                      {searchTerm ? 'Try adjusting your search.' : 'Click the "+" button to add your first gig!'}
                    </p>
                </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
