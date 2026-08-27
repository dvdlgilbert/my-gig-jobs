import React, { useState, useMemo, useRef } from 'react';
import type { Gig, Language, ReportPeriodType } from '../../types';
import { translations } from '../../translations';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import PdfIcon from '../icons/PdfIcon';
import ShareIcon from '../icons/ShareIcon';
import { saveElementAsPdf, shareElementAsPdf } from '../../utils/pdfExport';
import { TrendingUp } from 'lucide-react';

interface IncomeStatementReportProps {
  gigs: Gig[];
  currencySymbol: string;
  language: Language;
  onBack: () => void;
}

const IncomeStatementReport: React.FC<IncomeStatementReportProps> = ({
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

  // Extract unique available years from gigs + current and adjacent years
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

  // Calculate financial figures
  const financials = useMemo(() => {
    let serviceRevenue = 0;
    let costOfServices = 0;
    let salesTaxLiability = 0;

    matchingGigs.forEach((gig) => {
      const labor = gig.jobCost || 0;
      const expenses = (gig.expenses || []).reduce((acc, exp) => acc + (exp.amount || 0), 0);
      const subtotal = labor + expenses;
      const taxRate = gig.taxRate || 0;
      const tax = subtotal * (taxRate / 100);

      serviceRevenue += labor;
      costOfServices += expenses;
      salesTaxLiability += tax;
    });

    const totalIncome = serviceRevenue;
    const totalExpense = costOfServices + salesTaxLiability;
    const netIncome = totalIncome - totalExpense;
    const gigCount = matchingGigs.length;
    const avgRevenuePerGig = gigCount > 0 ? totalIncome / gigCount : 0;

    return {
      serviceRevenue,
      totalIncome,
      costOfServices,
      salesTaxLiability,
      totalExpense,
      netIncome,
      gigCount,
      avgRevenuePerGig,
    };
  }, [matchingGigs]);

  const handleSavePdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportMessage(t.generatingPdf);
    try {
      const filename = `MyGiGs-Income-Statement-${selectedYear}-${selectedPeriod}.pdf`;
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
      const filename = `MyGiGs-Income-Statement-${selectedYear}-${selectedPeriod}.pdf`;
      const title = `${t.incomeStatement} - ${selectedYear} ${getPeriodLabel(selectedPeriod)}`;
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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
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
              {t.incomeStatement}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              {t.incomeStatementDesc}
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
          <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9333ea', margin: '0.25rem 0' }}>
            {t.incomeStatement}
          </p>
          <p style={{ fontSize: '0.9375rem', color: '#4b5563', fontWeight: 600, margin: '0.25rem 0 0 0' }}>
            {t.period}: {getPeriodLabel(selectedPeriod)} ({selectedYear})
          </p>
        </div>

        {/* Section 1: INCOME */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            {t.incomeSection}
          </div>
          
          {/* Subsections */}
          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.serviceRevenue}</span>
              <span style={{ fontWeight: 600 }}>{currencySymbol}{financials.serviceRevenue.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #f3f4f6', color: '#111827', fontSize: '1rem', fontWeight: 800, marginTop: '0.25rem' }}>
              <span>{t.totalIncome}</span>
              <span style={{ color: '#059669' }}>{currencySymbol}{financials.totalIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 2: EXPENSES */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            {t.expensesSection}
          </div>

          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.costOfServices}</span>
              <span style={{ fontWeight: 600 }}>{currencySymbol}{financials.costOfServices.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.salesTaxLiability}</span>
              <span style={{ fontWeight: 600 }}>{currencySymbol}{financials.salesTaxLiability.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #f3f4f6', color: '#111827', fontSize: '1rem', fontWeight: 800, marginTop: '0.25rem' }}>
              <span>{t.totalExpense}</span>
              <span style={{ color: '#dc2626' }}>{currencySymbol}{financials.totalExpense.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 3: NET INCOME & Highlights */}
        <div style={{ borderTop: '2px solid #111827', paddingTop: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', fontSize: '1.375rem', fontWeight: 900, color: '#111827' }}>
            <span>{t.netIncome}</span>
            <span style={{ color: financials.netIncome >= 0 ? '#059669' : '#dc2626' }}>
              {currencySymbol}{financials.netIncome.toFixed(2)}
            </span>
          </div>

          {/* Average Revenue Per Gig Card / Line */}
          <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="#9333ea" />
              <span style={{ fontWeight: 700, color: '#581c87', fontSize: '0.9375rem' }}>
                {t.avgRevenuePerGig}:
              </span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#9333ea' }}>
              {currencySymbol}{financials.avgRevenuePerGig.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1.25rem', color: '#6b7280', fontSize: '0.8125rem' }}>
            <span>{t.gigsCompletedCount}:</span>
            <span style={{ fontWeight: 700, color: '#374151' }}>{financials.gigCount}</span>
          </div>
        </div>

        {/* Statement Footer */}
        <footer style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>This Income Statement was generated by My GiG Jobs v2.0</p>
          <p style={{ margin: 0 }}>Copyright &copy; 2025 - Gigs and Side-Hustle Technologies, llc</p>
        </footer>
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

export default IncomeStatementReport;
