import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History as HistoryIcon, Calendar, Trophy, ChevronRight, Brain, Clock, Award, Trash2 } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { getHistory, clearHistory, TestResult } from '../lib/history';
import { useNavigate } from 'react-router-dom';

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export default function History() {
  const { user, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFirestoreError = (error: any, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: user?.uid,
        email: user?.email,
        emailVerified: user?.emailVerified,
        isAnonymous: user?.isAnonymous,
        tenantId: user?.tenantId,
        providerInfo: user?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  useEffect(() => {
    if (!isAuthReady) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        if (user) {
          const q = query(
            collection(db, 'testResults'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const firestoreResults = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          })) as TestResult[];
          setResults(firestoreResults);
        } else {
          setResults(getHistory());
        }
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.LIST, 'testResults');
        } else {
          console.error('Error fetching results:', error);
          // Fallback to local history on error
          setResults(getHistory());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user, isAuthReady]);

  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearHistory = () => {
    setShowClearModal(true);
  };

  const confirmClearHistory = () => {
    clearHistory();
    if (!user) setResults([]);
    setShowClearModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy-deep flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-16 h-16 text-brand-gold" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy-deep pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold mb-4"
            >
              <HistoryIcon className="w-3 h-3" /> YOUR JOURNEY
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Test History</h1>
            <p className="text-white/60 max-w-xl">
              Review your past performance and track your cognitive growth over time.
              {user ? ' Your results are securely synced to your account.' : ' Results are stored locally on this device.'}
            </p>
          </div>
          
          {!user && results.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
            >
              <Trash2 className="w-4 h-4" /> Clear Local History
            </button>
          )}
        </div>
        
        {results.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tests taken yet</h3>
            <p className="text-white/40 mb-8">Complete your first IQ test to see your history here.</p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-hover transition-all"
            >
              Take Your First Test
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, i) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-dark p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-brand-royal/50 transition-all group"
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-brand-royal/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-black text-brand-royal">{result.iq}</span>
                    <span className="text-[8px] font-bold text-brand-royal/50 uppercase">IQ</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white">{result.category}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                        {result.mode}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(result.date || (result as any).timestamp).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {result.percentile}th Percentile
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="hidden md:flex items-center gap-4">
                    {Object.entries(result.domainScores || {}).slice(0, 3).map(([domain, score]) => (
                      <div key={domain} className="text-center">
                        <div className="text-xs font-bold text-brand-gold">{Math.round(score)}%</div>
                        <div className="text-[8px] text-white/30 uppercase tracking-tighter">{domain}</div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => navigate('/')} // In a real app, this would go to a detailed result view
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-brand-gold group-hover:bg-brand-gold/10 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Clear History Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-navy-deep border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Clear Local History?</h3>
            <p className="text-white/60 mb-8">
              Are you sure you want to clear your local history? This will not affect your cloud-saved results.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClearHistory}
                className="flex-1 py-3 px-6 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                Clear History
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
