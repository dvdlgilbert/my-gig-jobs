// FIX: Fix module resolution error by removing file extension.
import type { Gig, UserSettings } from '../types';

const GIGS_STORAGE_KEY = 'myGigsData';

export const getGigs = (): Gig[] => {
  try {
    const gigsJson = localStorage.getItem(GIGS_STORAGE_KEY);
    const gigs = gigsJson ? JSON.parse(gigsJson) : [];
    // Sort gigs by date, most recent first
    // FIX: Replaced non-existent 'dateApplied' property with 'date' for sorting.
    return gigs.sort((a: Gig, b: Gig) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Could not parse gigs from localStorage", error);
    return [];
  }
};

export const saveGigs = (gigs: Gig[]): void => {
  try {
    localStorage.setItem(GIGS_STORAGE_KEY, JSON.stringify(gigs));
  } catch (error) {
    console.error("Could not save gigs to localStorage", error);
  }
};

const SETTINGS_STORAGE_KEY = 'myGigsSettings';

export const getSettings = (): UserSettings => {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!settingsJson) return { language: 'en', currencyCode: 'USD', isOnboarded: false };
    const parsed = JSON.parse(settingsJson);
    return {
      language: parsed.language || 'en',
      currencyCode: parsed.currencyCode || 'USD',
      isOnboarded: parsed.isOnboarded ?? true
    };
  } catch (error) {
    return { language: 'en', currencyCode: 'USD', isOnboarded: false };
  }
};

export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Could not save settings to localStorage", error);
  }
};

const CASH_FLOW_STORAGE_KEY = 'myGigsCashFlowData';

export const getCashFlowData = (periodKey: string): { salePurchaseAssets: number; netFinancing: number; cashStart: number } => {
  try {
    const raw = localStorage.getItem(CASH_FLOW_STORAGE_KEY);
    if (!raw) return { salePurchaseAssets: 0, netFinancing: 0, cashStart: 0 };
    const parsed = JSON.parse(raw);
    return parsed[periodKey] || { salePurchaseAssets: 0, netFinancing: 0, cashStart: 0 };
  } catch (error) {
    console.error("Could not read cash flow data", error);
    return { salePurchaseAssets: 0, netFinancing: 0, cashStart: 0 };
  }
};

export const saveCashFlowData = (periodKey: string, data: { salePurchaseAssets: number; netFinancing: number; cashStart: number }): void => {
  try {
    const raw = localStorage.getItem(CASH_FLOW_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[periodKey] = data;
    localStorage.setItem(CASH_FLOW_STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error("Could not save cash flow data", error);
  }
};
