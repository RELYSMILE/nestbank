import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Mail, Phone, Globe, CreditCard, Calendar, Shield } from 'lucide-react';
import { countries } from '@/lib/countries';

const Profile: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;
  const country = countries.find(c => c.code === user.country);

  const fields = [
    { icon: User, label: 'Full Name', value: user.name },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone || 'Not set' },
    { icon: Globe, label: 'Country', value: country ? `${country.flag} ${country.name}` : user.country || '—' },
    { icon: CreditCard, label: 'Account Number', value: user.account_number },
    { icon: Shield, label: 'Bank', value: user.bank_name },
    { icon: Calendar, label: 'Member Since', value: user.created_at?.toDate
  ? user.created_at.toDate().toLocaleDateString()
  : new Date(user.created_at).toLocaleDateString() },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Profile</h1>
        <p className="text-slate-500 mb-8">Your account information</p>

        <div className="rounded-3xl bg-gradient-to-br from-[tomato] to-orange-600 p-8 text-white shadow-xl mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-black border-2 border-white/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black">{user.name}</h2>
              <p className="text-white/80">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-4 p-5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">{f.label}</p>
                <p className="text-slate-900 dark:text-white font-semibold">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
