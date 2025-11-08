export type Gig = {
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
  jobCost?: number;
  hoursWorked?: number;
  jobStatus: 'Planned' | 'Confirmed' | 'Completed' | 'Cancelled';
};

