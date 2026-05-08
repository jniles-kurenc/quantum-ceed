import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bell, CheckCircle2, FlaskConical, Trophy } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { SUPPORT_TIPS_FOR_PARTNER, PHASE_INFO } from '../data/defaults';
import CircularProgress from '../components/CircularProgress';
import PhaseTag from '../components/PhaseTag';
import type { Phase } from '../types';
import clsx from 'clsx';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const { user, tasks, habits, spermTests, partnerUpdates, markUpdateRead } = useAppStore();

  if (user?.purchaseMode !== 'gift') {
    return (
      <div className="h-full flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-white font-semibold">Partner Dashboard</p>
          <p className="text-dark-400 text-sm mt-2">Only available in Gift mode.</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-6">Back to Home</button>
        </div>
      </div>
    );
  }

  const currentDay = user.currentDay ?? 1;
  const phase: Phase = currentDay <= 30 ? 1 : currentDay <= 60 ? 2 : 3;
  const phaseInfo = PHASE_INFO[phase];

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progressPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overallProgress = Math.round((currentDay / 90) * 100);
  const habitStreak = Math.max(...habits.map((h) => h.streak), 0);
  const completedHabits = habits.filter((h) => h.completedToday).length;

  const unreadUpdates = partnerUpdates.filter((u) => !u.read);
  const tipOfDay = SUPPORT_TIPS_FOR_PARTNER[currentDay % SUPPORT_TIPS_FOR_PARTNER.length];

  const updateIcon = (type: string) => {
    switch (type) {
      case 'task_complete': return <CheckCircle2 size={16} className="text-green-400" />;
      case 'sperm_test': return <FlaskConical size={16} className="text-gold-400" />;
      case 'phase_complete': return <Trophy size={16} className="text-purple-400" />;
      default: return <Bell size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="scroll-container h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-xl bg-dark-800 border border-white/8 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-dark-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Partner Dashboard</h1>
            <p className="text-dark-400 text-xs mt-0.5">Following {user.name}'s journey</p>
          </div>
        </div>
      </div>

      {/* Love banner */}
      <div className="px-5 mb-4">
        <div className="bg-gradient-to-r from-pink-950/50 to-dark-800 border border-pink-700/20 rounded-2xl p-4 flex items-center gap-3">
          <Heart size={20} className="text-pink-400 flex-shrink-0" fill="currentColor" />
          <p className="text-dark-200 text-sm leading-relaxed">
            Your support is one of the most powerful things {user.name} has on this journey.
          </p>
        </div>
      </div>

      {/* His overall progress */}
      <div className="px-5 mb-4">
        <div className={clsx(
          'rounded-3xl p-5 border border-white/8 bg-gradient-to-br',
          phase === 1 ? 'from-forest-900/70 to-dark-900' :
          phase === 2 ? 'from-gold-900/50 to-dark-900' :
                        'from-purple-950/70 to-dark-900'
        )}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <PhaseTag phase={phase} size="sm" />
              <p className="text-white font-bold text-lg mt-2">{user.name} — Day {currentDay}</p>
              <p className="text-dark-300 text-xs mt-0.5">{phaseInfo.name} Phase</p>
            </div>
            <CircularProgress value={overallProgress} size={64} strokeWidth={5}>
              <span className="text-xs font-bold text-white">{overallProgress}%</span>
            </CircularProgress>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/8 rounded-xl p-2">
              <p className="text-white font-bold text-base">{completedTasks}/{totalTasks}</p>
              <p className="text-dark-400 text-[10px]">Today's tasks</p>
            </div>
            <div className="bg-white/8 rounded-xl p-2">
              <p className="text-white font-bold text-base">{completedHabits}/{habits.length}</p>
              <p className="text-dark-400 text-[10px]">Habits done</p>
            </div>
            <div className="bg-white/8 rounded-xl p-2">
              <p className="text-white font-bold text-base">{habitStreak}</p>
              <p className="text-dark-400 text-[10px]">Day streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's progress */}
      <div className="px-5 mb-4">
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold text-sm">Today's Progress</p>
            <span className="text-dark-400 text-xs">{progressPct}% complete</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gold-400 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct === 100 && (
            <p className="text-forest-300 text-xs mt-2 font-medium">🎉 {user.name} completed all tasks today!</p>
          )}
        </div>
      </div>

      {/* Sperm test status */}
      <div className="px-5 mb-4">
        <h2 className="text-white font-semibold text-base mb-3">Sperm Test Status</h2>
        <div className="flex gap-2">
          {spermTests.map((t) => (
            <div
              key={t.day}
              className={clsx(
                'flex-1 rounded-2xl p-3 border text-center',
                t.completed
                  ? 'bg-forest-900/50 border-forest-600/30'
                  : 'bg-dark-800 border-white/5'
              )}
            >
              <FlaskConical size={18} className={clsx('mx-auto mb-1', t.completed ? 'text-forest-300' : 'text-dark-500')} />
              <p className="text-white text-xs font-semibold">Day {t.day}</p>
              <p className={clsx('text-[10px] mt-0.5', t.completed ? 'text-forest-300' : 'text-dark-500')}>
                {t.completed ? 'Done ✓' : 'Pending'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent updates */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-base">Recent Updates</h2>
          {unreadUpdates.length > 0 && (
            <span className="text-xs bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded-full">
              {unreadUpdates.length} new
            </span>
          )}
        </div>

        {partnerUpdates.length === 0 ? (
          <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 text-center">
            <Bell size={24} className="text-dark-500 mx-auto mb-2" />
            <p className="text-dark-400 text-sm">Updates will appear here as {user.name} makes progress.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {partnerUpdates.slice(0, 5).map((update, i) => (
              <button
                key={i}
                onClick={() => markUpdateRead(i)}
                className={clsx(
                  'w-full bg-dark-800 border rounded-2xl p-3 text-left flex items-start gap-3 transition-all card-hover',
                  !update.read ? 'border-gold-500/20' : 'border-white/5 opacity-70'
                )}
              >
                <div className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {updateIcon(update.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{update.message}</p>
                  <p className="text-dark-500 text-[11px] mt-0.5">
                    {new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!update.read && (
                  <div className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0 mt-2" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* His meal schedule */}
      <div className="px-5 mb-4">
        <h2 className="text-white font-semibold text-base mb-3">His Eating Schedule</h2>
        <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
          {[
            { time: '7:30 AM', meal: 'Fertility Smoothie Bowl', icon: '🌅' },
            { time: '12:30 PM', meal: 'Salmon & Quinoa Bowl', icon: '☀️' },
            { time: '3:30 PM', meal: 'Walnut Energy Snack', icon: '🍎' },
            { time: '7:00 PM', meal: 'Grilled Chicken & Veg', icon: '🌙' },
          ].map((item, i, arr) => (
            <div
              key={item.time}
              className={clsx(
                'flex items-center gap-3 px-4 py-3',
                i < arr.length - 1 ? 'border-b border-white/5' : ''
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{item.meal}</p>
                <p className="text-dark-400 text-xs">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to support him */}
      <div className="px-5 mb-10">
        <h2 className="text-white font-semibold text-base mb-3">How to Support Him</h2>
        <div className="bg-gradient-to-r from-pink-950/40 to-dark-800 border border-pink-700/15 rounded-2xl p-4">
          <Heart size={16} className="text-pink-400 mb-2" fill="currentColor" />
          <p className="text-dark-200 text-sm leading-relaxed">{tipOfDay}</p>
        </div>
        <div className="mt-3 space-y-2">
          {SUPPORT_TIPS_FOR_PARTNER.slice(1, 4).map((tip) => (
            <div key={tip} className="bg-dark-800 border border-white/5 rounded-2xl p-3 flex gap-3">
              <Heart size={14} className="text-pink-400 flex-shrink-0 mt-0.5" />
              <p className="text-dark-200 text-xs leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
