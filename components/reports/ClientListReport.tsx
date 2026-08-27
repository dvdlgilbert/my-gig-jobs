import React, { useState, useMemo, useRef } from 'react';
import type { Gig, Language } from '../../types';
import { translations } from '../../translations';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import SearchIcon from '../icons/SearchIcon';
import PdfIcon from '../icons/PdfIcon';
import ShareIcon from '../icons/ShareIcon';
import { saveElementAsPdf, shareElementAsPdf } from '../../utils/pdfExport';
import { Users, Hash, DollarSign } from 'lucide-react';

interface ClientListReportProps {
  gigs: Gig[];
  currencySymbol: string;
  language: Language;
  onBack: () => void;
}

const ClientListReport: React.FC<ClientListReportProps> = ({
  gigs,
  currencySymbol,
  language,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const t = translations[language] || translations.en;

  // Calculate transaction total for each gig (Labor + Expenses + Tax)
  const gigTransactions = useMemo(() => {
    return gigs.map((gig) => {
      const labor = gig.jobCost || 0;
      const materials = (gig.expenses || []).reduce((acc, exp) => acc + (exp.amount || 0), 0);
      const subtotal = labor + materials;
      const taxRate = gig.taxRate || 0;
      const tax = subtotal * (taxRate / 100);
      const total = subtotal + tax;

      return {
        ...gig,
        labor,
        materials,
        subtotal,
        tax,
        total,
      };
    });
  }, [gigs]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return gigTransactions;
    const term = searchTerm.toLowerCase();
    return gigTransactions.filter(
      (g) =>
        g.clientName.toLowerCase().includes(term) ||
        g.clientEmail.toLowerCase().includes(term) ||
        g.clientPhone.toLowerCase().includes(term) ||
        g.jobTitle.toLowerCase().includes(term) ||
        g.id.toLowerCase().includes(term) ||
        g.clientAddress.toLowerCase().includes(term)
    );
  }, [gigTransactions, searchTerm]);

  // Summary statistics
  const stats = useMemo(() => {
    const uniqueClients = new Set(
      gigs.map((g) => g.clientName.trim().toLowerCase()).filter(Boolean)
    );
    const totalTransactions = filteredTransactions.length;
    const totalRevenue = filteredTransactions.reduce((acc, g) => acc + g.total, 0);
    const avgPerTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      uniqueClientsCount: uniqueClients.size,
      totalTransactions,
      totalRevenue,
      avgPerTransaction,
    };
  }, [gigs, filteredTransactions]);

  const handleSavePdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportMessage(t.generatingPdf);
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      await saveElementAsPdf(printContainerRef.current, `MyGiGs-Client-List-Report-${dateStr}.pdf`);
      setExportMessage(t.pdfDownloaded);
      setTimeout(() => setExportMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setExportMessage('Error saving PDF');
      setTimeout(() => setExportMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSharePdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportMessage(t.generatingPdf);
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const result = await shareElementAsPdf(
        printContainerRef.current,
        `MyGiGs-Client-List-Report-${dateStr}.pdf`,
        `${t.clientListReport} - ${dateStr}`
      );
      if (result === 'shared') {
        setExportMessage(t.pdfShared);
      } else {
        setExportMessage(t.pdfDownloaded);
      }
      setTimeout(() => setExportMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setExportMessage('Error sharing PDF');
      setTimeout(() => setExportMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
            aria-label={t.back}
          >
            <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              {t.clientListReport}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              {t.clientListReportDesc}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <input
            type="text"
            placeholder={t.searchClients}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#111827',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
            <SearchIcon style={{ width: '18px', height: '18px' }} />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Users size={16} color="#9333ea" />
            <span>{t.totalClients}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            {stats.uniqueClientsCount}
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Hash size={16} color="#2563eb" />
            <span>{t.totalTransactions}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            {stats.totalTransactions}
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <DollarSign size={16} color="#059669" />
            <span>{t.totalRevenue}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', margin: 0 }}>
            {currencySymbol}{stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div
        ref={printContainerRef}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* Printable Header */}
        <div style={{ borderBottom: '2px solid #111827', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>
              {t.myGigsTitle.toUpperCase()}
            </h2>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#9333ea', margin: '0.25rem 0 0 0' }}>
              {t.clientListReport}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
              <strong>{t.date}:</strong> {new Date().toLocaleDateString()}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0.25rem 0 0 0' }}>
              {filteredTransactions.length} {t.allRecords}
            </p>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '0.8125rem', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>{t.client}</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>{t.id}</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>{t.phone}</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>{t.email}</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700, textAlign: 'right' }}>{t.total}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((gig, idx) => (
                  <tr
                    key={gig.id}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa',
                      fontSize: '0.875rem',
                      color: '#111827',
                    }}
                  >
                    {/* Client Name + Job Context */}
                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>
                        {gig.clientName || 'Unnamed Client'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>
                        {gig.jobTitle} &bull; {new Date(gig.date.replace(/-/g, '/')).toLocaleDateString()}
                      </div>
                      {gig.clientAddress && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.1rem' }}>
                          {gig.clientAddress}
                        </div>
                      )}
                    </td>

                    {/* ID */}
                    <td style={{ padding: '1rem', verticalAlign: 'top', fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280' }}>
                      {gig.id.substring(0, 8).toUpperCase()}
                    </td>

                    {/* Phone */}
                    <td style={{ padding: '1rem', verticalAlign: 'top', color: '#374151' }}>
                      {gig.clientPhone ? (
                        <a href={`tel:${gig.clientPhone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                          {gig.clientPhone}
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>—</span>
                      )}
                    </td>

                    {/* Email */}
                    <td style={{ padding: '1rem', verticalAlign: 'top', color: '#374151' }}>
                      {gig.clientEmail ? (
                        <a href={`mailto:${gig.clientEmail}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                          {gig.clientEmail}
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>—</span>
                      )}
                    </td>

                    {/* Total */}
                    <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                      {currencySymbol}{gig.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#9ca3af' }}>
                    <Users size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>{t.noClientTransactions}</p>
                  </td>
                </tr>
              )}
            </tbody>
            {filteredTransactions.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: '2px solid #111827', backgroundColor: '#f9fafb' }}>
                  <td colSpan={4} style={{ padding: '1rem', fontWeight: 800, fontSize: '0.9375rem', color: '#111827', textTransform: 'uppercase' }}>
                    {t.totalRevenue}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 900, fontSize: '1.125rem', color: '#059669' }}>
                    {currencySymbol}{stats.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer info on print document */}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px dashed #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
          <span>Generated by My GiG Jobs v2.0</span>
          <span>Copyright &copy; 2025 - Gigs and Side-Hustle Technologies, llc</span>
        </div>
      </div>

      {/* Notification Toast */}
      {exportMessage && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1f2937', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', zIndex: 100, fontSize: '0.875rem', fontWeight: 600 }}>
          {exportMessage}
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={handleSavePdf}
          disabled={isExporting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#9333ea',
            color: 'white',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            fontWeight: 700,
            fontSize: '0.9375rem',
            border: 'none',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px rgba(147, 51, 234, 0.25)',
            transition: 'background-color 0.2s',
            opacity: isExporting ? 0.7 : 1,
          }}
          className="hover:bg-purple-700"
        >
          <PdfIcon style={{ width: '20px', height: '20px' }} />
          <span>{t.saveToPdf}</span>
        </button>

        <button
          onClick={handleSharePdf}
          disabled={isExporting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            fontWeight: 700,
            fontSize: '0.9375rem',
            border: 'none',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px rgba(37, 99, 235, 0.25)',
            transition: 'background-color 0.2s',
            opacity: isExporting ? 0.7 : 1,
          }}
          className="hover:bg-blue-700"
        >
          <ShareIcon style={{ width: '20px', height: '20px' }} />
          <span>{t.sharePdf}</span>
        </button>
      </div>
    </div>
  );
};

export default ClientListReport;
