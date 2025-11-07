export interface Gig {
  id: number; // System-generated timestamp
  jobTitle: string;
  clientName: string;
  jobDescription: string;
  clientPhone: string;
  clientEmail: string;
  date: string;
  time: string;
  clientAddress: string;
  jobCost: string; // Stored as string to handle currency symbols easily
  hoursWorked: string; // Stored as string
  jobLocation: string;
  jobStatus: string;
}

// FIX: Added missing type definitions for GigDetails and GigPlan, which are used in `geminiService.ts`.
export interface GigDetails {
  artistName: string;
  venue: string;
  eventType: string;
  genre: string;
  audienceVibe: string;
}

export interface GigPlan {
  setlist: string[];
  banter: string[];
  socialMediaPost: string;
}

