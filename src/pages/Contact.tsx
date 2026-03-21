import * as React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Globe, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black text-white mb-6">Contact Us</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-brand-navy-mid p-8 rounded-[2rem] border border-white/5 text-center">
            <Mail className="w-10 h-10 text-brand-gold mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Email</h3>
            <p className="text-white/60 text-sm">support@iqtestpro.com</p>
          </div>
          <div className="bg-brand-navy-mid p-8 rounded-[2rem] border border-white/5 text-center">
            <MessageSquare className="w-10 h-10 text-brand-royal-light mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Support</h3>
            <p className="text-white/60 text-sm">Help Center & FAQ</p>
          </div>
          <div className="bg-brand-navy-mid p-8 rounded-[2rem] border border-white/5 text-center">
            <Globe className="w-10 h-10 text-brand-peri mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Global</h3>
            <p className="text-white/60 text-sm">International Offices</p>
          </div>
        </div>

        <div className="bg-brand-navy-mid p-12 rounded-[3rem] border border-white/5">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Full Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Subject</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-gold outline-none transition-all" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Message</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-gold outline-none transition-all h-40 resize-none" placeholder="Your message here..."></textarea>
            </div>
            <button className="w-full py-5 bg-brand-gold text-white font-bold rounded-2xl hover:bg-brand-gold-hover transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2">
              Send Message
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
