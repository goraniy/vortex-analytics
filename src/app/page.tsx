'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { B2BClient, Currency, RegionalMetric } from '@/types';

const MOCK_CLIENTS: B2BClient[] = [
  { id: 'C-901', companyName: 'Berlin Logistics GmbH', country: 'DE', mrr: 4200, churnRisk: 14, gdprStatus: 'COMPLIANT', lastActive: '2026-06-15', sector: 'Automotive' },
  { id: 'C-902', companyName: 'Zurich Wealth AG', country: 'CH', mrr: 8500, churnRisk: 68, gdprStatus: 'COMPLIANT', lastActive: '2026-06-12', sector: 'Fintech' },
  { id: 'C-903', companyName: 'Vienna Tech Labs', country: 'AT', mrr: 3100, churnRisk: 45, gdprStatus: 'PENDING', lastActive: '2026-06-14', sector: 'SaaS' },
  { id: 'C-904', companyName: 'Paris Retail SAS', country: 'FR', mrr: 5900, churnRisk: 22, gdprStatus: 'COMPLIANT', lastActive: '2026-06-15', sector: 'Enterprise' },
  { id: 'C-905', companyName: 'Munich Quantum Corp', country: 'DE', mrr: 12500, churnRisk: 8, gdprStatus: 'COMPLIANT', lastActive: '2026-06-16', sector: 'Enterprise' },
  { id: 'C-906', companyName: 'Geneva BioTech', country: 'CH', mrr: 7100, churnRisk: 39, gdprStatus: 'COMPLIANT', lastActive: '2026-06-10', sector: 'Fintech' },
];

const REGIONAL_DATA: Record<string, RegionalMetric> = {
  DE: { country: 'Germany', vatRate: 19, complianceScore: 99, growthRate: '+4.2%' },
  CH: { country: 'Switzerland', vatRate: 8.1, complianceScore: 96, growthRate: '+2.8%' },
  AT: { country: 'Austria', vatRate: 20, complianceScore: 98, growthRate: '+3.1%' },
  FR: { country: 'France', vatRate: 20, complianceScore: 94, growthRate: '+5.0%' },
};

export default function Home() {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [showGDPRBanner, setShowGDPRBanner] = useState<boolean>(false);
  const [ltvMultiplier, setLtvMultiplier] = useState<number>(12); // Slider state
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('vortex_gdpr_consent');
    if (!consent) setShowGDPRBanner(true);
  }, []);

  const handleGDPRAccept = (accepted: boolean) => {
    localStorage.setItem('vortex_gdpr_consent', accepted ? 'GRANTED' : 'DENIED');
    setShowGDPRBanner(false);
  };

  const getCurrencySymbol = (curr: Currency) => {
    if (curr === 'CHF') return 'CHF ';
    if (curr === 'GBP') return '£';
    return '€';
  };

  const convertValue = (valInEUR: number, targetCurr: Currency) => {
    if (targetCurr === 'CHF') return valInEUR * 0.96;
    if (targetCurr === 'GBP') return valInEUR * 0.84;
    return valInEUR;
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Audit Report generated successfully in compliance with EU regulations (v2026.1).');
    }, 1500);
  };

  const filteredClients = MOCK_CLIENTS.filter(c => {
    const matchRegion = regionFilter === 'ALL' || c.country === regionFilter;
    const matchSector = sectorFilter === 'ALL' || c.sector === sectorFilter;
    return matchRegion && matchSector;
  });

  const totalMRR = filteredClients.reduce((acc, c) => acc + c.mrr, 0);
  const activeVatRate = regionFilter !== 'ALL' ? REGIONAL_DATA[regionFilter].vatRate : 19;

  return (
    <main className="min-h-screen bg-[#07090E] text-slate-200 font-sans antialiased p-6 lg:p-12 relative selection:bg-indigo-600 selection:text-white">
      
      {/* GLOBAL BACKGROUND LINES FOR PREMIUM DESIGN VIBE */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-slate-800/60 pb-8 mb-10 gap-6 relative z-10">
        <div>
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
            🇪🇺 EuroZone Fiscal Core v2.6
          </span>
          <h1 className="text-4xl font-light tracking-tight mt-3 text-white">VORTEX <span className="text-slate-500 font-extralight">Intelligence Suite</span></h1>
          <p className="text-xs text-slate-500 font-mono mt-1">Cross-border enterprise portfolio monitoring & predictive analytics</p>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-2 rounded-xl border border-slate-800/80 backdrop-blur-sm w-full lg:w-auto">
          {/* Currency Toggle */}
          <div className="flex bg-slate-950 border border-slate-800/80 p-1 rounded-lg font-mono text-xs">
            {(['EUR', 'CHF', 'GBP'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${currency === curr ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Region Select */}
          <select 
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800/80 p-2 rounded-lg font-mono text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Jurisdictions (EU/CH)</option>
            <option value="DE">Germany (DE)</option>
            <option value="CH">Switzerland (CH)</option>
            <option value="AT">Austria (AT)</option>
            <option value="FR">France (FR)</option>
          </select>

          {/* Sector Select */}
          <select 
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800/80 p-2 rounded-lg font-mono text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Sectors</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Fintech">Fintech</option>
            <option value="SaaS">SaaS</option>
            <option value="Automotive">Automotive</option>
          </select>

          {/* Audit Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 p-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            {isExporting ? 'Generating...' : '📊 Export Audit'}
          </button>
        </div>
      </header>

      {/* CORE MATRIX GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COMPONENT: KPI & INTERACTIVE SLIDER (4 KOLONA) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* TOTAL portfolio HEALTH CARD */}
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Aggregated Gross MRR</span>
            <h3 className="text-3xl font-extralight mt-2 text-white">
              {getCurrencySymbol(currency)}{convertValue(totalMRR, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex justify-between text-[11px] font-mono text-slate-400">
              <span>Est. Local VAT ({activeVatRate}%):</span>
              <span className="text-slate-300">
                {getCurrencySymbol(currency)}{convertValue((totalMRR * activeVatRate) / 100, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* INTERACTIVE LTV CALCULATOR MODULE */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md space-y-4">
            <div>
              <h4 className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Dynamic LTV Projection</h4>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">Forecast client lifecycle value asset ceilings</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Contract Contract Length:</span>
                <span className="text-indigo-400 font-bold">{ltvMultiplier} Months</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="36" 
                value={ltvMultiplier}
                onChange={(e) => setLtvMultiplier(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Projected Portfolio Value (LTV)</span>
              <p className="text-xl font-mono text-emerald-400 mt-1 font-semibold">
                {getCurrencySymbol(currency)}{convertValue(totalMRR * ltvMultiplier, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* JURISDICTIONAL MATRIX STATS */}
          {regionFilter !== 'ALL' && REGIONAL_DATA[regionFilter] && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-950/10 border border-indigo-500/20 p-5 rounded-2xl font-mono text-xs space-y-2"
            >
              <h4 className="text-indigo-400 uppercase text-[10px] tracking-widest font-bold">|| Regional Profile: {REGIONAL_DATA[regionFilter].country}</h4>
              <div className="flex justify-between text-slate-400 pt-2">
                <span>Standard VAT Code:</span>
                <span className="text-white">{REGIONAL_DATA[regionFilter].vatRate}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GDPR Compliance Index:</span>
                <span className="text-emerald-400">{REGIONAL_DATA[regionFilter].complianceScore}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Quarterly Growth Metric:</span>
                <span className="text-white font-bold">{REGIONAL_DATA[regionFilter].growthRate}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COMPONENT: ENTERPRISE PORTFOLIO HEALTH MATRIX (8 KOLONA) */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">B2B Portfolio Health Matrix</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Automated churn probability vectors</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/50 border border-slate-700/40 px-2.5 py-1 rounded">
                Records Found: {filteredClients.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[10px] font-mono uppercase text-slate-500 tracking-widest pb-3">
                    <th className="pb-3 pl-2">Client ID</th>
                    <th className="pb-3">Company Entity</th>
                    <th className="pb-3">Sector</th>
                    <th className="pb-3">Region</th>
                    <th className="pb-3">Contract Value</th>
                    <th className="pb-3">Churn Risk</th>
                    <th className="pb-3 text-right pr-2">GDPR Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30 text-slate-300">
                  <AnimatePresence mode="popLayout">
                    {filteredClients.map((client) => (
                      <motion.tr 
                        key={client.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className="hover:bg-slate-900/20 transition-colors group"
                      >
                        <td className="py-4 pl-2 font-mono text-indigo-400 font-bold group-hover:text-indigo-300">{client.id}</td>
                        <td className="py-4 font-medium text-slate-200 font-sans">{client.companyName}</td>
                        <td className="py-4">
                          <span className="bg-slate-800/40 border border-slate-700/30 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono">
                            {client.sector}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-slate-400">{client.country}</td>
                        <td className="py-4 font-mono text-white font-medium">
                          {getCurrencySymbol(currency)}{convertValue(client.mrr, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-4 w-40">
                          <div className="flex items-center gap-2.5">
                            <div className="h-1.5 w-16 bg-slate-800/80 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${client.churnRisk}%` }}
                                className={`h-full ${client.churnRisk > 40 ? 'bg-red-500' : 'bg-emerald-500'}`}
                              />
                            </div>
                            <span className={`font-mono font-bold ${client.churnRisk > 40 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {client.churnRisk}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <span className={`px-2 py-0.5 font-mono text-[9px] rounded border ${
                            client.gdprStatus === 'COMPLIANT' 
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                          }`}>
                            {client.gdprStatus}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* COMPONENT: GDPR CONSENT BANNER */}
      <AnimatePresence>
        {showGDPRBanner && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 max-w-5xl mx-auto bg-slate-950/95 border border-indigo-500/30 p-5 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-50 backdrop-blur-xl"
          >
            <div className="space-y-1">
              <h4 className="text-xs font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <span>🇪🇺</span> GDPR Privacy Consent Compliance Layer
              </h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed max-w-3xl">
                This enterprise telemetry node processes localized metrics to compute deterministic B2B churn analytics and financial indexes. We strictly adhere to data minimization protocols according to Art. 6 GDPR.
              </p>
            </div>
            <div className="flex gap-2 font-mono text-[10px] uppercase tracking-wider shrink-0 w-full md:w-auto justify-end">
              <button 
                onClick={() => handleGDPRAccept(false)}
                className="px-4 py-2.5 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
              >
                Refuse Analytics
              </button>
              <button 
                onClick={() => handleGDPRAccept(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors cursor-pointer shadow-lg shadow-indigo-600/20 font-bold"
              >
                Initialize Node
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}