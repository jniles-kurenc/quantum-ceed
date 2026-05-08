import { useState } from 'react';
import { Camera, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { getMealPlan, PHASE_INFO } from '../data/defaults';
import PhaseTag from '../components/PhaseTag';
import type { Phase, Meal } from '../types';
import clsx from 'clsx';

const MEAL_EMOJIS = {
  breakfast: '🌅',
  lunch: '☀️',
  snack: '🍎',
  dinner: '🌙',
};

const MEAL_COLORS = {
  breakfast: 'from-orange-950/60 to-dark-800 border-orange-700/20',
  lunch:     'from-blue-950/60  to-dark-800 border-blue-700/20',
  snack:     'from-green-950/60 to-dark-800 border-green-700/20',
  dinner:    'from-purple-950/60 to-dark-800 border-purple-700/20',
};

export default function MealPlan() {
  const { user } = useAppStore();
  const currentDay = user?.currentDay ?? 1;
  const phase: Phase = currentDay <= 30 ? 1 : currentDay <= 60 ? 2 : 3;
  const meals = getMealPlan(phase);

  const [photoMeals, setPhotoMeals] = useState<Record<string, string>>({});
  const [loggedMeals, setLoggedMeals] = useState<Record<string, boolean>>({});
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const loggedCount = Object.keys(loggedMeals).length;

  const handlePhotoUpload = (mealId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoMeals((p) => ({ ...p, [mealId]: url }));
      setLoggedMeals((l) => ({ ...l, [mealId]: true }));
    }
  };

  const toggleLog = (mealId: string) => {
    setLoggedMeals((l) => {
      const updated = { ...l };
      if (updated[mealId]) delete updated[mealId];
      else updated[mealId] = true;
      return updated;
    });
  };

  return (
    <div className="scroll-container h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meal Plan</h1>
            <p className="text-dark-400 text-sm mt-0.5">Optimized for sperm health</p>
          </div>
          <PhaseTag phase={phase} size="sm" />
        </div>
      </div>

      {/* Nutrition summary */}
      <div className="px-5 mb-5">
        <div className="bg-dark-800 rounded-2xl p-4 border border-white/5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-white font-bold text-xl">{totalCalories}</p>
              <p className="text-dark-400 text-xs mt-0.5">kcal / day</p>
            </div>
            <div className="border-x border-white/5">
              <p className="text-white font-bold text-xl">{totalProtein}g</p>
              <p className="text-dark-400 text-xs mt-0.5">protein</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">{loggedCount}/{meals.length}</p>
              <p className="text-dark-400 text-xs mt-0.5">logged</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-dark-700 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gold-400 transition-all"
              style={{ width: `${(loggedCount / meals.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase info */}
      <div className="px-5 mb-4">
        <div className={clsx(
          'bg-gradient-to-r rounded-2xl p-4 border',
          phase === 1 ? 'from-forest-900/60 to-dark-800 border-forest-700/20' :
          phase === 2 ? 'from-gold-900/40 to-dark-800 border-gold-700/20' :
                        'from-purple-900/40 to-dark-800 border-purple-700/20'
        )}>
          <p className="text-white font-semibold text-sm">{PHASE_INFO[phase].icon} {PHASE_INFO[phase].name} Phase Nutrition</p>
          <p className="text-dark-300 text-xs mt-1 leading-relaxed">{PHASE_INFO[phase].description}</p>
        </div>
      </div>

      {/* Meals */}
      <div className="px-5 mb-8 space-y-3">
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            logged={!!loggedMeals[meal.id]}
            photoUrl={photoMeals[meal.id]}
            expanded={expandedMeal === meal.id}
            onToggleExpand={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
            onToggleLog={() => toggleLog(meal.id)}
            onPhotoUpload={(e) => handlePhotoUpload(meal.id, e)}
          />
        ))}
      </div>

      {/* Key nutrients */}
      <div className="px-5 mb-10">
        <h2 className="text-white font-semibold text-base mb-3">Key Fertility Nutrients</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Zinc', source: 'Pumpkin seeds, oysters', icon: '🥜', importance: 'Sperm production' },
            { name: 'Folate', source: 'Leafy greens, legumes', icon: '🥬', importance: 'DNA integrity' },
            { name: 'Omega-3', source: 'Salmon, walnuts', icon: '🐟', importance: 'Motility boost' },
            { name: 'CoQ10', source: 'Beef, sardines', icon: '⚡', importance: 'Cell energy' },
            { name: 'Selenium', source: 'Brazil nuts, eggs', icon: '🥚', importance: 'Antioxidant' },
            { name: 'Vitamin C', source: 'Citrus, peppers', icon: '🍊', importance: 'Sperm quality' },
          ].map((n) => (
            <div key={n.name} className="bg-dark-800 border border-white/5 rounded-2xl p-3">
              <div className="text-xl mb-1">{n.icon}</div>
              <div className="text-white font-semibold text-sm">{n.name}</div>
              <div className="text-gold-400 text-[10px] mt-0.5">{n.importance}</div>
              <div className="text-dark-400 text-[10px] mt-0.5">{n.source}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MealCardProps {
  meal: Meal;
  logged: boolean;
  photoUrl?: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleLog: () => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function MealCard({ meal, logged, photoUrl, expanded, onToggleExpand, onToggleLog, onPhotoUpload }: MealCardProps) {
  return (
    <div className={clsx(
      'bg-gradient-to-r rounded-2xl border transition-all overflow-hidden',
      MEAL_COLORS[meal.category],
      logged ? 'opacity-75' : ''
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">{MEAL_EMOJIS[meal.category]}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-white font-semibold text-sm leading-snug">{meal.name}</p>
                <p className="text-dark-400 text-xs mt-0.5">{meal.time}</p>
              </div>
              <button
                onClick={onToggleLog}
                className={clsx(
                  'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                  logged ? 'bg-gold-500 text-dark-900' : 'bg-dark-700 border border-white/10 text-dark-400'
                )}
              >
                {logged && <Check size={14} />}
              </button>
            </div>
            <div className="flex gap-3 mt-2">
              <span className="text-xs text-dark-300">{meal.calories} kcal</span>
              <span className="text-xs text-dark-300">{meal.protein}g protein</span>
            </div>
          </div>
        </div>

        <button
          onClick={onToggleExpand}
          className="flex items-center gap-1 mt-2 text-dark-400 text-xs"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Less' : 'Ingredients'}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3 fade-slide-up">
          <p className="text-dark-200 text-sm leading-relaxed mb-3">{meal.description}</p>
          <div className="flex items-center gap-2">
            {photoUrl ? (
              <img src={photoUrl} alt="Meal" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
            ) : (
              <label className="flex items-center gap-2 bg-dark-700/60 border border-white/10 rounded-xl px-3 py-2 cursor-pointer active:scale-95 transition-all">
                <Camera size={16} className="text-dark-300" />
                <span className="text-dark-300 text-xs">Photo proof</span>
                <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onPhotoUpload} />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
