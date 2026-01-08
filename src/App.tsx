import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGameStore } from './stores';
import { OnboardingFlow } from './components';
import { HomePage, LearnPage, PracticePage, ProfilePage, SettingsPage } from './pages';
import './index.css';

function App() {
  const { hasCompletedOnboarding, completeOnboarding } = useGameStore();

  // Show onboarding for first-time users
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:lessonId" element={<LearnPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:type" element={<PracticePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
