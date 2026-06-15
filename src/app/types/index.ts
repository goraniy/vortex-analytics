export interface B2BClient {
  id: string;
  companyName: string;
  country: 'DE' | 'CH' | 'AT' | 'FR';
  mrr: number; 
  churnRisk: number; 
  gdprStatus: 'COMPLIANT' | 'PENDING';
  lastActive: string;
  sector: 'Enterprise' | 'SaaS' | 'Fintech' | 'Automotive';
}

export interface RegionalMetric {
  country: string;
  vatRate: number;
  complianceScore: number;
  growthRate: string;
}

export type Currency = 'EUR' | 'CHF' | 'GBP';