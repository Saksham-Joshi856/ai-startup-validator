import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SuspenseFallback } from "@/components/common/SkeletonLoaders";
import AuthPage from "@/pages/AuthPage";

// Lazy load pages for better code splitting
const DashboardPage = lazy(() => import("@/pages/DashboardPage").then(m => ({ default: m.DashboardPage || m.default })));
const ValidateIdeaPage = lazy(() => import("@/pages/ValidateIdeaPage").then(m => ({ default: m.default })));
const ReportsPage = lazy(() => import("@/pages/ReportsPage").then(m => ({ default: m.default })));
const InsightsPage = lazy(() => import("@/pages/InsightsPage").then(m => ({ default: m.default })));
const AdvisorPage = lazy(() => import("@/pages/AdvisorPage").then(m => ({ default: m.default })));
const SettingsPage = lazy(() => import("@/pages/SettingsPage").then(m => ({ default: m.default })));
const NotFound = lazy(() => import("@/pages/NotFound").then(m => ({ default: m.default })));

// Optimize query client for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component - redirects to AuthPage if not logged in
function ProtectedDashboard() {
  const { user, loading } = useAuth();

  console.log("AUTH PAGE ACTIVE");

  if (loading) {
    return <SuspenseFallback />;
  }

  // If user NOT logged in → ALWAYS show AuthPage
  if (!user) {
    return <AuthPage />;
  }

  // If user logged in → show Dashboard with all features
  return (
    <DashboardLayout>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/validate"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <ValidateIdeaPage />
            </Suspense>
          }
        />
        <Route
          path="/reports"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <ReportsPage />
            </Suspense>
          }
        />
        <Route
          path="/insights"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <InsightsPage />
            </Suspense>
          }
        />
        <Route
          path="/advisor"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <AdvisorPage />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProtectedDashboard />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
