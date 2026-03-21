import * as React from 'react';
import { motion } from 'motion/react';
import { Brain, Zap, Target, BarChart3, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const GAMES = [
  {
    id: 'memory-span',
    title: 'Digit Span Pro',
    icon: <Brain className="w-8 h-8" />,
    domain: 'Working Memory',
    color: '#C8102E',
    description: 'Memorize increasingly long sequences of numbers. Trains your short-term memory capacity.',
    difficulty: 'Dynamic',
  },
  {
    id: 'speed-match',
    title: 'Symbol Match',
    icon: <Zap className="w-8 h-8" />,
    domain: 'Processing Speed',
    color: '#D4952A',
    description: 'Identify matching symbols as fast as possible. Improves neural processing efficiency.',
    difficulty: 'Fast',
  },
  {
    id: 'pattern-logic',
    title: 'Matrix Master',
    icon: <Target className="w-8 h-8" />,
    domain: 'Fluid Intelligence',
    color: '#22c55e',
    description: 'Solve complex visual matrices. Enhances non-verbal reasoning and pattern recognition.',
    difficulty: 'Hard',
  },
  {
    id: 'mental-math',
    title: 'Arithmetic Rush',
    icon: <BarChart3 className="w-8 h-8" />,
    domain: 'Quantitative Reasoning',
    color: '#6B7FCC',
    description: 'Solve rapid-fire math problems. Builds mathematical fluency and speed.',
    difficulty: 'Medium',
  },
];

export default function Games() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-xs font-bold mb-6">
            <Zap className="w-3 h-3" />
            BRAIN TRAINING CENTER
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6">Train Your Intelligence</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Scientifically designed games to sharpen your cognitive domains. Regular training can improve your IQ score over time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GAMES.map((game) => (
            <div key={game.id} className="card-dark p-8 group hover:border-brand-gold/50 transition-all duration-500">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-2xl bg-white/5 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all">
                  {game.icon}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Difficulty</div>
                  <div className="text-xs font-black text-brand-gold uppercase">{game.difficulty}</div>
                </div>
              </div>
              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: game.color }}>{game.domain}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{game.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{game.description}</p>
              </div>
              <Link to="/practice" className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-brand-gold/30 group-hover:bg-brand-gold/5 transition-all">
                <span className="text-sm font-bold text-white/70 group-hover:text-white">Play Training Game</span>
                <Play className="w-4 h-4 text-brand-gold" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 card-dark p-12 text-center border-brand-royal/30 bg-brand-royal/5">
          <h2 className="text-2xl font-bold mb-4">Track Your Progress</h2>
          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            Premium members get detailed progress charts, global rankings, and personalized training schedules.
          </p>
          <button className="btn-gold px-10">Unlock All Games</button>
        </div>
      </div>
    </div>
  );
}
