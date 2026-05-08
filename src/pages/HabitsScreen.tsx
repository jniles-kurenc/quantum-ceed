import { useAppStore } from '../store/appStore';
import { Flame, Trophy } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import clsx from 'clsx';

export default function HabitsScreen() {
  const { habits, toggleHabit, tasks, user } = useAppStore();

  const totalStreak = Math.min(...habits.map((h) => h.streak));
  const completedHabits = habits.filter((h) => h.completedToday).length;
  const perfectDay = completedHabits === habits.length;

  const afternoonTasks = tasks.filter((t) => t.timeOfDay === 'afternoon');

  return (
    <div className="scroll-container h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Habits & Tasks</h1>
        <p className="text-dark-400 text-sm mt-0.5">Day {user?.currentDay ?? 1} — Build the foundation</p>
      </div>

      {/* Streak banner */}
      <div className="px-5 mb-5">
        <div className="bg-gradient-to-r from-gold-900/50 to-dark-800 border border-gold-700/30 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
            <Flame size={24} className="text-gold-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Current Streak</p>
            <p className="text-dark-400 text-xs mt-0.5">Consistency is king — keep it alive</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gold-400">{totalStreak}</p>
            <p className="text-dark-400 text-[11px]">days</p>
          </div>
        </div>
      </div>

      {/* Daily Habits Grid */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-base">Daily Habits</h2>
          <span className="text-dark-400 text-xs">{completedHabits}/{habits.length}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={clsx(
                'flex flex-col items-center p-3 rounded-2xl border transition-all card-hover',
                habit.completedToday
                  ? 'bg-gold-500/15 border-gold-500/30'
                  : 'bg-dark-800 border-white/5'
              )}
            >
              <span className="text-2xl mb-1">{habit.icon}</span>
              <span className={clsx(
                'text-[10px] font-medium text-center leading-tight',
                habit.completedToday ? 'text-gold-300' : 'text-dark-300'
              )}>
                {habit.name}
              </span>
              {habit.streak > 0 && (
                <div className="flex items-center gap-0.5 mt-1">
                  <Flame size={9} className="text-orange-400" />
                  <span className="text-[9px] text-orange-400">{habit.streak}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Perfect day callout */}
      {perfectDay && (
        <div className="px-5 mb-5">
          <div className="bg-gold-900/30 border border-gold-500/30 rounded-2xl p-4 flex items-center gap-3">
            <Trophy size={24} className="text-gold-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Perfect Day! 🎉</p>
              <p className="text-dark-400 text-xs mt-0.5">All habits complete. Your body is thanking you.</p>
            </div>
          </div>
        </div>
      )}

      {/* Workout Section */}
      <div className="px-5 mb-6">
        <h2 className="text-white font-semibold text-base mb-3">Afternoon Tasks</h2>
        {afternoonTasks.length > 0 ? (
          <div className="space-y-2">
            {afternoonTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="bg-dark-800 rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-dark-400 text-sm">No afternoon tasks today — enjoy the rest! 🙌</p>
          </div>
        )}
      </div>

      {/* Phase tips */}
      <div className="px-5 mb-8">
        <h2 className="text-white font-semibold text-base mb-3">Today's Tips</h2>
        <div className="space-y-2">
          {[
            { emoji: '🥶', tip: 'End your shower with 60 seconds of cold water — boosts testosterone and recovery.' },
            { emoji: '📵', tip: 'Keep your phone out of your pocket to reduce scrotal heat exposure.' },
            { emoji: '🛌', tip: 'Prioritize 7–8 hours of sleep — most testosterone is produced during deep sleep.' },
          ].map((item) => (
            <div key={item.tip} className="bg-dark-800 rounded-2xl p-4 border border-white/5 flex gap-3">
              <span className="text-xl flex-shrink-0">{item.emoji}</span>
              <p className="text-dark-200 text-sm leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
