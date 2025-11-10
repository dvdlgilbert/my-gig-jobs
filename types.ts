export type GigStatus = 'Scheduled' | 'Pending' | 'Working' | 'Complete';

export interface Gig {
  id: string;
  jobTitle: string;
  description: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  date: string; // ISO string format
  time: string; // HH:mm format
  jobCost?: number;
  hoursWorked?: number;
  jobSite: string;
  jobStatus: GigStatus;
}
