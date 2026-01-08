import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGameStore } from './stores';
import { OnboardingFlow, ErrorBoundary } from './components';
import './index.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ReaderPage = lazy(() => import('./pages/ReaderPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const BridgeReaderPage = lazy(() => import('./pages/BridgeReaderPage'));
const GradedReaderPage = lazy(() => import('./pages/GradedReaderPage'));

// Loading fallback
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white'
  }}>
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>🐼</span>
      <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>加载中...</p>
    </div>
  </div>
);

function App() {
  const { hasCompletedOnboarding, completeOnboarding } = useGameStore();

  // Show onboarding for first-time users
  if (!hasCompletedOnboarding) {
    return (
      <ErrorBoundary>
        <OnboardingFlow onComplete={completeOnboarding} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:lessonId" element={<LearnPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/practice/:type" element={<PracticePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reader" element={<ReaderPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/bridge" element={<BridgeReaderPage />} />
            <Route path="/graded" element={<GradedReaderPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
