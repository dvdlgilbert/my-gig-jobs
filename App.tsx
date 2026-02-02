
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
import MoreVertIcon from './components/icons/MoreVertIcon';
import FilterIcon from './components/icons/FilterIcon';
import TrashIcon from './components/icons/TrashIcon';
import UploadIcon from './components/icons/UploadIcon';
import DownloadIcon from './components/icons/DownloadIcon';

/**
 * App Component
 * 
 * The main container for My GiG Jobs Tracker.
 * Manages the transition between the List View and the Form View,
 * handles global search/filtering, and orchestrates data persistence.
 */

type View = 'list' | 'form';

const App: React.FC = () => {
  // --- State Management ---
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
  const [initialFormSection, setInitialFormSection] = useState<'top' | 'expenses'>('top');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Persistence ---
  useEffect(() => {
    setGigs(getGigs());
  }, []);

  const updateGigs = (newGigs: Gig[]) => {
    const sortedGigs = newGigs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setGigs(sortedGigs);
    saveGigs(sortedGigs);
  };

  // --- Handlers ---
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
  
  const handleEditGig = (gig: Gig, section: 'top' | 'expenses' = 'top') => {
    setEditingGig({ ...gig });
    setInitialFormSection(section);
    setView('form');
    setIsHeaderMenuOpen(false);
  };

  const handleDeleteGig = (gigId: string) => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      const newGigs = gigs.filter(g => g.id !== gigId);
      updateGigs(newGigs);
    }
  };

  const handleAddNew = () => {
    setEditingGig(null);
    setInitialFormSection('top');
    setView('form');
  };

  const handleExportGigs = () => {
    if (gigs.length === 0) {
      alert("No data to export.");
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
    setIsHeaderMenuOpen(false);
  };

  const handleImportGigs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (window.confirm("Importing will add to your current records. Continue?")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedGigs = JSON.parse(e.target?.result as string) as Gig[];
          if (Array.isArray(importedGigs)) {
            // Merge logic: Add imported gigs and avoid exact ID duplicates if possible
            const mergedGigs = [...gigs];
            importedGigs.forEach(ig => {
              if (!mergedGigs.find(mg => mg.id === ig.id)) {
                mergedGigs.push(ig);
              }
            });
            updateGigs(mergedGigs);
            alert("Gigs imported successfully!");
          }
        } catch (error) {
          alert("Failed to import. The file might be corrupted or in the wrong format.");
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
    setIsHeaderMenuOpen(false);
  };

  // --- Search & Filtering Logic ---
  const filteredGigs = useMemo(() => {
    let current = gigs;
    if (searchTerm) {
      current = current.filter(gig => 
        gig.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.jobSite.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterMonth || filterYear) {
      current = current.filter(gig => {
        const y = gig.date.substring(0, 4);
        const m = gig.date.substring(5, 7);
        return (filterYear ? y === filterYear : true) && (filterMonth ? m === filterMonth : true);
      });
    }
    return current;
  }, [gigs, searchTerm, filterMonth, filterYear]);

  // --- Rendering ---
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <style>{`.white-placeholder::placeholder { color: rgba(255, 255, 255, 0.75) !important; opacity: 1; }`}</style>

      {view === 'list' && (
         <header style={{ backgroundColor: '#9333ea', color: 'white', padding: '1rem', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>My GiG Jobs</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1, justifyContent: 'flex-end' }}>
                {/* Search Input */}
                <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
                  <input
                    type="text"
                    className="white-placeholder"
                    placeholder="Search titles, clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '9999px', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', outline: 'none', fontSize: '0.875rem' }}
                  />
                  <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <SearchIcon style={{ width: '18px', height: '18px', color: 'rgba(255, 255, 255, 0.8)' }} />
                  </div>
                </div>

                {/* Overflow Menu Button */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MoreVertIcon style={{ width: '24px', height: '24px' }} />
                  </button>
                  {isHeaderMenuOpen && (
                    <>
                      <div onClick={() => setIsHeaderMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 15 }}></div>
                      <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 20, width: '14rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <button onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#374151', fontSize: '0.875rem' }}>
                          <UploadIcon style={{ width: '20px' }} /> Import Gigs
                        </button>
                        <button onClick={handleExportGigs} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#374151', fontSize: '0.875rem' }}>
                          <DownloadIcon style={{ width: '20px' }} /> Export Gigs
                        </button>
                        <button onClick={() => { setIsFilterModalOpen(true); setIsHeaderMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#374151', fontSize: '0.875rem' }}>
                          <FilterIcon style={{ width: '20px' }} /> Filter by Date
                        </button>
                        <hr style={{ margin: '0', border: '0', borderTop: '1px solid #f3f4f6' }} />
                        <button onClick={() => { setIsDeleteAllModalOpen(true); setIsHeaderMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem 1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#dc2626', fontSize: '0.875rem' }}>
                          <TrashIcon style={{ width: '20px' }} /> Delete All Data
                        </button>
                      </div>
                    </>
                  )}
                </div>
            </div>
          </div>
        </header>
      )}

      <main style={{ flexGrow: 1, padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {view === 'list' ? (
          <>
            {filteredGigs.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredGigs.map(gig => (
                  <GigCard 
                    key={gig.id} 
                    gig={gig} 
                    onDelete={handleDeleteGig}
                    onEdit={(g) => handleEditGig(g, 'top')}
                    onManageExpenses={(g) => handleEditGig(g, 'expenses')}
                    onShowReceipt={setReceiptGig}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#6b7280' }}>
                <p style={{ fontSize: '1.125rem' }}>No records found.</p>
                <p style={{ fontSize: '0.875rem' }}>Try changing your search or adding a new gig.</p>
              </div>
            )}
            
            {/* Floating Action Button */}
            <button onClick={handleAddNew} style={{ backgroundColor: '#9333ea', color: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', bottom: '90px', right: '24px', zIndex: 50, border: 'none', boxShadow: '0 10px 15px rgba(147, 51, 234, 0.3)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <PlusIcon style={{ width: '32px', height: '32px' }} />
            </button>
          </>
        ) : (
          <GigForm 
            gig={editingGig} 
            initialSection={initialFormSection}
            onSave={handleSaveGig} 
            onCancel={() => setView('list')}
            onDelete={(id) => { handleDeleteGig(id); setView('list'); }}
          />
        )}
      </main>
      
      <footer style={{ width: '100%', textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
        Copyright (c) 2025 - Gigs and Side-Hustle Technologies, llc
      </footer>
      
      {/* Off-screen inputs and Modals */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportGigs} style={{ display: 'none' }} />
      {receiptGig && <ReceiptModal gig={receiptGig} onClose={() => setReceiptGig(null)} />}
      {isFilterModalOpen && <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={(m, y) => { setFilterMonth(m); setFilterYear(y); setIsFilterModalOpen(false); }} onClear={() => { setFilterMonth(''); setFilterYear(''); setIsFilterModalOpen(false); }} initialMonth={filterMonth} initialYear={filterYear} />}
      {isDeleteAllModalOpen && <DeleteAllModal isOpen={isDeleteAllModalOpen} onClose={() => setIsDeleteAllModalOpen(false)} onConfirm={() => { updateGigs([]); setIsDeleteAllModalOpen(false); }} />}
    </div>
  );
};

export default App;
