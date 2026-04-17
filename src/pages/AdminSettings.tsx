import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '@/lib/config';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({ app_name: '', hero_title: '', hero_subtitle: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

    useEffect(() => {
    const loadSettings = async () => {
      try {
        const ref = doc(db, 'nest_settings', 'app');
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setSettings({
            app_name: data.app_name || '',
            hero_title: data.hero_title || '',
            hero_subtitle: data.hero_subtitle || ''
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load settings');
      } finally {
        setFetching(false);
      }
    };

    loadSettings();
  }, []);

    if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <p>Forbidden</p>
      </DashboardLayout>
    );
  }

    const save = async () => {
    setLoading(true);

    try {
      const ref = doc(db, 'nest_settings', 'app');

      await setDoc(ref, settings, { merge: true });

      toast.success('Settings updated');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-500 mb-8">Configure global app settings</p>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <Field label="App Name" value={settings.app_name} onChange={(v) => setSettings({ ...settings, app_name: v })} />
          <Field label="Hero Title" value={settings.hero_title} onChange={(v) => setSettings({ ...settings, hero_title: v })} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Hero Subtitle</label>
            <textarea value={settings.hero_subtitle} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] outline-none" />
          </div>
          <button onClick={save} disabled={loading} className="w-full py-3 rounded-xl bg-[tomato] hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[tomato] outline-none" />
  </div>
);

export default AdminSettings;
