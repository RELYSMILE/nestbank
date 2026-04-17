import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/components/SplashScreen';

export const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, session, loading } = useAuth();
  if (loading) return <SplashScreen />;
  if (!session) return <Navigate to="/login" replace />;
  if (!user) return <SplashScreen />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (user.blocked) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="text-center"><h2 className="text-2xl font-bold text-red-600">Account Blocked</h2><p className="text-slate-500 mt-2">Please contact support for assistance.</p></div></div>;
  return <>{children}</>;
};

export default ProtectedRoute;
