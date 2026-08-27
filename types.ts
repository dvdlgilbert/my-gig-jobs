
export type GigStatus = 'Scheduled' | 'Pending' | 'Working' | 'Complete';

export type Language = 'en' | 'es' | 'zh';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface UserSettings {
  language: Language;
  currencyCode: string;
  isOnboarded?: boolean;
}

export interface CashFlowData {
  salePurchaseAssets: number; // Investing activities
  netFinancing: number;       // Financing activities
  cashStart: number;          // Cash balance at start
}

export interface CashFlowStorage {
  [periodKey: string]: CashFlowData;
}

export type ReportPeriodType = 
  | 'annual'
  | 'Q1' | 'Q2' | 'Q3' | 'Q4'
  | 'H1' | 'H2'
  | '01' | '02' | '03' | '04' | '05' | '06'
  | '07' | '08' | '09' | '10' | '11' | '12';


export interface Expense {
  id: string;
  description: string;
  amount: number;
}

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
  taxRate?: number;
  expenses?: Expense[];
  hoursWorked?: number;
  jobSite: string;
  jobStatus: GigStatus;
}
