import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Timer, AlertCircle, CheckCircle2, XCircle, Lightbulb, Brain, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../data/questions';
import { updateTheta, selectNextQuestion, thetaToIQ, computeConfidenceInterval } from '../lib/irt';
import { trackEvent } from '../lib/analytics';
import { useAuth } from '../context/AuthContext';
import { getQuestions, markQuestionAsUsed } from '../lib/db';
import LevelSelect from '../components/LevelSelect';

const TEST_MODES = {
  quick: {
    id: 'quick',
    label: 'Quick Screen',
    questions: 10,
    minutes: 6,
    domains: ['Numeric', 'Pattern'],
    description: 'Fast IQ estimate',
    rating: 3,
  },
  classical: {
    id: 'classical',
    label: 'Classical IQ',
    questions: 20,
    minutes: 20,
    domains: ['Numeric', 'Verbal', 'Logic', 'Math', 'Pattern'],
    description: '10 question types, full profile',
    rating: 5,
    recommended: true,
  },
  culturefair: {
    id: 'culturefair',
    label: 'Culture Fair',
    questions: 15,
    minutes: 12,
    domains: ['Pattern'],
    description: 'Non-verbal only, language-free',
    rating: 4,
    badge: 'LANGUAGE FREE',
  },
  adaptive: {
    id: 'adaptive',
    label: 'Adaptive IQ',
    questions: 15,
    minutes: 15,
    domains: ['Numeric', 'Verbal', 'Logic', 'Math', 'Pattern'],
    description: 'AI-powered questions adapt to your level.',
    rating: 5,
    badge: 'MOST ACCURATE',
  }
};

const DOMAIN_COLORS = {
  Pattern: '#22c55e',
  Numeric: '#6B7FCC',
  Verbal: '#1B4FBD',
  Logic: '#D4952A',
  Math: '#C8102E',
  'Working Memory': '#C8102E',
  'Processing Speed': '#D4952A',
};

const WM_SEQUENCES = [
  [3, 7, 2],           // easy
  [5, 1, 8, 4],        // medium
  [9, 2, 6, 1, 7],     // hard
  [4, 8, 3, 7, 2, 5],  // very hard
];

const PS_SYMBOLS = ['●', '○', '▲', '△', '■', '□'];

type TestPhase = 'warmup_wm' | 'warmup_ps' | 'level_select' | 'active_test' | 'finished';

// Matrix Cell Component for Pattern Reasoning
const MatrixCell = ({ value, isOption = false }: { value: string; isOption?: boolean }) => {
  if (value === '?') {
    return (
      <div className="w-full aspect-square bg-brand-gold/10 border-2 border-dashed border-brand-gold/30 rounded-lg flex items-center justify-center">
        <span className="text-2xl sm:text-4xl font-black text-brand-gold">?</span>
      </div>
    );
  }

  // Parse dots from string like "1,2,3"
  const dots = value.split(',').map(Number).filter(n => !isNaN(n));
  
  return (
    <div className={`w-full aspect-square bg-white/5 border border-white/10 rounded-lg grid grid-cols-3 gap-1 p-1 sm:p-2 ${isOption ? 'group-hover:border-brand-gold/50' : ''}`}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pos) => (
        <div key={pos} className="flex items-center justify-center">
          {dots.includes(pos) && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(212,149,42,0.4)]"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function TestEngine({ onComplete }: { onComplete: (results: any) => void }) {
  const { mode = 'classical' } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const testMode = TEST_MODES[mode as keyof typeof TEST_MODES] || TEST_MODES.classical;
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [phase, setPhase] = useState<TestPhase>('warmup_wm');
  
  // Working Memory State
  const [wmRound, setWmRound] = useState(0);
  const [wmShow, setWmShow] = useState(true);
  const [wmInput, setWmInput] = useState('');
  const [wmSpan, setWmSpan] = useState(0);

  // Processing Speed State
  const [psScore, setPsScore] = useState(0);
  const [psCurrentSymbol, setPsCurrentSymbol] = useState(PS_SYMBOLS[0]);
  const [psTimeLeft, setPsTimeLeft] = useState(20);
  const [psFeedback, setPsFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Main Test State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(testMode.minutes * 60);
  const [showExplanation, setShowExplanation] = useState(false);
  const [theta, setTheta] = useState(0);
  const [usedIds, setUsedIds] = useState(new Set<number>());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);

  const startRef = useRef(Date.now());

  // Initialize first question
  useEffect(() => {
    if (phase === 'active_test' && !currentQuestion && selectedLevel) {
      // Fetch questions from Firestore
      // Use guest ID if user is not logged in
      const userId = user?.uid || 'guest';
      getQuestions(String(selectedLevel.id), 'all', userId).then(fetchedQuestions => {
        setQuestions(fetchedQuestions);
        
        // Use the domains from the selectedLevel if available, otherwise fallback to testMode.domains
        const domains = selectedLevel.domains || testMode.domains;
        let firstQ = selectNextQuestion(0, new Set(), fetchedQuestions, domains[0]);
        
        // Fallback if no question found in the first domain
        if (!firstQ && fetchedQuestions.length > 0) {
          console.warn(`No question found for domain ${domains[0]}, falling back to any domain.`);
          firstQ = selectNextQuestion(0, new Set(), fetchedQuestions);
        }
        
        if (firstQ) {
          setCurrentQuestion(firstQ);
          setUsedIds(new Set([firstQ.id]));
          setTestQuestions([firstQ]);
        } else {
          console.error("No questions found for level:", selectedLevel.id);
        }
      });
    }
  }, [phase, user, selectedLevel, testMode.domains]);

  // Main Timer
  useEffect(() => {
    if (phase !== 'active_test') return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const remaining = Math.max(0, testMode.minutes * 60 - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        handleFinish();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [phase, testMode]);

  // Working Memory Logic
  useEffect(() => {
    if (phase === 'warmup_wm' && wmShow) {
      const timer = setTimeout(() => setWmShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, wmRound, wmShow]);

  const handleWMSubmit = () => {
    const target = WM_SEQUENCES[wmRound].join('');
    if (wmInput === target) {
      setWmSpan(WM_SEQUENCES[wmRound].length);
      if (wmRound < WM_SEQUENCES.length - 1) {
        setWmRound(prev => prev + 1);
        setWmInput('');
        setWmShow(true);
      } else {
        setPhase('warmup_ps');
      }
    } else {
      setPhase('warmup_ps');
    }
  };

  // Processing Speed Logic
  useEffect(() => {
    if (phase === 'warmup_ps') {
      // Ensure we have a symbol immediately
      if (!psCurrentSymbol) {
        setPsCurrentSymbol(PS_SYMBOLS[Math.floor(Math.random() * PS_SYMBOLS.length)]);
      }
      
      const timer = setInterval(() => {
        setPsTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('level_select');
            startRef.current = Date.now(); // Reset start time for main test
            return 0;
          }
          return prev - 1;
        });
        // Only change symbol automatically every 1.5s to give user time to react
        setPsCurrentSymbol(PS_SYMBOLS[Math.floor(Math.random() * PS_SYMBOLS.length)]);
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [phase, psCurrentSymbol]);

  const handlePSClick = () => {
    if (psCurrentSymbol === '●') {
      setPsScore(prev => prev + 1);
      setPsFeedback('correct');
    } else {
      setPsScore(prev => Math.max(0, prev - 2));
      setPsFeedback('wrong');
    }
    
    // Clear feedback after 300ms
    setTimeout(() => setPsFeedback(null), 300);
    
    // Change symbol immediately on click
    setPsCurrentSymbol(PS_SYMBOLS[Math.floor(Math.random() * PS_SYMBOLS.length)]);
  };

  const handleAnswer = (optionId: string) => {
    if (phase !== 'active_test' || !currentQuestion) return;
    
    const isCorrect = optionId === currentQuestion.correctOptionId;
    setAnswers(prev => ({ ...prev, [currentIdx]: optionId }));
    setShowExplanation(true);

    trackEvent('question_answered', {
      question_number: currentIdx + 1,
      domain: currentQuestion.domain,
      correct: isCorrect,
    });

    // Update IRT Theta
    const newTheta = updateTheta(theta, isCorrect, currentQuestion.difficulty, currentQuestion.discrimination);
    setTheta(newTheta);
    
    // Mark question as used
    if (user) {
      markQuestionAsUsed(currentQuestion.id.toString(), user.uid);
    }
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    // If we are navigating back and want to go forward to an already generated question
    if (currentIdx < testQuestions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setCurrentQuestion(testQuestions[nextIdx]);
      setShowExplanation(!!answers[nextIdx]);
      return;
    }

    const answeredCount = usedIds.size;
    const ci = computeConfidenceInterval(theta, answeredCount);
    
    // Stop conditions
    const isAdaptiveStop = mode === 'adaptive' && (ci.high - ci.low < 10 || answeredCount >= 15);
    const isNormalStop = mode !== 'adaptive' && answeredCount >= testMode.questions;

    if (isAdaptiveStop || isNormalStop) {
      handleFinish();
    } else {
      const domains = selectedLevel?.domains || testMode.domains;
      let nextQ = selectNextQuestion(theta, usedIds, questions, domains[answeredCount % domains.length]);
      
      // Fallback if no question found in the preferred domain
      if (!nextQ && questions.length > usedIds.size) {
        console.warn(`No question found for domain ${domains[answeredCount % domains.length]}, falling back to any domain.`);
        nextQ = selectNextQuestion(theta, usedIds, questions);
      }
      
      if (nextQ) {
        setCurrentQuestion(nextQ);
        setUsedIds(prev => new Set([...prev, nextQ.id]));
        setTestQuestions(prev => [...prev, nextQ]);
        setCurrentIdx(prev => prev + 1);
        setShowExplanation(false);
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = () => {
    setPhase('finished');
    const correctCount = testQuestions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctOptionId ? 1 : 0);
    }, 0);

    const domainScores = testQuestions.reduce((acc, q, idx) => {
      if (!acc[q.domain]) acc[q.domain] = { correct: 0, total: 0 };
      acc[q.domain].total++;
      if (answers[idx] === q.correctOptionId) acc[q.domain].correct++;
      return acc;
    }, {} as Record<string, { correct: number; total: number }>);

    // Add WM and PS to domain scores
    domainScores['Working Memory'] = { correct: wmSpan, total: 6 };
    domainScores['Processing Speed'] = { correct: psScore, total: 20 };

    const timeSpent = testMode.minutes * 60 - timeLeft;

    const isEarlyEnd = testQuestions.length < (mode === 'adaptive' ? 15 : testMode.questions) && timeLeft > 0;

    if (isEarlyEnd) {
      trackEvent('test_abandoned', {
        mode,
        questions_answered: testQuestions.length,
        time_spent: timeSpent,
      });
    }

    trackEvent('test_completed', {
      mode,
      iq_score: thetaToIQ(theta),
      time_taken: timeSpent,
    });

    onComplete({
      mode,
      level: selectedLevel?.id,
      correctCount,
      totalCount: testQuestions.length,
      answers,
      questions: testQuestions,
      domainScores,
      timeSpent,
      theta,
      ci: computeConfidenceInterval(theta, testQuestions.length),
      wmSpan,
      psScore
    });
    navigate('/results');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Warmup UI
  if (phase === 'warmup_wm') {
    return (
      <div className="min-h-screen bg-brand-navy-deep flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full card-dark p-8 sm:p-12 text-center">
          <Brain className="w-10 h-10 text-brand-gold mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Working Memory Warmup</h2>
          <p className="text-white/50 text-xs sm:text-sm mb-6">Memorize the sequence and type it back. This measures your short-term memory span.</p>
          
          <AnimatePresence mode="wait">
            {wmShow ? (
              <motion.div key="show" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-5xl sm:text-6xl font-black text-brand-gold tracking-widest font-mono mb-6">
                {WM_SEQUENCES[wmRound].join(' ')}
              </motion.div>
            ) : (
              <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <input
                  type="text"
                  value={wmInput}
                  onChange={(e) => setWmInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Type the sequence"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-bold text-white outline-none focus:border-brand-gold"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleWMSubmit()}
                />
                <button onClick={handleWMSubmit} className="btn-gold w-full py-3">Submit</button>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setPhase('level_select')} className="mt-6 text-xs text-white/30 hover:text-white transition-colors font-bold uppercase tracking-widest">Skip Warmup & Start Test →</button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'warmup_ps') {
    return (
      <div className="min-h-screen bg-brand-navy-deep flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full card-dark p-8 sm:p-12 text-center">
          <Zap className="w-10 h-10 text-brand-gold mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Processing Speed</h2>
          <p className="text-white/50 text-xs sm:text-sm mb-6">Click ONLY when you see the filled circle ●. Ignore other symbols!</p>
          
          <div className={`text-7xl sm:text-8xl mb-6 h-24 sm:h-32 flex items-center justify-center select-none transition-all duration-200 ${
            psFeedback === 'correct' ? 'text-green-500 scale-110 drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 
            psFeedback === 'wrong' ? 'text-red-500 scale-90 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 
            'text-white'
          }`}>
            {psCurrentSymbol}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Time: {psTimeLeft}s</div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Score: {psScore}</div>
          </div>

          <button 
            onMouseDown={handlePSClick}
            className="w-full py-6 bg-brand-gold/10 border-2 border-brand-gold rounded-2xl text-brand-gold font-black text-lg hover:bg-brand-gold/20 active:scale-95 transition-all"
          >
            CLICK NOW
          </button>
          <button onClick={() => setPhase('level_select')} className="mt-6 text-xs text-white/30 hover:text-white transition-colors font-bold uppercase tracking-widest">Skip Warmup & Start Test →</button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'level_select') {
    return <LevelSelect onSelect={(level) => {
      setSelectedLevel(level);
      setPhase('active_test');
    }} />;
  }

  if (!currentQuestion) return null;

  const progress = ((currentIdx + 1) / (mode === 'adaptive' ? 15 : testMode.questions)) * 100;
  const timePct = timeLeft / (testMode.minutes * 60);
  const currentIQ = thetaToIQ(theta);

  return (
    <div className="min-h-screen bg-brand-navy-deep pt-2 sm:pt-4 pb-4 px-4 overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 bg-black/20 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-white/40 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider tabular">
              Q{currentIdx + 1} <span className="opacity-30">/ {mode === 'adaptive' ? '15' : testMode.questions}</span>
            </div>
            <div className="px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest" style={{ backgroundColor: DOMAIN_COLORS[currentQuestion.domain as keyof typeof DOMAIN_COLORS] }}>
              {currentQuestion.domain}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-white/5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-white/10">
              <Timer className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${timePct < 0.1 ? 'text-red-500 animate-pulse' : 'text-brand-gold'}`} />
              <span className={`text-[9px] sm:text-xs font-bold tabular ${timePct < 0.1 ? 'text-red-500' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <button onClick={handleFinish} className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 transition-all">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* PROGRESS BAR (Segmented) */}
        <div className="flex gap-0.5 h-0.5 w-full mb-3 sm:mb-4">
          {[...Array(mode === 'adaptive' ? 15 : testMode.questions)].map((_, i) => {
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx;
            const q = testQuestions[i];
            const color = q ? DOMAIN_COLORS[q.domain as keyof typeof DOMAIN_COLORS] : '#333';
            
            return (
              <div 
                key={i} 
                className="flex-1 rounded-full overflow-hidden bg-white/5"
              >
                {(isCompleted || isCurrent) && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    className="h-full"
                    style={{ 
                      backgroundColor: isCurrent ? '#D4952A' : color,
                      opacity: isCurrent ? 1 : 0.6
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* QUESTION CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="card-dark p-3 sm:p-6 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${i < currentQuestion.originalDifficulty ? 'bg-brand-gold' : 'bg-white/10'}`} />
                ))}
              </div>
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {['P', 'N', 'V', 'L', 'M'].map((d, i) => {
                  const domainName = ['Pattern', 'Numeric', 'Verbal', 'Logic', 'Math'][i];
                  const isDone = testQuestions.slice(0, -1).some(q => q.domain === domainName);
                  const isCurrent = currentQuestion.domain === domainName;
                  return (
                    <div 
                      key={d} 
                      className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full flex-shrink-0 flex items-center justify-center text-[6px] sm:text-[8px] font-bold border transition-all ${
                        isCurrent ? 'border-brand-gold text-brand-gold' : 
                        isDone ? 'bg-brand-gold border-brand-gold text-white' : 
                        'border-white/10 text-white/20'
                      }`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
            </div>

            <h2 className="text-sm sm:text-lg font-bold text-white leading-tight mb-2 sm:mb-4">
              {currentQuestion.text}
            </h2>

            {currentQuestion.sequence && (
              <div className="bg-white/5 border border-white/10 border-l-2 border-l-brand-gold rounded-lg p-2 sm:p-3 text-center mb-2 sm:mb-4 font-mono text-sm sm:text-xl font-bold tracking-widest text-brand-gold tabular break-all">
                {currentQuestion.sequence}
              </div>
            )}

            {currentQuestion.matrix && (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 max-w-[320px] mx-auto bg-black/20 p-2 sm:p-4 rounded-2xl border border-white/5 shadow-2xl">
                {currentQuestion.matrix.map((cell, i) => (
                  <MatrixCell key={i} value={cell} />
                ))}
              </div>
            )}

            <div className={`grid ${currentQuestion.matrix ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1'} gap-1 sm:gap-2 mb-3 sm:mb-4`}>
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentIdx] === option.id;
                const isCorrect = showExplanation && option.id === currentQuestion.correctOptionId;
                const isWrong = showExplanation && isSelected && option.id !== currentQuestion.correctOptionId;

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={showExplanation}
                    whileTap={{ scale: 0.98 }}
                    className={`flex ${currentQuestion.matrix ? 'flex-col' : 'flex-row'} items-center gap-2 sm:gap-3 w-full p-2 sm:p-3 rounded-lg border transition-all duration-200 text-left group ${
                      isCorrect ? 'border-green-500 bg-green-500/10' :
                      isWrong ? 'border-red-500 bg-red-500/10' :
                      isSelected ? 'border-brand-gold bg-brand-gold/10' :
                      'border-white/10 bg-white/5 hover:border-brand-peri/30'
                    }`}
                  >
                    <div className={`w-5 h-5 sm:w-7 sm:h-7 rounded flex-shrink-0 flex items-center justify-center text-[8px] sm:text-[10px] font-bold transition-colors ${
                      isCorrect ? 'bg-green-500 text-white' :
                      isWrong ? 'bg-red-500 text-white' :
                      isSelected ? 'bg-brand-gold text-white' :
                      'bg-white/10 text-white/40'
                    }`}>
                      {option.id.toUpperCase()}
                    </div>
                    
                    {currentQuestion.matrix ? (
                      <div className="w-full">
                        <MatrixCell value={option.text} isOption />
                      </div>
                    ) : (
                      <span className="flex-grow font-medium text-[10px] sm:text-sm">{option.text}</span>
                    )}
                    
                    {!currentQuestion.matrix && isCorrect && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />}
                    {!currentQuestion.matrix && isWrong && <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />}
                  </motion.button>
                );
              })}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-brand-gold/5 border border-brand-gold/10 border-l-2 border-l-brand-gold rounded-lg p-2 sm:p-3 mb-4"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-3 h-3 text-brand-gold flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] sm:text-xs text-white/60 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  if (currentIdx > 0) {
                    setCurrentIdx(prev => prev - 1);
                    setCurrentQuestion(testQuestions[currentIdx - 1]);
                    setShowExplanation(!!answers[currentIdx - 1]);
                  }
                }}
                disabled={currentIdx === 0}
                className="flex items-center gap-1 text-[10px] font-bold text-white/30 hover:text-white disabled:opacity-0 transition-all"
              >
                <ChevronLeft className="w-3 h-3" /> Prev
              </button>

              <button
                onClick={handleNext}
                disabled={!answers[currentIdx]}
                className="btn-gold py-1.5 sm:py-2 px-4 sm:px-6 text-[10px] flex items-center gap-1 disabled:opacity-50"
              >
                {currentIdx === (mode === 'adaptive' ? 14 : testMode.questions - 1) ? 'Finish' : 'Next'} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
