/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Landing from './components/Landing.tsx';
import Onboarding from './components/Onboarding.tsx';
import TestEngine from './components/TestEngine.tsx';
import Results from './components/Results.tsx';
import { Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { CookieBanner } from './components/CookieBanner.tsx';
import { SEO } from './components/seo/SEO.tsx';
import { WebsiteSchema, OrganizationSchema } from './components/seo/StructuredData.tsx';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const IQScale = lazy(() => import('./pages/IQScale.tsx'));
const FamousIQ = lazy(() => import('./pages/FamousIQ.tsx'));
const IQByCountry = lazy(() => import('./pages/IQByCountry.tsx'));
const HistoryOfIQ = lazy(() => import('./pages/HistoryOfIQ.tsx'));
const Practice = lazy(() => import('./pages/Practice.tsx'));
const HighIQSocieties = lazy(() => import('./pages/HighIQSocieties.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Methodology = lazy(() => import('./pages/Methodology.tsx'));
const Privacy = lazy(() => import('./pages/Privacy.tsx'));
const Terms = lazy(() => import('./pages/Terms.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const Blog = lazy(() => import('./pages/Blog.tsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.tsx'));
const Games = lazy(() => import('./pages/Games.tsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.tsx'));
const History = lazy(() => import('./pages/History.tsx'));
const Premium = lazy(() => import('./pages/Premium.tsx'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        // Delay slightly to ensure content is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-brand-navy-deep flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-brand-gold/20 blur-3xl rounded-full"
        />
        <Brain className="w-16 h-16 text-brand-gold relative z-10" />
      </motion.div>
    </div>
  );
}

export default function App() {
  const [testResults, setTestResults] = React.useState<any>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);

  const handleStartTest = (profile: any) => {
    setUserProfile(profile);
  };

  const handleCompleteTest = (results: any) => {
    setTestResults(results);
  };

  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1A237E',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }} />
      <ScrollToTop />
      <SEO />
      <WebsiteSchema />
      <OrganizationSchema />
      <div className="min-h-screen bg-brand-navy text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/test/:mode" element={<Onboarding onStart={handleStartTest} />} />
              <Route path="/active-test/:mode" element={<TestEngine onComplete={handleCompleteTest} />} />
              <Route path="/results" element={testResults ? <Results results={testResults} profile={userProfile} /> : <Navigate to="/" />} />
              
              <Route path="/iq-scale" element={<IQScale />} />
              <Route path="/famous-iq" element={<FamousIQ />} />
              <Route path="/iq-by-country" element={<IQByCountry />} />
              <Route path="/history-of-iq" element={<HistoryOfIQ />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/high-iq-societies" element={<HighIQSocieties />} />
              <Route path="/history" element={<History />} />
              <Route path="/premium" element={<Premium />} />
              
              <Route path="/about" element={<About />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/games" element={<Games />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </AuthProvider>
  );
}
