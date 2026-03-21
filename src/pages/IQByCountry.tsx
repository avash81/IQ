import * as React from 'react';
import { motion } from 'motion/react';
import { Globe, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SEO } from '../components/seo/SEO';
import { BreadcrumbSchema } from '../components/seo/StructuredData';

const COUNTRY_DATA = [
  { name: 'Japan', flag: '🇯🇵', avg: 106.48, rank: 1, trend: 'up' },
  { name: 'Taiwan', flag: '🇹🇼', avg: 106.47, rank: 2, trend: 'up' },
  { name: 'Singapore', flag: '🇸🇬', avg: 105.89, rank: 3, trend: 'down' },
  { name: 'Hong Kong', flag: '🇭🇰', avg: 105.37, rank: 4, trend: 'up' },
  { name: 'China', flag: '🇨🇳', avg: 104.10, rank: 5, trend: 'up' },
  { name: 'South Korea', flag: '🇰🇷', avg: 102.35, rank: 6, trend: 'down' },
  { name: 'Belarus', flag: '🇧🇾', avg: 101.60, rank: 7, trend: 'up' },
  { name: 'Finland', flag: '🇫🇮', avg: 101.20, rank: 8, trend: 'up' },
  { name: 'Liechtenstein', flag: '🇱🇮', avg: 101.07, rank: 9, trend: 'down' },
  { name: 'Germany', flag: '🇩🇪', avg: 100.74, rank: 10, trend: 'up' },
  { name: 'Netherlands', flag: '🇳🇱', avg: 100.74, rank: 11, trend: 'up' },
  { name: 'Estonia', flag: '🇪🇪', avg: 100.72, rank: 12, trend: 'up' },
  { name: 'Luxembourg', flag: '🇱🇺', avg: 99.87, rank: 13, trend: 'down' },
  { name: 'Macau', flag: '🇲🇴', avg: 99.82, rank: 14, trend: 'up' },
  { name: 'Cambodia', flag: '🇰🇭', avg: 99.75, rank: 15, trend: 'up' },
  { name: 'Canada', flag: '🇨🇦', avg: 99.52, rank: 16, trend: 'down' },
  { name: 'Australia', flag: '🇦🇺', avg: 99.24, rank: 17, trend: 'up' },
  { name: 'Hungary', flag: '🇭🇺', avg: 99.24, rank: 18, trend: 'up' },
  { name: 'Switzerland', flag: '🇨🇭', avg: 99.24, rank: 19, trend: 'down' },
  { name: 'United Kingdom', flag: '🇬🇧', avg: 99.12, rank: 20, trend: 'up' },
];

export default function IQByCountry() {
  const [search, setSearch] = React.useState('');

  const filteredCountries = COUNTRY_DATA.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <SEO 
        title="Average IQ by Country 2025 — World IQ Rankings"
        description="Interactive table of average IQ scores by country. See how 50+ nations compare in cognitive performance."
        canonical="/iq-by-country"
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://iqtestpro.com/' },
        { name: 'IQ by Country', url: 'https://iqtestpro.com/iq-by-country' }
      ]} />
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black text-white mb-6">Average IQ by Country</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            A global comparison of cognitive performance across 180+ nations.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 mb-12 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-royal-light/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-brand-royal-light" />
            </div>
            <h2 className="text-3xl font-bold text-white">Global Rankings</h2>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-brand-gold outline-none transition-all"
              placeholder="Search countries..."
            />
          </div>
        </div>

        <div className="bg-brand-navy-mid rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 px-10 py-6 bg-white/5 border-b border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Country</div>
            <div className="col-span-3 text-center">Average IQ</div>
            <div className="col-span-3 text-right">Trend</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {filteredCountries.map((country, idx) => (
              <motion.div 
                key={country.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="grid grid-cols-12 px-10 py-6 items-center hover:bg-white/5 transition-all group cursor-pointer"
              >
                <div className="col-span-1 font-mono text-white/40 group-hover:text-brand-gold transition-colors">
                  #{country.rank}
                </div>
                <div className="col-span-5 flex items-center gap-4">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-bold text-white group-hover:text-brand-gold transition-colors">{country.name}</span>
                </div>
                <div className="col-span-3 text-center">
                  <div className="inline-flex items-center justify-center w-20 py-2 bg-brand-royal-light/10 text-brand-royal-light rounded-xl font-black text-lg">
                    {country.avg.toFixed(1)}
                  </div>
                </div>
                <div className="col-span-3 flex justify-end">
                  {country.trend === 'up' ? (
                    <div className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-3 py-1.5 rounded-full">
                      <ArrowUpRight className="w-3 h-3" /> Rising
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-400 text-xs font-bold bg-red-400/10 px-3 py-1.5 rounded-full">
                      <ArrowDownRight className="w-3 h-3" /> Stable
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 p-10 bg-brand-navy-mid rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Methodology & Data Sources</h3>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            The data presented here is based on the 2024 Intelligence Report, which aggregates results from 
            standardized cognitive tests, academic performance metrics, and national literacy rates. 
            Scores are normalized to a global mean of 100.
          </p>
          <div className="flex flex-wrap gap-4">
            {['World Bank Data', 'PISA Scores', 'UNESCO Education Stats', 'IQTest Pro Global Data'].map(source => (
              <span key={source} className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
