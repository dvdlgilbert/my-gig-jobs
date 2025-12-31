
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Gig } from './types';
import { getGigs, saveGigs } from './services/storageService';
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Ensure the specific gig is set before transitioning the view
    setEditingGig({ ...gig });
    setView('form');
    // Also close the header menu just in case
    setIsHeaderMenuOpen(false);
  };

  const handleDeleteGig = (gigId: string) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      const newGigs = gigs.filter(g => g.id !== gigId);
      updateGigs(newGigs);
      // If we are currently editing this gig, go back to list
      if (editingGig && editingGig.id === gigId) {
        setView('list');
        setEditingGig(null);
      }
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

  const handleImportClick = () => {
    fileInputRef.current?.click();
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
    event.target.value = '';
    setIsHeaderMenuOpen(false);
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
        gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.clientName.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      {/* Inject styles for search placeholder */}
      <style>{`
        .white-placeholder::placeholder {
          color: rgba(255, 255, 255, 0.75) !important;
          opacity: 1;
        }
      `}</style>

      {view === 'list' && (
         <header style={{ backgroundColor: '#9333ea', color: 'white', padding: '1rem', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>My GiG Jobs</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1, justifyContent: 'flex-end' }}>
              {gigs.length > 0 && (
                <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
                  <input
                    type="text"
                    className="white-placeholder"
                    placeholder="Search by title, description, client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '2.25rem',
                      paddingRight: '1rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      outline: 'none',
                      fontSize: '0.875rem'
                    }}
                  />
                  <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <SearchIcon style={{ width: '18px', height: '18px', color: 'rgba(255, 255, 255, 0.8)' }} />
                  </div>
                </div>
              )}
              
              {/* Menu Button - Always Visible */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} 
                  style={{
                    padding: '0.5rem',
                    borderRadius: '50%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="More options"
                >
                  <MoreVertIcon style={{ width: '24px', height: '24px' }} />
                  {isFilterActive && <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#facc15', border: '2px solid #9333ea' }}></span>}
                </button>
                
                  {/* Transparent overlay to close menu when clicking outside */}
                  {isHeaderMenuOpen && (
                    <div 
                      onClick={() => setIsHeaderMenuOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 15, cursor: 'default' }}
                    ></div>
                  )}

                  {isHeaderMenuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem', width: '14rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 20, overflow: 'hidden' }}>
                    <ul style={{ listStyle: 'none', padding: '0.25rem 0', margin: 0 }}>
                        <li>
                        <button onClick={handleImportClick} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }} className="hover:bg-gray-100">
                          <UploadIcon style={{ width: '20px', height: '20px' }} />
                          <span>Import Gigs</span>
                        </button>
                      </li>
                      {gigs.length > 0 && (
                        <>
                          <li>
                            <button onClick={() => { handleExportGigs(); setIsHeaderMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }} className="hover:bg-gray-100">
                              <DownloadIcon style={{ width: '20px', height: '20px' }} />
                              <span>Export Gigs</span>
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { setIsFilterModalOpen(true); setIsHeaderMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }} className="hover:bg-gray-100">
                              <FilterIcon style={{ width: '20px', height: '20px' }} />
                              <span>Filter Gigs</span>
                              {isFilterActive && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9333ea', marginLeft: 'auto' }}>Active</span>}
                            </button>
                          </li>
                          <li>
                            <button onClick={() => { setIsDeleteAllModalOpen(true); setIsHeaderMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#dc2626', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }} className="hover:bg-gray-100">
                              <TrashIcon style={{ width: '20px', height: '20px' }} />
                              <span>Delete All Data</span>
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="container mx-auto p-4 flex-grow" style={{ flexGrow: 1, padding: '1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {view === 'list' ? (
          <>
            {filteredGigs.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
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
              <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
                 { (gigs.length > 0 && filteredGigs.length === 0) ? (
                  <>
                    <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '1rem' }}>No gigs match your current filter or search.</p>
                    <button onClick={handleClearFilter} style={{ backgroundColor: '#9333ea', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Clear Filter</button>
                  </>
                ) : (
                  <>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto', color: '#9ca3af' }}>
                       <DatabaseIcon style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div style={{ marginTop: '1.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                       <p style={{ marginTop: '0.5rem', color: '#4b5563', textAlign: 'left' }}>
                         My GiGs is a standalone mobile application built to help freelancers, independent contractors, gig workers, and side-hustlers manage and track their work history, earnings, and client interactions. The application also provides convenient tools for communicating with clients via SMS, phone calls, and email, when permitted by the user.
                       </p>
                       <p style={{ marginTop: '1rem', color: '#4b5563', textAlign: 'left', fontWeight: 500 }}>
                         My Gigs is a product of Gigs and Side-Hustle Technologies, LLC.
                       </p>
                    </div>
                  </>
                )}
              </div>
            )}
            <button 
              onClick={handleAddNew} 
              aria-label="Add New Gig"
              style={{ 
                backgroundColor: '#9333ea', 
                color: 'white',
                width: '64px', 
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                bottom: '90px',
                right: '24px',
                zIndex: 50,
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer'
              }}
            >
              <PlusIcon style={{ width: '32px', height: '32px' }} />
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
      <footer style={{ width: '100%', textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.75rem', marginTop: 'auto' }}>
        Copyright (c) 2025 - Gigs and Side-Hustle Technologies, llc
      </footer>
      {/* Hidden File Input - Moved outside the menu conditional to ensure it remains mounted */}
      <input ref={fileInputRef} id="import-gigs-input" type="file" accept=".json" className="hidden" onChange={handleImportGigs} style={{ display: 'none' }} />

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
