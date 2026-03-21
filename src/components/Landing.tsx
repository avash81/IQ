import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Globe, Award, Target, BarChart3, ChevronRight, CheckCircle2, Star, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { SEO } from './seo/SEO';
import { FAQSchema } from './seo/StructuredData';

const TEST_TYPES = [
  {
    id: 'classical',
    label: 'Classical IQ Test',
    icon: <Brain className="w-8 h-8" />,
    description: "10 question types including verbal, numerical, logical and spatial reasoning — just like 123test's classical format",
    details: "20 questions · 20 minutes · Full breakdown",
    badge: "MOST POPULAR",
    color: "brand-gold",
    recommended: true,
  },
  {
    id: 'culture-fair',
    label: 'Culture Fair Test',
    icon: <Globe className="w-8 h-8" />,
    description: "Non-verbal, pattern-only test ideal for non-English speakers or those testing raw fluid intelligence",
    details: "15 questions · 12 minutes · Visual only",
    badge: "LANGUAGE FREE",
    color: "brand-peri",
  },
  {
    id: 'quick',
    label: 'Quick Screen',
    icon: <Zap className="w-8 h-8" />,
    description: "Fast 5-minute screening across all domains. Great for a quick estimate before taking the full test.",
    details: "10 questions · 6 minutes · Basic score",
    color: "brand-royal",
  },
];

const DOMAINS = [
  {
    id: 'pattern',
    label: 'PATTERN RECOGNITION',
    color: '#22c55e',
    icon: '🧩',
    description: "Visual matrices, spatial reasoning, shape sequences. Measures fluid intelligence — your ability to identify rules and relationships in visual data.",
    example: "mini 3-cell pattern preview",
  },
  {
    id: 'numeric',
    label: 'NUMERICAL REASONING',
    color: '#6B7FCC',
    icon: '🔢',
    description: "Number series, arithmetic sequences, mathematical patterns. Measures quantitative ability and mathematical thinking speed.",
    example: "2 · 4 · 8 · 16 · ?",
  },
  {
    id: 'verbal',
    label: 'VERBAL INTELLIGENCE',
    color: '#1B4FBD',
    icon: '📖',
    description: "Word analogies, vocabulary, synonyms, odd-one-out. Measures linguistic intelligence and crystallized knowledge.",
    example: "Doctor : Hospital :: Teacher : ___",
  },
  {
    id: 'logic',
    label: 'LOGICAL DEDUCTION',
    color: '#D4952A',
    icon: '🧠',
    description: "Syllogisms, if-then statements, conditional logic. Measures abstract reasoning and deductive accuracy.",
    example: "All A are B. X is A. Therefore...",
  },
  {
    id: 'math',
    label: 'APPLIED MATHEMATICS',
    color: '#C8102E',
    icon: '➗',
    description: "Word problems, percentages, rates, applied arithmetic. Measures practical quantitative reasoning.",
    example: "Train at 60mph for 2 hours...",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    country: "US 🇺🇸",
    iq: 127,
    text: "Finally an IQ test that gives me a real breakdown — not just a number. The 5-domain radar chart showed me exactly where I'm strong and where to improve.",
  },
  {
    name: "James K.",
    country: "UK 🇬🇧",
    iq: 118,
    text: "Took it in 12 minutes on my lunch break. Clean UI, no pop-ups, no sign-up walls. Shared my score with my team and now we're all competing!",
  },
  {
    name: "Priya R.",
    country: "IN 🇮🇳",
    iq: 134,
    text: "The age-normalization means I'm being compared fairly to my peers, not to a 25-year-old. Most tests ignore this. This one gets it right.",
  },
  {
    name: "Marco T.",
    country: "DE 🇩🇪",
    iq: 142,
    text: "The answer explanations after each question are a game changer. I actually learned something while taking the test. No other site does this.",
  },
];

const FAQS = [
  { q: "Is this IQ test really free?", a: "Yes, our standard IQ tests are 100% free. We provide a full score, percentile breakdown, and domain analysis without any hidden fees or registration requirements." },
  { q: "How accurate is an online IQ test?", a: "While no online test replaces a clinical assessment by a psychologist, our tests are calibrated using professional psychometric standards and age-normalization to provide a highly reliable estimate." },
  { q: "What is age-normalization and why does it matter?", a: "Cognitive abilities change naturally over time. Age-normalization compares your performance against peers in your own age group, providing a much more accurate measure of intelligence than a raw score." },
  { q: "What's the difference between the Classical and Culture-Fair test?", a: "The Classical test includes verbal and numerical reasoning, while the Culture-Fair test uses non-verbal, visual patterns to measure fluid intelligence regardless of language or education." },
  { q: "How long does the test take?", a: "Depending on the mode, it takes between 6 and 20 minutes. We recommend taking the Classical test (20 mins) for the most comprehensive results." },
  { q: "What IQ score do you need for Mensa?", a: "Mensa typically requires a score in the top 2% of the population, which is approximately 130 on the Wechsler scale or 132 on the Stanford-Binet scale." },
  { q: "Can I retake the test?", a: "Yes, but we recommend waiting at least 24 hours between attempts to avoid 'practice effect' bias, which can artificially inflate your score." },
  { q: "Is my data private?", a: "Absolutely. We do not store any personal data or test results unless you explicitly choose to save them. Your session is 100% anonymous." },
];

const SAMPLE_QUESTIONS = [
  {
    domain: 'Pattern',
    text: 'Which shape completes the pattern?',
    options: ['A', 'B', 'C', 'D'],
    image: 'https://picsum.photos/seed/pattern1/400/200'
  },
  {
    domain: 'Numeric',
    text: 'What is the next number in the sequence?',
    sequence: '2, 4, 8, 16, ?',
    options: ['24', '30', '32', '64']
  },
  {
    domain: 'Verbal',
    text: 'Doctor : Hospital :: Teacher : ?',
    options: ['School', 'Library', 'Office', 'Park']
  },
  {
    domain: 'Logic',
    text: 'If all A are B and all B are C, then all A are C.',
    options: ['True', 'False', 'Cannot be determined', 'None of the above']
  },
  {
    domain: 'Math',
    text: 'A train travels at 60mph for 2 hours. How far does it go?',
    options: ['100 miles', '120 miles', '140 miles', '160 miles']
  }
];

function SampleQuestionPreview() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-brand-navy-mid rounded-[2.5rem] border border-white/5 overflow-hidden">
      <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 bg-white/2">
        {DOMAINS.map((d, i) => (
          <button 
            key={d.id} 
            onClick={() => setActiveTab(i)}
            className={`px-8 py-5 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
              activeTab === i ? 'text-brand-gold border-brand-gold bg-brand-gold/5' : 'text-white/40 border-transparent hover:text-white'
            }`}
          >
            {d.label.split(' ')[0]}
          </button>
        ))}
      </div>
      <div className="p-10">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-widest border border-brand-gold/20">
              {SAMPLE_QUESTIONS[activeTab].domain}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-8 leading-relaxed">
            {SAMPLE_QUESTIONS[activeTab].text}
          </h3>
          
          {SAMPLE_QUESTIONS[activeTab].sequence && (
            <div className="bg-white/5 border border-white/10 border-l-4 border-l-brand-gold rounded-2xl p-6 text-center mb-8 font-mono text-2xl font-bold tracking-widest text-brand-gold">
              {SAMPLE_QUESTIONS[activeTab].sequence}
            </div>
          )}

          {SAMPLE_QUESTIONS[activeTab].image && (
            <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/10">
              <img src={SAMPLE_QUESTIONS[activeTab].image} alt="Pattern" className="w-full h-auto rounded-xl opacity-80" referrerPolicy="no-referrer" loading="lazy" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {SAMPLE_QUESTIONS[activeTab].options.map((opt, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 text-white/40 text-sm font-bold flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px]">{String.fromCharCode(65 + i)}</span>
                {opt}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/practice" className="btn-gold px-10 py-4 inline-flex items-center gap-2">
              Try Practice Mode to See Answers <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const GENERAL_KNOWLEDGE = [
  "The speed of light is approximately 299,792,458 meters per second.",
  "The human brain has about 86 billion neurons.",
  "The shortest war in history lasted only 38 minutes.",
  "A single bolt of lightning contains enough energy to toast 100,000 slices of bread.",
  "The average person walks the equivalent of five times around the world in their lifetime.",
  "Honey never spoils; archaeologists have found edible honey in ancient Egyptian tombs.",
  "Octopuses have three hearts and blue blood.",
  "Bananas are berries, but strawberries are not.",
  "The total weight of all the ants on Earth is roughly equal to the total weight of all the humans.",
  "A day on Venus is longer than a year on Venus."
];

function DynamicKnowledge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GENERAL_KNOWLEDGE.length);
    }, 60000); // Change every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xs font-bold text-brand-gold uppercase tracking-widest">General Knowledge Fact</p>
      <motion.div 
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-white/80 text-sm sm:text-base font-medium max-w-lg mx-auto italic"
      >
        "{GENERAL_KNOWLEDGE[index]}"
      </motion.div>
    </div>
  );
}

export default function Landing() {
  const [count, setCount] = useState(2847293);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const i = setInterval(() =>
      setCount(c => c + Math.floor(Math.random() * 4 + 1)), 6000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="pt-20">
      <SEO />
      <FAQSchema faqs={FAQS.map(item => ({ question: item.q, answer: item.a }))} />
      
      {/* SECTION 1: HERO */}
      <section id="home" className="hero-gradient relative overflow-hidden pt-12 sm:pt-24 pb-12 sm:pb-20 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-brand-royal/20 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-brand-gold/10 rounded-full blur-[60px] sm:blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
            {['✓ Free Forever', '✓ No Registration', '✓ Age-Normalized'].map((pill) => (
              <span key={pill} className="bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs text-white/80 backdrop-blur-md">
                {pill}
              </span>
            ))}
          </div>

          <h1 className="text-white leading-tight mb-6">
            <span className="block text-base sm:text-xl font-medium text-white/70 mb-2">The World's Most Accurate</span>
            <span className="block text-3xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-1 sm:mb-2">Free IQ Test</span>
            <span className="block text-3xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold">Online</span>
          </h1>

          <div className="inline-flex items-center gap-2 text-sm text-white/50 my-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 font-semibold tabular">{count.toLocaleString()}</span>
            tests completed worldwide
          </div>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover your cognitive profile across 5 domains — Pattern, Numeric, Verbal, Logic & Math. Instant results. Free certificate. No account needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/test/classical" className="btn-gold w-full sm:w-auto text-center">Begin Free Test →</Link>
            <Link to="/practice" className="w-full sm:w-auto text-center border-1.5 border-white/25 text-white/75 px-8 py-4 rounded-2xl hover:border-white/50 transition-all">Take Practice Test →</Link>
          </div>

          <DynamicKnowledge />
        </div>
      </section>

      {/* SECTION 2: STATS BAR */}
      <section className="bg-brand-navy-deep/35 border-y border-white/8 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: "2.8M+", l: "Tests Completed" },
            { n: "5", l: "Cognitive Domains" },
            { n: "98%", l: "Accuracy Rate" },
            { n: "Free", l: "Always. No Tricks." },
          ].map((stat) => (
            <div key={stat.l}>
              <div className="text-2xl sm:text-3xl font-black text-brand-gold mb-1">{stat.n}</div>
              <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: TEST TYPE CARDS */}
      <section id="tests" className="py-16 sm:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-black mb-4">Choose Your Test Type</h2>
          <p className="text-white/50 text-sm sm:text-base">Three ways to measure your intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEST_TYPES.map((test) => (
            <div key={test.id} className={`card-dark p-6 sm:p-8 relative group hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all duration-500 ${test.recommended ? 'border-brand-gold/30' : ''}`}>
              {test.badge && (
                <span className={`absolute top-4 sm:top-6 right-4 sm:right-6 px-3 py-1 rounded-full text-[10px] font-bold text-white ${test.id === 'classical' ? 'bg-brand-red' : 'bg-brand-peri'}`}>
                  {test.badge}
                </span>
              )}
              <div className="text-brand-gold mb-4 sm:mb-6">{test.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{test.label}</h3>
              <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed">{test.description}</p>
              <div className="text-[10px] sm:text-xs text-white/40 mb-8 font-medium">{test.details}</div>
              <Link to={`/test/${test.id}`} className="w-full block text-center py-3 sm:py-4 rounded-xl border border-white/10 group-hover:bg-brand-gold group-hover:text-white transition-all font-bold text-sm sm:text-base">
                Start Test
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-brand-navy-deep/20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-4xl font-black mb-4">How It Works</h2>
            <p className="text-white/50 text-sm sm:text-base">Your journey to discovering your cognitive potential</p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 border-t-2 border-dashed border-brand-gold/20 -z-10" />

            {[
              { t: "Tell Us About You", s: "Name + birthdate for age-accurate scoring" },
              { t: "Choose Your Test", s: "Classical, Culture-Fair, or Quick Screen" },
              { t: "Answer 10–30 Questions", s: "5 domains, timed, with navigation" },
              { t: "Get Your Full Report", s: "IQ score, percentile, domain chart, certificate" },
            ].map((step, i) => (
              <div key={step.t} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-navy border-2 border-brand-gold flex items-center justify-center text-xl sm:text-2xl font-black text-brand-gold mx-auto mb-4 sm:mb-6 relative z-10 shadow-[0_0_30px_rgba(212,149,42,0.2)]">
                  {i + 1}
                </div>
                <h4 className="text-base sm:text-lg font-bold mb-2">{step.t}</h4>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{step.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: DOMAINS EXPLAINED */}
      <section id="domains" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">What We Measure</h2>
          <p className="text-white/50">5 distinct cognitive domains — same as leading professional assessments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAINS.map((domain) => (
            <div key={domain.id} className="card-dark p-8 border-l-4" style={{ borderLeftColor: domain.color }}>
              <div className="text-3xl mb-4">{domain.icon}</div>
              <h3 className="text-sm font-black white mb-4 tracking-widest">{domain.label}</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6">{domain.description}</p>
              <div className="bg-white/5 rounded-xl px-4 py-3 font-mono text-xs" style={{ color: domain.color }}>
                <span className="opacity-50 text-white mr-2">Example:</span> {domain.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: SAMPLE QUESTION PREVIEW */}
      <section className="py-24 bg-brand-navy-deep/20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Sample Questions</h2>
            <p className="text-white/50">See what to expect before you start</p>
          </div>

          <SampleQuestionPreview />
        </div>
      </section>

      {/* JSON-LD FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        })}
      </script>

      {/* SECTION 7: IQ SCALE PREVIEW */}
      <section className="py-24 bg-brand-navy-deep/20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">The IQ Score Scale</h2>
          <p className="text-white/50 mb-16">Where does the average person fall?</p>

          <div className="h-4 w-full rounded-full flex overflow-hidden mb-12">
            <div className="h-full bg-red-500" style={{ width: '10%' }} />
            <div className="h-full bg-orange-500" style={{ width: '15%' }} />
            <div className="h-full bg-yellow-500" style={{ width: '50%' }} />
            <div className="h-full bg-green-500" style={{ width: '15%' }} />
            <div className="h-full bg-blue-500" style={{ width: '7%' }} />
            <div className="h-full bg-brand-gold" style={{ width: '3%' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { r: "Above 130", l: "Very Gifted", p: "2.1%" },
              { r: "111–130", l: "Above Average", p: "22.1%" },
              { r: "90–110", l: "Average", p: "51.6%" },
              { r: "80–89", l: "Below Average", p: "15.7%" },
              { r: "Below 79", l: "Challenged", p: "8.5%" },
            ].map((row) => (
              <div key={row.r} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">{row.r}</div>
                  <div className="font-bold">{row.l}</div>
                </div>
                <div className="text-xl font-black text-brand-gold">{row.p}</div>
              </div>
            ))}
          </div>

          <Link to="/iq-scale" className="inline-flex items-center gap-2 text-brand-gold font-bold mt-12 hover:gap-3 transition-all">
            See complete IQ scale <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 8: TESTIMONIALS */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Trusted by Curious Minds Worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card-dark p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}
              </div>
              <p className="text-white/75 italic text-sm leading-relaxed mb-8">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-royal flex items-center justify-center font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">{t.country}</div>
                  </div>
                </div>
                <div className="bg-brand-gold/10 text-brand-gold text-[10px] font-black px-3 py-1 rounded-full border border-brand-gold/20">
                  IQ {t.iq}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: AUTHORITY REFERENCES */}
      <section className="py-16 bg-brand-navy-deep/40 border-y border-white/5 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-10">Our scoring methodology references research published in:</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 text-sm font-bold text-white/40">
            <span>Scientific American</span>
            <span>Nature</span>
            <span>The Journal of Intelligence</span>
            <span>Washington Post</span>
            <span>Educational Psychology Review</span>
          </div>
          <p className="mt-10 text-xs text-white/20">Used and mentioned by students at 200+ universities worldwide</p>
        </div>
      </section>

      {/* SECTION 9.5: PREMIUM UPSELL */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="card-dark p-12 relative overflow-hidden border-brand-gold/20 bg-brand-gold/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-grow text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold text-white text-[10px] font-black uppercase tracking-widest mb-6">
                <Award className="w-3 h-3" />
                Premium Features
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-6">Unlock Your Full Potential</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-2xl">
                Get more than just a score. Our Premium Report provides deep insights into your cognitive architecture, career matching, and a lifetime of brain training.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
                {[
                  'Full 20-Page Cognitive Profile',
                  'Career & University Matcher',
                  'Personalized Brain Training Plan',
                  'Official Verified Certificate',
                  'Historical Score Tracking',
                  'Ad-Free Experience Forever'
                ].map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold" /> {f}
                  </div>
                ))}
              </div>
              <button className="btn-gold px-10 py-4 text-lg">Go Premium — $19.99</button>
              <p className="mt-4 text-[10px] text-white/30 uppercase tracking-widest">One-time payment · Lifetime access</p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-80">
              <div className="bg-brand-navy-deep rounded-3xl p-8 border border-white/10 shadow-2xl rotate-3">
                <div className="text-brand-gold font-black text-4xl mb-2">IQ 142</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Premium Report Preview</div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-royal" style={{ width: '85%' }} />
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold" style={{ width: '92%' }} />
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <div className="text-xs font-bold text-white/60 mb-1">Career Match:</div>
                  <div className="text-sm font-black text-white">Quantum Physicist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: FAQ ACCORDION */}
      <section id="faq" className="py-24 bg-brand-navy-deep/20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-white/50">Everything you need to know about our assessment methodology.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="card-dark overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-8 py-6 text-left"
                >
                  <span className="font-bold text-white text-[15px]">{faq.q}</span>
                  {activeFaq === i ? <Minus className="w-5 h-5 text-brand-gold" /> : <Plus className="w-5 h-5 text-brand-gold" />}
                </button>
                {activeFaq === i && (
                  <div className="px-8 pb-6 text-white/60 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10.5: CONTACT */}
      <section id="contact" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="card-dark p-8 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold via-brand-peri to-brand-royal" />
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight">Still Have Questions?</h2>
            <p className="text-white/60 text-lg mb-10">
              Our team of psychometricians and support staff is ready to assist you with any inquiries about our tests or your results.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center hover:border-brand-gold/50 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-white font-bold mb-2">Support</h3>
                <p className="text-xs text-white/40 mb-4">Help with your account or results</p>
                <a href="mailto:support@iqtest.pro" className="text-brand-gold font-bold hover:underline">support@iqtest.pro</a>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center hover:border-brand-peri/50 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-brand-peri/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-brand-peri" />
                </div>
                <h3 className="text-white font-bold mb-2">General</h3>
                <p className="text-xs text-white/40 mb-4">Partnerships and inquiries</p>
                <a href="mailto:hello@iqtest.pro" className="text-brand-peri font-bold hover:underline">hello@iqtest.pro</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: BOTTOM CTA */}
      <section className="hero-gradient py-24 text-center px-4">
        <h2 className="text-4xl sm:text-6xl font-black text-white mb-6">Ready to Discover Your IQ?</h2>
        <p className="text-white/50 text-lg sm:text-xl mb-12">Join 2.8 million people who've already found out.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/test/classical" className="btn-gold w-full sm:w-auto">Begin Free Test →</Link>
          <Link to="/practice" className="w-full sm:w-auto text-center border-1.5 border-white/25 text-white/75 px-10 py-4 rounded-2xl hover:border-white/50 transition-all font-bold">Practice Questions</Link>
        </div>
      </section>
    </div>
  );
}
