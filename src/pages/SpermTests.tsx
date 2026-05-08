import { useState } from 'react';
import { FlaskConical, Lock, Check, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import clsx from 'clsx';

const TEST_INFO = [
  {
    day: 1 as const,
    label: 'Baseline Test',
    description: 'Your starting point. This test establishes your baseline before the program begins.',
    icon: '🌱',
    color: 'from-forest-900/60 to-dark-800 border-forest-600/30',
    accentColor: 'text-forest-300',
  },
  {
    day: 45 as const,
    label: 'Mid-Point Test',
    description: "Halfway through the program. You should see early improvements in motility and concentration.",
    icon: '⚡',
    color: 'from-gold-900/40 to-dark-800 border-gold-600/20',
    accentColor: 'text-gold-300',
  },
  {
    day: 90 as const,
    label: 'Final Test',
    description: 'The big reveal. Compare your results to Day 1 and see your total transformation.',
    icon: '🏆',
    color: 'from-purple-900/40 to-dark-800 border-purple-600/20',
    accentColor: 'text-purple-300',
  },
];

const METRICS = [
  { key: 'motility', label: 'Motility', unit: '%', normal: '≥40%', description: 'Percentage of moving sperm' },
  { key: 'concentration', label: 'Concentration', unit: 'M/mL', normal: '≥16 M/mL', description: 'Sperm count per millilitre' },
  { key: 'morphology', label: 'Morphology', unit: '%', normal: '≥4%', description: 'Percentage of normal-shaped sperm' },
];

export default function SpermTests() {
  const { user, spermTests, updateSpermTest, addPartnerUpdate } = useAppStore();
  const currentDay = user?.currentDay ?? 1;
  const isGift = user?.purchaseMode === 'gift';

  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, Record<string, string>>>({});

  const handleSaveTest = (day: 1 | 45 | 90) => {
    const vals = inputValues[day] ?? {};
    updateSpermTest(day, {
      completed: true,
      date: new Date().toISOString(),
      motility: parseFloat(vals.motility) || undefined,
      concentration: parseFloat(vals.concentration) || undefined,
      morphology: parseFloat(vals.morphology) || undefined,
      notifiedPartner: isGift,
    });

    if (isGift) {
      addPartnerUpdate({
        date: new Date().toISOString(),
        type: 'sperm_test',
        message: `${user?.name} completed his Day ${day} YO Sperm Test.`,
        read: false,
      });
    }
    setExpandedDay(null);
  };

  const completedTests = spermTests.filter((t) => t.completed);

  const getImprovementPct = (metric: string): number | null => {
    const baseline = spermTests.find((t) => t.day === 1);
    const latest = [...spermTests].filter((t) => t.completed && t.day !== 1).sort((a, b) => b.day - a.day)[0];
    if (!baseline?.completed || !latest) return null;
    const baseVal = baseline[metric as keyof typeof baseline] as number | undefined;
    const latestVal = latest[metric as keyof typeof latest] as number | undefined;
    if (baseVal == null || latestVal == null || baseVal === 0) return null;
    return Math.round(((latestVal - baseVal) / baseVal) * 100);
  };

  return (
    <div className="scroll-container h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Sperm Tests</h1>
        <p className="text-dark-400 text-sm mt-0.5">Track your transformation with the YO Test</p>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-5">
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold text-sm">Tests Completed</p>
            <p className="text-dark-400 text-xs">{completedTests.length} of 3</p>
          </div>
          <div className="flex gap-2">
            {TEST_INFO.map((t) => {
              const done = spermTests.find((s) => s.day === t.day)?.completed;
              return (
                <div
                  key={t.day}
                  className={clsx(
                    'flex-1 rounded-xl h-2 transition-all',
                    done ? 'bg-gold-400' : 'bg-dark-700'
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Improvement summary */}
      {completedTests.length >= 2 && (
        <div className="px-5 mb-5">
          <div className="bg-gradient-to-r from-forest-900/60 to-dark-800 border border-forest-600/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-forest-300" />
              <p className="text-white font-semibold text-sm">Your Improvement</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {METRICS.map((m) => {
                const pct = getImprovementPct(m.key);
                return (
                  <div key={m.key} className="text-center bg-white/5 rounded-xl p-2">
                    <p className={clsx(
                      'font-bold text-lg',
                      pct == null ? 'text-dark-500' :
                      pct >= 0 ? 'text-forest-300' : 'text-red-400'
                    )}>
                      {pct == null ? '–' : `${pct > 0 ? '+' : ''}${pct}%`}
                    </p>
                    <p className="text-dark-400 text-[10px] mt-0.5">{m.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Test cards */}
      <div className="px-5 mb-8 space-y-3">
        {TEST_INFO.map((info) => {
          const testData = spermTests.find((t) => t.day === info.day)!;
          const isAvailable = currentDay >= info.day;
          const isExpanded = expandedDay === info.day;

          return (
            <div
              key={info.day}
              className={clsx(
                'bg-gradient-to-r rounded-2xl border transition-all overflow-hidden',
                info.color,
                !isAvailable && 'opacity-50'
              )}
            >
              <button
                onClick={() => isAvailable && setExpandedDay(isExpanded ? null : info.day)}
                className="w-full p-4 text-left"
                disabled={!isAvailable}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
                    {testData.completed ? (
                      <Check size={20} className="text-gold-400" />
                    ) : !isAvailable ? (
                      <Lock size={18} className="text-dark-500" />
                    ) : (
                      <FlaskConical size={18} className={info.accentColor} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{info.icon}</span>
                      <p className="text-white font-semibold text-sm">{info.label}</p>
                    </div>
                    <p className="text-dark-400 text-xs mt-0.5">Day {info.day} · YO Sperm Test</p>
                  </div>
                  <div className="flex-shrink-0">
                    {testData.completed ? (
                      <span className="text-xs bg-gold-500/20 text-gold-300 px-2 py-1 rounded-full font-medium">Done</span>
                    ) : isAvailable ? (
                      isExpanded ? <ChevronUp size={18} className="text-dark-400" /> : <ChevronDown size={18} className="text-dark-400" />
                    ) : (
                      <span className="text-xs text-dark-500">Locked</span>
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded - Log Results */}
              {isExpanded && !testData.completed && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3 fade-slide-up">
                  <p className="text-dark-300 text-xs leading-relaxed">{info.description}</p>
                  <p className="text-white font-medium text-sm">Enter your YO Test results:</p>
                  {METRICS.map((m) => (
                    <div key={m.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-dark-300">{m.label}</label>
                        <span className="text-[10px] text-dark-500">Normal: {m.normal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder={`e.g. ${m.key === 'motility' ? '45' : m.key === 'concentration' ? '20' : '5'}`}
                          value={inputValues[info.day]?.[m.key] ?? ''}
                          onChange={(e) =>
                            setInputValues((prev) => ({
                              ...prev,
                              [info.day]: { ...prev[info.day], [m.key]: e.target.value },
                            }))
                          }
                          className="input-field flex-1"
                        />
                        <span className="text-dark-400 text-sm w-12 text-right">{m.unit}</span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleSaveTest(info.day)}
                    className="btn-primary w-full mt-2"
                  >
                    <FlaskConical size={18} />
                    <span>Save Results</span>
                  </button>
                </div>
              )}

              {/* Completed - Show results */}
              {testData.completed && isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3 fade-slide-up">
                  <p className="text-dark-400 text-xs mb-3">
                    Completed {testData.date ? new Date(testData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {METRICS.map((m) => (
                      <div key={m.key} className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-white font-bold text-lg">
                          {(testData[m.key as keyof typeof testData] as number | undefined) ?? '–'}
                        </p>
                        <p className="text-dark-400 text-[10px] mt-0.5">{m.label}</p>
                        <p className="text-dark-500 text-[10px]">{m.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* About YO Test */}
      <div className="px-5 mb-10">
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-4">
          <h3 className="text-white font-semibold text-sm mb-2">About the YO Sperm Test</h3>
          <p className="text-dark-300 text-xs leading-relaxed">
            The YO Home Sperm Test is an FDA-cleared at-home male fertility test that measures sperm motility using your smartphone camera. Results are private, accurate, and available in minutes.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['FDA Cleared', 'At-Home', 'Clinically Accurate', 'Private Results'].map((tag) => (
              <span key={tag} className="text-[11px] bg-white/8 text-dark-200 rounded-full px-2.5 py-1">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
