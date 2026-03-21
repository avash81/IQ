import * as React from 'react';
import { motion } from 'motion/react';
import { Search, Trophy, Star, History } from 'lucide-react';
import { SEO } from '../components/seo/SEO';
import { BreadcrumbSchema } from '../components/seo/StructuredData';

const FAMOUS_GENIUSES = [
  { name: 'Albert Einstein', iq: '160', category: 'Physicist', description: 'Developed the theory of relativity, one of the two pillars of modern physics.' },
  { name: 'Stephen Hawking', iq: '160', category: 'Physicist', description: 'Renowned for his work on black holes and general relativity.' },
  { name: 'Marilyn vos Savant', iq: '228', category: 'Author', description: 'Listed in the Guinness Book of World Records for the highest recorded IQ.' },
  { name: 'Leonardo da Vinci', iq: '180-190', category: 'Artist/Inventor', description: 'The ultimate Renaissance man, excelling in art, science, and engineering.' },
  { name: 'Judit Polgár', iq: '170', category: 'Chess Grandmaster', description: 'Generally considered the strongest female chess player of all time.' },
  { name: 'Garry Kasparov', iq: '190', category: 'Chess Grandmaster', description: 'Former World Chess Champion and one of the greatest players in history.' },
  { name: 'Marie Curie', iq: '180', category: 'Scientist', description: 'The first person to win two Nobel Prizes in different scientific fields.' },
  { name: 'Johann Wolfgang von Goethe', iq: '210', category: 'Writer', description: 'A polymath who made significant contributions to literature and science.' },
];

const CELEBRITY_IQS = [
  { name: 'Natalie Portman', iq: '140', category: 'Actor', image: 'https://picsum.photos/seed/natalie/400/400' },
  { name: 'Conan O\'Brien', iq: '160', category: 'TV Host', image: 'https://picsum.photos/seed/conan/400/400' },
  { name: 'Shakira', iq: '140', category: 'Singer', image: 'https://picsum.photos/seed/shakira/400/400' },
  { name: 'Quentin Tarantino', iq: '160', category: 'Director', image: 'https://picsum.photos/seed/quentin/400/400' },
  { name: 'Lisa Kudrow', iq: '154', category: 'Actor', image: 'https://picsum.photos/seed/lisa/400/400' },
  { name: 'Matt Damon', iq: '160', category: 'Actor', image: 'https://picsum.photos/seed/matt/400/400' },
];

export default function FamousIQ() {
  const [search, setSearch] = React.useState('');

  const filteredGeniuses = FAMOUS_GENIUSES.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <SEO 
        title="Famous People IQ Scores — Geniuses & Celebrities"
        description="Discover the estimated IQ scores of Einstein, Mozart, and 30+ famous geniuses and celebrities."
        canonical="/famous-iq"
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://iqtestpro.com/' },
        { name: 'Famous IQ', url: 'https://iqtestpro.com/famous-iq' }
      ]} />
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black text-white mb-6">Famous IQ Scores</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Compare your intelligence with the world's greatest minds and celebrities.
          </p>
        </motion.div>

        <div className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-brand-gold" />
              </div>
              <h2 className="text-3xl font-bold text-white">Historical Geniuses</h2>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-brand-gold outline-none transition-all text-sm"
                placeholder="Search names..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGeniuses.map((genius, idx) => (
              <motion.div 
                key={genius.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-brand-navy-mid p-8 rounded-[2rem] border border-white/5 hover:border-brand-gold/30 transition-all group"
              >
                <div className="text-4xl font-black text-brand-gold mb-4 group-hover:scale-110 transition-transform">{genius.iq}</div>
                <h3 className="text-xl font-bold text-white mb-1">{genius.name}</h3>
                <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">{genius.category}</div>
                <p className="text-white/50 text-xs leading-relaxed">{genius.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-brand-royal-light/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-brand-royal-light" />
            </div>
            <h2 className="text-3xl font-bold text-white">Celebrity IQ Scores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CELEBRITY_IQS.map((celeb, idx) => (
              <div key={celeb.name} className="flex items-center gap-6 bg-brand-navy-mid p-6 rounded-[2.5rem] border border-white/5 hover:bg-white/5 transition-all">
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-royal-light/30">
                  <img src={celeb.image} alt={celeb.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{celeb.name}</h3>
                  <div className="text-xs text-white/40 mb-2">{celeb.category}</div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-royal-light/10 text-brand-royal-light rounded-full text-xs font-bold">
                    IQ {celeb.iq}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-navy-mid p-12 rounded-[3rem] border border-white/5 text-center">
          <History className="w-12 h-12 text-white/20 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Scoring Methodology</h2>
          <p className="text-white/50 text-sm max-w-2xl mx-auto leading-relaxed mb-8">
            Note: Historical IQ scores are often estimated based on biographical data, academic achievements, 
            and documented cognitive feats. Modern celebrity scores are typically reported from academic records 
            or professional testing.
          </p>
          <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
            Learn More About IQ History
          </button>
        </div>
      </div>
    </div>
  );
}
