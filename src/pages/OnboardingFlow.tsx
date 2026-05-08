import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Mic, MicOff, Check } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import QuantumLogo from '../components/QuantumLogo';
import SoundWave from '../components/SoundWave';
import clsx from 'clsx';

type Step = 'welcome' | 'mode-info' | 'profile' | 'voice-select' | 'voice-onboarding' | 'complete';

const VOICE_QUESTIONS = [
  "What's your name, and how old are you?",
  "What's your main goal with this program — is it fertility, energy, or overall health?",
  "On a scale of 1 to 10, how would you describe your current lifestyle — diet, sleep, and exercise?",
  "What's your biggest challenge right now when it comes to your health?",
  "Finally — what would success look like for you at the end of 90 days?",
];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { purchaseMode, setUser, voiceGender, setVoiceGender } = useAppStore();

  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStep, setVoiceStep] = useState(0);
  const [voiceComplete, setVoiceComplete] = useState(false);

  const isGift = purchaseMode === 'gift';

  useEffect(() => {
    if (step === 'voice-onboarding' && !voiceComplete) {
      speakQuestion(voiceStep);
    }
  }, [step, voiceStep]);

  const speakQuestion = (idx: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(VOICE_QUESTIONS[idx]);
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) =>
        voiceGender === 'male'
          ? v.name.toLowerCase().includes('male') || v.name.includes('Daniel')
          : v.name.toLowerCase().includes('female') || v.name.includes('Samantha')
      );
      if (preferred) utterance.voice = preferred;
      utterance.rate = 0.95;
      utterance.pitch = voiceGender === 'male' ? 0.85 : 1.1;
      setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsListening(true);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsListening(true);
    }
  };

  const handleNextVoiceStep = () => {
    setIsListening(false);
    if (voiceStep < VOICE_QUESTIONS.length - 1) {
      setVoiceStep((v) => v + 1);
    } else {
      setVoiceComplete(true);
      setStep('complete');
    }
  };

  const handleComplete = () => {
    setUser({
      name: name || (isGift ? partnerName : 'Champion'),
      age: parseInt(age) || 30,
      partnerName: isGift ? partnerName : undefined,
      purchaseMode,
      voiceGender,
      startDate: new Date().toISOString(),
      currentDay: 1,
      onboardingComplete: true,
    });
    navigate('/');
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center text-center px-6 py-12 h-full justify-between fade-slide-up">
            <div />
            <div>
              <QuantumLogo size={56} className="justify-center mb-8" />
              <h2 className="text-2xl font-bold text-white mb-3">
                {isGift ? "Let's Set Up His Journey" : "Let's Begin Your Transformation"}
              </h2>
              <p className="text-dark-300 text-sm leading-relaxed">
                {isGift
                  ? "We'll set up the program for your man, and create your Partner Dashboard so you can support him every step of the way."
                  : "We'll personalize your 90-day program with a quick voice session with your AI coach. This takes about 5 minutes."}
              </p>
              {isGift && (
                <div className="mt-6 bg-forest-900/40 border border-forest-600/30 rounded-2xl p-4 text-left">
                  <div className="text-forest-300 font-semibold text-sm mb-1">What you'll get</div>
                  <ul className="text-dark-200 text-xs space-y-1.5">
                    <li className="flex items-center gap-2"><Check size={12} className="text-forest-400" /> Partner Dashboard with his daily progress</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-forest-400" /> Notifications when he completes tasks</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-forest-400" /> His meal schedule & recommendations</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-forest-400" /> Alerts when he does his sperm tests</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-forest-400" /> Tips on how to support him</li>
                  </ul>
                </div>
              )}
            </div>
            <button onClick={() => setStep('profile')} className="btn-primary w-full">
              <span>Let's Go</span>
              <ArrowRight size={18} />
            </button>
          </div>
        );

      case 'profile':
        return (
          <div className="flex flex-col px-6 py-10 h-full fade-slide-up">
            <div className="mb-8">
              <StepIndicator current={1} total={3} />
              <h2 className="text-2xl font-bold text-white mt-4 mb-1">
                {isGift ? "About Your Man" : "About You"}
              </h2>
              <p className="text-dark-400 text-sm">Quick basics to personalize the program</p>
            </div>

            <div className="space-y-4 flex-1">
              {isGift && (
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="Your name (for partner dashboard)"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="input-field"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-2">
                  {isGift ? "His First Name" : "Your First Name"}
                </label>
                <input
                  type="text"
                  placeholder={isGift ? "e.g. Marcus" : "e.g. Marcus"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-2">
                  {isGift ? "His Age" : "Your Age"}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 32"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-field"
                  min="18"
                  max="65"
                />
              </div>
            </div>

            <button
              onClick={() => setStep('voice-select')}
              disabled={!name}
              className={clsx('btn-primary w-full mt-6', !name && 'opacity-40 cursor-not-allowed')}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>
          </div>
        );

      case 'voice-select':
        return (
          <div className="flex flex-col px-6 py-10 h-full fade-slide-up">
            <div className="mb-8">
              <StepIndicator current={2} total={3} />
              <h2 className="text-2xl font-bold text-white mt-4 mb-1">Choose Coach Voice</h2>
              <p className="text-dark-400 text-sm">
                {isGift ? `Select the voice ${name} will hear from his AI coach` : "Pick the voice that motivates you most"}
              </p>
            </div>

            <div className="space-y-3 flex-1">
              {(['male', 'female'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setVoiceGender(gender)}
                  className={clsx(
                    'w-full p-5 rounded-2xl border text-left flex items-center gap-4 transition-all card-hover',
                    voiceGender === gender
                      ? 'bg-gold-500/10 border-gold-500/50'
                      : 'bg-dark-800 border-white/5'
                  )}
                >
                  <div className={clsx(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                    voiceGender === gender ? 'bg-gold-500/20' : 'bg-dark-700'
                  )}>
                    {gender === 'male' ? '👨' : '👩'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold capitalize">{gender} Voice</div>
                    <div className="text-dark-400 text-xs mt-0.5">
                      {gender === 'male' ? 'Deep, calm & authoritative' : 'Warm, clear & motivating'}
                    </div>
                  </div>
                  {voiceGender === gender && (
                    <Check size={20} className="text-gold-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep('profile')} className="btn-secondary flex-shrink-0 px-4">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => setStep('voice-onboarding')} className="btn-primary flex-1">
                <span>Start Voice Session</span>
                <Mic size={18} />
              </button>
            </div>
          </div>
        );

      case 'voice-onboarding':
        return (
          <div className="flex flex-col px-6 py-10 h-full fade-slide-up">
            <div className="mb-6">
              <StepIndicator current={3} total={3} />
              <h2 className="text-2xl font-bold text-white mt-4 mb-1">Voice Onboarding</h2>
              <p className="text-dark-400 text-sm">
                Your AI coach will ask {isGift ? `${name}` : 'you'} 5 questions to personalize the program
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mb-6">
              {VOICE_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    'flex-1 h-1 rounded-full transition-all',
                    i < voiceStep ? 'bg-gold-400' : i === voiceStep ? 'bg-gold-400/60' : 'bg-dark-700'
                  )}
                />
              ))}
            </div>

            {/* Voice orb */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className={clsx(
                  'w-32 h-32 rounded-full flex items-center justify-center mb-6',
                  'bg-gradient-to-br from-dark-700 to-dark-800 border border-white/10',
                  (isSpeaking || isListening) ? 'voice-pulse glow-gold' : ''
                )}
              >
                {isListening ? (
                  <Mic size={44} className="text-gold-400" />
                ) : isSpeaking ? (
                  <SoundWave active={true} />
                ) : (
                  <MicOff size={44} className="text-dark-400" />
                )}
              </div>

              <div className="text-center mb-4 px-4">
                <p className="text-dark-400 text-xs font-medium uppercase tracking-widest mb-2">
                  Question {voiceStep + 1} of {VOICE_QUESTIONS.length}
                </p>
                <p className="text-white text-lg font-medium leading-relaxed">
                  {VOICE_QUESTIONS[voiceStep]}
                </p>
              </div>

              <div className="text-center">
                {isSpeaking && <p className="text-gold-400 text-sm animate-pulse">Coach is speaking…</p>}
                {isListening && <p className="text-forest-300 text-sm animate-pulse">Listening to your answer…</p>}
              </div>
            </div>

            {isListening && (
              <button onClick={handleNextVoiceStep} className="btn-primary w-full">
                <span>{voiceStep < VOICE_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Session'}</span>
                <ArrowRight size={18} />
              </button>
            )}

            {!isSpeaking && !isListening && (
              <button
                onClick={() => speakQuestion(voiceStep)}
                className="btn-secondary w-full"
              >
                <Mic size={18} />
                <span>Repeat Question</span>
              </button>
            )}
          </div>
        );

      case 'complete':
        return (
          <div className="flex flex-col items-center justify-between px-6 py-12 h-full text-center fade-slide-up">
            <div />
            <div>
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-3">You're All Set!</h2>
              <p className="text-dark-300 text-sm leading-relaxed mb-6">
                {isGift
                  ? `${name}'s 90-day program is ready. Your partner dashboard is also set up so you can follow his journey.`
                  : `Your personalized 90-day program is ready. Your AI coach knows your goals and is ready to guide you every day.`}
              </p>
              <div className="bg-dark-800 rounded-2xl p-4 border border-white/5 text-left space-y-2">
                {[
                  '🌱 Phase 1: Foundation starts today',
                  '🧬 YO Sperm Test on Day 1, 45 & 90',
                  '🤖 AI Coach available 24/7',
                  '📸 Daily task tracking with photo proof',
                ].map((item) => (
                  <div key={item} className="text-sm text-dark-200 flex items-center gap-2">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleComplete} className="btn-primary w-full">
              <span>Begin Your Journey</span>
              <ArrowRight size={18} />
            </button>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {renderStep()}
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={clsx(
            'h-1 rounded-full transition-all',
            i + 1 === current ? 'w-6 bg-gold-400' : i + 1 < current ? 'w-4 bg-gold-400/50' : 'w-4 bg-dark-700'
          )}
        />
      ))}
    </div>
  );
}
