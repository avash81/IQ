import * as React from 'react';
import { motion } from 'motion/react';

const TEST_LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    icon: '🌱',
    description: 'Standard IQ test with balanced difficulty.',
    questionCount: 20,
    timeMinutes: 20,
    targetAgeNote: 'Suitable for all ages',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    icon: '⚡',
    description: 'Moderately challenging questions across all domains.',
    questionCount: 25,
    timeMinutes: 25,
    targetAgeNote: 'Best for ages 16+',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: '🔥',
    description: 'Hard questions designed to differentiate high IQs (120+).',
    questionCount: 30,
    timeMinutes: 30,
    targetAgeNote: 'Best for ages 18+',
  },
  {
    id: 'adaptive',
    label: 'Adaptive IQ',
    icon: '🎯',
    description: 'AI-powered: questions adjust to your level in real-time. Most accurate.',
    questionCount: '10–20',
    timeMinutes: '8–15',
    targetAgeNote: 'All ages · Most accurate',
    badge: 'MOST ACCURATE',
  },
];

export default function LevelSelect({ onSelect }: { onSelect: (level: any) => void }) {
  return (
    <div className="min-h-screen bg-brand-navy-deep flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Choose Your Test Level</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Select the difficulty that matches your goal.
            You can always retake at a different level.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEST_LEVELS.map(level => (
            <motion.div
              key={level.id}
              whileHover={{ y: -5 }}
              className="card-dark p-6 cursor-pointer border border-white/10 hover:border-brand-gold transition-all flex flex-col"
              onClick={() => onSelect(level)}
            >
              <div className="text-4xl mb-4">{level.icon}</div>
              <div className="text-xl font-bold text-white mb-2">{level.label}</div>
              {level.badge && (
                <span className="text-[10px] font-black text-brand-gold bg-brand-gold/10 px-2 py-1 rounded-full mb-2 self-start uppercase tracking-widest">{level.badge}</span>
              )}
              <p className="text-white/60 text-sm mb-4 flex-grow">{level.description}</p>
              <div className="text-xs text-white/40 space-y-1 mb-4">
                <div>📝 {level.questionCount} questions</div>
                <div>⏱ {level.timeMinutes} min</div>
              </div>
              <div className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">{level.targetAgeNote}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
