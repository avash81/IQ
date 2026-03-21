import * as React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Globe, Brain, ArrowRight } from 'lucide-react';
import { getLeaderboard } from '../lib/db';
import { SEO } from '../components/seo/SEO.tsx';
import { COUNTRY_DATA } from '../data/countries';

export default function Leaderboard() {
  const [entries, setEntries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getLeaderboard(10).then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const getCountryFlag = (countryName: string) => {
    const country = COUNTRY_DATA.find(c => c.name === countryName);
    return country ? country.flag : '🌐';
  };

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <SEO 
        title="Global IQ Leaderboard — Top 10 Advanced Scores | IQTest Pro"
        description="See the world's highest IQ scores from our Advanced Assessment. Only the top 10 verified results are displayed on our global leaderboard."
      />
      
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span className="text-xs font-black text-brand-gold uppercase tracking-widest">Global Hall of Fame</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-6">Advanced Leaderboard</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            The top 10 highest verified IQ scores from our most rigorous assessment level.
          </p>
        </motion.div>

        <div className="bg-brand-navy-mid rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-white/40 font-bold">Fetching global rankings...</p>
            </div>
          ) : entries.length > 0 ? (
            <div className="divide-y divide-white/5">
              {entries.map((entry, idx) => (
                <motion.div 
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-6 p-6 hover:bg-white/5 transition-all group"
                >
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    {idx === 0 ? (
                      <Medal className="w-8 h-8 text-brand-gold" />
                    ) : idx === 1 ? (
                      <Medal className="w-7 h-7 text-slate-300" />
                    ) : idx === 2 ? (
                      <Medal className="w-6 h-6 text-orange-400" />
                    ) : (
                      <span className="text-xl font-black text-white/20">#{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-grow flex items-center gap-4">
                    <div className="text-2xl">{getCountryFlag(entry.country)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
                        {entry.userName || 'Anonymous User'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider">
                        <Globe className="w-3 h-3" />
                        {entry.country || 'Global'}
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-brand-royal">Advanced Level</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-brand-gold leading-none">{entry.iq}</div>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">IQ Score</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <Brain className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">No Rankings Yet</h3>
              <p className="text-white/40 mb-8">Be the first to claim a spot in the top 10!</p>
              <a href="/test/advanced" className="btn-gold inline-flex items-center gap-2">
                Take Advanced Test <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-brand-gold/5 border border-brand-gold/10 text-center">
          <p className="text-sm text-white/60 leading-relaxed">
            <strong className="text-brand-gold">Verification Notice:</strong> All leaderboard scores are subject to our anti-cheat verification system. 
            Scores that show patterns of non-human behavior or external assistance are automatically removed to maintain the integrity of the rankings.
          </p>
        </div>
      </div>
    </div>
  );
}
