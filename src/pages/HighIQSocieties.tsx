import * as React from 'react';
import { motion } from 'motion/react';
import { Award, Globe, Users, Target, CheckCircle2 } from 'lucide-react';

export default function HighIQSocieties() {
  const societies = [
    {
      name: 'Mensa International',
      percentile: 'Top 2%',
      iq: '130+',
      desc: 'The oldest and largest high IQ society in the world. Founded in 1946, it has over 145,000 members in 100 countries.',
      benefits: ['Global networking', 'Special interest groups', 'Local meetups', 'Mensa Magazine'],
      color: 'brand-gold'
    },
    {
      name: 'Intertel',
      percentile: 'Top 1%',
      iq: '135+',
      desc: 'Founded in 1966, Intertel is an international society for the intellectually gifted, requiring a score at or above the 99th percentile.',
      benefits: ['International journal', 'Regional gatherings', 'Online forums', 'Academic recognition'],
      color: 'brand-royal'
    },
    {
      name: 'Triple Nine Society',
      percentile: 'Top 0.1%',
      iq: '146+',
      desc: 'A high IQ society for adults whose score is at or above the 99.9th percentile of the general population.',
      benefits: ['Vidya journal', 'Annual gatherings', 'Deep intellectual discourse', 'Exclusive community'],
      color: 'brand-red'
    },
    {
      name: 'Prometheus Society',
      percentile: 'Top 0.003%',
      iq: '160+',
      desc: 'One of the most restrictive high IQ societies, requiring a score that occurs only once in every 30,000 people.',
      benefits: ['Gift of Fire journal', 'Extremely high-level discourse', 'Global elite network'],
      color: 'brand-navy-deep'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red text-xs font-bold mb-6">
            <Award className="w-3 h-3" />
            ELITE COMMUNITIES
          </div>
          <h1 className="text-5xl font-black text-white mb-6">High IQ Societies</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Explore the world's most exclusive intellectual communities and discover what it takes to join them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {societies.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-brand-navy-mid border border-white/10 rounded-[2.5rem] p-10 hover:border-brand-gold/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{s.name}</h2>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 bg-white/5 text-brand-gold text-xs font-bold rounded-full border border-white/10">
                      {s.percentile}
                    </span>
                    <span className="px-3 py-1 bg-white/5 text-white/40 text-xs font-bold rounded-full border border-white/10">
                      IQ {s.iq}
                    </span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-gold/20 transition-all">
                  <Users className="w-8 h-8 text-brand-gold" />
                </div>
              </div>

              <p className="text-white/60 leading-relaxed mb-8">
                {s.desc}
              </p>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-white/30 uppercase tracking-widest">Membership Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {s.benefits.map((b, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-10 w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                Learn How to Apply
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-brand-navy-deep rounded-[3rem] border border-white/5 text-center">
          <Target className="w-12 h-12 text-brand-gold mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Do You Qualify?</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10">
            Our Classical IQ Test is designed to provide an accurate estimate of your cognitive abilities. Use your results as a guide for potential high IQ society applications.
          </p>
          <button className="px-10 py-5 bg-brand-gold text-white font-bold rounded-2xl hover:bg-brand-gold-hover transition-all shadow-xl shadow-brand-gold/20">
            Take the Classical IQ Test
          </button>
        </div>
      </div>
    </div>
  );
}
