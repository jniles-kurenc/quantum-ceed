import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, FlaskConical, Users } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import CircularProgress from '../components/CircularProgress';
import TaskCard from '../components/TaskCard';
import PhaseTag from '../components/PhaseTag';
import { PHASE_INFO } from '../data/defaults';
import type { Phase } from '../types';
import clsx from 'clsx';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user, tasks, partnerUpdates } = useAppStore();

  const currentDay = user?.currentDay ?? 1;
  const phase: Phase = currentDay <= 30 ? 1 : currentDay <= 60 ? 2 : 3;
  const phaseInfo = PHASE_INFO[phase];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overallProgress = Math.round((currentDay / 90) * 100);

  const unreadUpdates = partnerUpdates.filter((u) => !u.read).length;

  const morningTasks = tasks.filter((t) => t.timeOfDay === 'morning');
  const eveningTasks = tasks.filter((t) => t.timeOfDay === 'evening');

  const isGift = user?.purchaseMode === 'gift';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="scroll-container h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-dark-400 text-sm">{greeting()},</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">{user?.name} 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            {isGift && (
              <button
                onClick={() => navigate('/partner')}
                className="relative w-10 h-10 rounded-xl bg-forest-900/60 border border-forest-700/30 flex items-center justify-center"
              >
                <Users size={18} className="text-forest-300" />
                {unreadUpdates > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-dark-900 text-[9px] font-bold flex items-center justify-center">
                    {unreadUpdates}
                  </span>
                )}
              </button>
            )}
            <button className="w-10 h-10 rounded-xl bg-dark-800 border border-white/8 flex items-center justify-center">
              <Bell size={18} className="text-dark-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Phase + Day Card */}
      <div className="px-5 mb-4">
        <div className={clsx(
          'rounded-3xl p-5 border border-white/8',
          'bg-gradient-to-br',
          phase === 1 ? 'from-forest-900/70 to-dark-900' :
          phase === 2 ? 'from-gold-900/50 to-dark-900' :
                        'from-purple-950/70 to-dark-900'
        )}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <PhaseTag phase={phase} />
              <p className="text-white font-bold text-xl mt-2">Day {currentDay} of 90</p>
              <p className="text-dark-300 text-xs mt-0.5">{phaseInfo.description.substring(0, 55)}…</p>
            </div>
            <CircularProgress value={overallProgress} size={72} strokeWidth={6}>
              <span className="text-xs font-bold text-white">{overallProgress}%</span>
            </CircularProgress>
          </div>

          {/* Phase focus chips */}
          <div className="flex flex-wrap gap-1.5">
            {phaseInfo.focus.map((f) => (
              <span key={f} className="text-[11px] bg-white/8 text-dark-200 rounded-full px-2.5 py-1">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="px-5 mb-4">
        <div className="bg-dark-800 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
          <CircularProgress value={progressPct} size={60} strokeWidth={5} color="#D4A847">
            <span className="text-xs font-bold text-white">{completedTasks}/{totalTasks}</span>
          </CircularProgress>
          <div className="flex-1">
            <p className="text-white font-semibold">Today's Tasks</p>
            <p className="text-dark-400 text-xs mt-0.5">
              {completedTasks === totalTasks
                ? '🎉 All done! Amazing work.'
                : `${totalTasks - completedTasks} remaining today`}
            </p>
            <div className="w-full bg-dark-700 rounded-full h-1.5 mt-2">
              <div
                className="h-1.5 rounded-full bg-gold-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sperm Test Banner */}
      {(currentDay === 1 || currentDay === 45 || currentDay === 90) && (
        <div className="px-5 mb-4">
          <button
            onClick={() => navigate('/tests')}
            className="w-full bg-forest-900/60 border border-forest-500/30 rounded-2xl p-4 flex items-center gap-3 card-hover"
          >
            <div className="w-10 h-10 rounded-xl bg-forest-700/40 flex items-center justify-center flex-shrink-0">
              <FlaskConical size={20} className="text-forest-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold text-sm">YO Sperm Test Due Today</p>
              <p className="text-dark-400 text-xs">Day {currentDay} baseline test — tap to log results</p>
            </div>
            <ChevronRight size={18} className="text-dark-400" />
          </button>
        </div>
      )}

      {/* Morning Tasks */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-base">Morning</h2>
          <span className="text-dark-400 text-xs">
            {morningTasks.filter((t) => t.completed).length}/{morningTasks.length} done
          </span>
        </div>
        <div className="space-y-2">
          {morningTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Evening Tasks */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-base">Evening</h2>
          <span className="text-dark-400 text-xs">
            {eveningTasks.filter((t) => t.completed).length}/{eveningTasks.length} done
          </span>
        </div>
        <div className="space-y-2">
          {eveningTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
