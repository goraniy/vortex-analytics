export interface B2BClient {
  id: string;
  companyName: string;
  country: 'DE' | 'CH' | 'AT' | 'FR';
  mrr: number; // Monthly Recurring Revenue
  churnRisk: number; // Përqindja e rrezikut të largimit
  gdprStatus: 'COMPLIANT' | 'PENDING';
  lastActive: string;
}

export type Currency = 'EUR' | 'CHF' | 'GBP';