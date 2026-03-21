import * as React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, ChevronRight, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function Onboarding({ onStart }: { onStart: (profile: any) => void }) {
  const { mode = 'classical' } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: 0,
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleStart = () => {
    onStart({ ...profile });
    navigate(`/active-test/${mode}`);
  };

  return (
    <div className="min-h-screen bg-brand-navy-deep flex items-center justify-center pt-24 pb-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Personalize Your Test</h2>
          <p className="text-white/50 text-sm leading-relaxed">We use your age to provide an accurate, normalized IQ score compared to your peers.</p>
        </div>

        <div className="card-dark p-8 sm:p-10">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-brand-gold focus:bg-brand-gold/5 transition-all outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-brand-gold focus:bg-brand-gold/5 transition-all outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                <Calendar className="w-4 h-4" /> Age
              </label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                placeholder="Enter your age"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-brand-gold focus:bg-brand-gold/5 transition-all outline-none"
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!profile.name || !isValidEmail(profile.email) || !profile.age}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Start Test <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
