import * as React from 'react';
import { motion } from 'motion/react';
import { FileText, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Terms() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      desc: 'By accessing and using IQTest Pro, you agree to be bound by these Terms of Use and all applicable laws and regulations.',
      icon: <CheckCircle2 className="w-8 h-8 text-brand-gold" />
    },
    {
      title: 'Use License',
      desc: 'Permission is granted to temporarily download one copy of the materials on IQTest Pro website for personal, non-commercial transitory viewing only.',
      icon: <FileText className="w-8 h-8 text-brand-royal-light" />
    },
    {
      title: 'Disclaimer',
      desc: 'The materials on IQTest Pro website are provided on an "as is" basis. IQTest Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.',
      icon: <AlertCircle className="w-8 h-8 text-brand-peri" />
    },
    {
      title: 'Limitations',
      desc: 'In no event shall IQTest Pro or its suppliers be liable for any damages arising out of the use or inability to use the materials on IQTest Pro website.',
      icon: <Shield className="w-8 h-8 text-green-400" />
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
          <h1 className="text-5xl font-black text-white mb-6">Terms of Use</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using IQTest Pro.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {sections.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-brand-navy-mid border border-white/10 rounded-[2.5rem] p-10 hover:border-brand-gold/50 transition-all"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                {s.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{s.title}</h2>
              <p className="text-white/60 leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-brand-navy-deep p-12 rounded-[3rem] border border-white/5 mb-24">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Governing Law</h2>
          <p className="text-white/60 leading-relaxed mb-10 text-center max-w-2xl mx-auto">
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which IQTest Pro operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
          <p className="text-white/30 text-xs mt-6 text-center uppercase tracking-widest font-bold">
            *Last updated: March 2026
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Questions?</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            If you have any questions about these Terms, please contact us at terms@iqtestpro.com.
          </p>
          <button className="px-10 py-5 bg-brand-gold text-white font-bold rounded-2xl hover:bg-brand-gold-hover transition-all shadow-xl shadow-brand-gold/20">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
