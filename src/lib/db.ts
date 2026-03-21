import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, updateDoc, arrayUnion, addDoc, orderBy, limit } from 'firebase/firestore';
import { QUESTIONS } from '../data/questions';

// Question service
export const getQuestions = async (difficulty: string, ageGroup: string, userId: string) => {
  try {
    // Map level ID to difficulty number
    const difficultyMap: Record<string, number> = {
      'beginner': 1,
      'intermediate': 3,
      'advanced': 4 // Changed from 5 to 4 as 4 is the max in local data
    };
    
    const isAdaptive = difficulty === 'adaptive';
    const difficultyNum = difficultyMap[difficulty] || 1;
    
    let fetchedQuestions: any[] = [];

    if (isAdaptive) {
      // For adaptive mode, we want a broad range of questions
      const q = query(collection(db, 'questions'));
      const snapshot = await getDocs(q);
      fetchedQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    } else {
      // Try to query by originalDifficulty (number)
      const q1 = query(
        collection(db, 'questions'),
        where('originalDifficulty', '==', difficultyNum)
      );
      const snapshot1 = await getDocs(q1);
      fetchedQuestions = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      // If no questions found by number, try by difficulty string
      if (fetchedQuestions.length === 0) {
        const q2 = query(
          collection(db, 'questions'),
          where('difficulty', '==', difficulty)
        );
        const snapshot2 = await getDocs(q2);
        fetchedQuestions = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      }
    }
    
    // Filter out used questions
    const unusedQuestions = fetchedQuestions.filter(q => !q.usedByUsers?.includes(userId));
    
    // If still no questions found in Firestore, fallback to local QUESTIONS
    if (unusedQuestions.length === 0) {
      console.warn('No questions found in Firestore, falling back to local data.');
      if (isAdaptive) {
        return QUESTIONS;
      }
      
      // Get questions for the requested difficulty
      const primaryQuestions = QUESTIONS.filter(q => q.originalDifficulty === difficultyNum);
      
      // If we have very few questions for this difficulty, include adjacent difficulties
      if (primaryQuestions.length < 15) {
        console.log(`Only ${primaryQuestions.length} questions for difficulty ${difficultyNum}, including adjacent levels.`);
        return QUESTIONS.filter(q => Math.abs(q.originalDifficulty - difficultyNum) <= 1);
      }
      
      return primaryQuestions;
    }
    
    // Similarly for Firestore results, if we have few, we might want more, 
    // but for now let's just return what we found or fallback if empty.
    return unusedQuestions;
  } catch (error) {
    console.error('Error fetching questions from Firestore:', error);
    // Fallback to local data on error
    const difficultyMap: Record<string, number> = {
      'beginner': 1,
      'intermediate': 3,
      'advanced': 4
    };
    const isAdaptive = difficulty === 'adaptive';
    if (isAdaptive) return QUESTIONS;
    const difficultyNum = difficultyMap[difficulty] || 1;
    return QUESTIONS.filter(q => q.originalDifficulty === difficultyNum);
  }
};

export const markQuestionAsUsed = async (questionId: string, userId: string) => {
  const questionRef = doc(db, 'questions', questionId);
  await updateDoc(questionRef, {
    usedByUsers: arrayUnion(userId)
  });
};

// Blog service
export const getBlogs = async () => {
  const snapshot = await getDocs(collection(db, 'blogs'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
};

export const getBlogBySlug = async (slug: string) => {
  const docRef = doc(db, 'blogs', slug);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as any;
  }
  return null;
};

// Leaderboard service
export const saveResultToFirestore = async (result: any) => {
  try {
    // Filter out undefined values to prevent Firestore errors
    const sanitizedResult = Object.keys(result).reduce((acc, key) => {
      if (result[key] !== undefined) {
        acc[key] = result[key];
      }
      return acc;
    }, {} as any);

    await addDoc(collection(db, 'results'), {
      ...sanitizedResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving result to Firestore:', error);
    throw error;
  }
};

export const getLeaderboard = async (limitCount: number = 10) => {
  const q = query(
    collection(db, 'results'),
    where('level', '==', 'advanced'), // Only show advanced level results
    orderBy('iq', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
};
