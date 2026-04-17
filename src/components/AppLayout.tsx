import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Stats from '@/components/landing/Stats';
import Trust from '@/components/landing/Trust';
import Footer from '@/components/landing/Footer';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/Config';
import { onSnapshot } from 'firebase/firestore';

const AppLayout: React.FC = () => {
  const [settings, setSettings] = useState<{ app_name: string; hero_title: string; hero_subtitle: string } | null>(null);

   useEffect(() => {
  const ref = doc(db, 'nest_settings', 'app');

  const unsub = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      setSettings(snap.data() as any);
    }
  });

  return () => unsub();
}, []);

  const heroTitle = settings?.hero_title || 'Welcome to NestBank';
  const heroSubtitle = settings?.hero_subtitle || 'Secure digital banking for everyone';

    return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <Hero title={heroTitle} subtitle={heroSubtitle} />

      <Features />
      <Stats />
      <Trust />
      <Footer />
    </div>
  );
};

export default AppLayout;
