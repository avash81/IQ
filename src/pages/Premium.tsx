import * as React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle2, Zap, Brain, FileText, Share2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Premium() {
  const { user, profile, login } = useAuth();
  const navigate = useNavigate();
  
  const isPremium = profile?.role === 'admin' || (profile as any)?.isPremium;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    // In a real app, this would trigger a payment flow (e.g., Stripe)
    setShowPaymentModal(true);
  };

  const confirmLogin = async () => {
    setShowLoginModal(false);
    await login();
  };

  const features = [
    { icon: Brain, title: "Full Cognitive Profile", desc: "Detailed breakdown of 5 cognitive domains with percentile rankings." },
    { icon: FileText, title: "Official PDF Certificate", desc: "Downloadable, high-resolution certificate for your records." },
    { icon: Zap, title: "Adaptive Testing", desc: "Advanced IRT-based engine for the most precise IQ estimation." },
    { icon: Share2, title: "Advanced Sharing", desc: "Customizable results cards to share on social media." },
    { icon: Shield, title: "Lifetime Access", desc: "Your results are stored securely and accessible forever." }
  ];

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold mb-4"
          >
            <Shield className="w-3 h-3" /> UNLOCK FULL POTENTIAL
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Go Premium</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Get the most accurate, professional-grade IQ assessment with detailed analytics and official certification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-brand-navy-mid border border-white/10 rounded-3xl p-10 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Premium Benefits</h3>
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{f.title}</h4>
                    <p className="text-white/40 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-gold rounded-3xl p-10 text-brand-navy flex flex-col items-center justify-center text-center">
            {isPremium ? (
              <>
                <div className="w-20 h-20 bg-brand-navy/10 rounded-full flex items-center justify-center mb-6">
                  <Star className="w-10 h-10 text-brand-navy" />
                </div>
                <h3 className="text-2xl font-black mb-2">You are Premium!</h3>
                <p className="text-brand-navy/70 font-bold mb-8">Thank you for supporting IQTest Pro. You have full access to all features.</p>
                <button 
                  onClick={() => navigate('/history')}
                  className="w-full py-4 bg-brand-navy text-white font-bold rounded-2xl hover:bg-brand-navy-deep transition-all shadow-xl"
                >
                  View Your History
                </button>
              </>
            ) : (
              <>
                <div className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Limited Time Offer</div>
                <div className="text-6xl font-black mb-4">$19.99</div>
                <div className="text-lg font-bold mb-8 opacity-80">One-time payment. Lifetime access.</div>
                <button 
                  onClick={handleUpgrade}
                  className="w-full py-4 bg-brand-navy text-white font-bold rounded-2xl hover:bg-brand-navy-deep transition-all shadow-xl"
                >
                  Unlock Premium Now
                </button>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold opacity-60">
                  <CheckCircle2 className="w-4 h-4" /> 30-Day Money Back Guarantee
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-navy-deep border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Login Required</h3>
            <p className="text-white/60 mb-8">
              Please log in to purchase Premium. Would you like to log in now?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogin}
                className="flex-1 py-3 px-6 rounded-xl bg-brand-gold text-brand-navy font-bold hover:bg-brand-gold-hover transition-colors"
              >
                Log In
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-navy-deep border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Payment Flow</h3>
            <p className="text-white/60 mb-8">
              This would trigger the payment flow. Since this is a demo, your account will be marked as premium in the future.
            </p>
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-3 px-6 rounded-xl bg-brand-gold text-brand-navy font-bold hover:bg-brand-gold-hover transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
