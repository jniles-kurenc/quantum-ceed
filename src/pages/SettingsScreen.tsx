import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Mic, Users, FlaskConical, Trash2, ChevronRight,
  Moon, Sun, Volume2, Check, Shield, Info
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import QuantumLogo from '../components/QuantumLogo';
import clsx from 'clsx';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { user, voiceGender, setVoiceGender, reminders, toggleReminder, updateReminderTime, resetAll } = useAppStore();
  const [showReset, setShowReset] = useState(false);

  const isGift = user?.purchaseMode === 'gift';

  const handleReset = () => {
    resetAll();
    navigate('/');
  };

  const reminderIcons = { morning: Sun, evening: Volume2, night: Moon };

  return (
    <div className="scroll-container h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-dark-400 text-sm mt-0.5">Personalize your experience</p>
      </div>

      {/* Profile card */}
      <div className="px-5 mb-5">
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-dark-400 text-xs mt-0.5">
              Day {user?.currentDay} · {isGift ? 'Gift Mode' : 'Self Mode'}
            </p>
          </div>
          <QuantumLogo size={32} showText={false} />
        </div>
      </div>

      {/* Voice Coach settings */}
      <Section title="Voice Coach">
        <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-white text-sm font-medium mb-3">Coach Voice</p>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setVoiceGender(g)}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all',
                    voiceGender === g
                      ? 'bg-gold-500/15 border-gold-500/40 text-gold-300'
                      : 'border-white/8 text-dark-300'
                  )}
                >
                  <Mic size={14} />
                  <span className="capitalize">{g}</span>
                  {voiceGender === g && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
          <SettingsRow
            icon={<Volume2 size={18} className="text-dark-300" />}
            label="Test Coach Voice"
            action={() => {
              if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(`Hey ${user?.name}, your Quantum Ceed coach is ready. Let's do this.`);
                u.rate = 0.95;
                u.pitch = voiceGender === 'male' ? 0.85 : 1.1;
                window.speechSynthesis.speak(u);
              }
            }}
          />
        </div>
      </Section>

      {/* Reminders */}
      <Section title="Reminders">
        <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
          {reminders.map((r, i) => {
            const IconComp = reminderIcons[r.type];
            return (
              <div
                key={r.id}
                className={clsx('px-4 py-3 flex items-center gap-3', i < reminders.length - 1 ? 'border-b border-white/5' : '')}
              >
                <div className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0">
                  <IconComp size={16} className="text-dark-300" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium capitalize">{r.type} reminder</p>
                  <p className="text-dark-500 text-xs mt-0.5">{r.label}</p>
                </div>
                <input
                  type="time"
                  value={r.time}
                  onChange={(e) => updateReminderTime(r.id, e.target.value)}
                  className="bg-dark-700 border border-white/8 text-dark-200 text-xs rounded-lg px-2 py-1 mr-2 w-20"
                />
                <Toggle enabled={r.enabled} onToggle={() => toggleReminder(r.id)} />
              </div>
            );
          })}
        </div>
      </Section>

      {/* Navigation shortcuts */}
      <Section title="Quick Access">
        <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
          {[
            { icon: <FlaskConical size={18} className="text-forest-300" />, label: 'Sperm Tests', path: '/tests' },
            ...(isGift ? [{ icon: <Users size={18} className="text-pink-400" />, label: 'Partner Dashboard', path: '/partner' }] : []),
            { icon: <Bell size={18} className="text-gold-300" />, label: 'Notifications', path: null },
          ].map((item, i, arr) => (
            <SettingsRow
              key={item.label}
              icon={item.icon}
              label={item.label}
              action={() => item.path && navigate(item.path)}
              last={i === arr.length - 1}
            />
          ))}
        </div>
      </Section>

      {/* Program info */}
      <Section title="Program">
        <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <div className="flex justify-between items-center">
              <p className="text-dark-300 text-sm">Start Date</p>
              <p className="text-white text-sm">{user?.startDate ? new Date(user.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</p>
            </div>
          </div>
          <div className="px-4 py-3 border-b border-white/5">
            <div className="flex justify-between items-center">
              <p className="text-dark-300 text-sm">Current Day</p>
              <p className="text-white text-sm">Day {user?.currentDay} of 90</p>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              <p className="text-dark-300 text-sm">Mode</p>
              <p className="text-white text-sm">{isGift ? '🎁 Gift Mode' : '💪 Self Mode'}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Legal */}
      <Section title="Legal & Support">
        <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
          <SettingsRow icon={<Shield size={18} className="text-dark-300" />} label="Privacy Policy" action={() => {}} />
          <SettingsRow icon={<Info size={18} className="text-dark-300" />} label="Terms of Service" action={() => {}} last />
        </div>
      </Section>

      {/* Reset */}
      <div className="px-5 mb-10">
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-800/30 bg-red-950/20 text-red-400 text-sm font-medium"
          >
            <Trash2 size={16} />
            Reset All Progress
          </button>
        ) : (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-4">
            <p className="text-white font-semibold text-sm mb-1">Are you sure?</p>
            <p className="text-dark-400 text-xs mb-4">This will delete all your progress, habits, and history. This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowReset(false)} className="btn-secondary flex-1 text-sm py-3">
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white rounded-2xl py-3 text-sm font-semibold active:scale-95 transition-all"
              >
                <Trash2 size={16} />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 mb-5">
      <p className="text-dark-400 text-xs font-semibold uppercase tracking-widest mb-2 px-1">{title}</p>
      {children}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  action,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  action?: () => void;
  last?: boolean;
}) {
  return (
    <button
      onClick={action}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 text-left active:bg-white/5 transition-colors',
        !last ? 'border-b border-white/5' : ''
      )}
    >
      <div className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="flex-1 text-white text-sm">{label}</span>
      <ChevronRight size={16} className="text-dark-500" />
    </button>
  );
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        'w-11 h-6 rounded-full transition-all flex-shrink-0 relative',
        enabled ? 'bg-gold-500' : 'bg-dark-600'
      )}
    >
      <div
        className={clsx(
          'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all',
          enabled ? 'left-5.5' : 'left-0.5'
        )}
        style={{ left: enabled ? '22px' : '2px' }}
      />
    </button>
  );
}
