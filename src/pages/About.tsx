import * as React from 'react';
import { motion } from 'motion/react';
import { Brain, Target, Globe, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black text-white mb-6">About IQTest Pro</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            We are dedicated to providing the most accurate, accessible, and scientifically grounded intelligence assessments available online.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-brand-gold/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-brand-gold" />
            </div>
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            <p className="text-white/60 leading-relaxed">
              To empower individuals worldwide with reliable cognitive insights. We believe that understanding your intellectual profile is the first step toward personal and professional growth.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-brand-royal/20 flex items-center justify-center">
              <Target className="w-8 h-8 text-brand-royal-light" />
            </div>
            <h2 className="text-3xl font-bold text-white">Our Methodology</h2>
            <p className="text-white/60 leading-relaxed">
              Our tests are developed in collaboration with psychometric experts and calibrated using a massive global dataset of over 2.8 million completed assessments.
            </p>
          </div>
        </div>

        <div className="bg-brand-navy-mid p-12 rounded-[3rem] border border-white/5 mb-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-6">Global Reach</h2>
              <p className="text-white/60 leading-relaxed mb-8">
                With users from over 180 countries, IQTest Pro is a truly international platform. Our age-normalized scoring ensures that you are compared fairly to your peers, regardless of where you are in the world.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-black text-brand-gold">2.8M+</div>
                  <div className="text-xs text-white/30 uppercase tracking-widest font-bold">Tests Taken</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-brand-gold">180+</div>
                  <div className="text-xs text-white/30 uppercase tracking-widest font-bold">Countries</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
              <Globe className="w-24 h-24 text-brand-royal-light animate-pulse" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <Shield className="w-12 h-12 text-brand-gold mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Privacy First</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10">
            Your data is yours. We do not store personal information beyond what is necessary for your assessment, and we never sell your data to third parties.
          </p>
          <button className="px-10 py-5 bg-brand-gold text-white font-bold rounded-2xl hover:bg-brand-gold-hover transition-all shadow-xl shadow-brand-gold/20">
            Take the Test Now
          </button>
        </div>
      </div>
    </div>
  );
}
