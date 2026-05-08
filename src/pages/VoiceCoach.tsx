import { useState, useEffect, useRef } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import SoundWave from '../components/SoundWave';
import { VOICE_MESSAGES } from '../data/defaults';
import clsx from 'clsx';

type ConvState = 'idle' | 'listening' | 'thinking' | 'speaking';

const AI_RESPONSES: Record<string, string[]> = {
  default: [
    "I hear you. Remember, consistency beats perfection. Show up today, even at 60%.",
    "Your body is responding to the work you're putting in. Trust the process.",
    "That's exactly the mindset we need. Stay focused on today's tasks.",
    "Progress isn't always visible, but it's always happening at the cellular level. Keep going.",
  ],
  energy: [
    "Low energy is common in the Foundation phase. Make sure you're hitting 7–8 hours of sleep and drinking enough water.",
    "Try a 10-minute cold shower this morning — it'll boost testosterone and wake up your nervous system.",
  ],
  motivation: [
    "Think about your why. Every habit you build today is a gift to your future self and your family.",
    "You're building something that matters. Not just for fertility — for your life.",
  ],
  sleep: [
    "Sleep is when testosterone is produced and sperm is repaired. Guard it like it's gold.",
    "Aim for lights out by 10:30 PM. Avoid screens 30 minutes before bed and keep the room cool.",
  ],
  diet: [
    "Today, focus on getting zinc, folate, and antioxidants in your meals. Check your meal plan for the specifics.",
    "Avoid processed foods, alcohol, and excessive heat — all enemies of sperm quality.",
  ],
};

export default function VoiceCoach() {
  const { user, voiceGender } = useAppStore();
  const [convState, setConvState] = useState<ConvState>('idle');
  const [transcript, setTranscript] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `Hey ${user?.name ?? 'champion'}, I'm your Quantum Ceed AI coach. Tap the mic and let's talk — I'm here for you 24/7.` }
  ]);
  const historyRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      voiceGender === 'male'
        ? v.name.includes('Daniel') || v.name.toLowerCase().includes('male')
        : v.name.includes('Samantha') || v.name.toLowerCase().includes('female')
    );
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.95;
    utterance.pitch = voiceGender === 'male' ? 0.85 : 1.1;
    setConvState('speaking');
    utterance.onend = () => setConvState('idle');
    window.speechSynthesis.speak(utterance);
  };

  const getAIResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('energy') || lower.includes('tired') || lower.includes('fatigue')) {
      return AI_RESPONSES.energy[Math.floor(Math.random() * AI_RESPONSES.energy.length)];
    }
    if (lower.includes('motivat') || lower.includes('give up') || lower.includes('hard')) {
      return AI_RESPONSES.motivation[Math.floor(Math.random() * AI_RESPONSES.motivation.length)];
    }
    if (lower.includes('sleep') || lower.includes('rest') || lower.includes('tired')) {
      return AI_RESPONSES.sleep[Math.floor(Math.random() * AI_RESPONSES.sleep.length)];
    }
    if (lower.includes('eat') || lower.includes('food') || lower.includes('diet') || lower.includes('meal')) {
      return AI_RESPONSES.diet[Math.floor(Math.random() * AI_RESPONSES.diet.length)];
    }
    return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)];
  };

  const startListening = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        continuous: boolean; interimResults: boolean; lang: string;
        onresult: ((e: { results: { [i: number]: { [i: number]: { transcript: string } } } }) => void) | null;
        onerror: (() => void) | null; start: () => void; stop: () => void;
      };
      webkitSpeechRecognition?: new () => {
        continuous: boolean; interimResults: boolean; lang: string;
        onresult: ((e: { results: { [i: number]: { [i: number]: { transcript: string } } } }) => void) | null;
        onerror: (() => void) | null; start: () => void; stop: () => void;
      };
    };
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) {
      simulateConversation("Hello coach, how's my progress today?");
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    setConvState('listening');
    setTranscript('');
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setConvState('thinking');
      handleUserInput(text);
    };
    recognition.onerror = () => {
      setConvState('idle');
      simulateConversation("I didn't catch that. Let me motivate you anyway.");
    };
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setConvState('idle');
  };

  const handleUserInput = (text: string) => {
    const response = getAIResponse(text);
    setHistory((h) => [...h, { role: 'user', text }, { role: 'ai', text: response }]);
    setTimeout(() => speak(response), 600);
  };

  const simulateConversation = (userText: string) => {
    const response = getAIResponse(userText);
    setHistory((h) => [...h, { role: 'user', text: userText }, { role: 'ai', text: response }]);
    setConvState('thinking');
    setTimeout(() => speak(response), 600);
  };

  const dailyMessage = VOICE_MESSAGES.morning[Math.floor(Math.random() * VOICE_MESSAGES.morning.length)];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Coach</h1>
            <p className="text-dark-400 text-sm mt-0.5">Voice-first, always available</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => speak(dailyMessage)}
              className="w-10 h-10 rounded-xl bg-dark-800 border border-white/8 flex items-center justify-center"
            >
              <Volume2 size={18} className="text-dark-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Conversation history */}
      <div
        ref={historyRef}
        className="flex-1 scroll-container px-5 py-2 space-y-3"
      >
        {history.map((msg, i) => (
          <div
            key={i}
            className={clsx(
              'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed fade-slide-up',
              msg.role === 'ai'
                ? 'bg-dark-800 border border-white/5 text-dark-100 self-start'
                : 'bg-gold-500/15 border border-gold-500/20 text-white ml-auto'
            )}
          >
            {msg.role === 'ai' && (
              <p className="text-gold-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Coach</p>
            )}
            {msg.text}
          </div>
        ))}

        {convState === 'thinking' && (
          <div className="max-w-[85%] bg-dark-800 border border-white/5 rounded-2xl px-4 py-3 fade-slide-up">
            <p className="text-gold-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Coach</p>
            <div className="flex gap-1.5 items-center h-5">
              <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Voice orb & controls */}
      <div className="flex-shrink-0 px-5 pb-8 pt-4">
        {/* Transcript preview */}
        {transcript && convState !== 'idle' && (
          <div className="bg-dark-800 rounded-2xl p-3 mb-4 text-center border border-white/5">
            <p className="text-dark-300 text-sm italic">"{transcript}"</p>
          </div>
        )}

        {/* Main voice button */}
        <div className="flex items-center justify-center mb-4">
          <button
            onMouseDown={startListening}
            onTouchStart={startListening}
            onMouseUp={convState === 'listening' ? stopListening : undefined}
            onTouchEnd={convState === 'listening' ? stopListening : undefined}
            className={clsx(
              'w-24 h-24 rounded-full flex items-center justify-center transition-all',
              convState === 'listening'
                ? 'bg-gold-500 glow-gold scale-110'
                : convState === 'speaking'
                ? 'bg-forest-700 glow-forest'
                : convState === 'thinking'
                ? 'bg-dark-700 animate-pulse'
                : 'bg-dark-700 border-2 border-white/10 active:scale-95'
            )}
          >
            {convState === 'speaking' ? (
              <SoundWave active={true} color="white" />
            ) : convState === 'listening' ? (
              <Mic size={36} className="text-dark-900" />
            ) : (
              <Mic size={36} className="text-dark-300" />
            )}
          </button>
        </div>

        <p className="text-center text-dark-400 text-xs mb-4">
          {convState === 'idle' && 'Hold to speak with your coach'}
          {convState === 'listening' && '🎙 Listening… release when done'}
          {convState === 'thinking' && 'Your coach is thinking…'}
          {convState === 'speaking' && 'Coach is speaking…'}
        </p>

        {/* Quick prompts */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            'How am I doing?',
            'Motivate me',
            'Diet tips',
            'Sleep advice',
            'Energy boost',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => simulateConversation(prompt)}
              className="flex-shrink-0 bg-dark-800 border border-white/8 text-dark-200 text-xs rounded-full px-3 py-1.5 active:scale-95 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
