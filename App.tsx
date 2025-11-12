import { useState, useEffect, useMemo } from 'react';
import type { Gig } from './types';
import { getGigs, saveGigs } from './services/storageService';
// FIX: Fix module resolution error by using relative paths.
import GigCard from './components/GigCard';
import GigForm from './components/GigForm';
import ReceiptModal from './components/ReceiptModal';
import FilterModal from './components/FilterModal';
import DeleteAllModal from './components/DeleteAllModal';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import DatabaseIcon from './components/icons/DatabaseIcon';
import UploadIcon from './components/icons/UploadIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import MoreVertIcon from './components/icons/MoreVertIcon';
import FilterIcon from './components/icons/FilterIcon';
import TrashIcon from './components/icons/TrashIcon';

type View = 'list' | 'form';

const App: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [view, setView] = useState<View>('list');
  const [editingGig, setEditingGig] = useState<Gig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [receiptGig, setReceiptGig] = useState<Gig | null>(null);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');


  useEffect(() => {
    setGigs(getGigs());
  }, []);

  const updateGigs = (newGigs: Gig[]) => {
    const sortedGigs = newGigs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  const handleAddNew = () => {
    setEditingGig(null);
    setView('form');
  };

  const handleCancelForm = () => {
    setView('list');
    setEditingGig(null);
  };

  const handleExportGigs = () => {
    if (gigs.length === 0) {
      alert("No gigs to export.");
      return;
    }
    const gigsJson = JSON.stringify(gigs, null, 2);
    const blob = new Blob([gigsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `my-gigs-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportGigs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (window.confirm("Are you sure you want to import gigs? This will overwrite your current data.")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const importedGigs = JSON.parse(text) as Gig[];
            if (Array.isArray(importedGigs)) {
              updateGigs(importedGigs);
              alert("Gigs imported successfully!");
            } else {
              throw new Error("Invalid file format.");
            }
          }
        } catch (error) {
          console.error("Failed to import gigs:", error);
          alert("Failed to import gigs. Please make sure the file is a valid JSON export from this app.");
        }
      };
      reader.readAsText(file);
    }
    // Reset file input to allow importing the same file again
    event.target.value = '';
  };
  
  const handleShowReceipt = (gig: Gig) => {
    setReceiptGig(gig);
  };

  const handleCloseReceipt = () => {
    setReceiptGig(null);
  };

  const handleApplyFilter = (month: string, year: string) => {
    setFilterMonth(month);
    setFilterYear(year);
    setIsFilterModalOpen(false);
  };

  const handleClearFilter = () => {
    setFilterMonth('');
    setFilterYear('');
    setIsFilterModalOpen(false);
  };
  
  const handleDeleteAllGigs = () => {
    updateGigs([]);
    setIsDeleteAllModalOpen(false);
  };

  const filteredGigs = useMemo(() => {
    let currentlyFilteredGigs = gigs;

    if (searchTerm) {
      currentlyFilteredGigs = currentlyFilteredGigs.filter(gig => 
        gig.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const isFilterActive = filterMonth || filterYear;
    if (isFilterActive) {
      currentlyFilteredGigs = currentlyFilteredGigs.filter(gig => {
        const gigYear = gig.date.substring(0, 4);
        const gigMonth = gig.date.substring(5, 7);
        
        const yearMatch = filterYear ? gigYear === filterYear : true;
        const monthMatch = filterMonth ? gigMonth === filterMonth : true;
        
        return yearMatch && monthMatch;
      });
    }

    return currentlyFilteredGigs;
  }, [gigs, searchTerm, filterMonth, filterYear]);
  
  const isFilterActive = !!(filterMonth || filterYear);

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      {view === 'list' && (
         <header className="bg-brand-purple shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-white whitespace-nowrap">My GiG Jobs</h1>
            <div className="flex items-center gap-2 justify-end w-full">
              {gigs.length > 0 && (
                <>
                  <button onClick={handleExportGigs} className="p-2 text-white rounded-full hover:bg-white/20" title="Export Gigs">
                    <DownloadIcon className="w-6 h-6" />
                  </button>
                  <label htmlFor="import-gigs-input" className="p-2 text-white rounded-full hover:bg-white/20 cursor-pointer" title="Import Gigs">
                    <UploadIcon className="w-6 h-6" />
                  </label>
                  <input id="import-gigs-input" type="file" accept=".json" className="hidden" onChange={handleImportGigs} />

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-full w-32 sm:w-56 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} 
                      onBlur={() => setTimeout(() => setIsHeaderMenuOpen(false), 150)} 
                      className="p-2 text-white rounded-full hover:bg-white/20"
                      title="More options"
                    >
                      <MoreVertIcon className="w-6 h-6" />
                      {isFilterActive && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-yellow-400 ring-2 ring-brand-purple"></span>}
                    </button>
                     {isHeaderMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 origin-top-right">
                        <ul className="py-1">
                           <li>
                            <button onClick={() => { setIsFilterModalOpen(true); setIsHeaderMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <FilterIcon className="w-5 h-5" />
                              <span>Filter Gigs</span>
                              {isFilterActive && <span className="text-xs font-semibold text-brand-purple ml-auto">Filtered</span>}
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { setIsDeleteAllModalOpen(true); setIsHeaderMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                              <TrashIcon className="w-5 h-5" />
                              <span>Delete All Data</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="container mx-auto p-4 flex-grow">
        {view === 'list' ? (
          <>
            {filteredGigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGigs.map(gig => (
                  <GigCard 
                    key={gig.id} 
                    gig={gig} 
                    onDelete={handleDeleteGig}
                    onEdit={handleEditGig}
                    onShowReceipt={handleShowReceipt}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6">
                 { (gigs.length > 0 && filteredGigs.length === 0) ? (
                  <>
                    <p className="text-gray-600 text-lg mb-4">No gigs match your current filter.</p>
                    <button onClick={handleClearFilter} className="bg-brand-purple text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium">Clear Filter</button>
                  </>
                ) : (
                  <>
                    <DatabaseIcon className="w-16 h-16 mx-auto text-gray-400" />
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                       <p className="mt-2 text-gray-600 text-left">
                         My GiGs is a standalone mobile application built to help freelancers, independent contractors, gig workers, and side-hustlers manage and track their work history, earnings, and client interactions. The application also provides convenient tools for communicating with clients via SMS, phone calls, and email, when permitted by the user.
                       </p>
                       <p className="mt-4 text-gray-600 text-left font-medium">
                         My Gigs is a product of Gigs and Side-Hustle Technologies, LLC.
                       </p>
                    </div>
                  </>
                )}
              </div>
            )}
            <button onClick={handleAddNew} className="fixed bottom-6 right-6 bg-brand-purple text-white p-4 rounded-full hover:bg-purple-700 shadow-lg transition-transform duration-200 hover:scale-110">
              <PlusIcon className="w-8 h-8" />
            </button>
          </>
        ) : (
          <GigForm 
            gig={editingGig} 
            onSave={handleSaveGig} 
            onCancel={handleCancelForm}
            onDelete={handleDeleteGig}
          />
        )}
      </main>
      <footer className="w-full text-center py-4 text-gray-500 text-xs">
        Copyright (c) 2025 - Gigs and Side-Hustle Technologies, llc
      </footer>
      {receiptGig && <ReceiptModal gig={receiptGig} onClose={handleCloseReceipt} />}
      {isFilterModalOpen && (
        <FilterModal 
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilter}
          onClear={handleClearFilter}
          initialMonth={filterMonth}
          initialYear={filterYear}
        />
      )}
      {isDeleteAllModalOpen && (
        <DeleteAllModal
          isOpen={isDeleteAllModalOpen}
          onClose={() => setIsDeleteAllModalOpen(false)}
          onConfirm={handleDeleteAllGigs}
        />
      )}
    </div>
  );
};

export default App;
