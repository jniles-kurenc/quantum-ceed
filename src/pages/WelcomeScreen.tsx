import { useNavigate } from 'react-router-dom';
import { Gift, User, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import QuantumLogo from '../components/QuantumLogo';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const setPurchaseMode = useAppStore((s) => s.setPurchaseMode);

  const handleSelect = (mode: 'gift' | 'self') => {
    setPurchaseMode(mode);
    navigate('/onboarding');
  };

  return (
    <div className="scroll-container h-full flex flex-col px-6 py-12">
      {/* Logo */}
      <div className="flex justify-center mb-10 fade-slide-up">
        <QuantumLogo size={72} />
      </div>

      {/* Headline */}
      <div className="text-center mb-3 fade-slide-up" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-3xl font-bold text-white leading-tight">
          The 90-Day
          <br />
          <span className="text-gold-gradient">Fertility Transformation</span>
        </h1>
        <p className="text-dark-300 mt-3 text-sm leading-relaxed">
          A science-backed program combining AI voice coaching,
          nutrition, and habit tracking to optimize male fertility.
        </p>
      </div>

      {/* Phase preview */}
      <div className="flex gap-2 justify-center my-6 fade-slide-up" style={{ animationDelay: '0.2s' }}>
        {[
          { icon: '🌱', label: 'Foundation', days: 'Days 1–30' },
          { icon: '⚡', label: 'Activation', days: 'Days 31–60' },
          { icon: '🏆', label: 'Optimization', days: 'Days 61–90' },
        ].map((p) => (
          <div key={p.label} className="flex-1 bg-dark-800 rounded-2xl p-3 text-center border border-white/5">
            <div className="text-xl mb-1">{p.icon}</div>
            <div className="text-[11px] font-semibold text-white">{p.label}</div>
            <div className="text-[10px] text-dark-300 mt-0.5">{p.days}</div>
          </div>
        ))}
      </div>

      {/* Choose mode */}
      <div className="mt-auto space-y-3 fade-slide-up" style={{ animationDelay: '0.3s' }}>
        <p className="text-center text-xs text-dark-400 font-medium uppercase tracking-widest mb-4">
          How are you starting?
        </p>

        <button
          onClick={() => handleSelect('gift')}
          className="w-full bg-forest-900/60 border border-forest-600/40 rounded-2xl p-5 text-left flex items-center gap-4 card-hover active:scale-[0.98] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-forest-700/40 flex items-center justify-center flex-shrink-0">
            <Gift size={22} className="text-forest-300" />
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-base">A Gift for My Man</div>
            <div className="text-dark-300 text-xs mt-0.5 leading-snug">
              You're gifting this to your partner. Get a Partner Dashboard to follow his journey.
            </div>
          </div>
          <ArrowRight size={18} className="text-dark-400 flex-shrink-0" />
        </button>

        <button
          onClick={() => handleSelect('self')}
          className="w-full bg-gold-900/30 border border-gold-600/30 rounded-2xl p-5 text-left flex items-center gap-4 card-hover active:scale-[0.98] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-gold-700/30 flex items-center justify-center flex-shrink-0">
            <User size={22} className="text-gold-300" />
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-base">For Myself</div>
            <div className="text-dark-300 text-xs mt-0.5 leading-snug">
              You're starting your own fertility transformation journey. Full AI coaching access.
            </div>
          </div>
          <ArrowRight size={18} className="text-dark-400 flex-shrink-0" />
        </button>
      </div>

      <p className="text-center text-[10px] text-dark-500 mt-6">
        By continuing you agree to our Terms of Service
      </p>
    </div>
  );
}
