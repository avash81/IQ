import * as React from 'react';
import { useMemo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, BarChart3, Globe, CheckCircle2, XCircle, Lightbulb, Download, Share2, RefreshCw, ChevronRight, ChevronDown, Info, Zap, Brain, Mail, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import confetti from 'canvas-confetti';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { COUNTRY_DATA } from '../data/countries';
import { CHC_FACTORS } from '../data/chc';
import { JOB_BENCHMARKS, UNIVERSITY_BENCHMARKS } from '../data/benchmarks';
import { thetaToIQ } from '../lib/irt';
import { saveResult } from '../lib/history';
import { saveResultToFirestore } from '../lib/db';
import { trackEvent } from '../lib/analytics';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    tenantId: string;
    providerInfo: {
      providerId: string;
      displayName: string;
      email: string;
      photoUrl: string;
    }[];
  }
}

export default function Results({ results, profile }: { results: any; profile: any }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: user?.uid || 'anonymous',
        email: user?.email || profile.email || 'unknown',
        emailVerified: user?.emailVerified || false,
        isAnonymous: user?.isAnonymous || true,
        tenantId: (user as any)?.tenantId || '',
        providerInfo: user?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName || '',
          email: provider.email || '',
          photoUrl: provider.photoURL || ''
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const iq = useMemo(() => Math.round(thetaToIQ(results.theta)), [results.theta]);
  
  const percentile = useMemo(() => {
    const z = (iq - 100) / 15;
    // Approximation of erf function
    const erf = (x: number) => {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x);
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      return sign * y;
    };
    const p = 0.5 * (1 + erf(z / Math.sqrt(2)));
    return Math.round(p * 100);
  }, [iq]);

  const category = useMemo(() => {
    if (iq >= 130) return { label: 'Very Superior', color: 'text-brand-gold', bg: 'bg-brand-gold/10' };
    if (iq >= 120) return { label: 'Superior', color: 'text-brand-royal', bg: 'bg-brand-royal/10' };
    if (iq >= 110) return { label: 'High Average', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    if (iq >= 90) return { label: 'Average', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (iq >= 80) return { label: 'Low Average', color: 'text-orange-400', bg: 'bg-orange-400/10' };
    return { label: 'Borderline', color: 'text-red-400', bg: 'bg-red-400/10' };
  }, [iq]);

  const radarData = useMemo(() => {
    if (!results.domainScores) return [];
    return Object.entries(results.domainScores).map(([key, score]: [string, any]) => ({
      subject: CHC_FACTORS[key as keyof typeof CHC_FACTORS]?.name || key,
      A: Math.round((score.correct / score.total) * 100),
      fullMark: 100,
    }));
  }, [results.domainScores]);

  const chcData = useMemo(() => {
    if (!results.domainScores) return [];
    const icons: Record<string, string> = {
      Gf: '🧩',
      Gc: '📚',
      Gq: '🔢',
      Gsm: '🧠',
      Gs: '⚡'
    };
    const tips: Record<string, string[]> = {
      Gf: ['Solve puzzles', 'Learn strategy games'],
      Gc: ['Read widely', 'Learn new vocabulary'],
      Gq: ['Practice mental math', 'Learn statistics'],
      Gsm: ['Use mnemonics', 'Practice dual n-back'],
      Gs: ['Play fast-paced games', 'Practice speed reading']
    };
    return Object.entries(results.domainScores).map(([key, score]: [string, any]) => ({
      id: key,
      ...CHC_FACTORS[key as keyof typeof CHC_FACTORS],
      score: Math.round((score.correct / score.total) * 100),
      icon: icons[key] || '🧠',
      tips: tips[key] || ['Keep practicing']
    }));
  }, [results.domainScores]);

  const bellData = useMemo(() => {
    const data = [];
    for (let x = 55; x <= 145; x += 2) {
      const y = (1 / (15 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - 100) / 15, 2));
      data.push({ x, y });
    }
    return data;
  }, []);

  const countryStats = useMemo(() => {
    const country = COUNTRY_DATA.find(c => c.name === profile.country) || COUNTRY_DATA.find(c => c.name === 'World Average') || COUNTRY_DATA[0];
    const diff = iq - country.avg;
    return {
      country,
      diff,
      rank: diff > 0 ? 'Above Average' : 'Below Average',
      percentileInCountry: Math.round((1 / (1 + Math.exp(-diff/10))) * 100)
    };
  }, [iq, profile.country]);

  const improvementTips = useMemo(() => {
    const sorted = [...chcData].sort((a, b) => a.score - b.score);
    const weakAreas = sorted.slice(0, 2);
    return weakAreas.map(area => ({
      factor: area.name,
      tips: area.tips
    }));
  }, [chcData]);

  const answerReview = useMemo(() => {
    if (!results.questions || !results.answers) return [];
    return results.questions.map((q: any, idx: number) => ({
      question: q.text,
      userAnswer: q.options.find((o: any) => o.id === results.answers[idx])?.text || 'No Answer',
      correctAnswer: q.options.find((o: any) => o.id === q.correctOptionId)?.text,
      isCorrect: results.answers[idx] === q.correctOptionId,
      explanation: q.explanation,
      category: q.domain
    }));
  }, [results.questions, results.answers]);

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#1E3A8A', '#FFFFFF']
    });

    const saveToFirestore = async () => {
      try {
        const resultData = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user?.uid || 'guest',
          date: new Date().toISOString(),
          iq,
          percentile,
          category: category.label,
          mode: results.mode || 'standard',
          level: results.level || 'beginner',
          correct: results.correctCount,
          total: results.totalCount,
          domainScores: results.domainScores,
          theta: results.theta,
          userName: profile?.name || 'Anonymous User',
          country: profile?.country || 'Global'
        };

        // Save locally
        saveResult(resultData);

        // Save to Firestore for leaderboard
        await saveResultToFirestore(resultData);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'results');
      }
    };

    saveToFirestore();
  }, []);

  const generatePdfBlob = async () => {
    if (!certificateRef.current) return null;
    
    // Position off-screen for capture
    const element = certificateRef.current;
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '-9999px';
    element.style.top = '0';
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0D1B4B',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
      });
      
      // Calculate scale to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
      element.style.display = 'none';
      return pdf;
    } catch (error) {
      console.error('PDF generation error:', error);
      element.style.display = 'none';
      return null;
    }
  };

  const downloadCertificate = async () => {
    setIsGeneratingPdf(true);
    const pdf = await generatePdfBlob();
    if (pdf) {
      pdf.save(`IQ_Certificate_${profile.name.replace(/\s+/g, '_')}.pdf`);
      trackEvent('certificate_downloaded', { iq_score: iq, category: category.label });
    }
    setIsGeneratingPdf(false);
  };

  const sendEmail = async () => {
    if (!user?.email && !profile.email) {
      toast.error('Please provide an email address in your profile or log in.');
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus('idle');

    const pdf = await generatePdfBlob();
    if (!pdf) {
      setIsSendingEmail(false);
      setEmailStatus('error');
      return;
    }

    const pdfBase64 = pdf.output('datauristring');
    const targetEmail = user?.email || profile.email;

    try {
      const response = await fetch('/api/send-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: profile.name,
          pdfBase64
        }),
      });

      if (response.ok) {
        setEmailStatus('success');
        trackEvent('score_shared', { method: 'email', iq_score: iq });
      } else {
        let errorMessage = 'Failed to send email';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } else {
            const text = await response.text();
            console.error('Server returned non-JSON error:', text);
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }

        if (errorMessage === 'Email service not configured') {
          toast.error('Email service is not yet configured. Please contact the administrator.');
        } else if (errorMessage.includes('Payload too large')) {
          toast.error('The certificate is too large to send via email. Please try downloading it instead.');
        } else {
          toast.error(errorMessage);
        }
        setEmailStatus('error');
      }
    } catch (error) {
      console.error('Email send error:', error);
      setEmailStatus('error');
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailStatus('idle'), 5000);
    }
  };

  const shareScore = async () => {
    const shareData = {
      title: 'My IQ Score',
      text: `I just scored ${iq} on the IQTest Pro! Can you beat my score?`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        trackEvent('score_shared', { method: 'native', iq_score: iq });
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast.success('Score link copied to clipboard!');
        trackEvent('score_shared', { method: 'clipboard', iq_score: iq });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy-deep pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
        {/* SCORE HERO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-navy rounded-3xl p-8 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-royal/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-8 border-brand-gold/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-black text-brand-gold leading-none">{iq}</div>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">IQ Score</div>
                </div>
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-2 -right-2 bg-brand-royal px-3 py-1 rounded-lg text-xs font-black text-white shadow-xl"
              >
                {percentile}th PERCENTILE
              </motion.div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <div className={`inline-block px-4 py-1 rounded-full ${category.bg} ${category.color} text-xs font-black uppercase tracking-widest mb-4`}>
                {category.label}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Outstanding Performance, {profile.name}!
              </h1>
              <p className="text-white/60 leading-relaxed max-w-xl">
                Your cognitive profile indicates a high level of intellectual capability. 
                You excel particularly in areas requiring complex pattern recognition and abstract reasoning.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COGNITIVE PROFILE (RADAR) */}
          <div className="bg-brand-navy rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-royal/20 rounded-lg">
                <Brain className="w-5 h-5 text-brand-royal" />
              </div>
              <h3 className="text-lg font-bold text-white">Cognitive Profile</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#D4AF37"
                    fill="#D4AF37"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DISTRIBUTION (BELL CURVE) */}
          <div className="bg-brand-navy rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Global Distribution</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bellData}>
                  <defs>
                    <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="y" stroke="#1E3A8A" fillOpacity={1} fill="url(#colorY)" />
                  <ReferenceLine x={iq} stroke="#D4AF37" strokeWidth={2} label={{ position: 'top', value: `You (${iq})`, fill: '#D4AF37', fontSize: 12, fontWeight: 'bold' }} />
                  <XAxis dataKey="x" hide />
                  <YAxis hide />
                  <Tooltip cursor={false} content={() => null} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-white/40">Your score is higher than {percentile}% of the global population.</p>
            </div>
          </div>
        </div>

        {/* CHC FACTORS BREAKDOWN */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-gold/20 rounded-lg">
              <Zap className="w-5 h-5 text-brand-gold" />
            </div>
            <h3 className="text-lg font-bold text-white">CHC Factor Analysis</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chcData.map((factor) => (
              <div key={factor.id} className="bg-brand-navy/50 rounded-2xl p-5 border border-white/5 hover:border-brand-gold/30 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-2xl">{factor.icon}</div>
                  <div className="text-xl font-black text-brand-gold">{factor.score}</div>
                </div>
                <h4 className="font-bold text-white mb-1">{factor.name}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{factor.description}</p>
                <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.score}%` }}
                    className="h-full bg-brand-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BENCHMARKS & COUNTRY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CAREER & EDUCATION BENCHMARKS */}
          <div className="bg-brand-navy rounded-3xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-gold" /> Potential Benchmarks
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Professional Compatibility</div>
                <div className="space-y-3">
                  {JOB_BENCHMARKS.filter(j => iq >= j.avg).slice(-3).map(job => (
                    <div key={job.job} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-sm font-medium text-white/80">{job.job}</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">MATCH</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Academic Compatibility</div>
                <div className="space-y-3">
                  {UNIVERSITY_BENCHMARKS.filter(u => iq >= u.avg).slice(-3).map(uni => (
                    <div key={uni.school} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-sm font-medium text-white/80">{uni.school}</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-brand-royal/20 text-brand-royal">ELIGIBLE</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COUNTRY COMPARISON */}
          <div className="bg-brand-navy rounded-3xl p-6 border border-white/10 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" /> Regional Comparison
            </h3>
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">{countryStats.country.flag}</div>
              <h4 className="text-2xl font-black text-white mb-1">{countryStats.country.name}</h4>
              <p className="text-white/40 text-sm mb-6">Average IQ: {countryStats.country.avg}</p>
              
              <div className="w-full space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-3xl font-black text-brand-gold mb-1">
                    {countryStats.diff > 0 ? '+' : ''}{countryStats.diff}
                  </div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Points vs National Average</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-xl font-bold text-emerald-400 mb-1">Top {100 - countryStats.percentileInCountry}%</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rank in {countryStats.country.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IMPROVEMENT TIPS */}
        <div className="bg-brand-navy rounded-3xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-brand-gold" /> Personalized Growth Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {improvementTips.map((tip, idx) => (
              <div key={idx} className="space-y-3">
                <div className="text-sm font-bold text-brand-gold uppercase tracking-wider">Focus: {tip.factor}</div>
                <ul className="space-y-2">
                  {tip.tips.map((t, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/60 leading-relaxed">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ANSWER REVIEW TOGGLE */}
        <div className="bg-brand-navy rounded-3xl border border-white/10 overflow-hidden">
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-royal/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-brand-royal" />
              </div>
              <h3 className="text-lg font-bold text-white">Detailed Answer Review</h3>
            </div>
            <ChevronDown className={`w-6 h-6 text-white/40 transition-transform ${showAnswers ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showAnswers && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="p-6 space-y-6">
                  {answerReview.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Question {idx + 1} • {item.category}</div>
                          <p className="text-white font-medium">{item.question}</p>
                        </div>
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className={`p-3 rounded-xl ${item.isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                          <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Your Answer</div>
                          <div className={item.isCorrect ? 'text-emerald-400' : 'text-red-400'}>{item.userAnswer}</div>
                        </div>
                        {!item.isCorrect && (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Correct Answer</div>
                            <div className="text-emerald-400">{item.correctAnswer}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 rounded-xl bg-brand-royal/10 border border-brand-royal/20 flex gap-3">
                        <Info className="w-4 h-4 text-brand-royal shrink-0 mt-0.5" />
                        <p className="text-xs text-white/60 leading-relaxed">{item.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={downloadCertificate} 
            disabled={isGeneratingPdf}
            className="btn-gold flex-grow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isGeneratingPdf ? 'Generating...' : 'Download PDF Certificate'}
          </button>
          
          <button 
            onClick={sendEmail}
            disabled={isSendingEmail}
            className={`flex-grow py-4 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
              emailStatus === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' :
              emailStatus === 'error' ? 'bg-red-500/20 border-red-500 text-red-400' :
              'border-white/10 text-white hover:bg-white/5'
            }`}
          >
            {isSendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
            {emailStatus === 'success' ? 'Sent Successfully!' : 
             emailStatus === 'error' ? 'Failed to Send' : 
             isSendingEmail ? 'Sending...' : 'Email Me My Results'}
          </button>

          <button onClick={() => navigate('/')} className="flex-grow py-4 rounded-2xl border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
            <RefreshCw className="w-5 h-5" /> Retake Test
          </button>
          <button onClick={shareScore} className="p-4 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* PROFESSIONAL CERTIFICATE FOR PDF GENERATION (Hidden by default) */}
        <div 
          ref={certificateRef} 
          style={{ display: 'none', width: '1000px', height: '700px', backgroundColor: '#091020', color: '#FFFFFF' }}
          className="p-0 overflow-hidden relative"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#1B4FBD', opacity: 0.2 }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: '#D4952A', opacity: 0.1 }} />
          
          <div className="h-full w-full p-12 flex flex-col items-center justify-between relative z-10" style={{ border: '20px solid #0D1B4B' }}>
            <div className="absolute inset-4 border-2 pointer-events-none" style={{ borderColor: '#D4952A', opacity: 0.3 }} />
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D4952A' }}>
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-black tracking-tighter" style={{ color: '#FFFFFF' }}>IQTEST<span style={{ color: '#D4952A' }}>PRO</span></div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D4952A' }}>Scientific Assessment</div>
                </div>
              </div>
              <h1 className="text-5xl font-black tracking-[0.1em] mb-4" style={{ color: '#FFFFFF' }}>CERTIFICATE OF ACHIEVEMENT</h1>
              <div className="h-1 w-64 mx-auto" style={{ backgroundColor: '#D4952A' }} />
            </div>

            {/* Content */}
            <div className="text-center space-y-8">
              <p className="text-2xl font-light italic" style={{ color: '#FFFFFF', opacity: 0.7 }}>This is to certify that</p>
              <h2 className="text-7xl font-black uppercase tracking-tight" style={{ color: '#FFFFFF' }}>{profile.name}</h2>
              <div className="flex items-center justify-center gap-6 text-lg font-bold uppercase tracking-widest" style={{ color: '#FFFFFF', opacity: 0.5 }}>
                <span>Age: {profile.age || 'N/A'}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4952A' }} />
                <span>{profile.email || user?.email}</span>
              </div>
              
              <div className="py-10 rounded-3xl border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <p className="text-xl mb-6" style={{ color: '#FFFFFF', opacity: 0.7 }}>has successfully completed the Clinical IQ Assessment with a score of</p>
                <div className="relative inline-block">
                  <span className="text-[120px] font-black tabular-nums" style={{ color: '#D4952A' }}>{iq}</span>
                  <div className="absolute -top-4 -right-12 px-4 py-1.5 rounded-full text-sm font-black" style={{ backgroundColor: '#1B4FBD', color: '#FFFFFF' }}>
                    {percentile}th PERCENTILE
                  </div>
                </div>
                <div className="mt-6 inline-block px-12 py-4 rounded-full border-2 text-2xl font-black uppercase tracking-widest" style={{ backgroundColor: 'rgba(27, 79, 189, 0.2)', borderColor: '#1B4FBD', color: '#FFFFFF' }}>
                  {category.label}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="w-full flex justify-between items-end mt-16 border-t pt-8" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#FFFFFF', opacity: 0.4 }}>Verification ID</div>
                <div className="text-sm font-mono" style={{ color: '#FFFFFF', opacity: 0.7 }}>{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#FFFFFF', opacity: 0.4 }}>Date Issued</div>
                <div className="text-sm" style={{ color: '#FFFFFF', opacity: 0.7 }}>{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {emailStatus !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 ${
              emailStatus === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {emailStatus === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-bold">
              {emailStatus === 'success' ? 'Certificate sent to your email!' : 'Failed to send email. Please try again.'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
