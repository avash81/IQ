import * as React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy-deep text-white/50 py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-1 mb-6">
              <span className="text-white font-black text-2xl tracking-tighter">IQ</span>
              <span className="text-brand-gold font-black text-2xl tracking-tighter">Test</span>
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-1 mt-2">Pro</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              The world's most accurate free IQ test online. Age-normalized scoring, 5 cognitive domains, instant results, and free certificate.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Tests</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/test/classical" className="hover:text-white transition-colors">Classical IQ Test</Link></li>
              <li><Link to="/test/culture-fair" className="hover:text-white transition-colors">Culture Fair Test</Link></li>
              <li><Link to="/test/quick" className="hover:text-white transition-colors">Quick Screen</Link></li>
              <li><Link to="/practice" className="hover:text-white transition-colors">Practice Questions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Learn</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/iq-scale" className="hover:text-white transition-colors">IQ Scale Guide</Link></li>
              <li><Link to="/famous-iq" className="hover:text-white transition-colors">Famous IQ Scores</Link></li>
              <li><Link to="/iq-by-country" className="hover:text-white transition-colors">IQ by Country</Link></li>
              <li><Link to="/history-of-iq" className="hover:text-white transition-colors">History of IQ</Link></li>
              <li><Link to="/high-iq-societies" className="hover:text-white transition-colors">High IQ Societies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/#home" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link to="/#faq" className="hover:text-white transition-colors">Help & FAQ</Link></li>
              <li><Link to="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 IQTest Pro · All rights reserved</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> No data stored</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> 100% anonymous</span>
          </div>
          <p>Made with ❤️ for curious minds worldwide</p>
        </div>
      </div>
    </footer>
  );
}
