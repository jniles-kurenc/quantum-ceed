import { CheckCircle2, Circle, Camera } from 'lucide-react';
import type { DailyTask } from '../types';
import { useAppStore } from '../store/appStore';
import clsx from 'clsx';

const CATEGORY_COLORS = {
  workout:    'text-blue-400 bg-blue-500/10',
  nutrition:  'text-green-400 bg-green-500/10',
  supplement: 'text-gold-400 bg-gold-500/10',
  habit:      'text-purple-400 bg-purple-500/10',
  mindset:    'text-pink-400 bg-pink-500/10',
};

const CATEGORY_LABELS = {
  workout:    'Workout',
  nutrition:  'Nutrition',
  supplement: 'Supplement',
  habit:      'Habit',
  mindset:    'Mindset',
};

interface Props {
  task: DailyTask;
}

export default function TaskCard({ task }: Props) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const setTaskPhoto = useAppStore((s) => s.setTaskPhoto);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTaskPhoto(task.id, url);
    }
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 card-hover',
        task.completed
          ? 'bg-white/5 border-white/5 opacity-70'
          : 'bg-dark-800 border-white/8'
      )}
    >
      <button
        onClick={() => !task.requiresPhoto && toggleTask(task.id)}
        className="flex-shrink-0"
      >
        {task.completed ? (
          <CheckCircle2 size={24} className="text-gold-400" />
        ) : (
          <Circle size={24} className="text-dark-400" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium leading-snug', task.completed ? 'line-through text-dark-300' : 'text-white')}>
          {task.title}
        </p>
        <span className={clsx('text-xs font-medium mt-0.5 inline-block px-2 py-0.5 rounded-full', CATEGORY_COLORS[task.category])}>
          {CATEGORY_LABELS[task.category]}
        </span>
      </div>

      {task.requiresPhoto && !task.completed && (
        <label className="flex-shrink-0 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center active:scale-95 transition-transform">
            <Camera size={18} className="text-dark-200" />
          </div>
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handlePhotoUpload} />
        </label>
      )}

      {task.photoUrl && (
        <img
          src={task.photoUrl}
          alt="Proof"
          className="w-9 h-9 rounded-xl object-cover border border-gold-500/30"
        />
      )}
    </div>
  );
}
