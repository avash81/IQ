import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Menu, X, Sun, Moon, ChevronDown, 
  Zap, Globe, BookOpen, Award, BarChart3, 
  History, HelpCircle, FileText, Info, MessageSquare,
  Gamepad2, Target, User as UserIcon, LogOut, Settings, Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, profile, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-navy/95 dark:bg-brand-navy-deep/95 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 group">
          <span className="text-white font-black text-2xl tracking-tighter">IQ</span>
          <span className="text-brand-gold font-black text-2xl tracking-tighter">Test</span>
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-1 mt-2">Pro</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/#home" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">Home</Link>
          <div className="relative group/menu">
            <button className="flex items-center gap-1 text-[13px] font-medium text-white/70 hover:text-white transition-colors">
              Tests <ChevronDown className="w-4 h-4 opacity-50 group-hover/menu:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-4 w-[calc(100vw-2rem)] max-w-[560px] bg-brand-navy/98 dark:bg-brand-navy-deep/98 backdrop-blur-2xl border border-white/12 rounded-3xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              <div>
                <h4 className="text-[11px] font-bold text-brand-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Target className="w-3 h-3" /> Take a Test
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link to="/test/classical" className="group/item flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center group-hover/item:bg-brand-gold/20 transition-colors">
                        <Brain className="w-4 h-4 text-brand-gold" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover/item:text-brand-gold transition-colors">Classical IQ Test</div>
                        <div className="text-[11px] text-white/40">Full 5-domain assessment</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/test/culture-fair" className="group/item flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-peri/10 flex items-center justify-center group-hover/item:bg-brand-peri/20 transition-colors">
                        <Globe className="w-4 h-4 text-brand-peri" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover/item:text-brand-peri transition-colors">Culture Fair Test</div>
                        <div className="text-[11px] text-white/40">Language-free visual test</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/test/quick" className="group/item flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-royal/10 flex items-center justify-center group-hover/item:bg-brand-royal/20 transition-colors">
                        <Zap className="w-4 h-4 text-brand-royal" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover/item:text-brand-royal transition-colors">Quick Screen</div>
                        <div className="text-[11px] text-white/40">Fast 5-minute estimate</div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-brand-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Learn & Explore
                </h4>
                <ul className="space-y-3">
                  <li><Link to="/iq-scale" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"><BarChart3 className="w-4 h-4 opacity-50" /> IQ Scale Guide</Link></li>
                  <li><Link to="/famous-iq" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"><Award className="w-4 h-4 opacity-50" /> Famous IQ Scores</Link></li>
                  <li><Link to="/iq-by-country" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"><Globe className="w-4 h-4 opacity-50" /> IQ by Country</Link></li>
                  <li><Link to="/leaderboard" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"><Trophy className="w-4 h-4 opacity-50" /> Leaderboard</Link></li>
                  <li><Link to="/history-of-iq" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"><History className="w-4 h-4 opacity-50" /> History of IQ</Link></li>
                  <li><Link to="/high-iq-societies" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"><Target className="w-4 h-4 opacity-50" /> High IQ Societies</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <Link to="/#how-it-works" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">How it Works</Link>
          <Link to="/#faq" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">Help</Link>
          <Link to="/#contact" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-gold/20 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-brand-gold" />
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-brand-navy/98 dark:bg-brand-navy-deep/98 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 mb-2 border-b border-white/5">
                    <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
                    <div className="text-[10px] text-white/40 truncate">{user.email}</div>
                  </div>
                  <Link to="/history" className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={() => setIsUserMenuOpen(false)}>
                    <History className="w-4 h-4" /> Test History
                  </Link>
                  <Link to="/premium" className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={() => setIsUserMenuOpen(false)}>
                    <Award className="w-4 h-4" /> Premium Plan
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}

          <Link to="/test/classical" className="hidden sm:block bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-red/20">Take Test</Link>
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-brand-navy-deep z-40 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8 pt-24 gap-8 overflow-y-auto">
          {user && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                ) : (
                  <UserIcon className="w-6 h-6 text-brand-gold" />
                )}
              </div>
              <div>
                <div className="font-bold text-white">{user.displayName}</div>
                <div className="text-xs text-white/40">{user.email}</div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-6">Navigation</h4>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/#home" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Brain className="w-5 h-5 text-brand-gold" />
                <span className="text-xs font-bold text-white">Home</span>
              </Link>
              <Link to="/#how-it-works" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Zap className="w-5 h-5 text-brand-gold" />
                <span className="text-xs font-bold text-white">How it Works</span>
              </Link>
              <Link to="/#faq" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <HelpCircle className="w-5 h-5 text-brand-gold" />
                <span className="text-xs font-bold text-white">Help</span>
              </Link>
              <Link to="/#contact" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <MessageSquare className="w-5 h-5 text-brand-gold" />
                <span className="text-xs font-bold text-white">Contact</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-6">Tests</h4>
            <div className="grid gap-4">
              <Link to="/test/classical" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Brain className="w-6 h-6 text-brand-gold" />
                <span className="font-bold text-white">Classical IQ</span>
              </Link>
              <Link to="/test/culture-fair" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Globe className="w-6 h-6 text-brand-peri" />
                <span className="font-bold text-white">Culture Fair</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-6">Explore</h4>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/iq-scale" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <BarChart3 className="w-5 h-5 text-brand-royal" />
                <span className="text-xs font-bold text-white">IQ Scale</span>
              </Link>
              <Link to="/famous-iq" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Award className="w-5 h-5 text-brand-gold" />
                <span className="text-xs font-bold text-white">Famous</span>
              </Link>
              <Link to="/iq-by-country" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Globe className="w-5 h-5 text-brand-peri" />
                <span className="text-xs font-bold text-white">Rankings</span>
              </Link>
              <Link to="/practice" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Target className="w-5 h-5 text-brand-peri" />
                <span className="text-xs font-bold text-white">Practice</span>
              </Link>
              <Link to="/games" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Gamepad2 className="w-5 h-5 text-brand-royal" />
                <span className="text-xs font-bold text-white">Games</span>
              </Link>
              <Link to="/blog" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <FileText className="w-5 h-5 text-brand-gold" />
                <span className="text-xs font-bold text-white">Blog</span>
              </Link>
              <Link to="/leaderboard" className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>
                <Trophy className="w-5 h-5 text-brand-gold" />
                <span className="text-xs font-bold text-white">Leaderboard</span>
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
            {user && (
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="w-full py-4 bg-red-500/10 text-red-400 font-bold rounded-2xl text-center border border-red-500/20"
              >
                Logout
              </button>
            )}
            <Link to="/test/classical" className="w-full py-4 bg-brand-red text-white font-bold rounded-2xl text-center shadow-xl shadow-brand-red/20" onClick={() => setIsMenuOpen(false)}>
              Start Free Test Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
