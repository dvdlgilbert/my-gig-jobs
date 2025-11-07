import React, { useState, useEffect, useMemo } from 'react';
import type { Gig } from './types';
import { getGigs, saveGigs } from './services/storageService';
import GigForm from './components/GigForm';
import GigCard from './components/GigCard';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import MoreVertIcon from './components/icons/MoreVertIcon';

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

const App: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingGig, setEditingGig] = useState<Gig | undefined>(undefined);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');

  useEffect(() => {
    setGigs(getGigs());
  }, []);

  const handleSaveGig = (gigToSave: Gig) => {
    const existingGig = gigs.find(g => g.id === gigToSave.id);
    let updatedGigs;
    if (existingGig) {
      updatedGigs = gigs.map(g => g.id === gigToSave.id ? gigToSave : g);
    } else {
      updatedGigs = [...gigs, gigToSave];
    }
    setGigs(updatedGigs);
    saveGigs(updatedGigs);
    setView('list');
  };

  const handleDeleteGig = (gigId: number) => {
    if (window.confirm('Are you sure you want to delete this gig record?')) {
        const updatedGigs = gigs.filter(g => g.id !== gigId);
        setGigs(updatedGigs);
        saveGigs(updatedGigs);
        setView('list');
    }
  };
  
  const handleAddNew = () => {
    setEditingGig(undefined);
    setView('form');
  };

  const handleEdit = (gig: Gig) => {
    setEditingGig(gig);
    setView('form');
  };

  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(gigs, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `my_gigs_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setIsMenuOpen(false);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        if (e.target?.result) {
            try {
                const importedGigs = JSON.parse(e.target.result as string);
                // Basic validation
                if (Array.isArray(importedGigs) && (importedGigs.length === 0 || importedGigs[0].jobTitle)) {
                    if(window.confirm('Are you sure you want to replace all current gigs with the imported data?')) {
                        setGigs(importedGigs);
                        saveGigs(importedGigs);
                    }
                } else {
                    alert('Invalid file format.');
                }
            } catch (error) {
                alert('Error parsing file. Please make sure it is a valid JSON file.');
            }
        }
      };
    }
    setIsMenuOpen(false);
  };
  
  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete ALL gig records? This action cannot be undone.')) {
        setGigs([]);
        saveGigs([]);
    }
    setIsMenuOpen(false);
  }

  const filteredAndSortedGigs = useMemo(() => {
    return gigs
      .filter(gig =>
        gig.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOption) {
          case 'date-asc':
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'title-asc':
            return a.jobTitle.localeCompare(b.jobTitle);
          case 'title-desc':
            return b.jobTitle.localeCompare(a.jobTitle);
          case 'date-desc':
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [gigs, searchTerm, sortOption]);

  if (view === 'form') {
    return <GigForm 
             gig={editingGig} 
             onSave={handleSaveGig} 
             onCancel={() => setView('list')} 
             onDelete={handleDeleteGig}
           />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-purple-700 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My GiG Jobs</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchVisible(!isSearchVisible)} className="p-2 rounded-full hover:bg-purple-600" aria-label="Search">
              <SearchIcon className="h-6 w-6" />
            </button>
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-purple-600" aria-label="Menu">
                <MoreVertIcon className="h-6 w-6" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 text-gray-800 animate-fade-in">
                  <div className="py-1">
                    <span className="block px-4 py-2 text-sm text-gray-500">Sort by:</span>
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="w-full px-3 py-2 text-sm border-0 focus:ring-0">
                        <option value="date-desc">Date (Newest First)</option>
                        <option value="date-asc">Date (Oldest First)</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                    </select>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button onClick={handleExportData} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export Data</button>
                    <label className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      Import Data
                      <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    </label>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button onClick={handleDeleteAll} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete All</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {isSearchVisible && (
            <div className="max-w-4xl mx-auto p-4 pt-0">
                <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-purple-600 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
            </div>
        )}
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full p-4">
        {filteredAndSortedGigs.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedGigs.map(gig => (
              <GigCard key={gig.id} gig={gig} onEdit={() => handleEdit(gig)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No gigs yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new gig record.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Gig
              </button>
            </div>
          </div>
        )}
      </main>

      <button
        onClick={handleAddNew}
        className="fixed bottom-6 right-6 bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-transform hover:scale-110"
        aria-label="Add new gig"
      >
        <PlusIcon className="h-8 w-8" />
      </button>
    </div>
  );
};

export default App;
