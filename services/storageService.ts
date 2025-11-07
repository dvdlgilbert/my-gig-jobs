import type { Gig } from '../types';

const GIGS_STORAGE_KEY = 'myGigsData';

export const getGigs = (): Gig[] => {
  try {
    const gigsJson = localStorage.getItem(GIGS_STORAGE_KEY);
    return gigsJson ? JSON.parse(gigsJson) : [];
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
