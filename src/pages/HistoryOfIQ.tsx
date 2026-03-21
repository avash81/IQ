import * as React from 'react';
import { motion } from 'motion/react';
import { History, BookOpen, Clock, Lightbulb } from 'lucide-react';

export default function HistoryOfIQ() {
  const milestones = [
    { year: '1869', title: 'Francis Galton', desc: 'Published "Hereditary Genius", exploring the idea of inherited intelligence.' },
    { year: '1904', title: 'Alfred Binet', desc: 'Developed the first practical intelligence test to identify students needing help.' },
    { year: '1916', title: 'Stanford-Binet', desc: 'Lewis Terman adapted Binet\'s test for the US, introducing the term "IQ".' },
    { year: '1939', title: 'Wechsler Scales', desc: 'David Wechsler developed the WAIS, measuring both verbal and performance skills.' },
    { year: '1980s', title: 'Flynn Effect', desc: 'James Flynn observed a steady rise in IQ scores across generations worldwide.' },
    { year: 'Present', title: 'Modern Psychometrics', desc: 'Integration of AI and adaptive testing for unprecedented accuracy.' }
  ];

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-royal/20 border border-brand-royal/30 text-brand-royal-light text-xs font-bold mb-6">
            <History className="w-3 h-3" />
            EVOLUTION OF INTELLIGENCE
          </div>
          <h1 className="text-5xl font-black text-white mb-6">History of IQ Testing</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            From early philosophical inquiries to modern psychometric standards, explore how we've measured the human mind.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-white/10 hidden md:block" />

          <div className="space-y-12">
            {milestones.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="flex-1 text-center md:text-right">
                  {i % 2 === 0 && (
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-brand-gold/50 transition-all">
                      <span className="text-brand-gold font-mono text-2xl font-bold block mb-2">{m.year}</span>
                      <h3 className="text-xl font-bold text-white mb-3">{m.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  )}
                </div>

                <div className="w-12 h-12 rounded-full bg-brand-navy border-4 border-brand-gold flex items-center justify-center z-10 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-brand-gold" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  {i % 2 !== 0 && (
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-brand-gold/50 transition-all">
                      <span className="text-brand-gold font-mono text-2xl font-bold block mb-2">{m.year}</span>
                      <h3 className="text-xl font-bold text-white mb-3">{m.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-brand-navy-mid p-10 rounded-[2.5rem] border border-white/5">
            <BookOpen className="w-10 h-10 text-brand-royal-light mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Nature vs. Nurture</h2>
            <p className="text-white/60 leading-relaxed">
              The debate over whether intelligence is primarily determined by genetics or environment has shaped the history of psychometrics. Modern research suggests a complex interplay between both.
            </p>
          </div>
          <div className="bg-brand-navy-mid p-10 rounded-[2.5rem] border border-white/5">
            <Lightbulb className="w-10 h-10 text-brand-gold mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">The Flynn Effect</h2>
            <p className="text-white/60 leading-relaxed">
              Named after James Flynn, this phenomenon describes the substantial and sustained increase in IQ scores measured in many parts of the world over the 20th century.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
