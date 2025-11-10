import React, { useState, useEffect, useMemo } from 'react';
import type { Gig, GigStatus } from './types';
import { getGigs, saveGigs } from './services/storageService';
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import DatabaseIcon from './components/icons/DatabaseIcon';

type View = 'list' | 'form';

const App: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [view, setView] = useState<View>('list');
  const [editingGig, setEditingGig] = useState<Gig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setGigs(getGigs());
  }, []);

  const updateGigs = (newGigs: Gig[]) => {
    // Sort gigs by date, most recent first, before saving and setting state
    const sortedGigs = newGigs.sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime());
    setGigs(sortedGigs);
    saveGigs(sortedGigs);
  };

  const handleSaveGig = (gigToSave: Gig) => {
    const existingIndex = gigs.findIndex(g => g.id === gigToSave.id);
    let newGigs;
    if (existingIndex > -1) {
      newGigs = [...gigs];
      newGigs[existingIndex] = gigToSave;
    } else {
      newGigs = [...gigs, gigToSave];
    }
    updateGigs(newGigs);
    setView('list');
    setEditingGig(null);
  };
  
  const handleEditGig = (gig: Gig) => {
    setEditingGig(gig);
    setView('form');
  }

  const handleDeleteGig = (gigId: string) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      const newGigs = gigs.filter(g => g.id !== gigId);
      updateGigs(newGigs);
    }
  };

  const handleUpdateStatus = (gigId: string, newStatus: GigStatus) => {
    const newGigs = gigs.map(g => g.id === gigId ? { ...g, status: newStatus } : g);
    updateGigs(newGigs);
  };

  const handleAddNew = () => {
    setEditingGig(null);
    setView('form');
  };

  const handleCancelForm = () => {
    setView('list');
    setEditingGig(null);
  };
  
  const filteredGigs = useMemo(() => {
    if (!searchTerm) {
      return gigs;
    }
    return gigs.filter(gig => 
      gig.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [gigs, searchTerm]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Gig Jobs</h1>
          {view === 'list' && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                 <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-full w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button onClick={handleAddNew} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 shadow">
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        {view === 'list' ? (
          <div>
            {filteredGigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGigs.map(gig => (
                  <GigCard 
                    key={gig.id} 
                    gig={gig} 
                    onDelete={handleDeleteGig} 
                    onUpdateStatus={handleUpdateStatus}
                    onEdit={handleEditGig}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <DatabaseIcon className="w-16 h-16 mx-auto text-gray-400" />
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Gigs Found</h2>
                <p className="mt-2 text-gray-500">
                  {searchTerm ? 'Try a different search term.' : 'Click the "+" button to add your first gig!'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <GigForm 
            gig={editingGig} 
            onSave={handleSaveGig} 
            onCancel={handleCancelForm} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
