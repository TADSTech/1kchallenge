'use client';

import { useState, useEffect } from 'react';
import { firebaseFirestore, firebaseAuth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  increment
} from 'firebase/firestore';
import { AccountLog } from '@/lib/types';

export function useAccountLogs() {
  const [logs, setLogs] = useState<AccountLog[]>([]);
  const [rankings, setRankings] = useState<{ id: string; username: string; balance: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(firebaseAuth.currentUser);

  // Track auth state
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 1. Listen for user's logs
  useEffect(() => {
    if (!user) {
      setLogs([]);
      // If we're not loading anymore but have no user, stop loading
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const q = query(
      collection(firebaseFirestore, `users/${user.uid}/logs`),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
      })) as AccountLog[];
      setLogs(fetchedLogs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Listen for global rankings
  useEffect(() => {
    const q = query(
      collection(firebaseFirestore, 'leaderboard'),
      orderBy('balance', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRankings = snapshot.docs.map(doc => ({
        id: doc.id,
        username: doc.data().username,
        balance: doc.data().balance
      }));
      setRankings(fetchedRankings);
    });

    return () => unsubscribe();
  }, []);

  const addLog = async (logData: Partial<AccountLog>) => {
    if (!user) throw new Error('User not authenticated');

    // 2. Save log to Firestore (No more Storage upload)
    const logRef = await addDoc(collection(firebaseFirestore, `users/${user.uid}/logs`), {
      ...logData,
      balanceImageUrl: '', // Will be verified manually
      timestamp: serverTimestamp(),
      status: 'PENDING'
    });

    // 3. Update local user's balance in leaderboard (Optimistic for now, or just wait for verification?)
    // User wants it "live", so let's update the leaderboard
    const userRef = doc(firebaseFirestore, 'leaderboard', user.uid);
    await setDoc(userRef, {
      username: user.displayName || user.email?.split('@')[0] || 'Unknown',
      balance: increment(logData.amount || 0),
      lastUpdated: serverTimestamp()
    }, { merge: true });

    return logRef.id;
  };

  return { logs, rankings, isLoading, addLog };
}
