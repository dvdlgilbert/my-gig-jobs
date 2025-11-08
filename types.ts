
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

export interface GigPlan {
  setlist: string[];
  banter: string[];
  socialMediaPost: string;
}
