'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { B2BClient, Currency } from '@/types';

const MOCK_CLIENTS: B2BClient[] = [
  { id: 'C-901', companyName: 'Berlin Logistics GmbH', country: 'DE', mrr: 4200, churnRisk: 14, gdprStatus: 'COMPLIANT', lastActive: '2026-06-15' },
  { id: 'C-902', companyName: 'Zurich Wealth AG', country: 'CH', mrr: 8500, churnRisk: 68, gdprStatus: 'COMPLIANT', lastActive: '2026-06-12' },
  { id: 'C-903', companyName: 'Vienna Tech Labs', country: 'AT', mrr: 3100, churnRisk: 45, gdprStatus: 'PENDING', lastActive: '2026-06-14' },
  { id: 'C-904', companyName: 'Paris Retail SAS', country: 'FR', mrr: 5900, churnRisk: 22, gdprStatus: 'COMPLIANT', lastActive: '2026-06-15' },
];

export default function Home() {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [showGDPRBanner, setShowGDPRBanner] = useState<boolean>(false);

  // Kontrollo nëse përdoruesi ka dhënë pëlqim më parë për GDPR
  useEffect(() => {
    const consent = localStorage.getItem('vortex_gdpr_consent');
    if (!consent) {
      setShowGDPRBanner(true);
    }
  }, []);

  const handleGDPRAccept = (accepted: boolean) => {
    localStorage.setItem('vortex_gdpr_consent', accepted ? 'GRANTED' : 'DENIED');
    setShowGDPRBanner(false);
  };

  // Konvertuesi i valutave bazuar në zgjedhjen e klientit evropian
  const getCurrencySymbol = (curr: Currency) => {
    if (curr === 'CHF') return 'CHF ';
    if (curr === 'GBP') return '£';
    return '€';
  };

  const convertMRR = (mrrInEUR: number, targetCurr: Currency) => {
    if (targetCurr === 'CHF') return (mrrInEUR * 0.96).toFixed(0);
    if (targetCurr === 'GBP') return (mrrInEUR * 0.84).toFixed(0);
    return mrrInEUR.toFixed(0);
  };

  const filteredClients = regionFilter === 'ALL' 
    ? MOCK_CLIENTS 
    : MOCK_CLIENTS.filter(c => c.country === regionFilter);

  return (
    <main className="min-h-screen bg-[#090B11] text-slate-100 font-sans antialiased p-8 relative">
      
      {/* HEADER EDITORIAL */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">[ EuroZone Analytics Core ]</span>
          <h1 className="text-3xl font-light tracking-tight mt-1">VORTEX <span className="text-slate-400 font-extralight">SaaS Suite</span></h1>
        </div>

        {/* Kontrollet e rëndësishme për bizneset në Evropë */}
        <div className="flex flex-wrap items-center gap-4 relative z-10">
          {/* Valuta */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded font-mono text-xs">
            {(['EUR', 'CHF', 'GBP'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2.5 py-1 rounded transition-colors ${currency === curr ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Rajoni */}
          <select 
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 p-1.5 rounded font-mono text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Regions (EU/CH)</option>
            <option value="DE">Germany (DE)</option>
            <option value="CH">Switzerland (CH)</option>
            <option value="AT">Austria (AT)</option>
            <option value="FR">France (FR)</option>
          </select>
        </div>
      </header>

      {/* BODY CONTENT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8">
        
        {/* KPI METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800/60 p-5 rounded-xl backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Total Portfolio MRR</span>
            <h3 className="text-2xl font-light mt-2 text-white">
              {getCurrencySymbol(currency)}{filteredClients.reduce((acc, c) => acc + parseFloat(convertMRR(c.mrr, currency)), 0).toLocaleString()}
            </h3>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/60 p-5 rounded-xl backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Active EU Accounts</span>
            <h3 className="text-2xl font-light mt-2 text-white">{filteredClients.length} <span className="text-xs text-slate-500 font-mono">Nodes</span></h3>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/60 p-5 rounded-xl backdrop-blur-md">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">High Churn Warning</span>
            <h3 className="text-2xl font-light mt-2 text-red-400">
              {filteredClients.filter(c => c.churnRisk > 40).length} <span className="text-xs text-slate-500 font-mono">At Risk</span>
            </h3>
          </div>
        </div>

        {/* CUSTOMER ANALYTICS TABLE */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">B2B Portfolio Health Matrix</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Real-time dynamic risk calculation engine</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-widest pb-3">
                  <th className="pb-3 pl-2">Client ID</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Region</th>
                  <th className="pb-3">Contract Value</th>
                  <th className="pb-3">Churn Risk</th>
                  <th className="pb-3 text-right pr-2">GDPR Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 pl-2 font-mono text-indigo-400 font-bold">{client.id}</td>
                    <td className="py-4 font-medium text-slate-200">{client.companyName}</td>
                    <td className="py-4 font-mono text-slate-400">{client.country}</td>
                    <td className="py-4 font-mono text-white font-medium">
                      {getCurrencySymbol(currency)}{parseInt(convertMRR(client.mrr, currency)).toLocaleString()}
                    </td>
                    <td className="py-4 w-44">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${client.churnRisk}%` }} 
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* COMPONENT: GDPR CONSENT BANNER (Pika Kryesore Vizuale) */}
      <AnimatePresence>
        {showGDPRBanner && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 max-w-4xl mx-auto bg-slate-900 border border-indigo-500/30 p-4 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-50 backdrop-blur-lg"
          >
            <div className="space-y-1">
              <h4 className="text-xs font-mono text-indigo-400 uppercase tracking-widest">🇪🇺 GDPR Privacy Consent Architecture</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                This enterprise node utilizes tracking matrices to compute localized B2B churn analytics. We value data minimization protocols according to Art. 6 GDPR.
              </p>
            </div>
            <div className="flex gap-2 font-mono text-[10px] uppercase tracking-wider shrink-0 w-full md:w-auto justify-end">
              <button 
                onClick={() => handleGDPRAccept(false)}
                className="px-4 py-2 border border-slate-800 rounded hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
              >
                Refuse Logs
              </button>
              <button 
                onClick={() => handleGDPRAccept(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                Accept & Initialize
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}