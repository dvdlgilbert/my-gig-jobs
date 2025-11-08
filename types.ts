
export interface Gig {
  id: number;
  jobTitle: string;
  jobDescription: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  date: string;
  time?: string;
  jobLocation?: string;
  jobCost?: number | string;
  hoursWorked?: number | string;
  jobStatus?: 'Planned' | 'Confirmed' | 'Completed' | 'Cancelled';
}

// FIX: Added GigDetails and GigPlan types for use with the Gemini API service.
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
