import { PHASE_INFO } from '../data/defaults';
import type { Phase } from '../types';
import clsx from 'clsx';

interface Props {
  phase: Phase;
  size?: 'sm' | 'md';
}

export default function PhaseTag({ phase, size = 'md' }: Props) {
  const info = PHASE_INFO[phase];
  const colors: Record<Phase, string> = {
    1: 'bg-forest-900/60 text-forest-300 border-forest-700/40',
    2: 'bg-gold-900/40 text-gold-300 border-gold-700/40',
    3: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        colors[phase],
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      )}
    >
      <span>{info.icon}</span>
      {info.name}
    </span>
  );
}
