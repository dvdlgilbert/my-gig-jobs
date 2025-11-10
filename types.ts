// types.ts

export type GigStatus = 'Interested' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Declined';

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

export interface Gig {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  status: GigStatus;
  contact: Contact;
  notes: string;
  dateApplied: string; // ISO string
}

