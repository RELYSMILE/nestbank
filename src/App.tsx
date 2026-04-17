import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "aos/dist/aos.css"
import AOS from "aos"


const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transfer = lazy(() => import("./pages/Transfer"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Profile = lazy(() => import("./pages/Profile"));
const Cards = lazy(() => import("./pages/Cards"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));


const queryClient = new QueryClient();

const App = () => {
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  if (booting) return <SplashScreen />;

  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" richColors />
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<SplashScreen />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
                  <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />

                  <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                  <Route path="/admin/transactions" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
