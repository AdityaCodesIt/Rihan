import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { ReportPage } from './pages/ReportPage';
import { TrackerPage } from './pages/TrackerPage';
import { CommandPalette } from './components/common/CommandPalette';
import { DemoControls } from './components/common/DemoControls';
import { CardSkeleton } from './components/common/Skeleton';
import { useStore } from './store/useStore';

// Lazy-loaded routes for performance & modularity
const OfficerConsolePage = lazy(() =>
  import('./pages/OfficerConsolePage').then((m) => ({ default: m.OfficerConsolePage }))
);
const PublicDashboardPage = lazy(() =>
  import('./pages/PublicDashboardPage').then((m) => ({ default: m.PublicDashboardPage }))
);

export default function App() {
  const theme = useStore((state) => state.theme);

  // Sync dark/light theme class on root html
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen civic-grid flex flex-col justify-between selection:bg-[#2DE2C4]/30 selection:text-white transition-colors duration-300">
          <Navbar />

          <main className="flex-1 w-full">
            <Suspense
              fallback={
                <div className="max-w-7xl mx-auto p-8 space-y-4">
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/track" element={<TrackerPage />} />
                <Route path="/track/:id" element={<TrackerPage />} />
                <Route path="/officer" element={<OfficerConsolePage />} />
                <Route path="/public" element={<PublicDashboardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />

          {/* Global Polish Tools */}
          <CommandPalette />
          <DemoControls />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
