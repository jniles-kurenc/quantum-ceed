import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import MobileShell from './components/MobileShell';
import WelcomeScreen from './pages/WelcomeScreen';
import OnboardingFlow from './pages/OnboardingFlow';
import HomeScreen from './pages/HomeScreen';
import VoiceCoach from './pages/VoiceCoach';
import HabitsScreen from './pages/HabitsScreen';
import MealPlan from './pages/MealPlan';
import SpermTests from './pages/SpermTests';
import PartnerDashboard from './pages/PartnerDashboard';
import SettingsScreen from './pages/SettingsScreen';

export default function App() {
  const user = useAppStore((s) => s.user);
  const isOnboarded = user?.onboardingComplete;

  return (
    <MobileShell>
      <Routes>
        {!isOnboarded ? (
          <>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/coach" element={<VoiceCoach />} />
            <Route path="/habits" element={<HabitsScreen />} />
            <Route path="/meals" element={<MealPlan />} />
            <Route path="/tests" element={<SpermTests />} />
            <Route path="/partner" element={<PartnerDashboard />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </MobileShell>
  );
}
