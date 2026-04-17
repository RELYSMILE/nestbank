import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, db } from '../lib/Config';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';

export interface NestUser {
  uid: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  account_number: string;
  bank_name: string;
  balance: number;
  pin: string;
  role: 'user' | 'admin';
  blocked: boolean;
  created_at: string;
}

interface AuthCtx {
  user: NestUser | null;
  session: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<NestUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load user profile from Firestore
  const loadProfile = useCallback(async (uid: string) => {
    const docRef = doc(db, 'nest_users', uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      setUser(snap.data() as NestUser);
    }
  }, []);

  // 🔄 Refresh user
  const refresh = useCallback(async () => {
    if (session?.uid) {
      await loadProfile(session.uid);
    }
  }, [session, loadProfile]);

  // 🔐 Auth state listener (replaces Supabase session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setSession(fbUser);

      if (fbUser?.uid) {
        await loadProfile(fbUser.uid);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadProfile]);

  // ⚡ Realtime user updates (balance, etc.)
  useEffect(() => {
    if (!session?.uid) return;

    const docRef = doc(db, 'nest_users', session.uid);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setUser((prev) => prev ? { ...prev, ...(snap.data() as any) } : (snap.data() as NestUser));
      }
    });

    return () => unsubscribe();
  }, [session?.uid]);

  // 🔑 Sign in
  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🚪 Sign out
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};