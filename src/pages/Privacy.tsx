import * as React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
  const sections = [
    {
      title: 'Data Collection',
      desc: 'We collect only the information necessary for your assessment, including your name, birthdate, and test responses. We do not collect sensitive personal information like your address or phone number.',
      icon: <Eye className="w-8 h-8 text-brand-gold" />
    },
    {
      title: 'Data Usage',
      desc: 'Your data is used solely to generate your IQ assessment and to improve our scoring models. We do not sell your data to third parties and we do not use it for targeted advertising.',
      icon: <FileText className="w-8 h-8 text-brand-royal-light" />
    },
    {
      title: 'Data Security',
      desc: 'We use industry-standard encryption and security protocols to protect your data. All communication with our servers is encrypted using SSL/TLS.',
      icon: <Lock className="w-8 h-8 text-brand-peri" />
    },
    {
      title: 'Your Rights',
      desc: 'You have the right to request the deletion of your data at any time. Since we do not require accounts, your data is primarily associated with your session or your email if provided.',
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
          <h1 className="text-5xl font-black text-white mb-6">Privacy Policy</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Your privacy is our priority. Discover how we protect your data and ensure a secure testing environment.
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
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Data Retention</h2>
          <p className="text-white/60 leading-relaxed mb-10 text-center max-w-2xl mx-auto">
            We retain test results for a period of 24 months to allow users to access their certificates and to provide historical data for our scoring models. After this period, data is anonymized.
          </p>
          <p className="text-white/30 text-xs mt-6 text-center uppercase tracking-widest font-bold">
            *Anonymized data is used for research and calibration purposes only.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Contact Privacy Team</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            If you have any questions or concerns about your privacy, please contact our dedicated privacy team at privacy@iqtestpro.com.
          </p>
          <button className="px-10 py-5 bg-brand-gold text-white font-bold rounded-2xl hover:bg-brand-gold-hover transition-all shadow-xl shadow-brand-gold/20">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
