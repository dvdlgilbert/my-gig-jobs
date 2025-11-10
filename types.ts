export interface Gig {
  id: string;
  title: string;
  company: string;
  location: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: 'Booked' | 'Lead' | 'Completed' | 'Cancelled';
  date: string;
  notes?: string;
}

