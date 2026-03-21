import * as React from 'react';
import { motion } from 'motion/react';
import { Info, HelpCircle, ChevronDown } from 'lucide-react';
import { SEO } from '../components/seo/SEO';
import { FAQSchema, BreadcrumbSchema } from '../components/seo/StructuredData';

const SCALE_DATA = [
  { range: '130+', category: 'Very Gifted', population: '2.1%', color: '#D4952A', description: 'Exceptional intellectual ability, often matching Mensa requirements.' },
  { range: '121–130', category: 'Gifted', population: '6.4%', color: '#1B4FBD', description: 'Superior intelligence, significantly above the average population.' },
  { range: '111–120', category: 'Above Average', population: '15.7%', color: '#6B7FCC', description: 'High average intelligence, capable of complex problem solving.' },
  { range: '90–110', category: 'Average', population: '51.6%', color: '#22c55e', description: 'The majority of the population falls within this range.' },
  { range: '80–89', category: 'Below Average', population: '15.7%', color: '#f59e0b', description: 'Low average intelligence, may face some cognitive challenges.' },
  { range: '70–79', category: 'Borderline', population: '6.4%', color: '#ef4444', description: 'Significant cognitive limitations compared to the general population.' },
  { range: 'Below 70', category: 'Extremely Low', population: '2.1%', color: '#991b1b', description: 'Severe cognitive impairment, often requiring specialized support.' },
];

const FAQ_ITEMS = [
  {
    q: "What is an IQ score?",
    a: "An Intelligence Quotient (IQ) is a total score derived from several standardized tests designed to assess human intelligence. The average IQ score is set at 100."
  },
  {
    q: "How accurate is this scale?",
    a: "The scale is based on the Wechsler Adult Intelligence Scale (WAIS) and the Stanford-Binet Intelligence Scales, which are the gold standards in professional psychological assessment."
  },
  {
    q: "Does IQ change with age?",
    a: "While your raw cognitive ability may change, IQ scores are age-normalized, meaning you are compared to others in your same age group. This keeps the score relatively stable over time."
  },
  {
    q: "What is the Flynn Effect?",
    a: "The Flynn Effect is the observed substantial and sustained increase in IQ test scores measured in many parts of the world over the 20th century."
  }
];

export default function IQScale() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <SEO 
        title="IQ Score Scale — What Does Your IQ Mean?"
        description="Complete IQ score chart from 40 to 160+. Understand every IQ range, what percentage of people score there, and what it means for you."
        canonical="/iq-scale"
      />
      <FAQSchema faqs={FAQ_ITEMS.map(item => ({ question: item.q, answer: item.a }))} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://iqtestpro.com/' },
        { name: 'IQ Scale', url: 'https://iqtestpro.com/iq-scale' }
      ]} />
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black text-white mb-6">The IQ Score Scale</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Understanding your results and where you fall in the global population.
          </p>
        </motion.div>

        <div className="bg-brand-navy-mid rounded-[3rem] border border-white/5 overflow-hidden mb-20">
          <div className="p-10 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center">
                <Info className="w-6 h-6 text-brand-gold" />
              </div>
              <h2 className="text-2xl font-bold text-white">Score Interpretation</h2>
            </div>
            
            <div className="h-4 w-full bg-white/5 rounded-full flex overflow-hidden mb-4">
              {SCALE_DATA.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ width: item.population, backgroundColor: item.color }} 
                  className="h-full first:rounded-l-full last:rounded-r-full opacity-80"
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase tracking-widest px-1">
              <span>70</span>
              <span>85</span>
              <span>100</span>
              <span>115</span>
              <span>130</span>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {SCALE_DATA.map((item, idx) => (
              <div key={idx} className="p-8 flex flex-col md:flex-row gap-8 hover:bg-white/5 transition-colors">
                <div className="md:w-48 flex-shrink-0">
                  <div className="text-3xl font-black mb-1" style={{ color: item.color }}>{item.range}</div>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{item.population} of population</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.category}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="bg-brand-navy-mid rounded-3xl border border-white/5 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-all"
                >
                  <span className="text-lg font-bold text-white">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-brand-gold transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-8 text-white/60 text-sm leading-relaxed animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button className="px-12 py-5 bg-brand-gold text-white font-bold rounded-2xl hover:bg-brand-gold-hover transition-all shadow-xl shadow-brand-gold/20">
            Take the IQ Test Now
          </button>
        </div>
      </div>
    </div>
  );
}
