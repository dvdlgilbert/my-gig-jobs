import React, { useState, useMemo, useRef } from 'react';
import type { Gig, Language, ReportPeriodType } from '../../types';
import { translations } from '../../translations';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import PdfIcon from '../icons/PdfIcon';
import ShareIcon from '../icons/ShareIcon';
import { saveElementAsPdf, shareElementAsPdf } from '../../utils/pdfExport';
import { Receipt, Layers, DollarSign } from 'lucide-react';

interface ExpensesStatementReportProps {
  gigs: Gig[];
  currencySymbol: string;
  language: Language;
  onBack: () => void;
}

interface ExpenseRowItem {
  id: string;
  description: string;
  date: string;
  jobId: string;
  jobRef: string;
  jobTitle: string;
  clientName: string;
  amount: number;
}

interface ExpenseGroup {
  description: string;
  items: ExpenseRowItem[];
  subtotal: number;
}

const ExpensesStatementReport: React.FC<ExpensesStatementReportProps> = ({
  gigs,
  currencySymbol,
  language,
  onBack,
}) => {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriodType>('annual');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const t = translations[language] || translations.en;

  // Extract unique available years from gigs + current and prior year
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>([currentYear, (parseInt(currentYear) - 1).toString()]);
    gigs.forEach((g) => {
      if (g.date && g.date.length >= 4) {
        yearsSet.add(g.date.substring(0, 4));
      }
    });
    return Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, [gigs, currentYear]);

  // Period label translation helper
  const getPeriodLabel = (period: ReportPeriodType): string => {
    switch (period) {
      case 'annual': return t.annual;
      case 'Q1': return t.quarter1;
      case 'Q2': return t.quarter2;
      case 'Q3': return t.quarter3;
      case 'Q4': return t.quarter4;
      case 'H1': return t.halfYear1;
      case 'H2': return t.halfYear2;
      case '01': return t.monthJan;
      case '02': return t.monthFeb;
      case '03': return t.monthMar;
      case '04': return t.monthApr;
      case '05': return t.monthMay;
      case '06': return t.monthJun;
      case '07': return t.monthJul;
      case '08': return t.monthAug;
      case '09': return t.monthSep;
      case '10': return t.monthOct;
      case '11': return t.monthNov;
      case '12': return t.monthDec;
      default: return period;
    }
  };

  // Filter gigs by selected year & period
  const matchingGigs = useMemo(() => {
    return gigs.filter((gig) => {
      if (!gig.date) return false;
      const y = gig.date.substring(0, 4);
      if (y !== selectedYear) return false;

      const m = gig.date.substring(5, 7);
      if (selectedPeriod === 'annual') return true;
      if (selectedPeriod === 'Q1') return ['01', '02', '03'].includes(m);
      if (selectedPeriod === 'Q2') return ['04', '05', '06'].includes(m);
      if (selectedPeriod === 'Q3') return ['07', '08', '09'].includes(m);
      if (selectedPeriod === 'Q4') return ['10', '11', '12'].includes(m);
      if (selectedPeriod === 'H1') return ['01', '02', '03', '04', '05', '06'].includes(m);
      if (selectedPeriod === 'H2') return ['07', '08', '09', '10', '11', '12'].includes(m);
      return m === selectedPeriod;
    });
  }, [gigs, selectedYear, selectedPeriod]);

  // Flatten and group expenses:
  // "pull expenses from each job record by description/expense title, date, then job number,
  // and where expense types are the same in multiple records they are listed one after the other (and should be totaled).
  // Finally the expenses can be sorted by periods with a total at the bottom of the list for the period."
  const { groupedExpenses, totalExpenseCount, periodTotalExpense, uniqueExpenseTypesCount } = useMemo(() => {
    const rawItems: ExpenseRowItem[] = [];

    matchingGigs.forEach((gig) => {
      const gigExpenses = gig.expenses || [];
      gigExpenses.forEach((exp) => {
        const desc = (exp.description && exp.description.trim()) ? exp.description.trim() : 'Miscellaneous Expense';
        const amt = typeof exp.amount === 'number' ? exp.amount : parseFloat(exp.amount as any) || 0;
        rawItems.push({
          id: exp.id || `${gig.id}-${Math.random()}`,
          description: desc,
          date: gig.date || '',
          jobId: gig.id,
          jobRef: gig.id ? gig.id.substring(0, 8).toUpperCase() : 'N/A',
          jobTitle: gig.jobTitle || 'Untitled Job',
          clientName: gig.clientName || 'Unnamed Client',
          amount: amt,
        });
      });
    });

    // Group by normalized description (case-insensitive key, keep cleanest display title)
    const groupMap = new Map<string, { displayTitle: string; items: ExpenseRowItem[] }>();

    rawItems.forEach((item) => {
      const key = item.description.toLowerCase();
      if (!groupMap.has(key)) {
        groupMap.set(key, { displayTitle: item.description, items: [] });
      }
      groupMap.get(key)!.items.push(item);
    });

    // Within each group, sort entries by date (ascending/chronological), then jobRef
    const sortedGroups: ExpenseGroup[] = [];
    let grandTotal = 0;

    // Sort groups alphabetically by description
    const sortedKeys = Array.from(groupMap.keys()).sort((a, b) => a.localeCompare(b));

    sortedKeys.forEach((key) => {
      const entry = groupMap.get(key)!;
      entry.items.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.jobRef.localeCompare(b.jobRef);
      });

      const subtotal = entry.items.reduce((sum, item) => sum + item.amount, 0);
      grandTotal += subtotal;

      sortedGroups.push({
        description: entry.displayTitle,
        items: entry.items,
        subtotal,
      });
    });

    return {
      groupedExpenses: sortedGroups,
      totalExpenseCount: rawItems.length,
      periodTotalExpense: grandTotal,
      uniqueExpenseTypesCount: sortedGroups.length,
    };
  }, [matchingGigs]);

  const handleSavePdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportMessage(t.generatingPdf);
    try {
      const filename = `MyGiGs-Expenses-Statement-${selectedYear}-${selectedPeriod}.pdf`;
      await saveElementAsPdf(printContainerRef.current, filename);
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
      const filename = `MyGiGs-Expenses-Statement-${selectedYear}-${selectedPeriod}.pdf`;
      const title = `${t.expensesStatement} - ${selectedYear} ${getPeriodLabel(selectedPeriod)}`;
      const result = await shareElementAsPdf(printContainerRef.current, filename, title);
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

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr.replace(/-/g, '/')).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', width: '100%' }}>
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
              {t.expensesStatement}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              {t.expensesStatementDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Period Selection Controls Bar */}
      <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '1.5rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Year Dropdown */}
        <div style={{ flex: '1 1 180px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            {t.year}
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              backgroundColor: '#f9fafb',
              color: '#111827',
              fontSize: '0.875rem',
              fontWeight: 600,
              outline: 'none',
            }}
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Period Dropdown */}
        <div style={{ flex: '1 1 240px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            {t.period}
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as ReportPeriodType)}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              backgroundColor: '#f9fafb',
              color: '#111827',
              fontSize: '0.875rem',
              fontWeight: 600,
              outline: 'none',
            }}
          >
            <option value="annual">{t.annual}</option>
            <optgroup label="Quarters">
              <option value="Q1">{t.quarter1}</option>
              <option value="Q2">{t.quarter2}</option>
              <option value="Q3">{t.quarter3}</option>
              <option value="Q4">{t.quarter4}</option>
            </optgroup>
            <optgroup label="Half Years">
              <option value="H1">{t.halfYear1}</option>
              <option value="H2">{t.halfYear2}</option>
            </optgroup>
            <optgroup label="Months">
              <option value="01">{t.monthJan}</option>
              <option value="02">{t.monthFeb}</option>
              <option value="03">{t.monthMar}</option>
              <option value="04">{t.monthApr}</option>
              <option value="05">{t.monthMay}</option>
              <option value="06">{t.monthJun}</option>
              <option value="07">{t.monthJul}</option>
              <option value="08">{t.monthAug}</option>
              <option value="09">{t.monthSep}</option>
              <option value="10">{t.monthOct}</option>
              <option value="11">{t.monthNov}</option>
              <option value="12">{t.monthDec}</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <DollarSign size={16} color="#e11d48" />
            <span>{t.periodTotalExpenses}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e11d48', margin: 0 }}>
            {currencySymbol}{periodTotalExpense.toFixed(2)}
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Layers size={16} color="#9333ea" />
            <span>{t.expenseCategoriesCount}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            {uniqueExpenseTypesCount}
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Receipt size={16} color="#2563eb" />
            <span>{t.totalExpenseItems}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            {totalExpenseCount}
          </p>
        </div>
      </div>

      {/* Printable Statement Document */}
      <div
        ref={printContainerRef}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          padding: '2.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Statement Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #111827', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>
            {t.myGigsTitle}
          </h2>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e11d48', margin: '0.25rem 0' }}>
            {t.expensesStatement}
          </p>
          <p style={{ fontSize: '0.9375rem', color: '#4b5563', fontWeight: 600, margin: '0.25rem 0 0 0' }}>
            {t.period}: {getPeriodLabel(selectedPeriod)} ({selectedYear})
          </p>
        </div>

        {/* Expenses List & Grouped Tables */}
        {groupedExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{t.noExpensesInPeriod}</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>{t.noExpensesInPeriodSub}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {groupedExpenses.map((group, groupIdx) => (
              <div
                key={`group-${groupIdx}-${group.description}`}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Group Title Bar */}
                <div
                  style={{
                    backgroundColor: '#fff1f2',
                    borderBottom: '1px solid #fecdd3',
                    padding: '0.75rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#e11d48',
                      }}
                    />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#9f1239' }}>
                      {group.description}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor: '#ffe4e6',
                        color: '#be123c',
                      }}
                    >
                      {group.items.length} {group.items.length === 1 ? t.itemRecord : t.itemRecords}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#be123c' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginRight: '0.35rem', color: '#9f1239' }}>
                      {t.subtotal}:
                    </span>
                    {currencySymbol}{group.subtotal.toFixed(2)}
                  </div>
                </div>

                {/* Group Items Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: '#f9fafb',
                          borderBottom: '1px solid #e5e7eb',
                          fontSize: '0.75rem',
                          color: '#4b5563',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        <th style={{ padding: '0.625rem 1rem', fontWeight: 700, width: '130px' }}>{t.date}</th>
                        <th style={{ padding: '0.625rem 1rem', fontWeight: 700, width: '110px' }}>{t.jobNumber}</th>
                        <th style={{ padding: '0.625rem 1rem', fontWeight: 700 }}>{t.jobTitle} / {t.client}</th>
                        <th style={{ padding: '0.625rem 1rem', fontWeight: 700, textAlign: 'right', width: '120px' }}>{t.amount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item, itemIdx) => (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: itemIdx === group.items.length - 1 ? 'none' : '1px solid #f3f4f6',
                            backgroundColor: itemIdx % 2 === 0 ? '#ffffff' : '#fcfcfc',
                            fontSize: '0.875rem',
                          }}
                        >
                          <td style={{ padding: '0.75rem 1rem', verticalAlign: 'top', color: '#374151', whiteSpace: 'nowrap' }}>
                            {formatDateDisplay(item.date)}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', verticalAlign: 'top', fontFamily: 'monospace', fontWeight: 700, color: '#4b5563', fontSize: '0.8125rem' }}>
                            #{item.jobRef}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 600, color: '#111827' }}>{item.jobTitle}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.1rem' }}>
                              {t.client}: <span style={{ fontWeight: 500, color: '#4b5563' }}>{item.clientName}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', verticalAlign: 'top', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                            {currencySymbol}{item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid #fecdd3', backgroundColor: '#fff5f6', fontWeight: 800 }}>
                        <td colSpan={3} style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: '#9f1239', textTransform: 'uppercase' }}>
                          {group.description} {t.subtotal}:
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.9375rem', color: '#e11d48' }}>
                          {currencySymbol}{group.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}

            {/* Final Period Grand Total at Bottom of the List */}
            <div
              style={{
                borderTop: '3px solid #111827',
                paddingTop: '1.25rem',
                marginTop: '1rem',
              }}
            >
              <div
                style={{
                  backgroundColor: '#faf5ff',
                  border: '2px solid #e9d5ff',
                  borderRadius: '0.875rem',
                  padding: '1.25rem 1.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9333ea' }}>
                    {getPeriodLabel(selectedPeriod)} ({selectedYear})
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', marginTop: '0.2rem' }}>
                    {t.periodGrandTotalExpenses}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {totalExpenseCount} {t.totalExpenseItemsCount} &bull; {uniqueExpenseTypesCount} {t.expenseCategoriesCount}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#e11d48', letterSpacing: '-0.025em' }}>
                    {currencySymbol}{periodTotalExpense.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statement Footer */}
        <footer style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '1.5rem', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>This Expenses Statement was generated by My GiG Jobs v2.0</p>
          <p style={{ margin: 0 }}>Copyright &copy; 2025 - Gigs and Side-Hustle Technologies, llc</p>
        </footer>
      </div>

      {/* Notification Toast */}
      {exportMessage && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1f2937', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', zIndex: 100, fontSize: '0.875rem', fontWeight: 600 }}>
          {exportMessage}
        </div>
      )}

      {/* Bottom Action Buttons (Matching Income and Cash Flow format) */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginBottom: '2rem' }}>
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
            backgroundColor: '#059669',
            color: 'white',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            fontWeight: 700,
            fontSize: '0.9375rem',
            border: 'none',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px rgba(5, 150, 105, 0.25)',
            transition: 'background-color 0.2s',
            opacity: isExporting ? 0.7 : 1,
          }}
          className="hover:bg-emerald-700"
        >
          <ShareIcon style={{ width: '20px', height: '20px' }} />
          <span>{t.sharePdf}</span>
        </button>
      </div>
    </div>
  );
};

export default ExpensesStatementReport;
