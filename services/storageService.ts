// FIX: Fix module resolution error by removing file extension.
import type { Gig } from '../types';

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
