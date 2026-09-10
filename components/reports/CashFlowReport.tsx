import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Gig, Language, ReportPeriodType, CashFlowData } from '../../types';
import { translations } from '../../translations';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import PdfIcon from '../icons/PdfIcon';
import ShareIcon from '../icons/ShareIcon';
import { getCashFlowData, saveCashFlowData } from '../../services/storageService';
import { saveElementAsPdf, shareElementAsPdf } from '../../utils/pdfExport';
import { Edit3, X, Check } from 'lucide-react';

interface CashFlowReportProps {
  gigs: Gig[];
  currencySymbol: string;
  language: Language;
  onBack: () => void;
}

const CashFlowReport: React.FC<CashFlowReportProps> = ({
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

  // Modal editing state for investing / financing / start balance
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'investing' | 'financing' | 'start'>('all');
  const [manualData, setManualData] = useState<CashFlowData>({
    saleOfAssets: 0,
    purchaseOfAssets: 0,
    netProceeds: 0,
    repayments: 0,
    cashStart: 0,
  });
  const [tempData, setTempData] = useState({
    saleOfAssets: '',
    purchaseOfAssets: '',
    netProceeds: '',
    repayments: '',
    cashStart: '',
  });

  const t = translations[language] || translations.en;
  const periodKey = `${selectedYear}-${selectedPeriod}`;

  // Load manual adjustments for this periodKey
  useEffect(() => {
    const data = getCashFlowData(periodKey);
    setManualData(data);
  }, [periodKey]);

  const openEditModal = (section: 'all' | 'investing' | 'financing' | 'start' = 'all') => {
    setActiveSection(section);
    const sale = manualData.saleOfAssets ?? ((manualData.salePurchaseAssets && manualData.salePurchaseAssets > 0) ? manualData.salePurchaseAssets : 0);
    const purchase = manualData.purchaseOfAssets ?? ((manualData.salePurchaseAssets && manualData.salePurchaseAssets < 0) ? Math.abs(manualData.salePurchaseAssets) : 0);
    const proceeds = manualData.netProceeds ?? ((manualData.netFinancing && manualData.netFinancing > 0) ? manualData.netFinancing : 0);
    const repays = manualData.repayments ?? ((manualData.netFinancing && manualData.netFinancing < 0) ? Math.abs(manualData.netFinancing) : 0);
    const start = manualData.cashStart || 0;

    setTempData({
      saleOfAssets: sale === 0 ? '' : sale.toString(),
      purchaseOfAssets: purchase === 0 ? '' : purchase.toString(),
      netProceeds: proceeds === 0 ? '' : proceeds.toString(),
      repayments: repays === 0 ? '' : repays.toString(),
      cashStart: start === 0 ? '' : start.toString(),
    });
    setIsEditModalOpen(true);
  };

  // Extract available years
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

  // Filter matching gigs for operating activities in period
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

  // Financial Calculations for Cash Flow Statement
  const statementFigures = useMemo(() => {
    let cashReceivedFromClients = 0;
    let cashPaidForExpenses = 0;

    matchingGigs.forEach((gig) => {
      // Cash received is the total billed/collected (Labor + tax or total)
      const labor = gig.jobCost || 0;
      const expenses = (gig.expenses || []).reduce((acc, exp) => acc + (exp.amount || 0), 0);
      const subtotal = labor + expenses;
      const taxRate = gig.taxRate || 0;
      const tax = subtotal * (taxRate / 100);
      
      cashReceivedFromClients += (labor + tax); // revenue + collected tax
      cashPaidForExpenses += expenses;
    });

    // 1. Operating Activities
    const netCashOperating = cashReceivedFromClients - cashPaidForExpenses;

    // 2. Investing Activities (2 lines: cash-in and cash-out)
    const saleOfAssets = manualData.saleOfAssets ?? (
      (manualData.salePurchaseAssets && manualData.salePurchaseAssets > 0) ? manualData.salePurchaseAssets : 0
    );
    const purchaseOfAssets = manualData.purchaseOfAssets ?? (
      (manualData.salePurchaseAssets && manualData.salePurchaseAssets < 0) ? Math.abs(manualData.salePurchaseAssets) : 0
    );
    const netCashInvesting = saleOfAssets - purchaseOfAssets;

    // 3. Financing Activities (2 lines: Net proceeds and Repayments)
    const netProceeds = manualData.netProceeds ?? (
      (manualData.netFinancing && manualData.netFinancing > 0) ? manualData.netFinancing : 0
    );
    const repayments = manualData.repayments ?? (
      (manualData.netFinancing && manualData.netFinancing < 0) ? Math.abs(manualData.netFinancing) : 0
    );
    const netCashFinancing = netProceeds - repayments;

    // 4. Net Increase in Cash
    const netIncreaseInCash = netCashOperating + netCashInvesting + netCashFinancing;

    // 5. Cash balance at start
    const cashBalanceStart = manualData.cashStart || 0;

    // 6. Cash balance at end
    const cashBalanceEnd = cashBalanceStart + netIncreaseInCash;

    return {
      cashReceivedFromClients,
      cashPaidForExpenses,
      netCashOperating,
      saleOfAssets,
      purchaseOfAssets,
      netCashInvesting,
      netProceeds,
      repayments,
      netCashFinancing,
      netIncreaseInCash,
      cashBalanceStart,
      cashBalanceEnd,
    };
  }, [matchingGigs, manualData]);

  const handleSaveModal = () => {
    const sale = Math.abs(parseFloat(tempData.saleOfAssets) || 0);
    const purchase = Math.abs(parseFloat(tempData.purchaseOfAssets) || 0);
    const proceeds = Math.abs(parseFloat(tempData.netProceeds) || 0);
    const repays = Math.abs(parseFloat(tempData.repayments) || 0);
    const start = parseFloat(tempData.cashStart) || 0;

    const updated: CashFlowData = {
      saleOfAssets: sale,
      purchaseOfAssets: purchase,
      salePurchaseAssets: sale - purchase,
      netProceeds: proceeds,
      repayments: repays,
      netFinancing: proceeds - repays,
      cashStart: start,
    };

    setManualData(updated);
    saveCashFlowData(periodKey, updated);
    setIsEditModalOpen(false);
  };

  const handleSavePdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportMessage(t.generatingPdf);
    try {
      const filename = `MyGiGs-Cash-Flow-${selectedYear}-${selectedPeriod}.pdf`;
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
      const filename = `MyGiGs-Cash-Flow-${selectedYear}-${selectedPeriod}.pdf`;
      const title = `${t.cashFlowStatement} - ${selectedYear} ${getPeriodLabel(selectedPeriod)}`;
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
              {t.cashFlowStatement}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              {t.cashFlowStatementDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Period Selection Controls */}
      <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '1.5rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
            {t.cashFlowStatement}
          </p>
          <p style={{ fontSize: '0.9375rem', color: '#4b5563', fontWeight: 600, margin: '0.25rem 0 0 0' }}>
            {t.period}: {getPeriodLabel(selectedPeriod)} ({selectedYear})
          </p>
        </div>

        {/* 1. Cash flows from operating activities */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            {t.cashFlowOp}
          </div>
          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.cashReceivedClients}</span>
              <span style={{ fontWeight: 600 }}>{currencySymbol}{statementFigures.cashReceivedFromClients.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.lessCashPaidExpenses}</span>
              <span style={{ fontWeight: 600, color: '#dc2626' }}>({currencySymbol}{statementFigures.cashPaidForExpenses.toFixed(2)})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid #f3f4f6', color: '#111827', fontSize: '0.9375rem', fontWeight: 700, marginTop: '0.25rem' }}>
              <span>{t.netCashOp}</span>
              <span style={{ color: statementFigures.netCashOperating >= 0 ? '#059669' : '#dc2626' }}>
                {currencySymbol}{statementFigures.netCashOperating.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Cash Flow from investing activities [Edit] */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>
              {t.cashFlowInv}
            </span>
            <button
              onClick={() => openEditModal('investing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: '#f3e8ff',
                color: '#9333ea',
                border: 'none',
                padding: '0.25rem 0.625rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="hover:bg-purple-200"
            >
              <Edit3 size={12} />
              <span>[{t.edit}]</span>
            </button>
          </div>
          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.saleOfAssets}</span>
              <span style={{ fontWeight: 600 }}>{currencySymbol}{statementFigures.saleOfAssets.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.purchaseOfAssets}</span>
              <span style={{ fontWeight: 600, color: statementFigures.purchaseOfAssets > 0 ? '#dc2626' : '#374151' }}>
                ({currencySymbol}{statementFigures.purchaseOfAssets.toFixed(2)})
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid #f3f4f6', color: '#111827', fontSize: '0.9375rem', fontWeight: 700, marginTop: '0.25rem' }}>
              <span>{t.netCashInv}</span>
              <span style={{ color: statementFigures.netCashInvesting >= 0 ? '#059669' : '#dc2626' }}>
                {statementFigures.netCashInvesting < 0
                  ? `-${currencySymbol}${Math.abs(statementFigures.netCashInvesting).toFixed(2)}`
                  : `${currencySymbol}${statementFigures.netCashInvesting.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Cash flows from financing activities [Edit] */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>
              {t.cashFlowFin}
            </span>
            <button
              onClick={() => openEditModal('financing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: '#f3e8ff',
                color: '#9333ea',
                border: 'none',
                padding: '0.25rem 0.625rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="hover:bg-purple-200"
            >
              <Edit3 size={12} />
              <span>[{t.edit}]</span>
            </button>
          </div>
          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.netProceeds}</span>
              <span style={{ fontWeight: 600 }}>{currencySymbol}{statementFigures.netProceeds.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#374151', fontSize: '0.9375rem' }}>
              <span>{t.repayments}</span>
              <span style={{ fontWeight: 600, color: statementFigures.repayments > 0 ? '#dc2626' : '#374151' }}>
                ({currencySymbol}{statementFigures.repayments.toFixed(2)})
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid #f3f4f6', color: '#111827', fontSize: '0.9375rem', fontWeight: 700, marginTop: '0.25rem' }}>
              <span>{t.netCashFin}</span>
              <span style={{ color: statementFigures.netCashFinancing >= 0 ? '#059669' : '#dc2626' }}>
                {statementFigures.netCashFinancing < 0
                  ? `-${currencySymbol}${Math.abs(statementFigures.netCashFinancing).toFixed(2)}`
                  : `${currencySymbol}${statementFigures.netCashFinancing.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Net Increase in Cash (bold and right-justified) */}
        <div style={{ borderTop: '2px solid #111827', padding: '1rem 0', display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'right', minWidth: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
              <span>{t.netIncreaseCash}:</span>
              <span style={{ color: statementFigures.netIncreaseInCash >= 0 ? '#059669' : '#dc2626' }}>
                {statementFigures.netIncreaseInCash < 0
                  ? `-${currencySymbol}${Math.abs(statementFigures.netIncreaseInCash).toFixed(2)}`
                  : `${currencySymbol}${statementFigures.netIncreaseInCash.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Cash balance at start [Edit] (right justified) */}
        <div style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.5rem', minWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9375rem', color: '#4b5563', fontWeight: 600 }}>
                {t.cashBalanceStart}:
              </span>
              <button
                onClick={() => openEditModal('start')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  backgroundColor: '#f3e8ff',
                  color: '#9333ea',
                  border: 'none',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                className="hover:bg-purple-200"
              >
                <Edit3 size={10} />
                <span>[{t.edit}]</span>
              </button>
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
              {currencySymbol}{statementFigures.cashBalanceStart.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 6. Cash balance at end (total, bold, right justified) */}
        <div style={{ borderTop: '2px solid #111827', padding: '1rem 0 0.5rem 0', display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'right', minWidth: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>
              <span>{t.cashBalanceEnd}:</span>
              <span style={{ color: statementFigures.cashBalanceEnd >= 0 ? '#059669' : '#dc2626' }}>
                {statementFigures.cashBalanceEnd < 0
                  ? `-${currencySymbol}${Math.abs(statementFigures.cashBalanceEnd).toFixed(2)}`
                  : `${currencySymbol}${statementFigures.cashBalanceEnd.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>This Cash Flow Statement was generated by My GiG Jobs v2.0</p>
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

      {/* Edit Values Modal */}
      {isEditModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              maxWidth: '540px',
              width: '100%',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {t.editCashFlowValues}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  {getPeriodLabel(selectedPeriod)} ({selectedYear})
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Section Switcher Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '0.375rem 1rem', gap: '0.5rem', overflowX: 'auto' }}>
              <button
                type="button"
                onClick={() => setActiveSection('all')}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'all' ? '#9333ea' : 'transparent',
                  color: activeSection === 'all' ? 'white' : '#4b5563',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.allSections}
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('investing')}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'investing' ? '#9333ea' : 'transparent',
                  color: activeSection === 'investing' ? 'white' : '#4b5563',
                  whiteSpace: 'nowrap',
                }}
              >
                2. Investing
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('financing')}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'financing' ? '#9333ea' : 'transparent',
                  color: activeSection === 'financing' ? 'white' : '#4b5563',
                  whiteSpace: 'nowrap',
                }}
              >
                3. Financing
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('start')}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'start' ? '#9333ea' : 'transparent',
                  color: activeSection === 'start' ? 'white' : '#4b5563',
                  whiteSpace: 'nowrap',
                }}
              >
                5. {t.cashBalanceStart}
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
              {/* SECTION 2: Investing Activities */}
              {(activeSection === 'all' || activeSection === 'investing') && (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', backgroundColor: '#faf5ff' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#6b21a8', marginBottom: '0.875rem' }}>
                    {t.cashFlowInv}
                  </div>

                  {/* Line 1: Sale of Assets (Cash-in +) */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                      <span>{t.saleOfAssetsInput}</span>
                      <span style={{ color: '#059669', fontWeight: 800 }}>Cash In (+)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700 }}>
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={tempData.saleOfAssets}
                        onChange={(e) => setTempData({ ...tempData, saleOfAssets: e.target.value })}
                        style={{
                          width: '100%',
                          paddingLeft: '2.25rem',
                          paddingRight: '1rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          backgroundColor: 'white',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{t.saleOfAssetsHelp}</span>
                  </div>

                  {/* Line 2: Purchase of Assets (Cash-out -) */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                      <span>{t.purchaseOfAssetsInput}</span>
                      <span style={{ color: '#dc2626', fontWeight: 800 }}>Cash Out (-)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700 }}>
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={tempData.purchaseOfAssets}
                        onChange={(e) => setTempData({ ...tempData, purchaseOfAssets: e.target.value })}
                        style={{
                          width: '100%',
                          paddingLeft: '2.25rem',
                          paddingRight: '1rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          backgroundColor: 'white',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{t.purchaseOfAssetsHelp}</span>
                  </div>

                  {/* Live Calculation Preview */}
                  <div style={{ borderTop: '1px dashed #d8b4fe', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#4b5563' }}>
                    <span>{t.netCashInv}:</span>
                    <span style={{ color: (parseFloat(tempData.saleOfAssets || '0') - parseFloat(tempData.purchaseOfAssets || '0')) >= 0 ? '#059669' : '#dc2626' }}>
                      {(parseFloat(tempData.saleOfAssets || '0') - parseFloat(tempData.purchaseOfAssets || '0')) < 0
                        ? `-${currencySymbol}${Math.abs(parseFloat(tempData.saleOfAssets || '0') - parseFloat(tempData.purchaseOfAssets || '0')).toFixed(2)}`
                        : `${currencySymbol}${(parseFloat(tempData.saleOfAssets || '0') - parseFloat(tempData.purchaseOfAssets || '0')).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              )}

              {/* SECTION 3: Financing Activities */}
              {(activeSection === 'all' || activeSection === 'financing') && (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', backgroundColor: '#f0fdf4' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#166534', marginBottom: '0.875rem' }}>
                    {t.cashFlowFin}
                  </div>

                  {/* Line 1: Net Proceeds (Cash-in +) */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                      <span>{t.netProceedsInput}</span>
                      <span style={{ color: '#059669', fontWeight: 800 }}>Cash In (+)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700 }}>
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={tempData.netProceeds}
                        onChange={(e) => setTempData({ ...tempData, netProceeds: e.target.value })}
                        style={{
                          width: '100%',
                          paddingLeft: '2.25rem',
                          paddingRight: '1rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          backgroundColor: 'white',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{t.netProceedsHelp}</span>
                  </div>

                  {/* Line 2: Repayments (Cash-out -) */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                      <span>{t.repaymentsInput}</span>
                      <span style={{ color: '#dc2626', fontWeight: 800 }}>Cash Out (-)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700 }}>
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={tempData.repayments}
                        onChange={(e) => setTempData({ ...tempData, repayments: e.target.value })}
                        style={{
                          width: '100%',
                          paddingLeft: '2.25rem',
                          paddingRight: '1rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          backgroundColor: 'white',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{t.repaymentsHelp}</span>
                  </div>

                  {/* Live Calculation Preview */}
                  <div style={{ borderTop: '1px dashed #bbf7d0', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: '#4b5563' }}>
                    <span>{t.netCashFin}:</span>
                    <span style={{ color: (parseFloat(tempData.netProceeds || '0') - parseFloat(tempData.repayments || '0')) >= 0 ? '#059669' : '#dc2626' }}>
                      {(parseFloat(tempData.netProceeds || '0') - parseFloat(tempData.repayments || '0')) < 0
                        ? `-${currencySymbol}${Math.abs(parseFloat(tempData.netProceeds || '0') - parseFloat(tempData.repayments || '0')).toFixed(2)}`
                        : `${currencySymbol}${(parseFloat(tempData.netProceeds || '0') - parseFloat(tempData.repayments || '0')).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              )}

              {/* SECTION 5: Cash balance at start */}
              {(activeSection === 'all' || activeSection === 'start') && (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.875rem' }}>
                    {t.cashBalanceStart}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                      {t.cashBalanceStart}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700 }}>
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={tempData.cashStart}
                        onChange={(e) => setTempData({ ...tempData, cashStart: e.target.value })}
                        style={{
                          width: '100%',
                          paddingLeft: '2.25rem',
                          paddingRight: '1rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          backgroundColor: 'white',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{t.cashBalanceStartHelp}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(147, 51, 234, 0.2)',
                }}
              >
                <Check size={16} />
                <span>{t.saveChanges}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlowReport;
