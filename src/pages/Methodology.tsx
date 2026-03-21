import * as React from 'react';
import { motion } from 'motion/react';
import { Target, BarChart3, Database, ShieldCheck } from 'lucide-react';

export default function Methodology() {
  const principles = [
    {
      title: 'Age-Normalized Scoring',
      desc: 'Our scoring system compares your results to a representative sample of your peers in the same age group, ensuring a fair and accurate assessment.',
      icon: <Target className="w-8 h-8 text-brand-gold" />
    },
    {
      title: 'Psychometric Standards',
      desc: 'We follow the latest psychometric standards in test development, ensuring high reliability and validity across all cognitive domains.',
      icon: <BarChart3 className="w-8 h-8 text-brand-royal-light" />
    },
    {
      title: 'Global Calibration',
      desc: 'Our data is calibrated using a massive global dataset of over 2.8 million completed assessments, providing a truly international benchmark.',
      icon: <Database className="w-8 h-8 text-brand-peri" />
    },
    {
      title: 'Bias Mitigation',
      desc: 'We actively work to mitigate cultural and linguistic biases in our tests, offering a Culture-Fair mode for non-English speakers.',
      icon: <ShieldCheck className="w-8 h-8 text-green-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black text-white mb-6">Our Methodology</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Discover the scientific principles and psychometric standards that power IQTest Pro.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {principles.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-brand-navy-mid border border-white/10 rounded-[2.5rem] p-10 hover:border-brand-gold/50 transition-all"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                {p.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{p.title}</h2>
              <p className="text-white/60 leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-brand-navy-deep p-12 rounded-[3rem] border border-white/5 mb-24">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">The Scoring Formula</h2>
          <p className="text-white/60 leading-relaxed mb-10 text-center max-w-2xl mx-auto">
            Our IQ scores are calculated using a standard normal distribution (z-score) with a mean of 100 and a standard deviation of 15.
          </p>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center font-mono text-2xl text-brand-gold">
            IQ = 100 + 15 * ( (Score - Mean) / SD )
          </div>
          <p className="text-white/30 text-xs mt-6 text-center uppercase tracking-widest font-bold">
            *Mean and SD are dynamically adjusted based on age-group data.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Continuous Calibration</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Our AI models are continuously updated and calibrated as more tests are completed, ensuring that our assessments remain the most accurate available online.
          </p>
          <button className="px-10 py-5 bg-brand-gold text-white font-bold rounded-2xl hover:bg-brand-gold-hover transition-all shadow-xl shadow-brand-gold/20">
            Take the Test Now
          </button>
        </div>
      </div>
    </div>
  );
}
