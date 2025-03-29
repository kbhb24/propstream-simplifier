import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { SecureDashboardLayout } from "@/components/layout/SecureDashboardLayout";
import React from "react";
import TestPage from './pages/debug/TestPage'
import SimpleRecordDetail from '@/pages/debug/SimpleRecordDetail';

// Pages
import Index from "./pages/Index";
import Features from "./pages/Features";
import PricingPage from "./pages/PricingPage";
import FlowDesigner from "./pages/FlowDesigner";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import LeadManagement from "./pages/LeadManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import Records from "./pages/dashboard/Records";
import Profile from "./pages/dashboard/Profile";
import { RecordDetail } from "./pages/dashboard/RecordDetail";
import ActivityPage from "./pages/dashboard/ActivityPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SignInPage from './pages/auth/Login';
import SignUpPage from './pages/auth/Signup';

// Temporary placeholder until build issue is fixed
const DashboardOverview = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-2">Monthly Uploads</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-2">Total Records</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-2">Records with Phone</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const SecureLayout = () => (
  <SecureDashboardLayout>
    <Outlet />
  </SecureDashboardLayout>
);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route
                  path="/auth/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/register"
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/forgot-password"
                  element={
                    <PublicRoute>
                      <ForgotPasswordPage />
                    </PublicRoute>
                  }
                />
                
                {/* Protected routes - all inside SecureDashboardLayout */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <SecureDashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Records />} />
                  <Route path="records" element={<Records />} />
                  <Route path="records/:id" element={<RecordDetail />} />
                  <Route path="record/:id" element={<RecordDetail />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="activity" element={<ActivityPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="help" element={<div>Help Coming Soon</div>} />
                </Route>
                
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />

                {/* Auth Routes */}
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Debug/Testing Routes */}
                <Route
                  path="/debug/test"
                  element={
                    <ProtectedRoute>
                      <TestPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/debug/record/:id" element={<ProtectedRoute><SimpleRecordDetail /></ProtectedRoute>} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
