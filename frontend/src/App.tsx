import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SuspenseFallback } from "@/components/common/SkeletonLoaders";
import AuthPage from "@/pages/AuthPage";

// Lazy load pages for better code splitting
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ValidateIdeaPage = lazy(() => import("@/pages/ValidateIdeaPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const InsightsPage = lazy(() => import("@/pages/InsightsPage"));
const AdvisorPage = lazy(() => import("@/pages/AdvisorPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

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
    <Routes>
      <Route element={<DashboardLayout />}>
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
      </Route>
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ProtectedDashboard />
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
