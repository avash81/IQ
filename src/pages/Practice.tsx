import * as React from 'react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, CheckCircle2, AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { QUESTIONS, Question } from '../data/questions';
import { SEO } from '../components/seo/SEO';
import { BreadcrumbSchema } from '../components/seo/StructuredData';

export default function Practice() {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const domains = ['All', 'Pattern', 'Numeric', 'Verbal', 'Logic', 'Math'];

  const filteredQuestions = useMemo(() => {
    if (selectedDomain === 'All') return QUESTIONS;
    return QUESTIONS.filter(q => q.domain === selectedDomain);
  }, [selectedDomain]);

  const currentQuestion = filteredQuestions[currentIdx];

  const handleSelect = (id: string) => {
    if (showExplanation) return;
    setSelectedId(id);
    setShowExplanation(true);
    setTotal(prev => prev + 1);
    if (id === currentQuestion.correctOptionId) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedId(null);
    setShowExplanation(false);
    setCurrentIdx((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setSelectedId(null);
      setShowExplanation(false);
      setCurrentIdx(prev => prev - 1);
    }
  };

  const resetSession = () => {
    setScore(0);
    setTotal(0);
    setCurrentIdx(0);
    setSelectedId(null);
    setShowExplanation(false);
  };

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <SEO 
        title="Free IQ Practice Questions — Test Your Skills"
        description="Practice IQ questions across 5 domains. Number series, analogies, logic puzzles and visual patterns."
        canonical="/practice"
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://iqtestpro.com/' },
        { name: 'Practice', url: 'https://iqtestpro.com/practice' }
      ]} />
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-xs font-bold mb-6">
            <Brain className="w-3 h-3" />
            FREE PRACTICE MODE
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Master Every Domain</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Sharpen your cognitive skills with zero pressure. Each question includes a detailed explanation to help you learn the underlying logic.
          </p>
        </motion.div>

        {/* Domain Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {domains.map(domain => (
            <button
              key={domain}
              onClick={() => {
                setSelectedDomain(domain);
                setCurrentIdx(0);
                setSelectedId(null);
                setShowExplanation(false);
              }}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedDomain === domain
                  ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Session Score</div>
            <div className="text-2xl font-black text-brand-gold">{score} <span className="text-white/20">/</span> {total}</div>
          </div>
          <button 
            onClick={resetSession}
            className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedDomain}-${currentIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-brand-navy-mid border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="px-4 py-1.5 bg-brand-royal/20 text-brand-royal-light text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-royal/30">
                {currentQuestion.domain}
              </span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < currentQuestion.originalDifficulty ? 'bg-brand-gold' : 'bg-white/10'}`} 
                  />
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {currentQuestion.sequence && (
              <div className="bg-white/5 border border-white/10 border-l-4 border-l-brand-gold rounded-2xl p-8 text-center mb-8 font-mono text-3xl font-bold tracking-widest text-brand-gold tabular">
                {currentQuestion.sequence}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedId === option.id;
                const isCorrect = showExplanation && option.id === currentQuestion.correctOptionId;
                const isWrong = showExplanation && isSelected && option.id !== currentQuestion.correctOptionId;
                const isDimmed = showExplanation && !isSelected && !isCorrect;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    disabled={showExplanation}
                    className={`flex items-center gap-4 w-full p-5 rounded-2xl border-2 transition-all group ${
                      isCorrect ? 'border-green-500 bg-green-500/10' :
                      isWrong ? 'border-red-500 bg-red-500/10' :
                      isSelected ? 'border-brand-gold bg-brand-gold/10' :
                      isDimmed ? 'border-white/5 bg-white/2 opacity-40' :
                      'border-white/10 bg-white/5 hover:border-brand-peri/60 hover:bg-brand-peri/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      isCorrect ? 'bg-green-500/20 text-green-400' :
                      isWrong ? 'bg-red-500/20 text-red-400' :
                      isSelected ? 'bg-brand-gold/25 text-brand-gold' :
                      'bg-white/10 text-white/40 group-hover:bg-brand-peri/20 group-hover:text-brand-peri'
                    }`}>
                      {option.id.toUpperCase()}
                    </div>
                    <span className="text-lg font-medium text-white/90">{option.text}</span>
                    <div className="ml-auto">
                      {isCorrect && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                      {isWrong && <AlertCircle className="w-6 h-6 text-red-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-brand-gold/10 border border-brand-gold/20 border-l-4 border-l-brand-gold rounded-2xl"
              >
                <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest mb-2">
                  <Brain className="w-4 h-4" />
                  Psychometric Explanation
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <div className="flex gap-4 mt-6">
                  {currentIdx > 0 && (
                    <button 
                      onClick={handlePrev}
                      className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10"
                    >
                      Previous
                    </button>
                  )}
                  <button 
                    onClick={handleNext}
                    className="flex-[2] py-4 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/20"
                  >
                    Next Question
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
