import React, { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import type { CoachVoice, PurchaseMode } from '../../lib/types';
import { ModeSelectScreen } from './ModeSelectScreen';
import { ProfileSetupScreen } from './ProfileSetupScreen';
import { RemindersSetupScreen } from './RemindersSetupScreen';
import { SplashScreen } from './SplashScreen';
import { VoiceOnboardingScreen } from './VoiceOnboardingScreen';

type Step = 'splash' | 'mode' | 'profile' | 'voice' | 'reminders';

export function OnboardingFlow() {
  const { setProfile, setOnboarding } = useApp();
  const [step, setStep] = useState<Step>('splash');
  const [mode, setMode] = useState<PurchaseMode | null>(null);
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState<string | undefined>(undefined);
  const [coachVoice, setCoachVoice] = useState<CoachVoice>('male');
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [coachStyle, setCoachStyle] = useState<'gentle' | 'direct' | 'playful'>('direct');

  if (step === 'splash') {
    return <SplashScreen onContinue={() => setStep('mode')} />;
  }

  if (step === 'mode') {
    return (
      <ModeSelectScreen
        onSelect={(m) => {
          setMode(m);
          setStep('profile');
        }}
      />
    );
  }

  if (step === 'profile' && mode) {
    return (
      <ProfileSetupScreen
        mode={mode}
        onComplete={({ name: n, partnerName: p, coachVoice: cv }) => {
          setName(n);
          setPartnerName(p);
          setCoachVoice(cv);
          setStep('voice');
        }}
      />
    );
  }

  if (step === 'voice') {
    return (
      <VoiceOnboardingScreen
        name={name}
        coachVoice={coachVoice}
        onComplete={(secs, s) => {
          setVoiceSeconds(secs);
          setCoachStyle(s);
          setStep('reminders');
        }}
      />
    );
  }

  if (step === 'reminders' && mode) {
    return (
      <RemindersSetupScreen
        onComplete={async (reminders) => {
          const today = new Date();
          const startDateISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          await setProfile({
            name,
            partnerName,
            mode,
            coachVoice,
            startDateISO,
            personality: { motivation: '', challenges: '', style: coachStyle },
            reminders,
          });
          await setOnboarding({
            completed: true,
            voiceSessionSecondsRecorded: voiceSeconds,
          });
        }}
      />
    );
  }

  return null;
}
